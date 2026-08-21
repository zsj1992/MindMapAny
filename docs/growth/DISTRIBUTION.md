# 分发清单

> 物料在 [`LAUNCH-COPY.md`](./LAUNCH-COPY.md)，提交前先打开那份，别现编。逐站表单怎么填、素材文件在哪，看 [`BACKLINK-KIT.md`](./BACKLINK-KIT.md)。

## 为什么现在做这个而不是做 SEO

域名 4 天大、零外链。技术侧已经没问题了——robots 正常、sitemap 88 个 URL 全部收录成功、7 语言 hreflang 齐全。**新域名从收录到有排名是 3–6 个月**，而且没有外链的新站基本排不上去。

所以这三到六个月里，用户不会从 Google 来。目录站同时给两样东西：**外链**（解决排不上去的根因）和**转介流量**（不用等 Google）。

## 顺序

**先做「竞品替代」类**（AlternativeTo、SaaSHub、OpenAlternative）。原因：我们关键词库里 mapify、mindmapai 这些竞品词有真实搜索量，而"X alternative"型查询的意图极其明确——正在用竞品、正在找替代品的人。这类站排这种词排得很好，等于借它们的权重接住我们自己排不上的词。

**再做 AI 工具目录**（走量，主要是外链）。

**最后做社区**（Show HN、Product Hunt）。社区只有一次首发机会，等插件 0.2.0 过审、`/browser-extension` 文案更新完再发，别浪费。

---

## 清单

状态：☐ 未提交 · ⏳ 待审 · ✅ 已收录 · ⏸ 需人工（注册/登录/Cloudflare）· 💳 付费

### 一、竞品替代类（优先）

| 站点 | 提交入口 | 费用 | 状态 |
|---|---|---|---|
| AlternativeTo | alternativeto.net → Add Application | 免费 | ⏸ Cloudflare 拦截 + 需注册账号 |
| SaaSHub | saashub.com → Submit | 免费 | ⏸ Cloudflare 拦截 |
| ~~OpenAlternative~~ | 只收开源项目，本项目未开源，跳过（见 BACKLINK-KIT） | — | — |
| StackShare | stackshare.io | 免费 | ⏸ Vercel 限流(429)，需重试/浏览器提交 |

> 提交时**一定要填「替代品」字段**，指向 Mapify、MindMapAI、Xmind。这是这类站的价值所在，不填等于白提。

### 二、AI 工具目录

| 站点 | 提交入口 | 费用 | 状态 |
|---|---|---|---|
| There's An AI For That | theresanaiforthat.com/submit | 免费排队 / 付费加速 | ⏸ 表单已渲染但需注册账号 + 排期 + 选免费套餐 |
| Futurepedia | futurepedia.io/submit-tool | 免费 + 付费快审 | ⏸ 需注册（Join For Free），登录后才有提交表单 |
| Toolify | toolify.ai/submit | 免费 | ⏸ Cloudflare 拦截 |
| aitools.fyi | aitools.fyi/submit | 免费 | 💳 入口实际跳转 BoostMyTool 付费提交服务（表单含 Name on card 字段） |
| Dang.ai | dang.ai/submit | 免费 | ⏸ 重定向登录页 |
| Uneed | uneed.best | 免费 | ⏳ 表单已填（name+url），站点抓取后需注册保存 |
| Fazier | fazier.com | 免费 | ⏸ 需登录 |
| BetaList | betalist.com/submit | 免费排队 / 付费 | ☐ 需 Twitter 账号，暂缺，跳过 |

> 付费加速先别买。免费位收录了再看数据决定值不值——目录站的转介量差异极大，有的一天几十个访问，有的一个月零。
> 2026-08-20 实测：除 Uneed 外全部被 Cloudflare 或登录墙拦截，自动化无法完成；aitools.fyi 提交入口已变为付费服务（BoostMyTool）。

### 三、社区（插件过审后）

| 渠道 | 注意 |
|---|---|
| Product Hunt | 只有一次首发。周二至周四发，避开美国节假日 |
| Hacker News (Show HN) | 标题写事实别写营销词。溯源那个点正对 HN 胃口 |
| Reddit r/productivity, r/PKMS, r/ObsidianMD | 先看各版规，多数禁止硬广。以"我做了个东西解决自己的问题"切入 |
| V2EX / 少数派 | 中文用户群，注意 Creem 结账不支持支付宝微信 |
| Indie Hackers | 适合发构建过程，不适合发广告 |

### 四、自有渠道

- **Chrome 应用商店本身就是搜索引擎**。商店内搜 "mind map" 有量，竞争远小于 Google，而装机用户是最容易转化成付费的。0.2.0 过审后优化 listing 的标题、描述、截图。
- **DirPost**（你自己的目录站）可以自列一条。**只列一条**——自有站点的互链权重本来就低，多了反而像操纵。

---

## 提交时的注意

- **同一份描述别原样复制到所有站**。Google 会把大段重复内容当低质信号。用 `LAUNCH-COPY.md` 里不同长度的版本，或者换个开头。
- **邮箱统一**用一个，方便后续认领和改信息。
- **记录提交日期**，多数目录站审核要 3–14 天，两周后没动静再跟进。
- **能填 dofollow 的字段就填全**：官网、Twitter、GitHub、支持邮箱。信息越全越容易过审。

## 效果怎么看

不用等 GSC。在 Cloudflare 或 GA 里看 referrer——目录站带来的是**转介流量**，当天就能看见。外链效果慢，那要几周后才在排名上体现。

判断一个目录站值不值得投付费位，看它免费位一个月带来多少转介访问，再决定。
