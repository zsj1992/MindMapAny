# MindMapAny 关键词到 URL 决策（第一版）

> 采集日期：2026-08-12；默认市场：美国英语。
> 当前没有 DataForSEO/Keyword Planner 实时搜索量接口，因此数量、CPC 和 KD 在关键词母表中保持为空。第一版用于建立正确页面边界和发布流程，不用于假装精确排序。

## 已确认保留的 URL

| 主 URL | 主任务 | 合并承接的表达 | 决策 |
|---|---|---|---|
| `/` | 了解 MindMapAny 并进入工作台 | ai mind map generator（观察） | 首页不与六个格式词争排名 |
| `/tools` | 选择文件/内容输入类型 | document to mind map, file to mind map | 保持聚合页，不再建重复的 generic document tool |
| `/tools/pdf-to-mind-map` | 上传 PDF 并生成可编辑脑图 | pdf to mindmap, convert pdf to mind map, pdf mind map generator | P0 优化；页码引用先作为页面差异点测试 |
| `/tools/text-to-mind-map` | 粘贴文本/笔记并生成脑图 | long text, notes, AI answer to mind map | P0 优化；先用页面区块验证场景词 |
| `/tools/webpage-to-mind-map` | 从公开文章 URL 抽取正文并生成脑图 | webpage, website, URL, article to mind map | P0 优化；明确不是整站爬取或登录页面 |
| `/tools/docx-to-mind-map` | 上传 Word DOCX 并生成脑图 | word document, docx, AI word to mind map | P0 优化；SERP 样本明确偏工具页 |
| `/tools/epub-to-mind-map` | 上传 EPUB 并按章节生成脑图 | ebook, book to mind map | P0 优化；不能承诺只输入书名或处理 DRM |
| `/tools/pptx-to-mind-map` | 上传 PPTX 并保留幻灯片编号 | PowerPoint, PPTX, presentation, PPT summarizer mind map | P0 优化；旧版 `.ppt` 不支持必须写清楚 |
| `/blog/ai-mind-map-guide` | 解释 AI 脑图方法与适用边界 | how to make a mind map with AI | 暂不拆相似教程，先扩充现有支柱页 |
| `/blog/how-to-convert-pdf-to-mind-map` | 教用户完成并验证 PDF 转换 | how to make a mind map from a PDF | 与工具页形成“操作/方法”意图区分 |
| `/blog/mind-map-vs-summary` | 帮用户选择输出格式 | mind map or summary | 保留现有文章 |

## 候选新增 URL（尚未获准发布）

| 候选 URL | 需求簇 | 当前判断 | 发布前唯一缺口 |
|---|---|---|---|
| `/use-cases/research-paper-to-mind-map` | research/academic paper to mind map | 产品高度匹配且差异明确，第一优先候选 | 补搜索量和 Top 10 页面类型；固定论文样本 |
| `/blog/mind-map-with-page-citations` | source/page provenance | 差异化强，但可能是低量教育需求 | 排除 citation-network 意图并补搜索量 |
| `/blog/verify-ai-summary-accuracy` | AI 输出核验 | 能形成独特证据文章 | 验证 SERP、准备具体错误案例和检查框架 |
| `/use-cases/study-notes-to-mind-map` | study/lecture notes | 竞品页面经常把它作为 text tool 场景 | 先测现有 text 页查询，证明需要独立 URL |
| `/tools/chatgpt-to-mind-map` | ChatGPT conversation mapping | 有新需求信号，但当前仅可靠支持粘贴文本 | 验证公开分享链接抓取，避免功能承诺失实 |
| `/use-cases/lecture-slides-to-mind-map` | lecture PPTX mapping | 产品匹配且出现学术任务信号 | 补商业搜索需求，固定真实 lecture deck |
| `/compare/best-pdf-to-mind-map-tools` | commercial comparison | 与购买决策相关 | 同文件实测至少三款工具并补搜索量 |
| `/compare/mapify-alternatives` | competitor alternatives | 商业意图明确 | 补量、逐项核实当日价格和功能 |

## 当前拒绝或暂停的页面

- `citation mapping mind map`：搜索意图是文献引用网络，不等于节点回到 PDF 页码，当前产品不应承诺。
- `NotebookLM mind map alternative`：NotebookLM 的多来源 notebook、问答等能力与当前产品不同，暂不做比较页。
- `textbook to mind map`：大型教材的成功率、文件限制和格式覆盖尚无生产数据。
- `mind map generator`：宽泛、高竞争且常要求自由绘图/协作；不为它复制一个泛化首页。
- `how to read research papers`：主题过宽，可能与工具意图距离过大；等待真实查询证据。

## 防蚕食规则

1. 拼写、单复数、`to mind map` / `to mindmap` 不拆页。
2. 文件格式是不同上传能力，可以各有工具页；同一格式下的 generator/converter/AI 修饰词合并。
3. 用例页必须跨越“换一个标题”的门槛：独立用户、输入、流程、样本和结果至少有三项明显不同。
4. 教程只有在 SERP 为信息/混合意图时建立；纯操作词直接指向工具页。
5. 比较页必须有带日期的同样本实测；无数据时不能先写结论。

## 下一次数据补全

接入 GSC/Keyword Planner 后，先补 `KEYWORD-MASTER.csv` 的 search_volume、CPC、KD 和 GSC 字段，再按以下优先顺序做 SERP 重叠验证：

1. research paper / academic paper / PDF to mind map
2. page citations / source references / verify AI summary
3. study notes / lecture notes / text to mind map
4. PowerPoint / lecture slides / PPT summarizer mind map
5. Mapify alternatives / best PDF to mind map tools

