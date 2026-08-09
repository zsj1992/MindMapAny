# MapAny

把任何内容变成结构清晰、可溯源的脑图。文本 / PDF / 网页 / YouTube → 可编辑的思维导图。

## 架构

一条通用管线，四种输入共用；深度研究在上游增加“检索 + 多来源报告”阶段：

```
输入 → 提取(Block[]) → 切块(chunkId ↔ 页码/时间戳) → LLM 产 Markdown 大纲 → 确定性解析成 JSON → 渲染/编辑/导出

研究问题 → DeepSeek Web Search → 带编号引用的研究报告 → 同一脑图生成管线
```

两个关键设计决定：

1. **模型产 Markdown 大纲，不产 JSON。** 长文档下 LLM 直出深层嵌套 JSON 容易截断和自相矛盾，且无法流式渲染。大纲可以逐行解析、坏行单独丢弃，token 也更省。JSON 只作为存储和编辑的唯一数据源。
2. **溯源在切块阶段锚定。** 每个 chunk 携带 `{page}` 或 `{startSec}`，模型只被允许回引 `^chunkId`，页码和时间戳一律查表还原 —— 让模型自己写位置信息，它一定会编。

## 目录

| 路径 | 作用 |
|---|---|
| `src/lib/mindmap/schema.ts` | 脑图数据契约、深度预算 |
| `src/lib/mindmap/outline.ts` | Markdown 大纲 ↔ MindMap 的确定性解析器 |
| `src/lib/mindmap/prompt.ts` | system / user / reduce 提示词 |
| `src/lib/mindmap/generate.ts` | 单次生成 + 长文档 map-reduce |
| `src/lib/chunk.ts` | 切块与溯源锚定 |
| `src/lib/extract/` | pdf / web / youtube 提取，含 SSRF 防护 |
| `src/lib/layout.ts` | ELK 自动布局 |
| `src/lib/credits.ts` | 套餐限制与积分计费（改价只动这里）|
| `src/components/canvas/` | React Flow 画布 |
| `supabase/schema.sql` | 表结构与 RLS |
| `scripts/eval.ts` | 生成质量评测 |

## 本地开发

```bash
cp .env.example .env.local   # 至少填 AI_GATEWAY_API_KEY
npm run dev
```

未配置 Supabase 时，登录/保存/分享自动降级为不可用，普通生成功能照常。深度研究复用服务端 `DEEPSEEK_API_KEY`。

```bash
npm test        # 解析器 + 管线回归测试
npm run eval    # 真实输入的生成质量评测（需 AI key）
```

## 部署

```bash
vercel deploy --prod
```

需要在 Vercel 项目里配置 `.env.example` 中的变量。Supabase 需先执行 `supabase/schema.sql`。

## 当前边界

已实现：文本 / PDF / 网页 / YouTube 字幕、带引用的多来源深度研究、编辑、折叠、PNG/SVG/Markdown 导出、保存、公开分享页（SSR + OG + sitemap）、积分与套餐闸门。

不支持：扫描件 OCR、音视频转录、纯 JS 渲染页面、需登录页面、无字幕视频、协作、PPT/Excel。
