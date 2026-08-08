# MindMapAny 站点架构

## 设计原则

公开内容层负责搜索发现和产品教育，`/app` 只负责完成任务。每个搜索意图只有一个主要 URL，工具页承接“马上使用”的交易型意图，博客承接“了解、学习、比较”的信息型意图。

```text
/
├── /tools                         工具目录（CollectionPage）
│   ├── /tools/pdf-to-mind-map     PDF 转思维导图
│   ├── /tools/text-to-mind-map    文本转思维导图
│   ├── /tools/youtube-to-mind-map YouTube 转思维导图
│   └── /tools/webpage-to-mind-map 网页转思维导图
├── /blog                          内容中心（Blog）
│   └── /blog/[slug]               指南、方法、对比
├── /pricing                       商业转化
├── /m/[slug]                      用户主动公开的脑图
└── /app/*                         产品工作台（noindex）
```

## URL 扩展规则

- 新输入能力先增加 `/tools/{input}-to-mind-map`，再将 CTA 指向 `/app/{kind}`。
- 教程统一放在 `/blog/{descriptive-slug}`，不要把教程文案塞进工作台。
- 用例达到至少 3 篇独立内容后再建立 `/use-cases` 聚合页，避免创建薄目录。
- 暂不增加 `/categories/[slug]` 和标签归档；当博客超过 30 篇且每个分类至少 5 篇时再开放索引。
- 国际化采用 `/{locale}/...`，不能把不同语言混在同一 URL；上线前补 hreflang 和本地化 sitemap。

## 索引策略

| 区域 | 索引 | Sitemap | 说明 |
|---|---:|---:|---|
| `/tools` | 是 | 是 | 稳定、独立搜索意图 |
| `/blog` | 是 | 是 | 原创教育内容 |
| `/pricing` | 是 | 是 | 商业意图 |
| `/m/[slug]` | 仅公开内容 | 是 | 用户生成内容，后续需质量门槛 |
| `/app/*` | 否 | 否 | 登录态、交互态、内容薄且易重复 |
| `/api/*` | 否 | 否 | 非 HTML 内容 |

## 内链规则

- 首页 → 工具目录、四个工具页、核心指南。
- 工具页 → 对应工作台、相关教程、价格页。
- 博客文章 → 一个主要工具页、一个上位指南、1–2 篇同簇文章。
- 支柱指南 → 所有簇的核心文章；所有核心文章必须反链支柱页。
- 锚文本描述目标用途，避免所有链接都使用“点击这里”。

