import { generateText } from 'ai';
import { resolveModelConfig } from '@/lib/ai/model';
import { extractPdf } from '@/lib/extract/pdf';
import { chunkDocument, groupChunks } from '@/lib/chunk';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/mindmap/prompt';

async function main() {
  const data = await (await fetch('https://arxiv.org/pdf/1706.03762')).arrayBuffer();
  const doc = await extractPdf({ data, filename: 'attention' });
  const { chunks } = chunkDocument(doc);
  const group = groupChunks(chunks)[0];
  const { model, providerOptions } = resolveModelConfig('fast');
  const res = await generateText({
    model,
    system: buildSystemPrompt({ language: 'zh-CN', depth: 'standard', purpose: 'study' }),
    prompt: buildUserPrompt(group, doc.title),
    maxOutputTokens: 3000,
    ...(providerOptions ? { providerOptions } : {}),
  });
  const lines = res.text.split('\n').filter(l => l.trim());
  console.log('--- 前 14 行原始输出 ---');
  lines.slice(0, 14).forEach(l => console.log(JSON.stringify(l)));
  const withRef = lines.filter(l => /\^[A-Za-z0-9_-]+\s*$/.test(l)).length;
  console.log(`\n带 ^chunkId 结尾的行: ${withRef}/${lines.length}`);
}
main();
