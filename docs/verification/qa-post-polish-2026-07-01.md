# QA 后首发小修复验记录

日期：2026-07-01  
角色：开发 + UI/Frontend 首发执行负责人  
范围：仅处理 QA 后总控不接受的两个用户可见小瑕疵，不改评分、题库、结果数据、结果文案、免责声明、部署配置或 image2 静态图资产。

本地预览 URL：`http://127.0.0.1:5173/`  
代码修复提交：`c12a7f3 fix: 修复结果页装饰遮挡与重测 URL 残留`  
截图证据目录：`C:\Users\12156\AppData\Local\Temp\longhair-guy-detector-first-polish-2026-07-01`

## 结论

小修复验通过，可回流架构 / CTO 复核。

- 结果页顶部装饰贴纸在 390x844、430x932、1280x900 下不再遮挡结果前缀或标题区域。
- 从 `?result=OHBG` 点击“再测一次”后，地址栏已清掉旧 `result` 参数；刷新当前地址不会回到旧结果。
- 分享卡 390x844、430x932 无横向溢出和文字重叠回归。
- 保存 PNG 仍为 `1080x1350`。
- console/pageerror 为空。

## 修复点

1. 结果页装饰避让：
   - 为 `.phone-stage` 增加 `phase-${phase}` 状态类。
   - 仅在 `.phase-result` 下收窄、上移 `.decor-paper.top-left`，保留首页 / 答题页原视觉布局。

2. 重测 URL 清理：
   - 新增 `clearResultUrl()`，删除地址栏 `result` 查询参数。
   - `startQuiz()` 重置答案和进度时同步清 URL。
   - `src/App.test.tsx` 新增结果直链重测回归测试。

## 命令验证

| 命令 | 结果 |
| --- | --- |
| `npm test -- --run` | 通过，3 个测试文件、12 项测试 |
| `npm run typecheck` | 通过 |
| `npm run build` | 通过，Vite `v6.4.3` 生成 `dist/index.html`、CSS、JS |

## Playwright 复验

执行方式：

- 普通 Playwright + 本机 Chrome：`C:\Program Files\Google\Chrome\Application\chrome.exe`
- `deviceScaleFactor = 1`
- 监听 `console` warning/error 与 `pageerror`

### 结果页装饰

| 视口 | 截图 | 页面宽度 | 贴纸 / 前缀 | 贴纸 / 标题 | 关键度量 |
| --- | --- | --- | --- | --- | --- |
| 390x844 | `result-390x844.png`，390x844 | `scrollWidth = 390` | 不相交 | 不相交 | 贴纸 bottom `53.59`，前缀 top `67.19` |
| 430x932 | `result-430x932.png`，430x932 | `scrollWidth = 430` | 不相交 | 不相交 | 贴纸 bottom `53.59`，前缀 top `67.19` |
| 1280x900 | `result-1280x900.png`，1280x900 | `scrollWidth = 1280` | 不相交 | 不相交 | 页面 stage 居中，贴纸 bottom `53.59`，前缀 top `67.19` |

### 重测 URL

起点：`http://127.0.0.1:5173/?result=OHBG`

| 操作 | 结果 |
| --- | --- |
| 点击结果页“再测一次” | URL 变为 `http://127.0.0.1:5173/` |
| 页面状态 | 进入答题页，题号 `01 / 24` |
| 当前地址刷新 | 进入首页，未回到旧结果页 |
| 当前地址查询参数 | `search = ""`，不含 `result` |

### 分享卡回归

| 视口 | 截图 | 页面宽度 | 分享卡 | 按钮区 | 文字重叠 |
| --- | --- | --- | --- | --- | --- |
| 390x844 | `result-share-390x844.png`，390x844 | `scrollWidth = 390` | `x = 40.47`，`right = 349.53` | 未超出视口 | 无 |
| 430x932 | `result-share-430x932.png`，430x932 | `scrollWidth = 430` | `x = 40.47`，`right = 389.53` | 未超出视口 | 无 |

保存图卡：

- 文件：`share-card-download.png`
- 尺寸：`1080x1350`

### 浏览器健康

- `console` warning/error：`[]`
- `pageerror`：`[]`

## 未处理项

- 未部署 Cloudflare 生产环境。
- 未改 Cloudflare 部署文档或生产配置。
- 未处理 image2 16 张静态图资产。
- 未改免责声明口径。
- 未纳入未跟踪的 `docs/design/v2/`。

## 回流建议

下一回流对象：架构 / CTO `019f18f0-959a-75e0-8c8b-a47b19261fb0`，抄送总控 / CEO `019f17ca-0d15-77a3-8d57-1905c94bf7bd`。若架构复核认可，可进入总控发布确认 / 运维上线前最终步骤。
