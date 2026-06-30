# QA 发布门禁报告：长发男鉴定器移动端 MVP

日期：2026-07-01  
角色：QA / 对抗式上线门禁  
范围：本地 `http://127.0.0.1:5173/`，不改业务代码、不部署、不写凭据

## 结论

QA 未发现阻塞上线问题。

当前版本可以作为今晚首发候选进入 Cloudflare Pages 预览 / 生产前最后确认，但存在 3 个 Medium 风险和 2 个 Low 残余风险。若总控按“不得出现禁用表达”和“结果页无遮挡”做字面强门禁，建议先回流开发 + UI/Frontend 做一轮小修再生产发布。

## Findings

### Blocker

无。

### High

无。

### Medium

1. 结果页顶部装饰贴纸压到结果前缀区域，移动端和桌面截图都可见。
   - 证据：`C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-release-gate-fKeouB\result-390x844.png`、`desktop-1280x900.png`。
   - 影响：不影响主标题识别，但违反“结果页无明显遮挡”的视觉门禁口径；首屏的“你的精神长发男类型是”在装饰贴纸下显得拥挤。
   - 回流对象：UI/Frontend。

2. 点击“再测一次”后页面回到第 1 题，但地址栏仍保留旧 `?result=OHBG`。
   - 证据：Playwright 记录 `restartState.url = http://127.0.0.1:5173/?result=OHBG`，同时 `restartState.hasQuiz = true`、`count = 01 / 24`。
   - 影响：正常继续答题会在新结果生成时覆盖 URL；但如果用户重测中途刷新、复制地址栏或分享当前 URL，会回到旧结果。
   - 回流对象：开发。

3. 用户可见免责声明使用了禁用词的否定式表达。
   - 证据：首页有“娱乐测试，不构成人格诊断。”；抽屉有“它不是心理诊断，也不是人格科学。”
   - 影响：这些不是权威背书，合规方向是安全的；但与“不得出现心理诊断、人格科学等表达”的字面门禁冲突。
   - 需要决策：总控决定是保留否定式免责声明，还是改成不含禁用词的娱乐边界文案。

### Low

1. Cloudflare Pages Node 版本未在仓库中锁定。
   - 证据：本地 Node 为 `v24.16.0`；官方 Cloudflare Pages v3 build image 当前默认 Node.js 为 `22.16.0`，可通过 `NODE_VERSION`、`.nvmrc` 或 `.node-version` 覆盖。
   - 影响：当前依赖大概率可在 Node 22 构建，但生产构建可复现性不如显式锁定。
   - 参考：Cloudflare Pages build image 文档，https://developers.cloudflare.com/pages/configuration/build-image/

2. image2 静态 16 图资产未完成，当前分享卡是 DOM 文字海报兜底。
   - 证据：分享卡导出稳定为 `1080x1350`，16 个结果遍历无溢出/重叠；仓库未落地 16 张 image2 静态图卡资产。
   - 影响：DOM 兜底足以上线功能闭环，但传播图的类型差异、场景感和“图卡资产”完成度仍低于设计文档理想态。

## 验收证据

### 命令

- `npm test -- --run`：通过，3 个测试文件，11 项测试。
- `npm run typecheck`：通过。
- `npm run build`：通过，生成 `dist/index.html`、hashed CSS / JS 资源。
- `node C:\Users\12156\AppData\Local\Temp\longhair-release-gate-qa.mjs`：通过，完整 Playwright 门禁脚本。

### 浏览器 / Playwright

- 内置 Browser 390 视口烟测：URL `http://127.0.0.1:5173/`，标题 `长发男鉴定器`，首页 DOM 非空，点击“开始鉴定”进入 `01 / 24`，console error/warn 为空。
- Playwright 本机 Chrome：390x844、430x932、1280x900。
- 截图目录：`C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-release-gate-fKeouB`。
- 截图尺寸：
  - `home-390x844.png`：390x844
  - `quiz-390x844.png`：390x844
  - `result-390x844.png`：390x844
  - `result-share-390x844.png`：390x844
  - `result-share-430x932.png`：430x932
  - `desktop-1280x900.png`：1280x900
