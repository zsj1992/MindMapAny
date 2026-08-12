# Similarweb 竞品关键词复盘与使用方案

> 数据日期：2026-08-12  
> 竞品：mindmapai.app、mapify.so  
> 原始文件：[`SIMILARWEB-KEYWORDS-RAW-2026-08-12.csv`](./SIMILARWEB-KEYWORDS-RAW-2026-08-12.csv)  
> 执行母表：[`KEYWORD-MASTER.csv`](./KEYWORD-MASTER.csv)

## 这次整理了什么

- 原始数据共 89 行、86 个去重词；`deepseek plain text into graphical representation`、`ia mapa mental`、`ai uluk rangkuman buku novel` 各重复一次。由于没有标明每个词属于哪个竞品，重复只能视为潜在的交叉信号，不能直接当作搜索量。
- 原始词全部保存在快照中；其中 63 个新增判断进入关键词母表。已经存在于母表的 `pdf to mind map`、`ai mind map`、`ai mind map generator`、`mind map generator` 等不重复追加。
- Similarweb 清单没有给出逐词搜索量、国家、排名 URL 和竞品归属，因此母表的 `search_volume`、`cpc`、`kd` 继续留空。不能把“前 100”误写成具体流量。
- 63 个新增判断中：7 个直接优化现有页、21 个合并进现有 URL、4 个先在现有页测试、3 个先验证 SERP、4 个观察、5 个等待产品能力、5 个等待完整语言版本、13 个排除、1 个普通暂停。

## 从词库看出的四个真实需求簇

### 1. 英文通用词有流量，但不是新建页面的理由

`mind map`、`mindmap`、`mind mapper`、`mind map generator`、`online mind map generator` 都指向同一个宽泛品类。它们可能同时包含手动画图、协作白板、模板和 AI 生成意图。当前只由首页和 `AI mind map` 支柱指南承接，不为每个变体复制 URL。

更值得做的是现有工具页里的任务词：

- `/tools/text-to-mind-map`：`generate mind map from text`、`make mind map from paragraph`、`tool to summarize text into mind map`。
- `/tools/pdf-to-mind-map`：`convert my pdf back into mind format`，并继续承接已有的 `pdf to mind map`。
- 所有工具的功能说明：`export mind map to markdown`。它先作为真实功能区块和帮助内容测试，不立即拆页。

### 2. 西班牙语是这批数据里最明确的现成增长面

西语有 16 个进入母表的词，而且站点已经有完整的 `/es` 首页、工具目录和六个工具页，不需要先开发新架构。

首批页面映射：

| 页面 | 主词 | 合并承接 |
|---|---|---|
| `/es` | `ia mapa mental` | `mapa mental`、`mapa conceptual ia`；概念图措辞只能谨慎使用 |
| `/es/tools` | `herramienta para mapas mentales online` | `herramienta para hacer mapas conceptuales gratis` |
| `/es/tools/pdf-to-mind-map` | `hacer mapas mentales de un pdf` | `para hacer mapa mental de un pdf`、`crear un mapa conceptual de un pdf` |

`mapa conceptual` 与 `mapa mental` 不是完全相同的产品：概念图常需要任意节点间连线和关系标签。当前产品以树状层级为主，因此这些词先用于解释差异和测试展示，不应声称已支持完整概念图编辑。

### 3. 日语已有核心品类词，先优化首页而不是扩页

`マインドマップ` 和 `マインドマップai` 都可由 `/ja` 承接，现有日文标题与正文已经自然使用该词。下一步是结合 GSC 查询调整 title、首屏说明和首页到六个日文工具页的点击，而不是新建另一个“AI マインドマップ生成器”页面。

### 4. YouTube 是产品机会，不是现在的 SEO 页面机会

清单里同时出现英文、西语、日语、印尼语的 YouTube 转录、摘要和脑图词。这是跨语言的产品需求信号，但当前 `/api/generate` 不支持 YouTube，音视频也在站点 FAQ 中明确写为未支持。

因此：

- 保留 `/tools/youtube-to-mind-map` 为候选 URL，但继续 404、不得进 sitemap、不得先发占位页。
- 先验证字幕获取覆盖率、无字幕视频、语言识别、时间戳回链、时长限制、版权与平台条款。
- 只有真实端到端生成成功、限制文案完成、失败路径可用后，才建立英文工具页；西语和日语版本必须再经过各自语言质检。
- `youtube文字起こしダウンロード` 等纯下载/纯转录词与脑图任务不同，即使以后支持 YouTube 也不必全部承接。

## 关键词库怎么用

### 页面更新顺序

