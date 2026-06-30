# 移动端 MVP 本地验证记录

更新时间：2026-07-01

## 2026-07-01 QA 后首发小修复验

总控不接受的两个用户可见小瑕疵已完成小修并复验通过：

- 结果页顶部装饰贴纸不再压到结果前缀 / 标题区域。
- 从 `?result=OHBG` 点击“再测一次”后，地址栏会清掉旧 `result` 参数；刷新当前地址不会回到旧结果。

复验证据：

- 详见 `docs/verification/qa-post-polish-2026-07-01.md`。
- 截图目录：`C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-first-polish-2026-07-01`。
- `result-390x844.png`：390x844，`document.scrollWidth = 390`，贴纸与前缀 / 标题不相交。
- `result-430x932.png`：430x932，`document.scrollWidth = 430`，贴纸与前缀 / 标题不相交。
- `result-1280x900.png`：1280x900，贴纸与前缀 / 标题不相交。
- `result-share-390x844.png`：390x844，分享卡无横向溢出 / 文字重叠回归。
- `result-share-430x932.png`：430x932，分享卡无横向溢出 / 文字重叠回归。
- `share-card-download.png`：1080x1350。
- Playwright `console` warning/error 与 `pageerror` 均为空。

命令复验：

| 命令 | 结果 |
| --- | --- |
| `npm test -- --run` | 通过，3 个测试文件，12 项测试 |
| `npm run typecheck` | 通过 |
| `npm run build` | 通过 |

## 2026-07-01 分享卡返工复验

总控返工问题：

- 旧版 `result-share-390x844.png` 是元素截图叠加 DPR 后的 `668x1138`，容易被误判为 390x844 视口截图，且暴露出分享卡预览容器横向余量不足。
- 分享面板标题在元素截图中贴左边界。
- 分享卡内部右下角装饰伪元素参与滚动宽度计算，`.share-card` 自身 `scrollWidth` 大于 `clientWidth`。
- 分享卡 footer 绝对定位，和红色分享文案之间缺少稳定的纵向安全距离。

修复点：

- `result-share-390x844.png`、`result-share-430x932.png` 改为整页视口截图，截图文件尺寸与 viewport 一致。
- 分享面板新增内边距和 `overflow: hidden`，标题、分享卡和按钮区不再贴边。
- 分享卡预览改为响应式 `width: min(100%, 360px)` + `aspect-ratio: 4 / 5`，导出 PNG 时仍临时固定为 360x450 并使用 `pixelRatio: 3`。
- 分享卡 footer 改为 flex 流内底部区域，避免与红色文案重叠。
- 右下角唱片环改为卡片内部绘制，不再撑大 `.share-card.scrollWidth`。
- 打开分享卡后的滚动改为 React ref + effect，渲染后再滚动到分享面板。

返工截图尺寸与布局度量：

| 文件 | 视口/导出尺寸 | 结果 |
| --- | --- | --- |
| `home-375x812.png` | 375x812 | 通过 |
| `quiz-390x844.png` | 390x844 | 通过 |
| `result-share-390x844.png` | 390x844 | 通过，`document.scrollWidth = 390`，`.share-card.scrollWidth = 307`，`.share-card.clientWidth = 307` |
| `result-share-430x932.png` | 430x932 | 通过，`document.scrollWidth = 430`，`.share-card.scrollWidth = 347`，`.share-card.clientWidth = 347` |
| `share-card-download.png` | 1080x1350 | 通过 |

额外复验：

- Playwright 遍历 16 个结果短名，在 390x844 视口打开分享卡，检查 `cardOverflow`、`pageOverflow`、短名/场景/红色文案/footer 重叠，结果均为空失败集。
- Playwright console/pageerror：空。

## 本地预览

- URL：`http://127.0.0.1:5173/`
- Dev server：Vite dev server，本轮由 `npm run dev -- --port 5173` 启动。

## CodeGraph

- 已运行：`codegraph init -i`
- 已复查：`check_codegraph.py --project D:\javaProjects\personal\longhair-guy-detector`
- 结果：已初始化，`.codegraph/` 已由 `.gitignore` 忽略。

## 自动化验证

| 命令 | 结果 |
| --- | --- |
| `npm test -- --run` | 通过，3 个测试文件，11 项测试 |
| `npm run typecheck` | 通过 |
| `npm run build` | 通过，产物目录 `dist` |

## 浏览器与截图验收

内置 Browser smoke check：

- URL：`http://127.0.0.1:5173/`
- viewport：390x844
- 检查：首页 DOM 非空、标题为“长发男鉴定器”、开始按钮唯一、点击后进入 `01 / 24`、console error/warn 为空。

Playwright 截图：

- 使用本机 Chrome：`C:\Program Files\Google\Chrome\Application\chrome.exe`
- 截图目录：`C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-qa`
- `home-375x812.png`
- `quiz-390x844.png`
- `quiz-430x932.png`
- `result-share-390x844.png`
- `desktop-1280x900.png`

分享卡保存：

- 文件：`C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-qa\share-card-download.png`
- PNG 尺寸：1080x1350
- Playwright console/pageerror：空。

## 验收观察

- 首页和答题页继承参考图的黑色旧纸、粗粝中文标题、红色强调、唱片、纸片、线团和档案感。
- 390x844 答题页首屏可见 5 个选项和底部提示。
- 全 NPC 路径通过自动化测试稳定得到 `OHBG` / `人间烟火长发男`。
- 结果页使用 16 型短名与内容系统数据，不出现心理诊断、精准人格或权威测评表达。
- 分享卡是本地 DOM 预览和本地 PNG 保存，不调用浏览器端模型 API，不暴露凭据。
