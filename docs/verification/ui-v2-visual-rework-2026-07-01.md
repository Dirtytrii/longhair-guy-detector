# UI v2 视觉返工本地验证记录

日期：2026-07-01

角色：开发 + UI/Frontend 首发执行负责人

## 本轮范围

- 纳入 `docs/design/v2/` 移动端 v2 参考图作为本轮视觉验收基准。
- 新增本地静态画像资产：
  - `public/assets/result-portrait-v2.png`
  - `public/assets/share-card-portrait-v2.png`
- 重塑首页、答题页、结果页和分享卡页视觉层级，靠近 v2 参考图的黑色磨砂纸、旧纸正文、暗红 CTA、黄绿胶带、唱片角、红线和亚文化拼贴风格。
- 保持评分算法、题库、16 型命名、结果文案核心口径、免责声明、登录/统计/广告/支付/模型 API 边界不变。

## 命令验证

在最新本地 `main` HEAD `244cd88` 上重跑：

```bash
npm test -- --run
npm run typecheck
npm run build
```

结果：

- `npm test -- --run`：3 个测试文件、12 项测试通过。
- `npm run typecheck`：通过。
- `npm run build`：通过，产物输出到 `dist/`。

## 本地预览

- 本地预览 URL：`http://127.0.0.1:4173/`
- 预览方式：`npm run build` 后使用 `vite preview --host 127.0.0.1 --port 4173`。
- 默认 Cloudflare Pages URL 只读访问：`https://longhair-guy-detector.pages.dev/` 返回 HTTP 200；本轮 v2 提交尚未推送远端，因此该线上 URL 不代表已更新到 v2。

## 截图与自动检查

截图目录：

```text
C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-ui-v2-2026-07-01
```

Playwright 结果文件：

```text
C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-ui-v2-2026-07-01\playwright-results.json
```

截图尺寸：

| 页面 | 文件 | 尺寸 | 横向溢出 |
| --- | --- | --- | --- |
| 首页 | `home-375x812.png` | 375x812 | 通过 |
| 答题页（第 7 题） | `quiz-390x844.png` | 390x844 | 通过 |
| 结果页 | `result-390x844.png` | 390x844 | 通过 |
| 结果页 | `result-430x932.png` | 430x932 | 通过 |
| 分享页 | `share-390x844.png` | 390x844 | 通过 |
| 分享页 | `share-430x932.png` | 430x932 | 通过 |
| 桌面兜底 | `result-1280x900.png` | 1280x900 | 通过 |
| 分享卡导出 | `share-card-download.png` | 1080x1350 | 通过 |

自动检查摘要：

- `document.documentElement.scrollWidth === window.innerWidth`：所有截图视口通过。
- `.phone-stage.scrollWidth === .phone-stage.clientWidth`：所有截图视口通过。
- 分享卡 390x844 / 430x932：标题、红色文案、四轴分数、footer 垂直间距通过。
- `console.warning/error`：0。
- `pageerror`：0。
- 分享卡保存 PNG：1080x1350。

## 视觉复核

对照 `docs/design/v2/home-screen.png`、`quiz-screen.png`、`result-screen.png`、`share-card-screen.png` 与最新截图，已修复的主要差异：

1. 全局基调由偏普通暗色界面调整为黑色磨砂纸纹、旧纸正文、暗红主按钮和低饱和黄绿胶带。
2. 首页强化超大中文标题、居中红色判词、旧纸质大按钮、右侧竖排标语、唱片角和纸片装饰。
3. 答题页强化 `07 / 24` 数字进度、线团节点、大号宋体题干、旧纸描边选项卡、红色序号和空心圆。
4. 结果页接入新生成长发男拼贴画像，改为标题 / 红色判词 / 画像拼贴 / 四轴面板 / 视角与危险倾向的参考图结构。
5. 分享卡接入新生成长发男头像资产，增加月相 / 唱片圆形背景、胶带贴纸、四轴分数格和海报式底部判词。
6. 修复 v2 装饰层被计入 `.phone-stage.scrollWidth` 的横向溢出风险。
7. 修复 390x844 分享卡预览中 footer 可能被挤出卡片底部的问题。
8. 收紧答题页 390x844 垂直节奏，让底部「上一题」与提示完整露出。

本轮保留的 intentional deviation：

- 首页标题使用系统宋体/本地字体模拟参考图的破损字形，没有引入额外字体文件，避免首发新增字体加载风险。
- 分享卡 390x844 预览中头像尺寸比参考图略小，用于确保长类型名、红色文案、四轴分数和 footer 不重叠。
- 结果页四轴面板使用现有四轴评分字段展示，不新增图标系统，避免误改评分数据结构。
- 桌面 1280x900 保持移动端 H5 居中舞台，而不是重做桌面版布局；本轮目标仍是移动端优先。
- 本轮只落地通用 v2 长发男画像资产，没有扩展为 16 张独立 image2 静态图。

## 结论

本地 UI v2 最小可验收切片通过：可运行、可构建、可截图验收、可保存 1080x1350 分享卡 PNG。下一步需要总控 / 用户决定是否推送远端并触发 Cloudflare Pages 更新，或先派架构 / QA 做 v2 视觉复核。

## 总控推送后线上复验补充

总控在远端 `main` 更新到 `57a7096` 后，对默认 Cloudflare Pages 地址做只读复验：

- `https://longhair-guy-detector.pages.dev/`：HTTP 200。
- 远端 HTML 已引用 v2 构建资产：`/assets/index-B30k-9ir.js`、`/assets/index-BZNLbraq.css`。
- 远端 JS 中可检出 `/assets/result-portrait-v2.png` 与 `/assets/share-card-portrait-v2.png`。
- 两张 v2 静态画像资产直连均返回 HTTP 200，`Content-Type: image/png`。

线上 Playwright 390x844 烟测发现：

- 首页、答题页、结果页、分享页均无页面级横向溢出，`document.scrollWidth === document.clientWidth`。
- console warning / error：0。
- pageerror：0。
- 结果页可见 `result-portrait-v2.png`。
- 分享卡可见 `share-card-portrait-v2.png`。
- 但分享卡内部存在非页面级溢出：`.share-card.scrollWidth` 为 367，`.share-card.clientWidth` 为 331。

根因与修复：

- 根因：`.share-card::before` 右侧唱片环使用 `right: -2.2rem`，视觉上被 `overflow: hidden` 裁掉，但仍会被 Chrome 计入 `.share-card.scrollWidth`。
- 修复：将该伪元素收回卡片内部，避免装饰层撑开分享卡内部滚动宽度。

修复后本地复验：

- 命令：`npm test -- --run`、`npm run typecheck`、`npm run build` 均通过。
- 截图目录：`C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-share-overflow-fix-2026-07-01`
- 390x844：`documentScrollWidth === documentClientWidth === 390`；`shareCardScrollWidth === shareCardClientWidth === 331`；console/pageerror 为 0。
- 430x932：`documentScrollWidth === documentClientWidth === 430`；`shareCardScrollWidth === shareCardClientWidth === 358`；console/pageerror 为 0。
