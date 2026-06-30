# 角色窗口台账

> 本文件是角色路由 source of truth。状态未知写“待确认”，不要编造 thread id。

| 角色 | 状态 | thread id | 来源窗口 | 当前职责 | 下一步 | 循环状态 |
| --- | --- | --- | --- | --- | --- | --- |
| 总控 | 已建立 | 019f17ca-0d15-77a3-8d57-1905c94bf7bd | 用户直接对接；原发起窗口 `019f17c5-01a6-74d0-a5b5-af0e7c6784c3` 不再交互 | 已研究设计 PDF，明确 MVP、风险、验收信号和下一角色路由 | 由当前总控继续对接用户，建议派架构/CTO 做技术方案和执行拆分 | L1 总控研究完成，待当前总控/用户决策 |
| 架构 | 已验收 | 019f18f0-959a-75e0-8c8b-a47b19261fb0 | 总控/用户 | 已输出移动端 MVP 技术路线、CodeGraph 状态、开源参考扫描、评分/数据结构、UI/开发/测试/QA/Cloudflare 拆分；不写代码、不初始化 CodeGraph | 已获总控确认并进入今晚首发执行；监督开发 + UI/Frontend 执行回调，必要时补派测试/QA/运维 | 架构验收通过，执行中 |
| 内容主编 | 已验收 | 019f18ef-e4fb-7233-af41-0897febd7e39 | 总控 `019f17ca-0d15-77a3-8d57-1905c94bf7bd` | 已整理 16 型短名、场景长名、判词、长描述、随机文案池、危险倾向、精神同伙 / 推荐阅读和 image2 图卡规则；不写代码、不派开发 | 内容源已可交给架构 / UI / 开发使用；后续如用户反馈，再回内容主编迭代命名或判词 | 内容验收通过 |
| 开发 | 返工中 | 019f193a-669b-7b63-9828-496013c03bb0 | 架构/总控 | 已完成 React/Vite/Tailwind 静态 H5 主体，但分享卡移动端预览存在横向溢出/局部重叠风险；不部署生产、不写凭据 | 修复分享卡预览宽度、标题贴边和卡片文案重叠，重跑构建/截图/PNG 尺寸验证并回调 | 开发返工中，待复验 |
| UI/PPT | 返工中 | 019f193a-669b-7b63-9828-496013c03bb0 | 架构/内容主编/总控 | 首页/答题页视觉基本到位，但结果分享卡预览未过总控抽查；不改产品定位 | 调整结果分享卡移动端布局，确保 390x844 视口无横向溢出、无文字重叠，再随开发回调 | UI/Frontend 返工中，待复验 |
| 测试 | 待确认 | 待确认 | 架构 | 测试用例、测试报告、压测/性能/并发验证 | 待确认 | 待确认 |
| QA | 待确认 | 待确认 | 架构 | 对抗式验收、Review readiness、风险审查 | 待确认 | 待确认 |
| 安全 | 待确认 | 待确认 | 架构 | 授权安全审计和低影响验证 | 待确认 | 待确认 |
| DBA | 待确认 | 待确认 | 架构 | 数据库实例风险和只读诊断 | 待确认 | 待确认 |
| 运维 | 待确认 | 待确认 | 架构 | 部署、日志、cron、服务诊断 | 待确认 | 待确认 |
| 公众号发布 | 待确认 | 待确认 | 内容主编 | 微信公众号草稿、预览、发布准备 | 待确认 | 待确认 |
| 小红书 | 待确认 | 待确认 | 内容主编 | 小红书内容实验、发布包、评论研究 | 待确认 | 待确认 |
| 视频 | 待确认 | 待确认 | 内容主编 | 视频脚本、分镜、素材和渲染计划 | 待确认 | 待确认 |
| 知识库 | 待确认 | 待确认 | 总控 | Obsidian/个人知识库整理 | 待确认 | 待确认 |
| 技能维护 | 待确认 | 待确认 | 总控 | skill 命中率、触发规则、registry/README/docs 维护 | 待确认 | 待确认 |
| 文档/交付 | 待确认 | 待确认 | 总控/架构 | 交付清单、验收材料、操作指南和交接文档 | 待确认 | 待确认 |

## 最近回调