- 分享卡下载：`share-card-download.png`，1080x1350。

### 功能路径

- 首页进入答题页：通过。
- 答题页 5 个选项显示：通过。
- 返回上一题：通过，返回 `01 / 24` 且保留已选“夯”。
- 24 题全 NPC：通过，结果 `OHBG / 人间烟火长发男`。
- 结果 URL 直达：通过，16 个结果码均能直接打开结果页。
- 生成图卡：通过。
- 保存 PNG：通过，文件为 1080x1350。
- 复制结果链接：通过，剪贴板为 `http://127.0.0.1:5173/?result=OHBG`。
- 再测一次：页面状态通过，但 URL 未清理旧结果，见 Medium finding。

### 分享卡与视觉

- 390x844：`document.scrollWidth = 390`，`.share-card.scrollWidth = 307`，`.share-card.clientWidth = 307`，无横向溢出。
- 430x932：`document.scrollWidth = 430`，`.share-card.scrollWidth = 347`，`.share-card.clientWidth = 347`，无横向溢出。
- 16 个结果码分享卡遍历：无页面横向溢出、无卡片横向溢出、无检测到的标题/场景/红色文案/footer 文字重叠。
- 肉眼复核：首页、答题页、分享卡符合黑纸、唱片、档案、旧纸、红色强调的方向；结果页顶部装饰遮挡风险另列 Medium。

### 隐私 / 安全边界

- 未发现登录、手机号、生日、姓名、精确位置等 PII 采集。
- 未发现答案上传、`fetch()`、`sendBeacon`、`XMLHttpRequest`、广告、统计、支付、模型 API 或前端密钥。
- Playwright 请求记录无外联请求。
- console/pageerror/requestfailed 均为空。
- localStorage keys 为空，cookie 为空。
- `public/_headers` 已包含 `X-Content-Type-Options`、`Referrer-Policy`、`Permissions-Policy`，并对 `/assets/*` 设置长缓存。Cloudflare `_headers` 文件用法与官方文档一致：https://developers.cloudflare.com/pages/configuration/headers/

## 部署风险

- `docs/deployment/cloudflare-pages.md` 的构建命令 `npm run build`、输出目录 `dist`、静态 headers、无业务环境变量、回滚记录要求基本足以上线准备。
- 建议运维上线时记录 production URL、commit SHA、部署时间、最后截图证据。
- Cloudflare 官方文档确认生产部署可回滚到任一成功构建的 production deployment，Preview deployment 不是 rollback target：https://developers.cloudflare.com/pages/configuration/rollbacks/
- 建议上线前补一个 Cloudflare Preview URL 的只读冒烟验收；本轮未部署，也未验证线上 headers 实际响应。

## 上线建议

QA 结论：未发现阻塞上线问题。

建议：若今晚必须发，可先上 Preview 并让总控确认 Medium 风险是否接受；若还有 20-30 分钟开发窗口，优先回流修复“重测清 URL”和“结果页顶部装饰避让”，然后 QA 只需重跑移动截图与 restart URL 两项即可。

残余风险：image2 16 张静态图未完成；当前 DOM 分享卡可用但图像传播资产完成度有限。Cloudflare 生产环境未实际部署，本报告不替代上线后的只读验证。

## 技能命中回传

- 已加载并使用：`agent-role-orchestrator`、`gstack-qa-only`、`build-web-apps:frontend-testing-debugging`、`playwright`、`verification-before-completion`、`browser:control-in-app-browser`。
- 临时补用：`systematic-debugging`，用于定位临时 Playwright 脚本的编码/包解析失败；问题不属于产品缺陷。
- 来源窗口要求但未使用：无。
- 影响产出的 skill：`agent-role-orchestrator` 约束台账和回调；`gstack-qa-only` 约束 QA-only；`frontend-testing-debugging` 与 `playwright` 约束浏览器证据；`verification-before-completion` 约束结论必须有新跑验证。

