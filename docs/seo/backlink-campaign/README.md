# MapAny 外链提交战役 — 运行总结（2026-08-20）

使用 [backlink_skills](https://github.com/flaqai/backlink_skills) 的 **SPD V2 Quality** 流程（`tools/backlink_skills/submit-product-directories-v2-quality/`），为 **MindMapAny（https://mindmapany.com）** 执行产品目录提交。每批 ≤10 站点，已执行两批。

## 结果总览

| 批次 | 已提交（等待审核） | 需人工 | 不可用/付费 |
|---|---|---|---|
| 第一批 | 1（ki-suche.io） | 7 | 2 |
| 第二批 | 2（aitoolsmarketer.com、reviewai.net） | 6 | 2（1 付费 + 1 不可用） |
| **合计** | **3** | **13** | **4** |

合规记录（均通过 V2 审计器 `Valid: yes`）：
- 第一批：`docs/seo/backlink-campaign/campaign-record.md`
- 第二批：`docs/seo/backlink-campaign/campaign-record-batch2.md`
产品资料：`docs/seo/backlink-campaign/mapany-product-profile.md`
证据（抓取页面/响应/截图/脚本）：`docs/seo/backlink-campaign/evidence/` 与 `scripts/backlink-*.mjs`

## ✅ 已提交（等待审核）

### 第一批
- **ki-suche.io**（德语 AI 工具目录）— 服务端表单直提，响应 *"Danke für deine Einreichung!"*

### 第二批
- **aitoolsmarketer.com**（AI 营销工具目录）— 表单提交后 `POST /api/form` 返回 `{"ok":true}`
- **reviewai.net**（独立 AI 工具目录）— 提交后页面提示 *"Thanks! We'll review your tool and publish it soon."*

> 均免费、无验证码、无回链要求；站方人工审核后收录。

## ⏸ 需人工处理（两批累计，按优先级）

1. **iuu.ai** — 先在 mindmapany.com 首页添加其验证 meta 标签后重提（`https://iuu.ai/submit`）
2. **futuretools.io** — 知名目录，表单可填但提交被 Cloudflare 拦截；浏览器人工提交：分类 **Productivity**、定价 **Free/Freemium**、勿勾 newsletter（`https://futuretools.io/submit-a-tool`）
3. **bai.tools** — Google 账号登录后完成免费条目提交
4. **therundown.ai** — 提供收件邮箱（站方发提交链接）
5. **theaigeneration.com** — 注册账号后在 `/add/` 提交 Add Listing
6. **openhunts.com / fastlaunch.io** — 注册/登录后提交项目（fastlaunch 免费名额有限）
7. **indietool.io** — 注册后在 Add your startup 添加项目
8. **aitoolguru.com / ai-findr.com / library.phygital.plus** — 注册或浏览器人工提交
9. **aiai.tools** — 需决定是否接受回链问题 + 提供截图后人工重提
10. **spotSaaS（tally.so/r/mBkqj5）** — 免费收录表单但必填 logo/截图/客户名单/预算等素材，需你提供素材后人工填写

## ❌ 不可用 / 付费

- **toolsfine.com** — 免费提交通道自 2026-01-01 暂停，仅付费套餐（paid-only）
- **aioffice.io / futureforgez.com** — 站点不可达/域名失效
- **aistage.net** — /submit 返回 403
- **noxilo.com / humanornot.co** — 无有效提交入口 / 非目录站（不合格）

## 第三轮：docs/growth 分发清单核验（2026-08-20）

按 `docs/growth/DISTRIBUTION.md` 的用户规划清单实测 10 个站点：

| 站点 | 结果 |
|---|---|
| Uneed | ⏳ 表单已填（name+url），站点抓取后需注册保存（`uneed.best/submit-a-tool`） |
| AlternativeTo / SaaSHub / Toolify | ⏸ Cloudflare 拦截，需浏览器人工 |
| There's An AI For That | ⏸ Cloudflare 已过、表单可渲染，但需注册账号 + 排期 + 选免费套餐 |
| Futurepedia / Dang.ai / Fazier / StackShare | ⏸ 登录墙 / 限流 |
| aitools.fyi | 💳 入口已变为 BoostMyTool 付费提交服务（表单含卡号字段），免费通道不存在 |

本轮无新增确认提交（全部为登录/Cloudflare/付费门槛，符合清单里"待填"的预期）；实测结论已固化到 `docs/growth/DISTRIBUTION.md` 与 `BACKLINK-KIT.md`。

## 合规说明

- 只提交真实产品信息（取自项目源码）；未付费、未绕过验证码/登录/Cloudflare、未同意回链、未群发。
- 锚文本策略：只用品牌/产品/裸 URL，不购买或索要 dofollow。
- 所有执行动作已记入 append-only 事件日志，证据保留在 `evidence/`（保留期至 2027-08-20）。
- 下一步建议：处理人工队列后复查两批收录状态；如需扩大规模，可按 V1 Batch 流程把已核验 URL 批量推进。
