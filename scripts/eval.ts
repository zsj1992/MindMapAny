/**
 * 生成质量评测。第一周的验收标准就靠它：
 *   npx tsx scripts/eval.ts            跑全部用例
 *   npx tsx scripts/eval.ts pdf        只跑某一类
 *
 * 输出成功率、耗时、节点数、溯源覆盖率、解析告警。
 * 改 prompt 或换模型后必须跑一遍再合并 —— 否则质量退化是无声的。
 */
import { readFileSync } from 'node:fs';
import { chunkDocument } from '../src/lib/chunk';
import { extractPdf } from '../src/lib/extract/pdf';
import { extractWeb } from '../src/lib/extract/web';
import { extractYoutube } from '../src/lib/extract/youtube';
import { totalChars, type ExtractedDoc } from '../src/lib/extract/types';
import { generateMindMap } from '../src/lib/mindmap/generate';
import { levelOf, type Depth, type Purpose } from '../src/lib/mindmap/schema';

interface Case {
  id: string;
  kind: 'text' | 'web' | 'pdf' | 'youtube';
  input: string;
  depth?: Depth;
  purpose?: Purpose;
  language?: string;
}

/** 覆盖四种输入 × 不同长度 × 中英文。真实上线前应扩到 20 条。 */
const CASES: Case[] = [
  { id: 'web-wiki-mindmap', kind: 'web', input: 'https://en.wikipedia.org/wiki/Mind_map' },
  { id: 'web-wiki-transformer', kind: 'web', input: 'https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)', depth: 'detailed' },
  { id: 'web-zh', kind: 'web', input: 'https://zh.wikipedia.org/wiki/心智图', language: 'zh-CN' },
  { id: 'pdf-attention', kind: 'pdf', input: 'https://arxiv.org/pdf/1706.03762', purpose: 'study' },
  { id: 'yt-ted', kind: 'youtube', input: 'https://www.youtube.com/watch?v=iG9CE55wbtY' },
  {
    id: 'text-short-zh',
    kind: 'text',
    input: `人工智能的三个主要分支是机器学习、自然语言处理和计算机视觉。
机器学习又分为监督学习、无监督学习和强化学习。监督学习需要标注数据，常见算法包括线性回归和决策树。
无监督学习不需要标签，典型任务是聚类和降维。强化学习通过奖励信号学习策略，广泛用于游戏和机器人控制。`,
    depth: 'concise',
  },
];

async function extract(c: Case): Promise<ExtractedDoc> {
  if (c.kind === 'web') return extractWeb(c.input);
  if (c.kind === 'youtube') return extractYoutube(c.input, (c.language ?? 'en').split('-')[0]);
  if (c.kind === 'pdf') {
    const data = c.input.startsWith('http')
      ? await (await fetch(c.input)).arrayBuffer()
      : (() => {
          const b = readFileSync(c.input);
          return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer;
        })();
    return extractPdf({ data, filename: c.id });
  }
  return {
    kind: 'text',
    title: c.input.split('\n')[0].slice(0, 60),
    blocks: c.input.split(/\n{2,}/).map((t) => ({ text: t.trim() })).filter((b) => b.text),
    notes: [],
  };
}

interface Row {
  id: string;
  ok: boolean;
  ms: number;
  chars?: number;
  nodes?: number;
  maxLevel?: number;
  /** 叶子节点里带溯源的比例 —— 低于 0.8 说明模型在漏标 chunkId */
  sourced?: number;
  warnings?: number;
  error?: string;
}

async function run(c: Case): Promise<Row> {
  const started = Date.now();
  try {
    const doc = await extract(c);
    const chars = totalChars(doc);
    const { map, warnings } = await generateMindMap({
      doc,
      language: c.language ?? 'zh-CN',
      depth: c.depth ?? 'standard',
      purpose: c.purpose ?? 'general',
      tier: 'fast',
    });

    const parents = new Set(map.nodes.map((n) => n.parentId).filter(Boolean));
    const leaves = map.nodes.filter((n) => n.parentId && !parents.has(n.id));
    const sourced = leaves.length ? leaves.filter((n) => n.source).length / leaves.length : 0;

    // 单节点图等于失败，别让它混进成功率
    const ok = map.nodes.length > 3;
    return {
      id: c.id,
      ok,
      ms: Date.now() - started,
      chars,
      nodes: map.nodes.length,
      maxLevel: Math.max(...map.nodes.map((n) => levelOf(map, n.id))) + 1,
      sourced: Number(sourced.toFixed(2)),
      warnings: warnings.length,
      ...(ok ? {} : { error: 'too few nodes' }),
    };
  } catch (e) {
    return { id: c.id, ok: false, ms: Date.now() - started, error: (e as Error).message.slice(0, 80) };
  }
}

async function main() {
  const filter = process.argv[2];
  const cases = filter ? CASES.filter((c) => c.kind === filter || c.id.includes(filter)) : CASES;
  if (!cases.length) {
    console.error('没有匹配的用例');
    process.exit(1);
  }

  const rows: Row[] = [];
  for (const c of cases) {
    const row = await run(c);
    rows.push(row);
    console.log(
      `${row.ok ? '✓' : '✗'} ${row.id.padEnd(28)} ${String(row.ms).padStart(6)}ms ` +
        (row.ok
          ? `chars=${row.chars} nodes=${row.nodes} depth=${row.maxLevel} sourced=${row.sourced} warn=${row.warnings}`
          : row.error),
    );
  }

  const passed = rows.filter((r) => r.ok).length;
  const rate = passed / rows.length;
  const avgSourced =
    rows.filter((r) => r.ok).reduce((n, r) => n + (r.sourced ?? 0), 0) / Math.max(1, passed);

  console.log(`\n成功率 ${passed}/${rows.length} (${(rate * 100).toFixed(0)}%) · 平均溯源覆盖 ${(avgSourced * 100).toFixed(0)}%`);
  // 第一周验收线：成功率 80%，溯源覆盖 80%
  if (rate < 0.8 || avgSourced < 0.8) {
    console.error('未达验收标准');
    process.exit(1);
  }
}

main();
