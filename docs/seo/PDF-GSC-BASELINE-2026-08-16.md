# PDF 关键词 GSC 基线（2026-08-16）

数据源：Google Search Console API，属性 `sc-domain:mindmapany.com`。统计窗口为 2026-07-16 至 2026-08-13；GSC 数据按惯例保留 3 天延迟。

## 当前基线

- 全站：22 次展现，0 点击，平均排名 75.8。
- PDF 词簇：10 次展现，0 点击。
- `/tools/pdf-to-mind-map`：4 次展现，平均排名 80.8。
- `/blog/how-to-convert-pdf-to-mind-map`：6 次展现，平均排名 82.5。

PDF 词簇中已有展现的查询：

| 查询 | 展现 | 平均排名 | 当前出现页面 |
|---|---:|---:|---|
| pdf to map | 3 | 85.0 | 工具页、教程页 |
| pdf to mind map free | 3 | 79.3 | 工具页 |
| pdf to mind map | 2 | 91.5 | 教程页 |
| how to generate mind maps from pdf files | 1 | 82.0 | 教程页 |
| turn pdf into interactive map | 1 | 60.0 | 教程页 |

## 诊断与页面归属

数据量很小，不能把短期波动当作趋势；但直接交易意图词 `pdf to mind map` 目前只触发教程页，`pdf to map` 又同时触发两个页面，已经出现早期的意图重叠信号。

固定页面归属：

- `/tools/pdf-to-mind-map` 主打 `PDF to mind map`、`PDF to mind map free`、`PDF mind map generator`，满足立即上传和生成的交易意图。
- `/blog/how-to-convert-pdf-to-mind-map` 主打 `how to convert PDF to mind map` 及其他 how-to 查询，满足步骤、准备、核验和方法解释的信息意图。

本次只修正教程页的 `primaryKeyword`，不在低样本阶段大改标题、URL 或正文。

## 验收节奏

1. 每周运行 `npm run gsc`，记录 28 天滚动窗口。
2. 每月运行 `npm run gsc -- --days 90`，观察趋势而不是单日排名。
3. 当 PDF 词簇累计达到至少 100 次展现后，比较两个页面的 query × page 分布。
4. 成功标准：交易意图词主要落到工具页；how-to 词主要落到教程页；工具页平均排名持续上升且开始获得点击。
5. 若累计 100 次展现后仍互相竞争，再调整教程页标题、导语及指向工具页的锚文本，不先新建相似页面。

原始明细见 `docs/seo/data/gsc-28d-2026-08-13.csv`。
