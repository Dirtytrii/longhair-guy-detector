# 移动端 MVP 本地验证记录

更新时间：2026-06-30

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
