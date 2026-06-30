# Cloudflare Pages 发布前预检报告

日期：2026-07-01

角色：运维 / Cloudflare Pages 上线准备负责人

项目：`D:\javaProjects\personal\longhair-guy-detector`

本地预览：`http://127.0.0.1:4173/`

预检基线：`615057f`（写入本报告前本地 `main` HEAD）

## 结论

Cloudflare Pages 发布准备：运维维度通过。

本轮只完成发布前准备、构建核验、配置建议、操作清单和回滚预案；未部署生产、未绑定域名、未写入凭据、未推送远端。

进入生产发布前仍需要等待：

- 开发 + UI/Frontend 完成 QA 后两项小修并回调架构 / 总控。
- 用户明确授权生产发布。
- 由有权限的人把选定 commit 推送到 GitHub；当前本地 `main` 相对 `origin/main` 仍显示 ahead，Cloudflare Pages 连接 GitHub 仓库时只能构建远端已推送提交。

## 只读预检范围

已检查：

- `AGENTS.md`
- `.codex/role-windows.md`
- `README.md`
- `docs/deployment/cloudflare-pages.md`
- `docs/verification/mobile-mvp-local-verification.md`
- `docs/verification/test-gate-2026-07-01.md`
- `docs/verification/qa-release-gate-2026-07-01.md`
- `package.json`
- `package-lock.json`
- `public/_headers`
- `.gitignore`
- `dist/`

未执行：

- 未登录 Cloudflare 控制台。
- 未创建 Pages 项目。
- 未触发生产部署。
- 未推送 GitHub。
- 未绑定域名。
- 未创建或写入 Cloudflare token / API key。
- 未修改业务代码、样式、构建脚本或测试脚本。

## 当前工作区状态

`git status --short --branch`：

```text
## main...origin/main [ahead 28]
 M .codex/role-windows.md
 M src/App.test.tsx
 M src/App.tsx
 M src/styles.css
?? docs/deployment/cloudflare-release-preflight-2026-07-01.md
?? docs/design/v2/
```

处理原则：

- `docs/design/v2/` 不纳入部署文档提交。
- `src/App.test.tsx`、`src/App.tsx`、`src/styles.css` 属于并行开发 + UI/Frontend 小修改动，不纳入运维提交。
- `.codex/role-windows.md` 已包含测试 / QA / 总控并行门禁台账变化；本轮只做增量合并，不覆盖其它窗口状态。
- 运维本轮只提交本报告和合并后的 `.codex/role-windows.md` 台账快照。

## Cloudflare Pages 配置建议

| 配置项 | 建议值 | 依据 / 说明 |
| --- | --- | --- |
| Project name | `longhair-guy-detector` | 与仓库名一致，便于回溯 |
| Git provider | GitHub | 远端为 `https://github.com/Dirtytrii/longhair-guy-detector.git` |
| Repository | `Dirtytrii/longhair-guy-detector` | 需用户账号授权 Cloudflare 访问 |
| Production branch | `main` | 当前开发和门禁均基于 `main` |
| Root directory | `/` 或留空 | 项目根目录就是 Vite 应用根目录 |
| Framework preset | `React (Vite)` | Cloudflare 官方预设为 `npm run build` + `dist` |
| Build command | `npm run build` | 本地已复跑通过 |
| Build output directory | `dist` | Vite 构建产物目录 |
| Build system | Pages 默认 v3 build image | 官方文档当前 v3 Node.js 默认 `22.16.0` |
| Node version | 先使用 Cloudflare 默认 Node.js `22.16.0` | 本地为 `v24.16.0`；当前依赖应兼容 Node 22。若云端构建失败，再由总控决策是否添加 `.node-version` 或 `NODE_VERSION` |
| Environment variables | 留空 | MVP 不需要业务环境变量 |

不要加入：

- image2 / imagegen key
- OpenAI / OpenRouter / 任意模型 API key
- 统计 SDK key
- 广告 / 联盟平台 key
- 支付平台 key
- Cloudflare API token

参考：

