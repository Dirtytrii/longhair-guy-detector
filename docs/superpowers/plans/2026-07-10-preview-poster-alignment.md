# 预览海报版式对齐实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 让首页、答题页与结果页以现有预览海报为无拉伸的版式锚点，同时为真实交互层提供可见且可访问的反馈。

**架构：** `public/assets/*-poster-v3.png` 继续提供静态排版和装饰，`src/App.tsx` 只补充行为相关的 ARIA 状态，`src/styles.css` 负责不拉伸背景、半透明交互层和小屏布局。现有计分、结果链接、分享图卡生成与下载逻辑不变。

**技术栈：** React 18、TypeScript、CSS、Vitest、Testing Library、Vite。

---

## 文件结构

- 修改：`src/App.tsx` — 为答案按钮公开当前选择状态。
- 修改：`src/App.test.tsx` — 覆盖答案选择后的可访问交互反馈。
- 修改：`src/styles.css` — 以海报的原始比例显示背景，并优化三个页面的可读层、焦点与窄屏排版。
- 修改：`docs/verification/ui-preview-alignment-2026-07-10.md` — 记录浏览器截图、视口和交互验收结果。

### 任务 1：为答案选择反馈建立回归测试

**文件：**
- 修改：`src/App.test.tsx`
- 修改：`src/App.tsx`

- [x] **步骤 1：编写失败的测试**

在 `describe("mobile quiz flow")` 内新增：

```tsx
it("exposes the selected answer while moving to the next question", async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(screen.getByRole("button", { name: /开始鉴定/ }));
  const npcAnswer = screen.getByRole("button", { name: /NPC/ });

  expect(npcAnswer).toHaveAttribute("aria-pressed", "false");
  await user.click(npcAnswer);
  expect(npcAnswer).toHaveAttribute("aria-pressed", "true");
});
```

- [x] **步骤 2：运行测试验证失败**

运行：`npm test -- --run src/App.test.tsx`

预期：FAIL，断言显示答案按钮缺少 `aria-pressed="false"`。

- [x] **步骤 3：编写最少实现代码**

在 `QuizScreen` 的答案按钮上添加与现有 `selectedValue` 一致的状态：

```tsx
aria-pressed={option.value === selectedValue}
```

- [x] **步骤 4：运行测试验证通过**

运行：`npm test -- --run src/App.test.tsx`

预期：PASS，所有 `mobile quiz flow` 测试通过。

- [x] **步骤 5：提交交互状态改动**

```powershell
git add src/App.tsx src/App.test.tsx
git commit -m "feat(答题页): 公开答案选中状态"
```

### 任务 2：将页面背景与交互层对齐到海报比例

**文件：**
- 修改：`src/styles.css`

- [x] **步骤 1：确认行为回归测试仍为绿灯**

运行：`npm test -- --run src/App.test.tsx`

预期：PASS。任务 1 的 `aria-pressed` 回归测试保护可见的答案选择反馈；首页和结果页
已有完整答题、结果与分享交互测试。CSS 空间布局不依赖可由 jsdom 可靠模拟的几何信息，
由任务 3 的真实浏览器截图进行回归验证。

- [x] **步骤 2：编写最少样式实现**

将首页、答题页、结果页的背景声明从：

```css
background: url("/assets/home-poster-v3.png") center top / 100% 100% no-repeat;
```

改为保留素材比例的共用写法：

```css
background-color: #0d0c0a;
background-image: url("/assets/home-poster-v3.png");
background-position: center top;
background-repeat: no-repeat;
background-size: 100% auto;
```

对 `.home-screen` 设定 `aspect-ratio: 941 / 1672` 和 `min-height: min(100dvh, 100%);`，
使首页可完整显示海报；对 `.quiz-screen` 与 `.result-screen` 保留内容驱动高度，并将
`::before` 的不透明度降到可见海报纹理但仍可读文字的水平。答案卡的默认背景改为
`rgba(18, 16, 13, 0.62)`，选中态同时设置 `box-shadow: 0 0 0 2px rgba(181, 69, 61, 0.28)`。

- [x] **步骤 3：运行交互测试验证通过**

运行：`npm test -- --run src/App.test.tsx`

预期：PASS，首页两个海报热区和原有完整答题流程均可访问。

- [x] **步骤 4：提交海报对齐样式**

```powershell
git add src/styles.css src/App.test.tsx
git commit -m "style(UI): 按预览海报比例收敛页面版式"
```

### 任务 3：执行多视口交互与视觉验收

**文件：**
- 创建：`docs/verification/ui-preview-alignment-2026-07-10.md`

- [x] **步骤 1：启动本地预览**

运行：`npm run dev -- --host 127.0.0.1`

预期：Vite 输出本地 HTTP 地址且无启动错误。

- [x] **步骤 2：执行浏览器验收**

按 375 × 812、390 × 844、430 × 932 和 1280 × 900 依次检查：

```text
/ -> 点击“开始鉴定” -> 选择“NPC” -> 观察答案红色选择态与下一题
/?result=OHBG -> 观察动态结果与四轴 -> 点击“生成图卡” -> 分享面板出现
```

每个移动端视口需验证无横向滚动、无文本裁切、无元素重叠；桌面需验证 430px 电话画布居中。

- [x] **步骤 3：执行自动化质量门禁**

运行：

```powershell
npm test -- --run
npm run typecheck
npm run build
```

预期：三个命令均以退出码 0 完成。

- [x] **步骤 4：记录验收证据**

创建验证文档，记录浏览器路径、四个视口、控制台结果、截图路径、通过的交互和剩余风险。

- [x] **步骤 5：提交验证记录**

```powershell
git add docs/verification/ui-preview-alignment-2026-07-10.md
git commit -m "docs(验证): 记录预览海报对齐验收结果"
```
