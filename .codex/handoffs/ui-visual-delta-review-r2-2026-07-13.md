【给 UI/PPT 窗口的 compact 提示词】
角色：UI/PPT；项目：D:\javaProjects\personal\longhair-guy-detector；方式：新建；来源窗口：用户 / thread id: 待确认
上下文：原 UI/PPT 线程 019f193a-669b-7b63-9828-496013c03bb0 因本机 rollout 文件缺失无法接续；本窗口仅承接只读视觉评审。线上 URL：https://longhair-guy-detector.pages.dev/。

模型建议：
- model：gpt-5.6-terra
- thinking：high
- 条件：涉及高风险决策或跨角色协调时升级到 gpt-5.6-sol + xhigh。
Token Budget Profile：
- profile：compact
- 策略：只保留闭环必需字段；省略深层技术方案、CodeGraph 和开源扫描占位，适合 L0/L1 小闭环。
预览图实现路线选择：
- 有预览图、参考图、截图或视觉保真目标时，不要默认拿 CSS 硬干；先给出 2-4 条实现路线并说明取舍。
- 候选路线至少考虑：CSS/组件复刻、图片切片/生成资产、Canvas/SVG、Three.js/WebGL、Lottie/视频、现成库/组件、手工或生成式视觉资产。
- 选择依据：交互需求、响应式要求、可维护性、加载性能、可访问性、动效复杂度、还原精度、后续内容替换成本。
- 如果预览图是复杂插画、纹理、3D、粒子、复杂动效或 AI 难以稳定复刻的视觉，优先考虑资产化或专用渲染路线，不要用大量脆弱 CSS 堆效果。
- 进入开发前输出推荐路线、拒绝路线、需要的资产/工具、验收方式；实现后用截图对比、像素/布局检查或视觉 QA 证据验证。
浏览器自动化路由：
- 先加载 $browser-automation-router；公开页、localhost 和视觉验收优先应用内 Browser，需要现有登录态、Chrome tab/profile/extension 时优先原生 Chrome 插件。
- 仅在 CI、可复现回归、trace、无人值守批处理或原生插件不可用时使用 $playwright 或平台脚本；不默认维护临时 JavaScript、cookie 导入或 profile-path 启动逻辑。
- 原生路由最低能力门槛为 Codex Desktop 2026-06-11 发布版本且当前任务实际可见对应插件；缺失时 fail closed 到明确降级方案。
反老登味 / 反 AI 味内容闸门：
- 正式对外内容必须先过这道闸门，再交付预览、发布包、复制文本、封面/社交卡文案或视频脚本。
- 反老登味：避免说教、爹味、上位者口吻、油腻成功学、年龄/资历压人、替读者下判断。
- 反 AI 味：避免模板化、空泛排比、万能套话、机械转折、过度总结、没有个人判断。
- 改写原则：保留真实经验、具体细节、自然口语、平台语感和读者处境。
- 安全边界：不改变事实、数据、价格、日期、来源、授权边界；不新增背书、效果承诺或发布状态。
- 执行方式：内容主编负责定义口径并验收；公众号发布、小红书、视频和含公开中文文案的 UI/PPT 产物执行；最终正式中文文案仍需加载并使用 $humanizer-zh。

角色树位置：总控 / CEO -> 架构 / CTO 或 内容主编 -> UI/PPT / UI/Frontend
Loop 深度（可折叠路由）：
- 本次深度：L0；L0 直达，L1 负责人，L2 负责人拆执行，L3 增加独立门禁。
- 本次 override：用户明确要求开启 UI 窗口，且本轮仅做只读视觉评审与修复方案，属于低风险、可独立闭环的专项任务。
任务分发决策：
- 任务规模：small
- 建议路径：继承来源窗口的角色分发决策
- 执行规则：保持当前角色边界；范围扩大或风险升级时回流来源窗口。
负责人交互边界：
- 总控只对接负责人层；技术执行由 CTO 派发，内容执行由内容主编派发。

目标：对照当前 Cloudflare Pages 界面与 docs/design/v2 预览图，定位可见视觉差异，并给出按影响和成本排序的最小修复路线；本轮只做视觉评审，不改代码。
请先阅读/检查：
- docs/design/v2/home-screen.png
- docs/design/v2/quiz-screen.png
- docs/design/v2/result-screen.png
- docs/design/v2/share-card-screen.png
- docs/design/mobile-visual-direction.md
- docs/verification/ui-v2-visual-rework-2026-07-01.md
允许修改：
- Cloudflare Pages 公网只读访问和本地预览截图
- src/、public/assets/、docs/design/ 的只读检查
禁止修改：
- 修改代码、资源、配置、依赖或部署
- git pull、git rebase、git push、生产写入
实现/工作要求：先选择预览实现路线：比对 CSS/组件、现有静态图像资产与必要的 Canvas/SVG；不得默认仅靠 CSS 硬调。用同一视口的真实渲染截图作证据。
验证：
- 以同一移动端视口截取当前页面，与四张 v2 预览逐页对照；报告每项差异的证据、严重度、根因假设、修复方式和验收标准。

闭环状态：当前=原窗口归档记录缺失；新建只读视觉差异评审；上一轮=用户反馈：当前 UI 效果太拉；需要直接看到当前 UI 和预览图的差异。；退出=输出带截图/文件证据的差异清单与最小修复路线；停止于修复方案，不进入实现。
上下文预算：只传增量与证据；过长时用台账、提交、PR 或压缩交接卡接续。
闭环完成条件：更新 .codex/role-windows.md 并提交，同时向来源 thread 发送压缩回调；仅更新台账不算闭环。
路由前检查：orchestrator=是；ledger=是；复用线程=待确认；更新台账=.codex/role-windows.md：创建后记录新线程；完成时更新状态并按项目约定提交。。
技能路由台账：
- 候选 skill：gstack-design-review
- 必选 skill：agent-role-orchestrator、browser-automation-router、gstack-design-review
- 可选 skill：无 / 待确认
- 跳过 skill 及原因：imagegen: 本轮只需评审，不生成或编辑图像。
提交/PR 要求：本轮无代码改动；若仅台账/交接文档变更，按项目约定单独中文提交。

回调/通知规则：本任务发起方：用户 / thread id: 待确认。完成、阻塞、需决策时主动通知；无发送工具时，以 <codex_delegation> 或“压缩回调”开头。
结构化反馈格式：问题/缺口；证据/复现；影响等级；建议回流对象；需要决策；下一闭环状态。
压缩回调：
- 当前状态：
- 本轮变化：
- 证据链接/文件/命令：
- 需要决策：
- 下一回流对象：
技能命中回传：
- 已加载并使用：
- 来源窗口要求但未使用：
- 临时发现应补用：
- 误召/无效加载：
- 影响产出的 skill：
规则沉淀：可复用优化沉淀=无 / 建议 / 已沉淀；写明目标位置和后续。
完成后请回传：向用户回传：1) 当前 UI 与预览图并排证据；2) P0/P1/P2 差异；3) 推荐路线及涉及文件；4) 不应触碰的业务边界；5) 是否可开始实施所需决定。
角色底线：只做视觉评审与修复方案。不得把问题扩展为产品重构、题库/评分改动、发布或部署。
