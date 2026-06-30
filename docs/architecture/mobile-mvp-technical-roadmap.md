# 长发男鉴定器移动端 MVP 技术路线

状态：架构 / CTO 方案，待总控 / 用户确认后派发执行角色

更新时间：2026-06-30

## 1. 输入源与边界

本方案以以下文件作为当前事实源：

- `README.md`
- `docs/product/result-type-naming.md`
- `docs/product/result-content-system.md`
- `docs/design/mobile-visual-direction.md`
- `docs/design/reference/mobile-home-target.png`
- `docs/design/reference/mobile-quiz-target.png`
- `C:\Users\12156\Downloads\长发男鉴定器移动端正式设计文档.docx`
- 必要背景：`C:\Users\12156\Downloads\长发男鉴定器正式版设计文档.pdf`

总控增量决策已纳入：

- 内容主编产出已验收通过。
- 6 个待决策短名全部保留，不返工。
- 结果数据结构、结果页 copy、图卡 prompt 以 `docs/product/result-type-naming.md` 和 `docs/product/result-content-system.md` 为准。
- 首页和答题页 UI 方向以 `docs/design/mobile-visual-direction.md` 及两张参考图为准。

非目标：

- 不实现生产代码、测试脚本、样式或构建配置。
- 不初始化 CodeGraph。
- 不部署、不创建 Cloudflare 配置、不写凭据。
- 不把产品包装成心理诊断、人格科学、精准识别或权威测评。

## 2. 推荐技术路线

结论：继续使用 React / Vite / TypeScript / Tailwind CSS，MVP 做纯前端静态 H5。

理由：

- React 适合把首页、答题页、加载页、结果页、分享卡预览拆成状态明确的组件。
- Vite 适合静态站点，生产构建默认面向静态托管；官方说明 `vite build` 会生成适合静态托管的生产 bundle。
- TypeScript 对本项目很有价值，尤其是题库、四轴、结果码、图卡 prompt、分享模板这些数据合同不能靠口头约定。
- Tailwind 的移动优先断点模型与本项目移动端首发一致；无前缀样式先覆盖手机，再用 `sm:` / `md:` 等增强平板和桌面。
- Cloudflare Pages 官方 React 指南和构建配置都把 React(Vite) 的构建命令 / 输出目录列为 `npm run build` / `dist`。

不建议首版使用：

- Next.js：当前没有 SSR、登录、服务端 API 或 SEO 动态页刚需，会增加部署和缓存心智。
- 后端 / 数据库：MVP 明确不登录、不采集个人身份信息，题库与结果本地化即可。
- 运行时 image2 / imagegen API：图卡资产可作为设计资产流程产出；若把模型 API 放进浏览器，会引入凭据和成本风险。
- 广告、付费报告、会员：商业化允许，但第一版先验证完成率、分享率和停留。

## 3. CodeGraph 状态

检查证据：

- `python C:\Users\12156\.codex\skills\agent-role-orchestrator\scripts\check_codegraph.py --project D:\javaProjects\personal\longhair-guy-detector`
- MCP `codegraph_status(projectPath="D:\javaProjects\personal\longhair-guy-detector")`

当前状态：

- 工具可用性：可用，脚本识别到 `C:\Users\12156\AppData\Roaming\npm\codegraph.CMD`。
- 初始化状态：未初始化。
- MCP 状态：报错 `CodeGraph not initialized in D:\javaProjects\personal\longhair-guy-detector. Run 'codegraph init' in that project first.`
- 索引路径：`D:\javaProjects\personal\longhair-guy-detector\.codegraph`
- `.gitignore` 忽略状态：当前未发现忽略配置。

建议：

- 在进入开发实现前，由总控 / 用户确认后运行 `codegraph init -i`。
- 初始化会创建 `.codegraph/` 本地索引目录；它应保持本地，不应进入提交。
- 因当前仓库没有 `.gitignore`，初始化前应同步确认是否允许新增 `.gitignore` 忽略 `.codegraph/`。
- 本轮只记录状态，不初始化。

