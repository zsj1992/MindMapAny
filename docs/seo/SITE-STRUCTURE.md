# MindMapAny 站点架构

> 2026-08-12 更新：英文为默认语言，另有中文、日文、韩文、西班牙文、德文和法文本地化页面。
> `/tools/youtube-to-mind-map` 从未上线（实际 404），继续保持不创建、不索引。
> Similarweb 竞品词导入后的详细判断见 [`SIMILARWEB-KEYWORD-REVIEW.md`](./SIMILARWEB-KEYWORD-REVIEW.md)。现阶段结论仍是做深现有六个工具页，而不是扩张 URL 数量。

## 设计原则

公开内容层负责搜索发现和产品教育，`/app` 只负责完成任务。每个搜索意图只有一个主要 URL，工具页承接“马上使用”的交易型意图，博客承接“了解、学习、比较”的信息型意图。

```text
/
├── /tools                         工具目录（CollectionPage）
│   ├── /tools/pdf-to-mind-map     PDF to mind map
│   ├── /tools/text-to-mind-map    Text to mind map
│   ├── /tools/webpage-to-mind-map Web page to mind map
│   ├── /tools/docx-to-mind-map    Word document to mind map
│   ├── /tools/epub-to-mind-map    EPUB ebook to mind map
│   └── /tools/pptx-to-mind-map    PowerPoint to mind map
├── /blog                          内容中心（Blog）
│   └── /blog/[slug]               Guide / How-to / Comparison
├── /pricing                       商业转化
├── /support · /terms · /privacy · /refund-policy · /billing   合规与支付（Creem 审核依赖）
├── /m/[slug]                      用户主动公开的脑图
└── /app/*                         产品工作台（noindex）
```

## 已实现输入类型

PDF、Text、Webpage、DOCX、EPUB、PPTX 都已有工作台输入和对应公开 `/tools/*` 落地页。下一步不是继续复制格式页，而是用真实示例、限制、FAQ、内部链接和转化数据把六页做深。

`/tools/youtube-to-mind-map` 不同——YouTube 输入尚未开放（`/api/generate` 明确返回不支持），因此**不得**为它建页。

## URL 扩展规则

- 新输入能力先增加 `/tools/{input}-to-mind-map`，再将 CTA 指向 `/app/{kind}`。
- 教程统一放在 `/blog/{descriptive-slug}`，不要把教程文案塞进工作台。
- 用例达到至少 3 篇独立内容后再建立 `/use-cases` 聚合页，首批候选是 Students、Researchers 和 Knowledge Workers。
- 暂不增加 `/categories/[slug]` 和标签归档；当博客超过 30 篇且每个分类至少 5 篇时再开放索引。
- 英文为默认 locale，直接挂在根路径；现有非英语版本使用独立前缀和 hreflang。新语言必须先有真实需求数据和人工语言质检。

## 索引策略

| 区域 | 索引 | Sitemap | 说明 |
|---|---:|---:|---|
| `/tools` | 是 | 是 | 稳定、独立搜索意图 |
| `/blog` | 是 | 是 | 原创教育内容 |
| `/pricing` | 是 | 是 | 商业意图 |
| `/support` `/terms` `/privacy` `/refund-policy` | 是 | 是 | 合规页，支付审核方会直接访问 |
| `/m/[slug]` | 仅公开内容 | 是 | 用户生成内容，后续需质量门槛 |
| `/app/*` | 否 | 否 | 登录态、交互态、内容薄且易重复 |
| `/api/*` | 否 | 否 | 非 HTML 内容 |

## 内链规则

- 首页 → 工具目录、三个工具页、核心指南。
- 工具页 → 对应工作台、相关教程、价格页。
- 博客文章 → 一个主要工具页、一个上位指南、1–2 篇同簇文章。
- 支柱指南 → 所有簇的核心文章；所有核心文章必须反链支柱页。
- 锚文本描述目标用途，避免所有链接都使用 “click here”。

## 2026-08-12 架构审计待办

- 首页正文增加到 `/blog/ai-mind-map-guide` 的上下文链接，完成首页到支柱内容的入口。
- 博客相关文章改为按主题簇选择；不能继续用数组顺序截取两篇。
- DOCX、EPUB、PPTX、Webpage 四个工具页逐步补一篇真正相关、带真实示例的内容回链。
- `/m/[slug]` 进入 sitemap 前增加公开内容质量门，至少检查节点数、正文量、重复度和敏感/垃圾内容。
- JSON-LD 面包屑的 Tools 层使用当前 locale 的 URL，与可见面包屑和 canonical 保持一致。
- `/use-cases` 至少有 3 个合格页面、`/compare` 至少有 3 个带日期实测页面后才建立各自聚合页。
