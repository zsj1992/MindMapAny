# 接入 Search Console API

一次性配置，之后 `npm run gsc` 就能拉数据，也能直接挂定时任务。

## 为什么用服务账号而不是 OAuth

OAuth 的 refresh token 会过期、会被撤销，还要有人去点同意屏。这个脚本迟早要无人值守地跑，服务账号只要在 GSC 里被加成用户就能一直用下去。

代价是多一步：服务账号建好后**必须回到 GSC 手动授权**，否则它有 API 权限但看不到任何站点。

## 步骤

### 1. 建服务账号（Google Cloud 控制台）

1. 打开 https://console.cloud.google.com/apis/library/searchconsole.googleapis.com ，启用 **Google Search Console API**（用 GSC 里那个有权限的账号）
2. 「IAM 和管理 → 服务账号 → 创建服务账号」
   - 名称随便，例如 `gsc-reader`
   - **不需要**授予任何 GCP 角色，直接下一步、完成
3. 点进这个服务账号 → 「密钥 → 添加密钥 → 创建新密钥 → JSON」，下载

### 2. 在 Search Console 里授权它

这一步最容易漏。到 https://search.google.com/search-console → 选中 mindmapany.com → **设置 → 用户和权限 → 添加用户**：

- 邮箱填服务账号的邮箱（形如 `gsc-reader@你的项目.iam.gserviceaccount.com`）
- 权限选 **完整** 或 **受限**，读数据够用

### 3. 填进 `.env.local`

从下载的 JSON 里取两个字段：

```
GSC_SA_EMAIL=gsc-reader@你的项目.iam.gserviceaccount.com
GSC_SA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

私钥直接复制 JSON 里 `private_key` 的值，**连同里面的 `\n` 一起**，用双引号包住。`.env.local` 已在 `.gitignore` 里。

下载的那个 JSON 文件配置完就删掉，别留在项目目录里。

## 用法

```bash
npm run gsc              # 最近 28 天
npm run gsc -- --days 90 # 最近 90 天
```

产出三个文件在 `docs/seo/data/`：

| 文件 | 用途 |
|---|---|
| `gsc-<日期>.md` | 人看的报告，见下 |
| `gsc-<日期>.csv` | query × page × country × device 明细，回填母表用 |
| `gsc-<日期>.json` | 原始快照（不进 git） |

## 报告里真正有用的是后两节

前面的「展现最多的查询/页面」是背景。真正能指导动作的是：

- **近在咫尺（排名 5–20，展现 ≥10）** — 投入产出最高的一档。Google 已经认为这一页和这个词相关，只差一点。改标题、补内容就可能进前几名，比为一个零展现的新词从头写一页划算得多。
- **有展现但零点击（展现 ≥20）** — 通常不是排名问题，是 title 和 description 没让人想点。改文案，不用动内容。

## 注意

- **数据有 2–3 天延迟**，脚本已经把结束日期设成 3 天前。拉到昨天只会得到一段假的下跌尾巴。
- **刚提交 sitemap 时报告是空的，这正常。** 从收录到有展现通常要一到几周。
- 排名是按展现**加权**平均的，不是算术平均——后者会被一堆零展现的长尾拉歪。
- 脚本会自己去问有权限的站点列表，不用手填 `sc-domain:` 还是 `https://`（猜错就是 403）。