风险：

- 未初始化时，架构和开发只能用 `rg` / 文件阅读做代码理解；现在仓库几乎无代码，影响不大。
- 一旦进入 React 组件、评分逻辑和测试文件阶段，不初始化会降低跨文件影响分析效率。
- 如果直接初始化但不忽略 `.codegraph/`，会制造大量本地未跟踪文件，干扰提交颗粒度。

## 4. 有限开源 / 可借鉴方案扫描

检索关键词：

- `React quiz app JSON questions scoring`
- `personality quiz React TypeScript Tailwind`
- `React BuzzFeed quiz component share result`
- `DOM to image React share card`
- `Satori Open Graph social card`

候选与可借鉴点：

1. [wingkwong/react-quiz-component](https://github.com/wingkwong/react-quiz-component)
   - 可借鉴：JSON 输入、题目校验、自定义结果页、结果汇总。
   - 不采用：它偏正确答案型 quiz，本项目是四轴气质映射，不能套用正确 / 错误模型。

2. [ackledotdev/association-quiz](https://github.com/ackledotdev/association-quiz)
   - 可借鉴：用 React / TypeScript / Tailwind 做 personality-esque quiz，答案可按权重对应结果，quiz data 可扩展。
   - 不采用：它是 Next.js 项目；本项目 MVP 静态 Vite 更轻。

3. [amamenko/react-buzzfeed-quiz](https://github.com/amamenko/react-buzzfeed-quiz)
   - 可借鉴：结果对象、题目对象、分享按钮和 `onResult` / `onAnswerSelection` 回调的 API 形态。
   - 不采用：BuzzFeed 风格和默认 UI 与本项目地下刊物视觉不匹配，且维护活跃度一般。

4. [bubkoo/html-to-image](https://github.com/bubkoo/html-to-image)
   - 可借鉴：把 DOM 节点导出为 PNG / JPEG / Blob，适合第一版本地生成分享卡。
   - 风险：跨域图片会污染 canvas；超大 DOM / data URI 有失败风险；需要用本地同源资产和固定 1080x1350 渲染容器验收。

5. [vercel/satori](https://github.com/vercel/satori)
   - 可借鉴：用 JSX / HTML / CSS 子集生成 SVG，适合后续做稳定 OG 图或服务端图卡。
   - 不采用为 MVP 主路线：它不是完整浏览器渲染，支持的 HTML/CSS 是子集；首版静态前端更适合先用 DOM 导出，后续如上 Cloudflare Pages Functions 再评估。

对下游约束：

- 只借鉴数据驱动、回调、分享卡生成思路，不复制 UI、文案和结果算法。
- 首版图卡导出优先客户端 DOM -> PNG；所有图卡底图、字体、纹理尽量同源本地化。
- 如果后续需要 URL 分享自动带结果图，再单独评估 Pages Functions + Satori / vercel/og 路线。

## 5. 数据结构与评分落地

推荐文件层：

- `src/data/questions.json`：24 题题库。
- `src/data/results.json`：16 型结果库，来自两份 product 文档。
- `src/data/share-copy.json`：全局随机短句和分享模板。
- `src/data/prompts.json`：16 型 image2 / imagegen 图卡 prompt，不在浏览器运行模型。
- `src/data/settings.json`：品牌文案、免责声明、社媒配置、视觉模板开关。
- `src/domain/scoring.ts`：纯函数评分。
- `src/domain/resultMapping.ts`：结果码、显示字段和强度映射。
- `src/domain/schema.ts`：TypeScript 类型，建议用 Zod 或等价运行时校验保证 JSON 不漂。

题目模型建议：

```ts
type Axis = "AO" | "TH" | "DB" | "FG";
type Pole = "A" | "O" | "T" | "H" | "D" | "B" | "F" | "G";

interface Question {
  id: number;
  text: string;
  axis: Axis;
  agreePole: Pole;
  tieBreaker?: boolean;
}
```

答题值：

```ts
type RawScore = -2 | -1 | 0 | 1 | 2;
```

选项文案：

- 计分值以 DOCX 表格为准：`-2, -1, 0, 1, 2`。
- 选项显示文案建议放入 `settings.json`，不要写死在组件里。
- 注意：新版视觉参考图上显示的是普通同意度文案，而 DOCX 表格中是“拉完了 / 有点拉 / NPC / 人上人 / 夯”。架构建议默认保留 DOCX 的计分文案；若总控确认视觉参考图的普通同意度文案也要替换正式文案，只改配置，不改评分函数。

计分公式：

```ts
contribution = rawScore * (agreePole === frontPole(axis) ? 1 : -1)
axisScore = sum(contribution)
```

判定：

- `axisScore > 0`：取前者字母。
- `axisScore < 0`：取后者字母。
- `axisScore = 0`：使用该轴最后一题作为 tie-break。
- tie-break 题：A/O 第 6 题，T/H 第 12 题，D/B 第 18 题，F/G 第 24 题。

零分归类技术决策：

- 若 `axisScore = 0` 且 tie-break 题 `rawScore != 0`，按该题贡献方向决定字母。
- 若 `axisScore = 0` 且 tie-break 题 `rawScore = 0`，归到该 tie-break 题的 `agreePole`。
- 按当前题库，这意味着完全中立时归为 `OHBG`。
- 这条规则的好处是完全确定、无需随机、不需要服务端；代价是全中立用户会落到暖端结果，测试需要固定快照验证。

强度值：

```ts
strength = Math.round(Math.abs(axisScore) / 12 * 100)
```

结果映射：

- 结果码由四轴字母拼接，如 `ATDG` / `OHBG`。
- `results.json` 同时保留：
  - `code`
  - `shortName`：来自 `result-type-naming.md`，用于 H1、分享卡主标题、结果列表和代码数据。
  - `sceneName`：来自内容系统 / DOCX，用于副标题、图卡方向和 image2 prompt。
  - `tagline`
  - `description`
  - `danger`
  - `companions`
  - `readings`
  - `copyPool`
  - `visualPromptRefs`

安全文案规则：

- 结果文案可以锋利、损、轻微冒犯，但只冒犯嘴硬、自我保护和拧巴。
- “危险倾向”必须写成娱乐化提醒，不能写成病理、风险评估或处方。
- `ATDF` 保留“天台终极长发男”短名时，图卡和 UI 不出现天台边缘、坠落、自伤暗示。

## 6. UI / Frontend 路线

视觉路线：

- 首页与答题页对齐 `docs/design/reference/mobile-home-target.png` 和 `docs/design/reference/mobile-quiz-target.png`。
- 基底是黑色旧纸、低饱和纹理、颗粒、复印 / 胶片 / 地下刊物质感。
- 主视觉使用大号粗粝中文标题、红色强调、胶带 / 纸片 / 线团 / 唱片 / 档案边角元素。
- 答题选项要有旧纸卡片和描边的实体感，不做普通表单或 SaaS 风格。

页面拆分：

- `HomePage`：首屏、主 CTA、次级“这玩意儿测什么”底部抽屉。
- `QuizPage`：单题单屏、进度、五级选项、上一题、自动下一题策略。
- `LoadingInterstitial`：900ms-1500ms 的短过渡和随机文案。
- `ResultPage`：短类型名、场景长名 / 判词、四轴强度、长描述、危险倾向、精神同伙、推荐阅读、分享入口。
- `ShareCardPanel`：3 套分享文字模板、图卡预览、保存图片、复制链接。
- `ResultGallery`：可选，展示全部 16 型，用于首页次级入口或开发调试，不抢首屏。

交互策略：

- MVP 可以用单页状态机，不必上路由库；如果要支持分享链接恢复结果，再引入 query 参数。
- 题目状态保存在内存；可选 `localStorage` 只保存当前答题进度，不保存可识别身份。
- “生成分享卡”先导出当前结果卡 DOM；后续 image2 资产生成是设计资产流程，不是用户运行时调用。
- 所有 CTA 和选项高度必须满足移动触控，建议不小于 44px。

响应式策略：

- 以 375x812、390x844、430x932 为主要手机验收尺寸。
- 桌面端不重新设计成营销站；使用居中手机画布或最大宽度容器，保持海报感。
- 不用 viewport 宽度缩放字体；标题可使用 clamp 但必须设置最小 / 最大值，避免中文换行炸版。
- 固定格式元素，如选项卡、进度条、分享卡 1080x1350 容器，要用稳定尺寸 / aspect-ratio，避免状态变化撑开布局。

视觉验收方式：

- UI/Frontend 先给首页、答题页、结果页、分享卡四个状态的本地可运行页面。
- Playwright 截图至少覆盖 375x812、390x844、430x932、1280x900。
- 用截图和参考图对照检查：标题位置、主按钮比例、选项卡间距、红色强调、纹理密度、底部装饰不遮挡内容。
- 检查最长中文短类型名、最长题目、最长危险倾向是否溢出。
- 检查无自伤、坠落、血腥、现实伤害暗示。

## 7. 开发路线

建议实现顺序：

1. 项目脚手架：React + Vite + TypeScript + Tailwind；仅建立基础运行、lint / typecheck / test 命令。
2. 数据合同：把题库、结果、分享文案、prompt 和 settings 落成本地 JSON / TS 数据，并加 schema 校验。
3. 评分核心：实现纯函数 `scoreAnswers`、`resolveAxisPole`、`resolveResultCode`、`calculateStrengths`。
4. 评分测试：先覆盖 24 题方向、四轴边界、全中立、每个结果码可达。
5. 首页 / 答题页 UI：按视觉参考还原，先静态，再接状态。
6. 加载页 / 结果页 UI：接入结果内容系统和四轴展示。
7. 分享卡：本地 DOM 预览、三套模板、保存 PNG、复制链接。
8. 隐私与合规文案：免责声明、无登录、无个人身份采集、无广告 / 无付费。
9. Cloudflare Pages 预备：只准备构建输出、headers 建议和部署文档，实际部署由总控 / 运维授权。

建议模块边界：

- `src/domain/*`：无 React 依赖的纯逻辑，测试优先。
- `src/data/*`：静态数据源，只做结构校验。
- `src/components/*`：可复用 UI。
- `src/pages/*` 或 `src/screens/*`：页面级组合。
- `src/hooks/*`：答题状态、分享卡导出。
- `src/styles/*`：Tailwind entry、字体、纹理 token。
- `public/assets/*`：纹理、胶带、唱片、纸片、后续 image2 图卡资产。

提交策略：

- 按 AGENTS.md，每次完成工作主动提交，提交信息使用中文且详尽。
- 推荐颗粒度：
  - `chore: 初始化 React Vite TypeScript Tailwind 移动端项目骨架`
  - `data: 落地题库和十六型结果内容数据源`
  - `test: 增加四轴评分和零分归类单元测试`
  - `feat: 实现本地评分和结果码映射`
  - `feat: 按移动端参考实现首页和答题页`
  - `feat: 实现结果页和分享卡预览`
  - `test: 增加移动端视觉和分享卡导出验收`
  - `docs: 补充 Cloudflare Pages 上线说明`

## 8. QA / 测试验收路线

测试角色：

- 测试窗口负责测试用例、单测策略和必要测试报告。
- QA 窗口负责对抗式验收，尝试证明“还不能上线”。

必须覆盖的测试：

- 评分单测：
  - 每题 direction / agreePole 贡献方向正确。
  - 每轴最大值、最小值、正负判定正确。
  - `axisScore = 0` 时 tie-break 正确。
  - tie-break 也为 0 时按 `agreePole` 归类，全 NPC 得到 `OHBG`。

- 结果映射测试：
  - 16 个结果码都有数据。
  - 16 个结果码都可通过构造答案命中。
  - `shortName` 与 `result-type-naming.md` 一致。
  - `sceneName` / `tagline` / `danger` / `copyPool` 与内容系统字段一致。

- UI 行为测试：
  - 24 题能完整答完。
  - 上一题能修改答案并影响结果。
  - 自动下一题不会跳过未选项。
  - 刷新 / 返回策略符合产品预期。

- 移动视觉验收：
  - 首页和答题页截图与两张 reference 对齐。
  - 结果页和分享卡继承同一视觉语言。
  - 中文长文本不重叠、不被装饰遮挡。
  - 触控区域可用，主要按钮不会贴底太近。

- 分享卡生成验收：
  - 1080x1350 输出稳定。
  - 保存 PNG 成功。
  - 复制链接不包含个人身份信息。
  - 使用本地同源图片，避免 canvas taint。
  - 断网情况下已完成答题的结果卡仍能生成。

- 隐私 / 合规检查：
  - 无登录。
  - 无手机号、生日、精确位置、真实姓名采集。
  - 不把答案上传服务端。
  - 不写心理诊断、人格科学、精准测评等权威表述。
  - MVP 无广告、无付费报告、无购买诱导。

## 9. Cloudflare 上线路线

推荐使用 Cloudflare Pages。

构建建议：

- 构建命令：`npm run build`
- 构建产物目录：`dist`
- 生产分支：`main`
- 预览部署：每个 PR / 分支自动生成 Preview Deployment，用于 UI 和 QA 截图验收。

环境变量：

- MVP 不需要业务环境变量。
- 如果只接入 Cloudflare Web Analytics，可在构建时使用公开 token / 配置，但不得放私密凭据。
- 若后续接入 imagegen、统计服务、广告或联盟返佣，必须重新评估是否需要 Pages Functions / 后端代理，不能把密钥写入前端。

缓存与 headers：

- Vite hashed assets 可用长缓存。
- HTML / entry 应避免长缓存，防止新部署后旧 HTML 引用已删除 chunk。
- Cloudflare Pages 支持在静态资产目录放 `_headers`，对静态响应附加 header。
- 建议未来由开发 / 运维实现并验证：

```text
/assets/*
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

回滚：

- Cloudflare Pages 支持把生产部署回滚到任一成功构建的历史 production deployment。
- Preview deployments 不能作为 rollback target。
- 每次上线前记录部署 commit SHA、Pages URL、验收截图和是否可回滚。

上线门禁：

- `npm run build` 通过。
- 单测通过。
- 移动端 Playwright 截图通过。
- 分享卡导出通过。
- 隐私 / 文案边界检查通过。
- 总控 / 用户确认 MVP 不含广告、付费、凭据、生产写操作。

## 10. 下游角色拆分

建议总控确认本方案后按 L2 派发：

| 角色 | 是否需要 | 主要目标 | 允许范围 | 禁止范围 | 验收信号 |
| --- | --- | --- | --- | --- | --- |
| UI/Frontend | 需要，优先 | 把首页和答题页按 reference 做成可实现视觉方案，并给结果页 / 分享卡继承规则 | `docs/design/*`、前端 UI 文件、视觉验收截图 | 改评分规则、改结果文案口径、部署 | 首页 / 答题页截图接近参考图，移动端无溢出 |
| 开发 | 需要 | 落地项目骨架、数据结构、评分逻辑、页面状态和分享卡导出 | `src/*`、`public/assets/*`、项目配置、测试文件 | 改产品文案决策、改发布凭据、初始化 CodeGraph 未获确认 | 本地可答完 24 题，结果正确，构建通过 |
| 测试 | 需要 | 设计并执行评分、映射、UI 流程、分享卡测试 | 测试文件、测试报告 | 直接改产品实现，除非另行授权 | 测试覆盖核心评分和 16 结果可达 |
| QA | 需要 | 对抗式验收移动端体验、文案边界、隐私和上线风险 | QA 报告、截图、复现步骤 | 代替测试写正式测试用例，擅自改代码 | 明确 blocker / 非 blocker，给上线建议 |
| 运维 | 可后置 | Cloudflare Pages 项目设置、预览部署、回滚说明 | 部署文档、只读预检、经授权的 Pages 设置 | 未授权部署、写凭据、改 DNS | Preview URL 可访问，回滚路径清楚 |
| 安全 | 可并入 QA 或后置 | 低影响检查静态站安全 header、隐私边界、无密钥泄漏 | 只读检查 | 未授权扫描第三方或生产写操作 | 无前端密钥、无个人信息上传、headers 风险有记录 |

不建议派发：

- DBA：MVP 无数据库。
- 公众号 / 小红书 / 视频：当前是产品实现阶段，内容发布另走内容主编路线。

## 11. 第二版完成的验收信号

用户可按以下信号判断“第二版完成”：

- 打开本地或 Preview URL，首页首屏像 `mobile-home-target.png`，不是普通问卷页。
- 答题页像 `mobile-quiz-target.png`，24 题单题单屏，进度、上一题、选项状态都可用。
- 任意答完 24 题后，结果页使用 16 个已确认短类型名和内容系统文案。
- 全 NPC 路径稳定得到 `OHBG`，并且该规则在测试里写明。
- 构造答案能命中全部 16 种结果。
- 分享卡能生成 1080x1350 PNG，保存后中文不糊、不溢出、不遮挡。
- 页面不登录、不收集个人身份信息、不上传答案。
- 页面没有广告、付费报告、购买诱导。
- 移动端截图在 375x812、390x844、430x932 下无重叠、无按钮溢出、无装饰压字。
- `npm run build`、评分单测、结果映射测试、移动视觉验收和分享卡验收均有证据。
- Cloudflare Pages 预览部署可访问，构建产物来自 `dist`，回滚路径清楚。

## 12. 仍需总控 / 用户确认

1. 是否允许开发前初始化 CodeGraph，并同时允许新增 `.gitignore` 忽略 `.codegraph/`。
2. 答题选项正式显示文案是否继续使用 DOCX 的“拉完了 / 有点拉 / NPC / 人上人 / 夯”，还是改成参考图里的普通同意度文案。
3. 首版分享卡是否只使用 DOM 生成 + 本地视觉资产，还是必须在 MVP 内接入 image2 产出的 16 型图卡资产。

## 13. 技能命中回传

- 已加载并使用：`agent-role-orchestrator`、`documents`、`pdf`、`gstack`、`gstack-spec`、`gstack-autoplan`。
- 来源窗口要求但未使用：无；旧版 PDF 本轮未重新抽取，因为新版 DOCX、product 文档和总控增量同步已覆盖技术路线所需事实。
- 临时发现应补用：无。
- 误召 / 无效加载：无。
- 影响产出的 skill：`agent-role-orchestrator` 约束了角色边界、CodeGraph 状态和回调；`documents` 约束了 DOCX 抽取；`pdf` 约束了旧 PDF 只在必要时参考；`gstack-spec` / `gstack-autoplan` 约束了目标、非目标、风险、拆分和门禁。

## 14. 外部参考链接

- [React on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Pages headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)
- [Vite production build](https://vite.dev/guide/build)
- [Tailwind responsive design](https://tailwindcss.com/docs/responsive-design)
- [React TypeScript](https://react.dev/learn/typescript)
- [wingkwong/react-quiz-component](https://github.com/wingkwong/react-quiz-component)
- [ackledotdev/association-quiz](https://github.com/ackledotdev/association-quiz)
- [amamenko/react-buzzfeed-quiz](https://github.com/amamenko/react-buzzfeed-quiz)
- [bubkoo/html-to-image](https://github.com/bubkoo/html-to-image)
- [vercel/satori](https://github.com/vercel/satori)
