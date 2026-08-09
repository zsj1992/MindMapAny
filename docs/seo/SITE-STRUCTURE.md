# MindMapAny 站点架构

> 2026-08-10 更新：站点语言为英文，`lang="en"`，OG locale `en_US`。
> 同时修正了一处与实现不符的记录：`/tools/youtube-to-mind-map` 从未上线（实际 404），已从架构树移除。

## 设计原则

公开内容层负责搜索发现和产品教育，`/app` 只负责完成任务。每个搜索意图只有一个主要 URL，工具页承接“马上使用”的交易型意图，博客承接“了解、学习、比较”的信息型意图。

```text
/
├── /tools                         工具目录（CollectionPage）
│   ├── /tools/pdf-to-mind-map     PDF to mind map
│   ├── /tools/text-to-mind-map    Text to mind map
│   └── /tools/webpage-to-mind-map Web page to mind map
├── /blog                          内容中心（Blog）
│   └── /blog/[slug]               Guide / How-to / Comparison
├── /pricing                       商业转化
├── /support · /terms · /privacy · /refund-policy · /billing   合规与支付（Creem 审核依赖）
├── /m/[slug]                      用户主动公开的脑图
└── /app/*                         产品工作台（noindex）
```

## 已实现但尚无工具页的输入类型

DOCX、EPUB、PPTX 在工作台已可用（`/app/docx`、`/app/epub`、`/app/pptx`），但没有对应的公开 `/tools/*` 落地页。这是当前最直接的一块 SEO 空缺：功能已经真实存在，只差承接页面，符合“功能可用才建页”的门槛。

`/tools/youtube-to-mind-map` 不同——YouTube 输入尚未开放（`/api/generate` 明确返回不支持），因此**不得**为它建页。

## URL 扩展规则

- 新输入能力先增加 `/tools/{input}-to-mind-map`，再将 CTA 指向 `/app/{kind}`。
- 教程统一放在 `/blog/{descriptive-slug}`，不要把教程文案塞进工作台。
- 用例达到至少 3 篇独立内容后再建立 `/use-cases` 聚合页，避免创建薄目录。
- 暂不增加 `/categories/[slug]` 和标签归档；当博客超过 30 篇且每个分类至少 5 篇时再开放索引。
- 英文为默认 locale，直接挂在根路径。若之后重开中文站，采用 `/zh/...` 并补 hreflang 与本地化 sitemap，不能把两种语言混在同一 URL。

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