- 2026-06-30：当前窗口已创建总控线程 `019f17ca-0d15-77a3-8d57-1905c94bf7bd`（标题：总控｜长发男鉴定器正式版），要求其先研究 `C:\Users\12156\Downloads\长发男鉴定器正式版设计文档.pdf`，再决定是否派架构/CTO。
- 2026-06-30：总控线程 `019f17ca-0d15-77a3-8d57-1905c94bf7bd` 已完成 PDF 研究；结论是保持 L1 到发起窗口，建议下一步派架构/CTO，而不是由总控直接写代码。
- 2026-06-30：用户补充决策：结果文案允许保留锋利和轻微羞辱感；评分方向与零分归类由技术团队决策并验证；分享图卡资产按设计文档要求使用 image2 生成；首发上线目标为 Cloudflare。
- 2026-06-30：用户确认原发起窗口后续不用交互，本项目继续由用户和当前总控线程直接对接；下游角色完成、阻塞或需决策时回流当前总控/用户。
- 2026-06-30：用户补充商业化方向：项目可以商业化，但 MVP 不做广告站；优先顺序为先传播量，再轻广告/赞助与推荐阅读返佣，再联名版/定制版，最后考虑付费报告或会员；核心资产是气质、转发欲和可复制的亚文化测试机制。
- 2026-06-30：当前窗口按用户要求继续推进，进入架构/视觉概念阶段；已生成并保存 UI 概念稿 `docs/design/longhair-guy-ui-concept-draft.png`，覆盖首页、答题页、结果页和分享卡预览。概念稿仅作视觉参考，题库和文案以设计 PDF 原文/后续数据文件为准。
- 2026-06-30：用户提供新版 `C:\Users\12156\Downloads\长发男鉴定器移动端正式设计文档.docx`；当前窗口已抽取新版题库、结果表和 16 段结果说明，确认新版采用移动端优先、短类型名 + 场景长名的结果表达。
- 2026-06-30：用户暂定 16 种短类型名版本，并要求按角色边界继续推进；当前总控已记录命名决策到 `docs/product/result-type-naming.md`，后续文案细化应交由内容主编，技术/UI/实现拆分应交由架构/CTO。
- 2026-06-30：角色纠偏：总控收回到决策、派发、风险和验收层，不再直接承担内容主编、架构、UI/Frontend、开发、测试或 QA 的执行工作；后续优先派内容主编和架构/CTO。
- 2026-06-30：总控已直接创建内容主编窗口 `019f18ef-e4fb-7233-af41-0897febd7e39`，要求其围绕 16 种短类型名整理正式内容系统、毒舌尺度、随机文案池和 image2 图卡 prompt，完成后回调当前总控/用户。
- 2026-06-30：内容主编窗口 `019f18ef-e4fb-7233-af41-0897febd7e39` 已完成内容整理，新增 `docs/product/result-content-system.md`；本轮只做内容规格，不写代码。需总控 / 用户确认的点：`ATDF` 的“天台”自伤联想边界、`AHDF` 锋利度、`OTDG` 稽查感、`OTBG` 普通度、`OHDG` 老派含义和 `OHBG` 泛化程度。
- 2026-06-30：总控验收内容主编输出：保留 6 个待决策短名和判词方向，不返工；约束为 `ATDF` 图卡和长文案避开天台边缘 / 跳下 / 坠落 / 自伤暗示，`AHDF` 后续用随机文案补锋利度，`OTDG` 的“稽查”仅指内容本能不指现实执法身份，`OTBG` 保留朴素短名并由场景长名补张力，`OHDG` 的“老派”只指审美和责任感，`OHBG` 先保留暖端收束，后续看分享反馈再调副句。
- 2026-06-30：总控已直接创建架构/CTO 窗口 `019f18f0-959a-75e0-8c8b-a47b19261fb0`，要求其输出技术路线、CodeGraph 状态、有限开源扫描、评分/数据结构、UI/开发/测试/QA/Cloudflare 路线和提交策略，完成后回调当前总控/用户。
- 2026-06-30：用户确认首页和问题页要对齐新的移动端视觉参考：`docs/design/reference/mobile-home-target.png` 与 `docs/design/reference/mobile-quiz-target.png`；总控已记录到 `docs/design/mobile-visual-direction.md`，后续由架构/CTO 纳入 UI/Frontend 路线，不由总控直接实现。
- 2026-06-30：架构/CTO 窗口 `019f18f0-959a-75e0-8c8b-a47b19261fb0` 已完成方案，新增 `docs/architecture/mobile-mvp-technical-roadmap.md`；确认继续 React / Vite / TypeScript / Tailwind 静态 H5 路线，CodeGraph 工具可用但未初始化，评分零分归类建议采用 tie-break 题 `agreePole` 兜底（全 NPC 得到 `OHBG`），下游建议按 UI/Frontend、开发、测试、QA 派发，Cloudflare Pages 作为首发部署路线。需总控/用户确认：是否允许初始化 CodeGraph 并新增 `.gitignore`、答题选项正式文案口径、首版分享卡是否必须纳入 image2 图卡资产。
- 2026-06-30：总控验收架构方案并拍板 3 个待决策点：允许初始化 CodeGraph 并新增 `.gitignore` 忽略 `.codegraph/`；答题选项正式文案使用新版 DOCX 的 `拉完了 / 有点拉 / NPC / 人上人 / 夯`；首版必须有本地 DOM 分享卡预览和 PNG 保存，image2 图卡按本地静态资产流程，不允许浏览器运行模型 API 或暴露凭据。
- 2026-06-30：因用户要求今晚首发上线，总控压缩执行链路，创建开发 + UI/Frontend 首发执行负责人窗口 `019f193a-669b-7b63-9828-496013c03bb0`，负责实现 React/Vite/Tailwind 静态 H5、首页/答题页视觉还原、评分、结果页、分享卡导出、构建验证和提交；实现回调后再立即派测试/QA/运维门禁。
- 2026-06-30：架构/CTO 窗口接收今晚首发监督位：等待开发 + UI/Frontend 执行负责人回调后，复核技术风险、评分/分享卡/隐私/构建证据是否满足架构门禁，并向总控建议是否补派测试、QA 或运维；架构本身不接手实现、不部署、不写凭据。
- 2026-06-30：开发 + UI/Frontend 执行负责人完成本地 MVP：初始化 CodeGraph 并忽略 `.codegraph/`；落地 React/Vite/TypeScript/Tailwind；完成 24 题、四轴评分、全 NPC -> OHBG、16 型结果、首页/答题页/结果页/分享卡；本地验证 `npm test -- --run`、`npm run typecheck`、`npm run build` 通过；Playwright 覆盖 375x812、390x844、430x932、1280x900，分享卡 PNG 为 1080x1350；待测试 / QA / 运维门禁。
- 2026-07-01：总控接收开发 + UI/Frontend 回调后抽查截图，首页和答题页基本通过；但 `C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-qa\result-share-390x844.png` 实际尺寸为 668x1138，分享卡预览存在移动端横向溢出、标题贴边和局部文案重叠风险。总控已暂缓测试 / QA / 运维门禁，先退回开发 + UI/Frontend 修复并重跑验证。

