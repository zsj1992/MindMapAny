# SEO experiment registry

最后更新：2026-08-16

| 实验 | 主词 | 目标页 | 状态 | 当前允许动作 | 下一步 |
|---|---|---|---|---|---|
| `PDF-EXP-001` | `pdf to mind map` | `/tools/pdf-to-mind-map` | observing | 页面内任务闭环已于 2026-08-16 部署 | Day 7 检查抓取与漏斗，至少观察 21 天/50 次新增词簇展现 |
| `TEXT-EXP-001` | `text to mind map` | `/tools/text-to-mind-map` | observing | 综合页面升级已于 2026-08-16 部署 | Day 7 检查抓取与漏斗，至少观察 28 天/50 次新增词簇展现 |

共同未处理对照页：`/tools/webpage-to-mind-map`。只要任一实验仍在观察，该页的 Title、description、H1、正文、schema 和内链策略保持冻结。

查看机器可读状态：

```bash
npm run seo:experiment -- list
```

本轮例外地按用户决定同时部署两个工具页实验。两个目标 URL 的变化分别测量，但共同对照页也上涨或下跌时，应优先解释为整站/算法因素，而不是把结果归功于某一个页面动作。
