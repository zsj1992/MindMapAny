# MindMapAny SEO 内页与文章滚动发布队列

> 这份队列没有固定日期轴。每天完成产品 P0 后，领取第一个满足“Ready 条件”的条目；条件不满足就推进它的研究任务，而不是跳过证据直接写文章。

## 固定流程

`关键词母表 → 补真实数据 → SERP 意图/重叠 → URL 决策 → Brief → 实现 → 质量门 → 发布 → 14/28 天复盘`

每次收集到新关键词：

1. 先追加到 `KEYWORD-MASTER.csv`，记录原词、来源、日期、地区和语言。
2. 清理无关词，与已有同义词合并；检查 `existing_url`。
3. 抽样 Top 10；7–10 个结果重叠时使用同一 URL，4–6 个属于同一簇并互链，0–3 个才考虑独立页面。
4. 在 `URL-DECISIONS.md` 写明保留、更新、合并、新建、观察或拒绝。
5. 只有通过日历中的“新页面发布闸门”才进入 Ready。

## 立即执行队列

| 顺序 | 类型 | 目标 | 状态 | Ready 条件 | 完成定义 |
|---:|---|---|---|---|---|
| 1 | 数据 | 给母表 P0/P1 词补 GSC、Keyword Planner 和 Trends | BLOCKED-DATA | 可访问 GSC/Ads 数据 | 所有 P0/P1 至少有一种真实需求数据，来源可追溯 |
| 2 | 现有工具页 | `/tools/pdf-to-mind-map` | RESEARCH | 补主词量和 Top 10；固定样本 | 首屏可操作、真实样本、页码引用、限制、FAQ、价格和簇内链完整 |
| 3 | 现有工具页 | `/tools/text-to-mind-map` | RESEARCH | 验证 long text / notes 是否同页 | 独立文本样本；不与 webpage 页复制；相关查询归属清楚 |
| 4 | 现有工具页 | `/tools/webpage-to-mind-map` | RESEARCH | 验证 URL/article/webpage 同簇 | 用公开文章复现；写清登录、JS 和反爬限制 |
| 5 | 现有工具页 | `/tools/docx-to-mind-map` | READY-PROVISIONAL | 已观察多个专用工具结果；仍补量 | DOCX 实例、表格/标题处理、`.doc` 与密码限制、内链完整 |
| 6 | 现有工具页 | `/tools/epub-to-mind-map` | READY-PROVISIONAL | 已观察多个专用工具结果；仍补量 | EPUB 实例、章节引用、DRM 限制和版权说明完整 |
| 7 | 现有工具页 | `/tools/pptx-to-mind-map` | READY-PROVISIONAL | 已观察专用转换及 PPT summarizer 结果 | PPTX 实例、幻灯片编号、`.ppt` 限制和内链完整 |
| 8 | 新用例 | Research paper to mind map | CANDIDATE | 搜索量 + SERP 类型 + 固定论文样本 | 独立任务页通过七项发布闸门；否则并入 PDF 页 |
| 9 | 证据文章 | How to verify an AI mind map against its source | CANDIDATE | SERP 验证 + 至少三个真实错误案例 | 给出可重复评分/核验方法并链接 PDF 和 text 工具 |
| 10 | 证据文章 | Mind maps with page citations | CANDIDATE | 与 citation-network 意图完成区分 | 展示真实页码节点和回查流程；无假引用 |
| 11 | 新用例 | Study or lecture notes to mind map | HOLD | 现有 text/PDF 页出现真实查询或生成使用 | 独立输入与工作流；不能只是替换人群名称 |
| 12 | 新工具 | ChatGPT conversation to mind map | HOLD-PRODUCT | 公开分享 URL 与粘贴文本都稳定支持 | 功能 E2E 通过后再做工具页，未实现前不收录 |
| 13 | 比较页 | Best PDF to mind map tools | HOLD-EVIDENCE | 同一 PDF 实测至少三款工具 + 搜索量 | 比较维度、失败样本、价格日期和适用人群可复核 |
| 14 | 比较页 | Mapify alternatives / MindMapAny vs Mapify | HOLD-DATA | 搜索量 + 最新竞品复测 | 无虚假主张、无暗示关联、季度更新责任明确 |

`READY-PROVISIONAL` 表示页面类型已有公开 SERP 证据，允许先做内容/示例审计，但在搜索量补全前不扩展相似页面。

## 单篇 Brief 必填字段

- 主关键词、合并的次关键词、locale/country 和数据来源。
- 用户现在要完成的任务，以及 SERP 主导页面类型。
- 目标 URL、现有冲突 URL 和为什么不合并。
- 产品入口、固定输入样本、输出证据和已知限制。
- 必须回答的购买/使用问题，不按“凑字数”设计章节。
- 至少三个入链来源和两个合理出链目标。
- GA4 事件、canonical、schema、OG、sitemap 和索引策略。
- 14/28 天后以什么指标决定保留、更新、合并或 noindex。

## 发布质量门

- 工具意图页面打开即可操作；文章不能假装是工具。
- 标题/正文/FAQ 不只是把 PDF 替换成 DOCX/EPUB/PPTX。
- 示例真实可复现，限制与当前代码一致。
- 不承诺 YouTube、旧 `.doc`/`.ppt`、DRM EPUB、登录网页或整站爬取。
- 比较、价格、竞品能力标注核验日期。
- 无孤立页、无重复主关键词、无错误 canonical。
- 发布后立即记录 GSC 请求收录和复盘日期。

## 每周维护

- 新词持续追加，不覆盖原始来源。
- 用 GSC 查询更新母表和 URL 决策，而不是只看总流量。
- 同一个簇有多个页面开始争同一查询时优先合并，不继续加文章。
- 队列少于 5 个有效候选时再收词；候选很多但无数据时先补数据，不批量写作。

