# SEO 实施路线图

> 2026-08-10 更新：站点已英文化，Phase 4 里原本排在 8–16 周的“评估英文站”已提前发生并落地，
> 因此路线图重排。触发原因是 Creem 支付审核需要英文站点，不是 SEO 决策。

## Phase 1：技术与信息架构（已完成）

- [x] 建立 `/tools` 目录和独立工具页（当前 3 个：pdf / text / webpage）。
- [x] 建立 `/blog` 与可复用的文章数据模型。
- [x] 将 `/app/*` 从 sitemap 移除并设为 noindex。
- [x] 增加 WebSite、SoftwareApplication、Blog、BlogPosting、FAQ 与面包屑结构化数据。
- [x] 更新全站导航、Footer 和 sitemap 内链入口。
- [x] 发布 3 篇种子内容。

## Phase 1.5：英文化（已完成，2026-08-10）

- [x] 全站界面、营销页、工具页、博客、合规页改为英文。
- [x] `lang="en"`、OG locale `en_US`、JSON-LD `inLanguage: 'en'`。
- [x] 脑图生成与深度研究的默认输出语言改为 `en`。
- [x] 关键词策略文档改为英文目标（本目录）。
- [ ] 提交新 sitemap 到 GSC，观察旧中文页面的重新索引与排名脱落情况。
- [ ] 复查三篇已翻译文章的英文自然度，必要时重写而不是修补。

## Phase 2：数据与可信度（1–4 周）

- [ ] 配置 Google Search Console 与 Bing Webmaster Tools。
- [ ] 接入 GA4 或隐私友好的产品分析，记录工具页→工作台→生成成功漏斗。
- [ ] 用真实 GSC 数据重估英文关键词的量级与难度（不要沿用中文站的判断）。
- [ ] 为作者、编辑规范和内容更新建立公开说明。
- [ ] 为公开分享页增加最低内容质量和重复内容控制。
- [ ] 为工具页增加实际生成示例与相关教程卡片。

## Phase 3：补齐已上线功能的落地页（1–3 周，优先级高于新内容）

- [ ] `/tools/docx-to-mind-map`（`/app/docx` 已可用）
- [ ] `/tools/epub-to-mind-map`（`/app/epub` 已可用）
- [ ] `/tools/pptx-to-mind-map`（`/app/pptx` 已可用）

三页必须各有独立说明、限制和 FAQ，不能只替换格式名复制 PDF 页。

## Phase 4：关键词簇执行（2–8 周）

- [ ] 按 `CONTENT-CALENDAR.md` 每周发布两篇。
- [ ] 使用 GSC 查询数据校正标题、意图和簇边界。
- [ ] 对排名 5–20 的页面优先补充内容和内链。
- [ ] 完成竞品实测后发布比较页。
- [ ] 只有实际功能上线后才扩展新的工具页面（YouTube 输入未开放，不得建页）。

## Phase 5：规模化（8–16 周）

- [ ] 博客超过 30 篇后评估可索引分类页。
- [ ] 建立用例中心，前提是每个用例有足够独立内容。
- [ ] 若中文需求得到验证，作为独立 `/zh` locale 重建，补 hreflang 与本地化 sitemap。
- [ ] 为更新频繁的内容建立定期刷新与 SEO drift 检查。

## 质量闸门

每次发布必须通过 lint、单元测试、生产构建、关键 URL 200 检查、canonical/robots/sitemap 检查。重大架构节点单独提交 Git，部署由人工明确触发。
