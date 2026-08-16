# 接入 Search Console API

一次性配置，之后 `npm run gsc` 就能拉数据，也能直接挂定时任务。

## 先读这段：服务账号可能建不出密钥

Google 现在对新建组织默认打开 `iam.disableServiceAccountKeyCreation`，会直接拦住「创建密钥」。遇到这个报错有两条路：

1. **关掉那条组织政策**（推荐，需要 `Organization Policy Administrator` 角色）
   IAM 和管理 → 组织政策 → 搜 `disableServiceAccountKeyCreation` → 管理政策 → 添加规则 → 关闭强制执行 → 保存。之后按下面的服务账号流程走。
2. **改用 OAuth**（见文末），不需要动任何政策。

## 为什么优先用服务账号而不是 OAuth

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

产出三个文件在 `docs/seo/data/`。文件名包含统计窗口，28 天与 90 天的结果不会互相覆盖：

| 文件 | 用途 |
|---|---|
| `gsc-<天数>d-<日期>.md` | 人看的报告，见下 |
| `gsc-<天数>d-<日期>.csv` | query × page × country × device 明细，回填母表用 |
| `gsc-<天数>d-<日期>.json` | 原始快照（不进 git） |

## 报告里真正有用的是后两节

前面的「展现最多的查询/页面」是背景。真正能指导动作的是：

- **近在咫尺（排名 5–20，展现 ≥10）** — 投入产出最高的一档。Google 已经认为这一页和这个词相关，只差一点。改标题、补内容就可能进前几名，比为一个零展现的新词从头写一页划算得多。
- **有展现但零点击（展现 ≥20）** — 通常不是排名问题，是 title 和 description 没让人想点。改文案，不用动内容。

## 注意

- **数据有 2–3 天延迟**，脚本已经把结束日期设成 3 天前。拉到昨天只会得到一段假的下跌尾巴。
- **刚提交 sitemap 时报告是空的，这正常。** 从收录到有展现通常要一到几周。
- 排名是按展现**加权**平均的，不是算术平均——后者会被一堆零展现的长尾拉歪。
- 脚本会自己去问有权限的站点列表，不用手填 `sc-domain:` 还是 `https://`（猜错就是 403）。

## 备选：OAuth

组织政策关不掉时走这条。代价是 refresh token 可能被撤销，需要重新授权一次。

1. GCP「凭证 → 创建凭据 → OAuth 客户端 ID」，类型选**桌面应用**
2. **同意屏必须发布为「生产」**。留在「测试」状态的话 refresh token **七天就失效**，定时任务会莫名其妙断掉 —— 这是这条路唯一真正的坑
3. 下载桌面 OAuth 客户端 JSON，然后运行：
   ```bash
   npm run gsc:auth -- --client-json /绝对路径/client_secret.json --write-env
   ```
   浏览器里点一次「允许」。脚本会把客户端 ID、客户端密钥和 refresh token 直接写进 `.env.local`，不会把 token 打印到终端。
4. 授权完成后删除下载的客户端 JSON；脚本会把 `.env.local` 权限收紧为仅当前用户可读写（`0600`）。

授权时要用**拥有 mindmapany.com 那个 Search Console 属性的 Google 账号**。这条路不需要在 GSC 里添加任何用户 —— 你本来就是所有者。

之后 `npm run gsc` 用法完全相同；脚本两种凭据都认，OAuth 优先。
