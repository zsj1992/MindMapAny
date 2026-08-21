# 外链提交资料包

> 文案原文在 [`LAUNCH-COPY.md`](./LAUNCH-COPY.md)，这份文件解决「每个站点的表单往哪格里粘什么」。
> 提交顺序和站点取舍见 [`DISTRIBUTION.md`](./DISTRIBUTION.md)。各家表单会改版，字段名以提交页实际为准，但要的料基本就是下面这些。

## 0. 提交前先填好的三个空

| 项 | 值 | 说明 |
|---|---|---|
| 提交邮箱 | `support@mindmapany.com` | 官网公开品牌邮箱；若改用专用邮箱，所有站需同步替换 |
| Twitter / X | **待填** | 没有就先不建；BetaList 会要 |
| GitHub | 无 | 项目未开源，留空 |

## 1. 素材清单

| 文件 | 尺寸 | 用在哪 |
|---|---|---|
| `docs/growth/assets/logo-512.png` | 512×512 圆角白底 | 目录站 logo 位（大多要求 ≥256 正方形） |
| `docs/growth/assets/logo-240.png` | 240×240 | Product Hunt thumbnail（预留） |
| `extension/icon.svg` | 矢量 | 少数站点收 SVG |
| `extension/store-assets/screenshot-1280x800.png` | 1280×800 | 各站截图位、Futurepedia/Toolify 等 |
| `extension/store-assets/promo-440x280.jpg` | 440×280 | 备用小图 |
| `public/og.png` | 1731×909 | 备用横幅；部分站点会自己抓 OG 图 |

**缺口**：Product Hunt 的 gallery 要求 1270×760，现有截图是 1280×800，直接缩放会轻微变形。到发 PH 那一步时用 `npm run screenshot` 按 1270×760 重截，现在不用管。

## 2. 通用字段速查

粘这些之前先扫一眼 LAUNCH-COPY.md 顶部的定位句——所有站说同一件事：**每个节点都能翻回原文第几页**。

| 表单字段 | 填什么 |
|---|---|
| Name | `MindMapAny` |
| Website | `https://mindmapany.com` |
| Tagline / One-liner（≤60 字符） | LAUNCH-COPY「Tagline」 |
| Short description（≤200 字符） | LAUNCH-COPY「短描述」 |
| Description / About（长） | LAUNCH-COPY「中描述」，够长时用「长描述」 |
| Category | Productivity 优先；多选再加 Education / AI / Note-taking |
| Tags / Keywords | LAUNCH-COPY「基础字段」表里的标签行 |
| Pricing model | Freemium |
| Pricing detail | `Free: 30 credits on signup. Paid from $5.39/month (annual).` |
| Platforms | Web, Chrome Extension |
| Logo | `docs/growth/assets/logo-512.png` |
| Screenshot | `extension/store-assets/screenshot-1280x800.png` |
| 中文站 | 用 LAUNCH-COPY「中文版」整段替换 |

> **别原样复制到所有站**（DISTRIBUTION.md 里说过，重复内容会被 Google 当低质信号）：每个站换个开头，或在中描述基础上手动调一句。

## 3. 逐站提交卡

### 一、竞品替代类（最先做）

**AlternativeTo** — alternativeto.net → 注册账号 → Add Application
- Alternatives to:**最关键的一格**，填 Mapify、MindMapAI、Xmind
- Description → 中描述
- Platforms → Online / Chrome
- License → Freemium；填具体价格
- 审核偏严，描述里别带营销词和外链

**SaaSHub** — saashub.com → Submit
- 替代品类比 AlternativeTo 多，除上面三个可加 GitMind、Whimsical
- Pricing 有结构化字段：免费额度写 `30 credits, no card required`，起步价 `$5.39/mo`
- 社交链接位全填上（有的话），信息越全过审越快

**OpenAlternative** — openalternative.co
- ⚠️ **这个站只收开源替代品**，要求公开 GitHub 仓库。MindMapAny 未开源，**现阶段不满足，跳过**。如果以后开源再回来。

**StackShare** — stackshare.io
- 偏技术栈目录，给 SaaS 工具的权重一般。有空再提，优先级最低

### 二、AI 工具目录（走量）

**There's An AI For That** — theresanaiforthat.com/submit
- 免费排队很长（数周）。先提交免费位占位，别买加速

**Futurepedia** — futurepedia.io/submit-tool
- 收 logo + 截图，都用素材清单里的
- Category 选 Productivity / Summarizer

**Toolify** — toolify.ai/submit
- 表单长，描述给中描述全文；页面有各种付费置顶，全忽略

**aitools.fyi** — aitools.fyi/submit
- ⚠️ **2026-08-20 实测：该入口已重定向到 BoostMyTool 付费提交服务**（tally.so/r/2EkV4g，表单含 "Name on card" 字段）。免费通道已不存在，暂跳过；若要走付费，看它报多少价再决定。
- 旧记录：简单表单（名称、URL、短描述、分类、定价、邮箱），已过时。

**Dang.ai** — dang.ai/submit
- 同上量级，短描述即可

**Uneed** — uneed.best
- 类 Product Hunt 的排队制发布站。要 thumbnail，用 logo-512
- 免费队列慢，排上后有一波首页曝光

**Fazier** — fazier.com
- 同样偏「发布」而非纯目录。描述用长描述，截图传 1280×800 那张

**BetaList** — betalist.com/submit
- 定位是「早期产品」，要一句话 pitch：用 LAUNCH-COPY「一句话」
- 要 Twitter 账号，没有就先跳过这家

### 三、社区（不在本文件范围）

Product Hunt / HN / Reddit 的玩法在 DISTRIBUTION.md 第三节，等插件过审后再动。PH 专用规格：thumbnail 240×240（已备好）、gallery 1270×760（到时重截）、描述 ≤260 字符（从短描述压缩）。

## 4. 提交记录模板

每提一家，在 DISTRIBUTION.md 清单里改状态，并记一行：

```
日期 | 站点 | 状态(待审/已收录) | 登录邮箱 | 备注(审核周期、付费位报价)
```

两周没动静再跟进；一个月后在 Cloudflare/GA 的 referrer 里看哪家真的带量。