## 压缩交接卡

- 最近摘要：仓库已从规划/资产阶段推进到可运行 MVP；原 PDF 已研究，新版移动端 DOCX 已抽取题库、评分规则、结果表和 16 段说明；用户已暂定 16 种短类型名，当前命名口径记录在 `docs/product/result-type-naming.md`；内容主编已新增 `docs/product/result-content-system.md` 且总控验收通过；首页和答题页视觉参考已记录到 `docs/design/mobile-visual-direction.md`；架构/CTO 已新增 `docs/architecture/mobile-mvp-technical-roadmap.md`；开发 + UI/Frontend 已完成本地 React/Vite/Tailwind MVP 主体，但分享卡移动端预览被总控抽查退回修复。
- 关键决策：产品保持娱乐向哲学气质测试，不做心理诊断；MVP 仍是移动端优先网页测试、24 题五级量表、四轴评分、16 型结果、结果页和分享卡；6 个短名风险点先全部保留，按安全/解释边界执行；首页和答题页必须对齐 `docs/design/mobile-visual-direction.md` 与两张 reference；技术路线继续 React / Vite / TypeScript / Tailwind 静态 H5；首发部署目标为 Cloudflare Pages；允许商业化，但 MVP 不接广告、不收费，先验证传播量、完成率、分享率和结果页停留；Loop 继续保持 L1/L2，由总控派负责人层。
- 当前证据：`C:\Users\12156\Downloads\长发男鉴定器正式版设计文档.pdf`；`C:\Users\12156\Downloads\长发男鉴定器移动端正式设计文档.docx`；`docs/product/result-type-naming.md`；`docs/product/result-content-system.md`；`docs/design/mobile-visual-direction.md`；`docs/design/reference/mobile-home-target.png`；`docs/design/reference/mobile-quiz-target.png`；`docs/architecture/mobile-mvp-technical-roadmap.md`；`docs/deployment/cloudflare-pages.md`；`docs/verification/mobile-mvp-local-verification.md`；`.codex/role-windows.md`；`AGENTS.md`；`git status --short --branch`；CodeGraph 已初始化且 `.codegraph/` 已忽略；本地截图目录 `C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-qa`。
- 下一步：等待开发 + UI/Frontend 修复分享卡移动端预览并回调；复验通过后立即派测试 / QA / 运维做今晚首发门禁。运维可按 `docs/deployment/cloudflare-pages.md` 准备 Cloudflare Pages，但不要未经授权部署生产。
- 新窗口接续提示：优先复用总控线程 `019f17ca-0d15-77a3-8d57-1905c94bf7bd`，不要重复创建总控；内容主编窗口 `019f18ef-e4fb-7233-af41-0897febd7e39` 和架构/CTO 窗口 `019f18f0-959a-75e0-8c8b-a47b19261fb0` 完成、阻塞或需决策时回调当前总控/用户，不再回调原发起窗口 `019f17c5-01a6-74d0-a5b5-af0e7c6784c3`；当前总控不得继续兼任架构、内容主编、UI/Frontend、开发、测试或 QA。