1. `/es/tools/pdf-to-mind-map`：把三个西语 PDF 查询自然写进 title/H1 附近说明、步骤或 FAQ，并展示一个真实 PDF 输出。
2. `/es` 与 `/es/tools`：明确“AI 生成 + 可编辑 + 可回到来源”，观察 `ia mapa mental`、`mapa mental` 的展示和进入工作台点击。
3. `/tools/text-to-mind-map`：增加 paragraph、long text、AI output 三个真实输入例子，合并新增英文长尾。
4. `/tools/pdf-to-mind-map`：补自然语言转换表达和页码核验示例，不另建同义页。
5. `/ja`：保持核心词集中在首页，通过日文工具页获取格式长尾。

### 新 URL 闸门

| 候选 | 何时可以新建 | 现在的动作 |
|---|---|---|
| `/blog/mind-map-vs-concept-map` | SERP 为解释/比较意图，并能清楚展示树状脑图与图式概念图差异 | 验证 SERP，不把 concept map 塞满首页 |
| `/blog/export-mind-map-to-markdown` | GSC 出现相关展示，且页面能提供真实导出、导入其他工具和限制示例 | 先在工具页强化功能区块 |
| `/compare/best-ai-mind-map-tools` | 同一输入实测至少 3 款产品，价格和限制有核验日期 | 不先写泛榜单 |
| `/tools/youtube-to-mind-map` | 产品端到端能力通过，上述失败和合规问题已解决 | 仅保留需求发现任务 |
| 俄语、葡语、印尼语页面 | 至少一个完整 locale 的首页、工具目录、核心工具页、导航、metadata 和人工 QA 同时就绪 | 不发布孤立语言页 |

### 每周数据闭环

按 `query × page × country × device` 导出 GSC 数据并回填母表。对每个目标 URL只看四类指标：展示量、平均排名、进入工作台点击率、生成成功率。出现下面任一情况时才改变架构：

- 同一查询由两个 URL 同时获得展示：先判断意图和内耗，再合并或重写。
- 一个页面连续 28 天得到多个同簇长尾：扩充该页，不急着拆页。
- 一个候选簇有独立 SERP 类型、明确产品任务和足够查询：才进入 URL 决策。
- 有点击但生成失败率高：优先修产品或限制说明，不继续加 SEO 流量。

## 站点架构结论

当前架构的方向是对的：公开搜索层与 `/app` 工作台分离；六种输入能力各有一个工具 URL；英文默认路径稳定；七种语言使用自指 canonical、互指 hreflang；sitemap 排除工作台。现在的问题不是缺少更多目录，而是“现有页深度和簇内链还没有吃完现有架构”。

### 做得好的地方

- `/tools/{input}-to-mind-map` 与真实输入能力一一对应，没有为拼写变体复制页面。
- 首页、工具目录、页头大菜单和页脚都能到达六个工具页，工具页不孤立。
- 西语、日语等本地化工具页已有独立文案和关键词，不是只换 URL 前缀。
- `/app/*` 与 `/api/*` 不进入索引；canonical、hreflang 和多语言 sitemap 的实现集中管理。
- 没有提前上线不支持的 YouTube 页，也没有为了比较词制造未经实测的结论。

### 需要补的结构问题

1. 首页目前没有正文链接到 `/blog/ai-mind-map-guide`。支柱内容只能从导航进入，无法形成“首页 → 支柱指南 → 簇内容 → 工具”的闭环。
2. 博客只有 3 篇，且相关文章由数组顺序截取，不是按簇选择。DOCX、EPUB、PPTX、Webpage 四个工具页没有对应文章回链。
3. 工具页是介绍页加 CTA，而不是页内直接可操作。对强交易意图词，需用 CTA 点击率和 SERP 类型验证是否应在首屏嵌入轻量输入框。
4. `/m/[slug]` 的 sitemap 只按“公开”收录，尚无字数、原创度、节点数或重复内容门槛。公开脑图变多后有薄内容和索引膨胀风险。
5. 多语言工具页的 JSON-LD 面包屑中第二级固定为英文 `/tools`，应与可见面包屑一致地指向 `/es/tools`、`/ja/tools` 等本地化 URL。
6. `/use-cases` 和 `/compare` 尚不存在是合理的；达到各自至少 3 个合格页面前不要建空聚合页。

### 推荐的近阶段结构

```text
/
├── /tools
│   ├── /pdf-to-mind-map
│   ├── /text-to-mind-map
│   ├── /webpage-to-mind-map
│   ├── /docx-to-mind-map
│   ├── /epub-to-mind-map
│   └── /pptx-to-mind-map
├── /blog
│   ├── /ai-mind-map-guide                    支柱
│   ├── /how-to-convert-pdf-to-mind-map       PDF 簇
│   ├── /mind-map-vs-summary                   方法簇
│   ├── /mind-map-vs-concept-map              通过验证后
│   └── /export-mind-map-to-markdown           出现真实查询后
├── /pricing
├── /browser-extension
├── /m/[slug]                                  通过质量门后索引
└── /app/*                                     noindex
```

西语和日语继续复用这套信息架构，只翻译已有明确需求和能人工质检的页面。短期不新建 `/es/blog` 或 `/ja/blog` 空目录。