- [Cloudflare Pages Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages Build image](https://developers.cloudflare.com/pages/configuration/build-image/)

## 本地构建与产物证据

主机上下文：

```text
时间：2026-07-01 01:31:19 +08:00
OS：Microsoft Windows NT 10.0.26200.0
USER：12156
COMPUTER：DIRTYTRII
Node：v24.16.0
npm：11.13.0
```

命令：

```text
npm test -- --run
npm run typecheck
npm run build
```

结果：

| 检查 | 结果 | 证据摘要 |
| --- | --- | --- |
| `npm test -- --run` | 通过 | 3 个测试文件，12 项测试通过 |
| `npm run typecheck` | 通过 | `tsc -b` exit 0 |
| `npm run build` | 通过 | Vite `v6.4.3`，1589 modules transformed，产物写入 `dist/` |

`dist/` 产物：

| 文件 | 大小 |
| --- | ---: |
| `dist/index.html` | 626 B |
| `dist/_headers` | 215 B |
| `dist/favicon.svg` | 353 B |
| `dist/assets/index-BvbxYsII.js` | 189829 B |
| `dist/assets/index-BCs0Xv9e.css` | 17280 B |

## 静态 Headers

`public/_headers` 已随 Vite 构建复制到 `dist/_headers`。

内容：

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

结论：

- hashed assets 有长期缓存。
- 全站有 `nosniff`、`Referrer-Policy` 和 camera / microphone / geolocation 禁用策略。
- 当前 MVP 没有 Pages Functions，使用 `_headers` 文件适配静态 H5。

参考：[Cloudflare Pages Headers](https://developers.cloudflare.com/pages/configuration/headers/)

## Git 忽略规则

`.gitignore` 已包含：

```text
.codegraph/
.codegraph
node_modules/
dist/
```

`git status --ignored=matching` 显示：

```text
!! .codegraph/
!! dist/
!! node_modules/
!! tsconfig.app.tsbuildinfo
!! tsconfig.node.tsbuildinfo
```

`git ls-files dist .codegraph node_modules docs/design/v2` 无输出，说明这些部署产物 / 本地索引 / 依赖目录未被 Git 跟踪。

## 本地预览烟测

预览服务：

```text
npm run preview -- --port 4173
http://127.0.0.1:4173/
```

Browser 插件检查：

| 项 | 结果 |
| --- | --- |
| URL | `http://127.0.0.1:4173/` |
| title | `长发男鉴定器` |
| 390x844 首页 DOM | 非空，包含标题和开始按钮 |
| `开始鉴定` 按钮 | 唯一 |
| 点击后状态 | 进入 `01 / 24` |
| framework error overlay | 未发现 |
| console error / warn | 空 |
| 390x844 页面横向溢出 | 否 |
| 默认桌面视口 | DOM 非空，console error / warn 为空 |

临时截图目录：

```text
C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-release-preflight
```

该目录未写入仓库。

## Cloudflare 控制台操作清单

仅在测试、QA、运维门禁都可接受，且用户明确授权生产发布后执行。

1. 打开 Cloudflare Dashboard。
2. 进入 **Workers & Pages**。
3. 选择 **Create application**。
4. 选择 **Pages**。
5. 选择 **Connect to Git**。
6. 授权并选择 GitHub 仓库 `Dirtytrii/longhair-guy-detector`。
7. 选择 Production branch：`main`。
8. 配置 Build settings：

| 字段 | 填写 |
| --- | --- |
| Framework preset | `React (Vite)` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 留空或 `/` |

9. Environment variables：保持空。
10. 确认没有添加任何模型、统计、广告、支付或 Cloudflare API 凭据。
11. 只有在总控 / 用户授权后，点击创建 / 部署。
12. 部署完成后记录：

```text
Production URL:
Pages project name:
Deployment ID:
Cloudflare production commit SHA:
部署时间:
操作人:
```

13. 部署后把 URL 交给运维或 QA 使用 `post-deployment-readonly-verification` 做线上只读验证。

## 部署后只读验证清单

用户明确提供线上 URL 后再执行。

| 检查 | 建议动作 |
| --- | --- |
| 页面身份 | 打开 URL，确认 title 为 `长发男鉴定器` |
| 非空页面 | 390x844 和桌面视口确认首页内容可见 |
| 基础交互 | 首页点击 `开始鉴定`，确认进入 `01 / 24` |
| 直达结果 | 打开 `?result=OHBG`，确认结果页可见 |
| 静态 headers | 对首页和 hashed asset 做 HEAD 请求，确认 `_headers` 生效 |
| console 健康 | 检查 error / warn |
| 网络边界 | 确认无外部答案上传、统计、广告、模型 API 请求 |
| 分享卡 | 打开分享卡预览，必要时下载 PNG 验证尺寸 |

Windows 本地可用命令示例：

```powershell
Invoke-WebRequest -Method Head '<PRODUCTION_URL>' | Select-Object -ExpandProperty Headers
Invoke-WebRequest -Method Head '<PRODUCTION_URL>/assets/<HASHED_ASSET>.js' | Select-Object -ExpandProperty Headers
```

## 回滚预案

上线后必须保存上一版成功 production deployment 作为回滚目标。

Cloudflare Pages 回滚步骤：

1. 进入 Pages 项目。
2. 打开 **Deployments**。
3. 在 **All deployments** 找到目标成功的 production deployment。
4. 点击该 deployment 的三点菜单。
5. 选择 **Rollback to this deployment**。
6. 在确认窗口确认。
7. 回滚后重新打开 production URL，做只读烟测。

注意：

- Cloudflare 官方说明：成功构建的 production deployment 可作为回滚目标。
- Preview deployment 不是 rollback target。

参考：[Cloudflare Pages Rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)

## 发布前必须等待的门禁

| 门禁 | 当前状态 | 发布前要求 |
| --- | --- | --- |
| 测试门禁 | 已通过 | 已有 `docs/verification/test-gate-2026-07-01.md` 和台账回流 |
| QA 门禁 | 已完成，未发现 Blocker / High | 总控已接受免责声明、image2 和 Node 版本相关残余风险；两项用户可见小瑕疵已回流开发 + UI/Frontend 小修 |
| 运维门禁 | 本报告给出运维维度通过 | 等待本报告提交和回调 |
| 用户授权 | 待确认 | 用户明确允许生产发布 |
| 远端提交 | 待确认 | 当前本地 `main` ahead `origin/main`，Cloudflare 发布前需推送被授权的目标 commit |

## 风险与建议

### 需要总控 / 用户决策

- 等待开发 + UI/Frontend 完成 QA 后两项小修：结果页顶部装饰避让、重测后清理旧 `?result=`。
- 是否授权把目标 commit 推送到 GitHub。
- 是否授权 Cloudflare Pages 生产部署。

### 运维风险

- Cloudflare 默认 Node.js 为 `22.16.0`，本地构建使用 `v24.16.0`。当前建议不设置 `NODE_VERSION`，保持环境变量为空；若云端构建失败，再按失败日志决策是否补 `.node-version` 或 `NODE_VERSION`。
- 本轮没有生产 URL，因此没有验证线上 headers、CDN 缓存、Pages 域名或回滚按钮。
- 若直接连接 GitHub 部署，Cloudflare 无法读取本地未推送提交。

## 回调摘要

- 当前状态：Cloudflare Pages 运维发布准备通过；生产发布仍需 QA 后小修回归、远端提交和用户授权。
- 本轮变化：复查官方 Pages 配置、复跑构建 / typecheck / 测试、确认 `dist/_headers`、检查 `.gitignore`、完成 Browser 本地预览烟测、输出控制台操作清单和回滚预案。
- 证据文件 / 命令：本报告；`npm test -- --run`；`npm run typecheck`；`npm run build`；`git status --short --branch`；`dist/_headers`；`.gitignore`；临时截图目录 `C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-release-preflight`。
- Cloudflare 配置建议：`React (Vite)`；`npm run build`；`dist`；Production branch `main`；环境变量留空；默认 Node.js `22.16.0`。
- 发布前门禁：测试已通过；QA 已完成且总控已作出小修决策；等待开发 + UI/Frontend 小修回归、用户确认生产发布、目标 commit 推送到 GitHub、部署后线上只读验证。
- 阻塞 / 风险：无运维 blocker；生产发布需要用户授权，且当前本地提交未推送到 `origin/main`。
- 下一回流对象：总控 `019f17ca-0d15-77a3-8d57-1905c94bf7bd`，抄送架构 `019f18f0-959a-75e0-8c8b-a47b19261fb0`。

## 技能命中回传

- 已加载并使用：`agent-role-orchestrator`、`pre-deployment-readonly-checklist`、`build-web-apps:frontend-testing-debugging`、`browser:control-in-app-browser`、`verification-before-completion`。
- 来源窗口要求但未使用：`post-deployment-readonly-verification`，因为用户尚未完成部署并提供线上 URL。
- 临时发现应补用：无。
- 误召 / 无效加载：`chinese-documentation`、`chinese-commit-conventions` 按中文文档 / 中文提交需求读取，但不是本任务核心约束。
- 影响产出的 skill：角色编排约束台账和回调；预部署清单约束只读边界、回滚和门禁；前端测试调试与 Browser 约束真实预览证据；完成前验证约束提交前复跑。

## 规则沉淀

- 可复用优化沉淀：无。
- 具体问题或优化：本轮未发现需要修改全局 skill、README 或项目部署清单的稳定规则问题。
