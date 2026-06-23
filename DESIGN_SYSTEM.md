# Vibe Design System

> 整合日期：2026-06-12
>
> 本文件是 Vibe 设计系统规范包的唯一人读权威入口，覆盖色彩、排版、组件、图表、预览页、Agent 规则和工程约束。
>
> **默认主题为 Claude 珊瑚 `#D97757`（暖象牙中性色）**；靛蓝、科技蓝、玉石绿为备选主题。
>
> 为便于阅读，本规范下文的**具体色值表以靛蓝 `#4F46E5` 作为示例参考主题**讲解各 token 的语义与用法；任何主题的实际取值，以 `src/themes/*` 与 `design-tokens.css` 为单一来源。换主题只需改主题文件，token 语义不变。

## 如何使用

1. 新项目优先阅读本文件。
2. 直接复制 `design-tokens.css` 作为初始 CSS 变量。
3. 将 `AGENT_RULES.mdc` 放入目标项目的 Agent / Cursor 规则目录。
4. 如需完整视觉预览，运行本项目并访问 `/dev/preview`。

## 关键机制速记

- 主题扫描：参考 `scripts/check-theme-tokens.mjs` 与 Part 4 的 hardcoded color / `text-white` / legacy overlay / legacy popover shadow 检查规则。
- 预览页面：参考 `src/app/(dev)/dev/preview/page.tsx`。
- 主题 token：参考 `src/themes/types.ts`、`src/themes/default.ts`、`src/themes/registry.ts` 与 `design-tokens.css`。
- 图表运行时主题：参考 `src/components/charts/theme/chartTheme.ts`。

## 内容范围

- Part 1：当前权威设计规范
- Part 2：图表组件 API 与使用规范
- Part 3：预览页 / 导航 / 全局布局契约
- Part 4：Agent 设计与图表执行规则
- Part 5：工程约束与代码风格
- Part 6：便携迁移参考


---

# Part 1. 当前权威设计规范

# Design System — Vibe

> 本文档是项目的 **设计规范单一权威来源 (Single Source of Truth)**。
> 所有 UI 开发必须遵循此规范。
>
> **默认品牌色**：Claude 珊瑚 `#D97757`（暖珊瑚 + 象牙暖中性）。下文示例值以靛蓝 `#4F46E5` 作为参考主题讲解。
> **技术栈**：Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui · TypeScript

---

## 1. 设计理念

- **风格**：现代、克制、数据驱动的专业平台风格
- **色调**：以靛蓝 (`#4F46E5`) 为品牌主色，仅用于主操作、选中态和关键强调；指标红绿、风险、错误等语义色独立使用截图色板中的低饱和红绿，背景统一为蓝紫中性灰白
- **质感**：扁平为主，通过微妙的边框和背景层次营造深度，避免重阴影
- **信息密度**：高信息密度，通过留白和层次保持可读性

---

## 2. 主题化设计体系

### 2.0 主题化架构（客户主题能力）

本项目的设计体系已经升级为**可切换主题**：`DESIGN_SYSTEM.md` 定义语义 token 与使用规则，`src/themes/` 定义每个客户/产品主题的具体 token 值，运行时由 `themeId` 注入 CSS 变量。

| 层级 | 文件 / API | 职责 |
|---|---|---|
| 主题类型 | `src/themes/types.ts` | 定义 `AppTheme` token 结构，是新增主题必须满足的契约 |
| 默认主题 | `src/themes/default.ts` | 当前 Vibe 设计配色的主题封装 |
| 主题注册 | `src/themes/registry.ts` | 注册 `themes`、`DEFAULT_THEME_ID`，并把主题转换为 CSS 变量 |
| 主题注入 | `src/contexts/ThemeContext.tsx` | 根据主题生成 `:root` CSS 变量并写入 `document.documentElement` |
| 租户选择 | `src/contexts/TenantContext.tsx` | 通过 tenant 的 `themeId` 选择当前主题 |
| 图表主题 | `src/components/charts/theme/chartTheme.ts` | 通过 `useChartTheme()` 为 ECharts 提供运行时主题色 |

新增客户主题时，只允许新增 `src/themes/<theme-id>.ts` 并在 `registry.ts` 注册。页面和组件不得为某个客户单独写颜色分支；切换客户主题必须通过 `themeId` 完成。

为避免新页面生成时出现多套主题色混搭，`npm run lint` 会执行 `npm run theme:check`。该扫描会阻止生产源码中出现产品 UI 硬编码色、`text-white`、旧遮罩和旧浮层阴影。外部平台 Logo 官方色、主题文件、`globals.css` 默认兜底、开发预览页属于明确例外。

团队共享默认 Logo 文件位于 `public/brand/logo.svg`。设置页上传 Logo 只写入当前浏览器 localStorage，适合作为本机预览；如果希望其他人拉取代码后看到新 Logo，必须替换 `public/brand/logo.svg` 并提交。

#### 主题 token 覆盖范围

一套主题必须覆盖所有会影响客户品牌观感的 token：背景、边框、文本、品牌主色、通知、指标方向、风险、功能状态、情绪、图表色序列、字体栈、圆角、间距、阴影、遮罩、链接、辅助色、组件语义 token、shadcn/ui token。

新增页面如发现现有 token 不够表达语义，优先扩展 `AppTheme` 与 `themeToCssVariables()`，再更新默认主题；不要在页面里临时新增孤立色值、孤立圆角、孤立阴影或客户专用样式分支。

#### 新页面 / 新组件色彩规则

- 产品 UI 颜色一律使用语义 token：`var(--bg-card)`、`var(--text-strong)`、`var(--highlight)`、`var(--color-risk-high)` 等。
- 产品 UI 的字体、圆角、间距、阴影、遮罩、链接色优先使用主题 token：`var(--font-sans)`、`var(--component-button-radius)`、`var(--space-lg)`、`var(--component-popover-shadow)`、`var(--overlay-scrim)`、`var(--link-default)` 等。
- React 中需要动态传色时，优先传 CSS 变量字符串；ECharts / canvas 需要真实色值时，使用 `useChartTheme()` 或 `useAppTheme()` 读取当前主题。
- `globals.css` 中的色值只作为默认主题兜底；客户主题的真实来源是 `src/themes/*`。
- 外部平台 / 品牌识别色例外，例如抖音、小红书、微信、YouTube 的 logo 与渠道官方色。这类颜色属于内容识别，不跟随客户主题。

### 2.1 核心色板

| 角色 | 色值 | CSS 变量 | 用途 |
|---|---|---|---|
| **主色** | `#4F46E5` | `--highlight` | 品牌主色、选中状态、主要按钮、导航选中背景、卡片 icon 背景、选项卡选中颜色 |
| **主色 Hover** | `#4338CA` | `--highlight-hover` | 主按钮 hover 态 |
| **主色 Active** | `#3730A3` | `--highlight-active` | 主按钮按下/激活态 |
| **主色之上文字** | `#FFFFFF` | `--highlight-foreground` | 主色背景上的文字色 |
| **标题色** | `#1E1B39` | `--text-strong` | 页面标题、选中文字、左侧导航选中 icon、数据大字；6% 透明度用于通用标签背景 |
| **主文本色** | `#3D3A56` | `--text-regular` | 正文文字、表格内文字、选中状态文字、左侧导航默认文字/icon |
| **次文本色** | `#6E6B8A` | `--text-secondary` | 提示文字、解释文字、表头文字、标签文字、图标、未选中 checkbox |
| **装饰色（bg）** | `#EEEEF7` | `--text-decorative` | 未选中 Tab 灰底、浮起色块填充（仅作背景） |
| **禁用文字色** | `#A5A3B8` | `--text-disabled` | 装饰文字 / 禁用态文字（"即将上线"、禁用按钮、placeholder、pagination 灰态） |
| **反白文字色** | `#FFFFFF` | `--text-inverse` | 深色 / 强调背景上的文字与图标 |
| **分割线色** | `#E4E3F0` | `--border-divider` | 全局分割线、进度条背景、气泡边框、表格边框、输入框边框（靛灰） |
| **表头背景** | `#EEEEF6` | `--bg-secondary` | 表格表头背景（靛米） |
| **页面背景** | `#F7F7FB` | `--bg-primary` | 页面全局背景底色（中性灰白，不带 brand 色温） |
| **卡片背景** | `#FFFFFF` | `--bg-card` | 卡片、表格行、输入框、浮层底色 |
| **卡片 Hover** | `#F3F2FA` | `--bg-card-hover` | 白底卡片 / pill 按钮 hover 状态 |
| **持久选中** | `#ECEAFD` | `--bg-selected` | 多选/单选选中态背景 |
| **控件填充** | `#F4F3FA` | `--bg-control` | 表单填充式控件背景 |

> **中性色配色逻辑**：所有中性背景/边框统一带靛蓝 / 蓝紫微调（hue ≈ 240-245°），整体降饱和，保证后台 SaaS 长时间阅读的舒适度。明度阶梯保持克制，UI 视觉节奏不受影响。

### 2.2 指标颜色（红涨绿跌）

| 方向 | 色值 | CSS 变量 | 用途 |
|---|---|---|---|
| **上升 / 增长** | `#D1595D` | `--color-indicator-up` | 指标正向变化、上升箭头（红涨） |
| **下降 / 回落** | `#4A9E63` | `--color-indicator-down` | 指标负向变化、下降箭头 |

### 2.3 图表配色（按顺序使用）

11 色序列，多系列图表与分类区分使用。辅助背景 5% 透明度，边框 10% 透明度。

> chart-1 用 brand 的"提亮版" `#6366F1`（靛蓝），不直接用纯 brand `#4F46E5`——后者作为细线条/小色块过暗，会糊成一团黑。如需在图表上强调 brand，单独传 `color="#4F46E5"`。

| 序号 | 色值 | 名称 |
|---|---|---|
| 1 | `#6366F1` | 靛蓝（brand） |
| 2 | `#8E89D6` | 雪青 |
| 3 | `#6F8FC2` | 钢蓝 |
| 4 | `#6AA9CF` | 天蓝 |
| 5 | `#5FB0A6` | 青瓷 |
| 6 | `#74A883` | 橄榄 |
| 7 | `#A6BF86` | 薄荷 |
| 8 | `#D6B46A` | 鸡冠黄 |
| 9 | `#D68F6C` | 陶土 |
| 10 | `#C98AA7` | 玫红 |
| 11 | `#A78BC7` | 紫 |

CSS 变量：`--color-chart-1` ~ `--color-chart-11`。

### 2.4 语义颜色（功能 + 风险）

#### 风险等级（实底标签 + 文字 `#FFFFFF`）

| 语义 | 色值 | CSS 变量 | 用途 |
|---|---|---|---|
| **高风险** | `#D1595D` | `--color-risk-high` | = 指标红，风险标签实底 |
| **中等风险** | `#D6A84A` | `--color-risk-medium` | 中风险标签实底 |
| **低风险** | `#6F8FC2` | `--color-risk-low` | 低风险标签实底 |
| **品牌关联-高 / 中 / 低** | `#1E1B39` 100% / 60% / 30% | — | 标签圆点 8px，距文字 8px |

风险标签规格：文字 12px、左右 padding 16px、高度 28px、pill 圆角。

#### 功能色（success / warning / danger / info）

> 因 brand 本身是靛蓝，**danger / negative / 高风险**统一使用低饱和指标红 `#D1595D`，与主色分离，避免把错误状态误读为品牌强调。

| 语义 | 色值 | CSS 变量 | 用途 |
|---|---|---|---|
| **成功** | `#4A9E63` | `--color-success` | 成功提示（= sentiment-positive） |
| **警告** | `#D6A84A` | `--color-warning` | 警告提示（与 risk-medium 同色） |
| **危险 / 错误** | `#D1595D` | `--color-danger` | 错误提示、报错文字、删除按钮（= sentiment-negative；**与 brand 蓝刻意拉开 hue**） |
| **信息** | `#6F8FC2` | `--color-info` | 普通提示 |

### 2.5 主色透明度规则

| 透明度 | 用途 |
|---|---|
| `#4F46E5` 100% | 按钮背景、选中状态、关键强调 |
| `#4F46E5` 20% | 品牌强调标签背景 |
| `#4F46E5` 10% | 词云核心词品牌背景 |
| `#4F46E5` 8% | 软背景、focus ring（`--highlight-light`） |
| `#4F46E5` 5% | 词云普通词品牌背景 |

### 2.6 情绪颜色（情感标签 单一权威源）

情感标签（正面 / 中性 / 负面）统一使用以下 token，组件层禁止使用其他色值表达情绪：

| 情绪 | 文字色 token | 文字色值 | 背景色 token | 背景色值 |
|---|---|---|---|---|
| **正面** | `--color-sentiment-positive` | `#4A9E63` | `--color-indicator-down` 20% | `#4A9E63` 20% |
| **中性** | `--color-sentiment-neutral` | `#8B91A8` | `--color-sentiment-neutral` 20% | `#8B91A8` 20% |
| **负面** | `--color-sentiment-negative` | `#D1595D` | `--color-sentiment-negative` 20% | `#D1595D` 20% |

> 背景用 `color-mix(in srgb, <token> 20%, transparent)` 实现。**负面背景不复用 `--highlight` 20%**，统一使用 `--color-sentiment-negative` 20%，让品牌强调与风险/错误语义保持清晰分工。该规范覆盖此前 `SentimentTag` 使用的 `--highlight-light` / `--highlight-rgb` 写法，新代码一律按此处规范执行。

---

## 3. 字体排版

### 3.1 字体栈

| 角色 | 字体 | CSS 变量 | 说明 |
|---|---|---|---|
| **中文正文** | Inter | `--font-sans` | 平台全局中文字体 |
| **英文正文** | Roboto | `--font-sans` | 平台全局英文字体（与 Inter 同栈） |
| **展示字体** | Inter | `--font-display` | 页面标题、重要模块标题 |
| **数据字体** | DIN Alternate | `--font-data` | KPI 数字、指标数据展示 |

> 平台端默认使用 Inter（中文）+ Roboto（英文）。如客户主题需要替换字体，只能在 `src/themes/<theme-id>.ts` 中修改 `typography` token，不在组件里覆盖字体栈。

### 3.2 字号 / 字重规格

**标题一律加粗 (font-weight: 700)**，正文常规体 (font-weight: 400)。

| 场景 | 字号 | 字重 | 说明 |
|---|---|---|---|
| **大标题** | 24px | **700** | 页面主标题 |
| **中标题** | 20px | **700** | 区块/卡片组标题 |
| **小标题** | 18px | **700** | 卡片标题、模块标题 |
| **常规标题** | 16px | **700** | 列表项标题、表头强调 |
| **正文** | 14px | 400 | 默认正文、表格内容、表单文字 |
| **辅助正文** | 14px | 400 | 标注、辅助说明、正文最小字号 |

> `12px` 仅用于标签、徽标、chip 等短标签形态；常规文本、说明、字段名、链接、tooltip 最小使用 `14px`。

### 3.3 数据展示字号

| 场景 | 字号 | 字重 | 字体 | 行高 |
|---|---|---|---|---|
| 数据大字 (KPI) | 40px | 700 | DIN Alternate | 48px |
| 数据中字 (指标) | 18px | 700 | DIN Alternate | 26px |
| 数据小字 (辅助) | 16px | 700 | DIN Alternate | — |

### 3.4 允许的字号 / 字重（白名单）

- **字号**：`12 · 14 · 16 · 18 · 20 · 24 · 26 · 32 · 40` px
- **字重**：`400 · 500 · 600 · 700`

> 任何超出白名单的取值视为违反规范，PR 必拒。

---

## 4. 间距与布局

### 4.1 全局布局

| 属性 | 值 |
|---|---|
| 页面最大宽度 | 1440px |
| 侧边距 | 24px |
| 内容区宽度（详情页） | 700px |

### 4.2 8px 网格系统

常用间距值：

| 值 | 用途 |
|---|---|
| 4px | 极小间距（标签圆角内边距） |
| 8px | 基础间距（标签内边距、元素间距、图标与文字间距） |
| 16px | 标准间距（标签与数字间距、风险标签内边距、卡片内边距） |
| 24px | 区块间距（标题与边框、标题与数字、卡片间距） |
| 32px | 大区块间距 |
| 48px | Section 间距 |

### 4.3 数据卡片内边距规范

- 标题上方与边框间距：24px
- 标题下方与数字间距：24px
- 标题左侧与边框间距：24px
- 标签上方与数字间距：16px
- 标签下方与边框间距：24px
- 标签左侧与边框间距：24px

---

## 5. 组件规范

### 5.1 按钮

| 类型 | 圆角 | 背景 | 文字 | 内边距 |
|---|---|---|---|---|
| 主要按钮（Primary） | 40px (pill) | `var(--highlight)` (#4F46E5) | `#FFFFFF` | 5px 32px |
| 操作按钮 | 6px | `var(--highlight)` (#4F46E5) | `#FFFFFF` | 10px 24px |
| 标签式按钮 | 8px | `var(--highlight)` (#4F46E5) | `#FFFFFF` | 2px 8px |

> Hover：`var(--highlight-hover)` (#4338CA)；按下：`var(--highlight-active)` (#3730A3)。

### 5.2 表格

| 属性 | 值 |
|---|---|
| 表头背景 | `var(--bg-secondary)` (#EEEEF6) |
| 表头边框 | `var(--border-divider)` (#E4E3F0) |
| 表头字色 | `#6E6B8A`，14px |
| 表格背景 | `#FFFFFF` |
| 表格边框 | `var(--border-divider)` (#E4E3F0) |
| 表格字色 | `#3D3A56`，14px |

### 5.3 标签 (Tag)

| 类型 | 背景 | 字色 | 字号 | 高度 | 圆角 | 内边距 |
|---|---|---|---|---|---|---|
| 通用标签 | `#1E1B39` 6% | `#6E6B8A` | 12px | 24px | 4px | 8px |
| 分类标签 | `#1E1B39` 6% | `#6E6B8A` | 12px | 20px | 4px | 8px |
| 平台标签 | `#1E1B39` solid | `#FFFFFF` | 12px | 20px | 4px | 8px |
| 风险标签 | 风险色实底 | `#FFFFFF` | 12px | 28px | pill | 16px |

### 5.4 选项卡 (Tabs)

| 状态 | 背景 | 字色 | 字号 | 高度 | 圆角 |
|---|---|---|---|---|---|
| 选中 | `var(--highlight)` (#4F46E5) | `#FFFFFF` | 16px / 600 | 40px | 20px |
| 未选中 | `var(--text-decorative)` (#EEEEF7) bg | `var(--text-regular)` | 14px / 400 | 40px | 6px |
| Tab 容器 | `#FFFFFF` | — | — | 48px | 8px |

### 5.5 表单组件

#### 通用输入框

| 属性 | 值 |
|---|---|
| 高度 | 40px |
| 背景色 | `#FFFFFF` |
| 边框色 | `var(--border-divider)` (#E4E3F0) |
| 圆角 | 8px |
| 文字颜色 | `#3D3A56`，14px |
| 占位文字颜色 | `#6E6B8A`，14px |
| 标签文字颜色 | `#6E6B8A`，14px |
| 下拉箭头图标 | 16×16px |
| 聚焦边框色 | `var(--highlight)` (#4F46E5) |
| Hover 边框色 | `var(--highlight)` (#4F46E5) |

#### 错误状态

| 属性 | 值 |
|---|---|
| 错误提示文字 | `var(--color-danger)` (#D1595D)，14px |
| 错误边框色 | `var(--color-danger)` (#D1595D) |

### 5.6 数据卡片

| 属性 | 值 |
|---|---|
| 背景 | `var(--bg-card)` (#FFFFFF) |
| 边框 | `var(--border-divider)` (#E4E3F0) |
| 圆角 | 8px |
| Hover 背景 | `var(--bg-card-hover)` (#F3F2FA) — 卡片可点击时使用 |
| 数字字体 | DIN Alternate |
| 数字字号 | 40px / 700 / `#1E1B39` |
| 标题字号 | 16px / 400 / `#3D3A56` |
| 辅助标签 | 12px / 400 / `#6E6B8A` |

### 5.7 浮层规范 (Floating Surfaces)

> 适用范围：`SelectContent` · `PopoverContent` · `DropdownMenuContent` · 图表 tooltip。
> 这些"从触发点弹出的浮层"共用同一套视觉 token，仅靠**阴影**与底层内容分层，**不使用 border**。

| 属性 | 值 |
|---|---|
| 背景 | `var(--bg-card)` (#FFFFFF) |
| 圆角 | `var(--component-popover-radius)` |
| 内边距 | `var(--component-popover-padding)` |
| 阴影 | `var(--component-popover-shadow)` |
| 边框 | **无**（不使用 border-divider） |
| 内部 item 间距 | 8px（Tailwind `gap-2`） |

#### 实现样例（Tailwind class）

```tsx
className="rounded-[var(--component-popover-radius)] bg-[var(--bg-card)] p-[var(--component-popover-padding)] shadow-[var(--component-popover-shadow)]"
```

#### 图表 tooltip 实现（ECharts theme）

```ts
tooltip: {
  borderWidth: 0,
  backgroundColor: '#FFFFFF',
  borderRadius: 8,
  padding: [8, 12],
  textStyle: { color: '#6E6B8A', fontSize: 14, fontFamily: FONT_FAMILY },
  extraCssText: 'box-shadow: 0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent);',
}
```

> 备注：ECharts tooltip 的 `backgroundColor` 必须通过 `useChartTheme()` 传当前主题真实色值（`var()` 在该字段上不稳定），但 `extraCssText` 是注入到浮层 `<div>` 的 CSS 字符串，可以使用主题 CSS 变量。

#### 不适用范围

- **Sheet / Drawer**：3/4 宽侧抽屉，属于"页面区域"形态，使用 `var(--overlay-scrim)` 与 `var(--component-modal-shadow)`。
- **Dialog / Modal**：居中弹层，使用 `var(--component-modal-radius)`、`var(--component-modal-shadow)` 与 `var(--overlay-scrim)`。

### 5.8 图标尺寸约定 (Icon Sizing)

| 场景 | 外层可点击区 | 内部图标 | 备注 |
|---|---|---|---|
| 小型行内交互图标（如 InfoTooltip、RefreshStatusBadge） | 16×16px | 14×14px lucide | 鼠标命中区 ≥ 16px，视觉图标 14px |
| 表单内联图标（下拉箭头、清除按钮） | — | 16×16px lucide | 直接 `size-4` |
| 卡片操作图标 | 36×36px | 16×16px lucide | 与按钮高度对齐 |
| 大型 hero icon | — | 24×24px | `size-6` |

> 凡是带 `<button>` 包裹的小型 lucide 图标，**外按钮 16×16、内 icon 14×14** 是默认约定；如需更大点击区，外按钮升到 32×32 或 36×36，内 icon 保持 14 或 16。

### 5.9 SegmentedSwitcher（分段切换器）

> 源码：`src/components/shared/SegmentedSwitcher.tsx`。两种变体：`pill`（默认）/ `underline`。

| 状态 | pill 变体背景 | underline 变体背景 | 文字色 |
|---|---|---|---|
| 选中 | 由 `activeColor` 滑块覆盖（默认 `var(--highlight)`） | 底部 2px 下划线 | `pill` → 白；`underline` → `var(--highlight)` |
| 默认 | `var(--text-decorative)` (#EEEEF7) | transparent | `var(--text-regular)` |
| **Hover**（非选中、非禁用） | `color-mix(in srgb, var(--text-secondary) 20%, transparent)` (灰 20%，比默认深一档) | `color-mix(in srgb, var(--text-secondary) 6%, transparent)` | `var(--text-strong)` |
| Focus | 同 Hover（键盘可达性） | 同 Hover | 同 Hover |
| Disabled | `var(--text-disabled)` (#A5A3B8) | transparent | inactive 色 + 50% opacity |

> 容器本身 `background: transparent`、**无 border**；视觉分层完全靠 pill 按钮的灰底 + 选中滑块的 brand 蓝。

容器规格：

| 属性 | sm | md (默认) |
|---|---|---|
| 容器高度 | 40px | 48px |
| 按钮高度 | 32px | 40px |
| 容器内 padding | 4px | 4px |
| 容器圆角 | 8px | 8px |
| 按钮圆角 | 6px | 6px |
| 字号 | 12px | 14px |

---

## 6. 图表规范

### 6.1 通用规则

| 属性 | 值 |
|---|---|
| 容器背景 | `var(--bg-card)`，边框 `var(--border-divider)` |
| 线条颜色（单系列） | `var(--color-chart-1)` (#6366F1) — chart-1 而非 brand，避免线条过暗 |
| 线条颜色（多系列） | 按图表配色顺序 (`getChartColor(i)`) |
| 线条颜色（双系列） | `#6366F1` + `#1E1B39` (`DUAL_SERIES_COLORS`) |
| 标题颜色 | `#3D3A56`，16px |
| 单位 / 时间文字 | `#6E6B8A`，14px |
| 气泡（tooltip） | **见 §5.7 浮层规范**；文字 `#6E6B8A` 14px，强调数字 `#1E1B39` |
| 网格线 / 轴线 | `var(--border-divider)` (#E4E3F0) |
| 折线图风格基线 | 对齐 `ChartStackedArea`：`symbol: 'none'` · `lineStyle.width: 1.5` · `axisPointer: { type: 'cross' }` |

### 6.2 图表组件库

所有图表必须使用 `@/components/charts` 中的预设组件（详见 `src/components/charts/CATALOG.md`），包括：

- `ChartLine` 折线图
- `ChartBar` 柱状图
- `ChartDonut` 环形图
- `ChartRadar` 雷达图
- `ChartWordCloud` 词云图
- `ChartStackedArea` 堆叠面积图
- `ChartMiniSparkline` 迷你趋势线
- `ChartBubble` 气泡图
- `ChartFunnel` 漏斗图
- `ChartSankey` 桑基图
- `ChartProportion` 占比图
- `ChartFlow` 流程图
- `EChartsBase` SSR 安全基座（自定义场景）

**禁止**：内联 SVG 模拟图表 / 安装其他图表库 / 在组件外构建 ECharts option。

### 6.3 特殊图表规则

- **气泡图**：图例 100% 不透明度，气泡填充 40% 不透明度
- **漏斗图**：透明度 100% → 0% 线性递减，descending 排序
- **桑基图**：节点宽度 20px，节点间距 8px，连线颜色跟随源节点 20% 透明度
- **占比图**：最大扇区数字 48px DIN Alternate，次大 28px，其余 20px

### 6.4 ECharts v6 兼容注意

ECharts 6 默认开启了「轴名/轴标签防重叠 + 防溢出」机制，与"顶部 legend + Y 轴 `nameLocation: 'end'`"组合会触发布局搬运、可能让绘图区被挤没，**导致整张图不显示**。

凡是需要在 Y 轴顶部展示 `name`（如 `单位（万）`）的 ChartLine，必须同时：

```ts
yAxis: {
  name: '单位（万）',
  nameLocation: 'end',
  nameGap: 16,
  nameMoveOverlap: false,            // ← 关防重叠
  nameTextStyle: { color: '#6E6B8A', fontSize: 14, align: 'left' },
},
grid: { ...chartTheme.grid, top: 64, outerBoundsMode: 'none' },  // ← 关防溢出 + 抬高 top
```

参考：[Apache ECharts 6 Upgrade Guide — Label Position](https://github.com/apache/echarts-handbook/blob/master/contents/en/basics/release-note/v6-upgrade-guide.md)。

---

## 7. 交互规范

### 7.1 状态

| 状态 | 处理方式 |
|---|---|
| Hover（文字 / icon） | transition 200ms ease，色值切到 `var(--text-strong)` 或主色 |
| Hover（白底卡片 / pill） | 背景切到 `var(--bg-card-hover)` (#F3F2FA) |
| Hover（半透明 tint，无底色容器场景） | `color-mix(in srgb, var(--text-secondary) 6%, transparent)` 或 `color-mix(in srgb, var(--border-divider) 40%, transparent)` |
| Selected（持久选中） | `var(--bg-selected)` (#ECEAFD) + 文字 `var(--text-strong)` |
| Active（按下） | `var(--highlight-active)` (#3730A3)，快速回弹 |
| Focus | 同 Hover 反馈（保证键盘可达性）；如需外环用主色 20% 透明 outline |
| Disabled | opacity 50%，cursor: not-allowed |

### 7.2 动画

| 场景 | 时长 | 缓动 |
|---|---|---|
| Hover 过渡 | 200ms | ease |
| 展开 / 折叠 | 250ms | ease-in-out |
| 模态弹出 | 200ms | ease |

---

## 8. 响应式断点

| 断点 | 宽度 | 用途 |
|---|---|---|
| Desktop | > 1024px | 完整布局 |
| Tablet | 768px – 1024px | 收起右侧栏 |
| Mobile | < 768px | 单列布局、汉堡菜单 |
| Small | < 480px | 极简布局 |

---

## 9. 空状态规范

### 9.1 变体

| 变体 | 文案 | 场景 |
|---|---|---|
| `no-search` | 暂无搜索内容 | 搜索结果为空 |
| `no-creation` | 您还未开始创作 | 用户无创建内容 |
| `no-data` | 暂无数据 | 数据列表/图表无数据 |
| `processing` | 数据整理中 | 异步任务进行中 |
| `error` | 系统出错了 | 服务端错误 |

### 9.2 尺寸

| 尺寸 | 插图区域 | 适用场景 |
|---|---|---|
| `compact` | 200×130px | 卡片内、侧边栏 |
| `standard` | 400×280px | 页面级空状态 |

### 9.3 文字

- 文字：14px，`#6E6B8A`（`var(--text-secondary)`）
- 居中布局，可选底部操作按钮

---

## 10. Do's and Don'ts

### ✅ Do

- 使用 CSS 变量 (`var(--highlight)`) 引用颜色
- 新功能 / 新页面必须默认 theme-ready：只引用语义 token，不为客户或页面写死色值
- 新客户主题通过 `src/themes/<theme-id>.ts` + `registry.ts` 注册，再由 `themeId` 切换；主题要覆盖颜色、字体、圆角、间距、阴影、遮罩、链接和组件语义 token
- ECharts / canvas 图表使用 `useChartTheme()` 获取运行时主题色
- 数据数字统一使用 DIN Alternate 字体
- 间距使用主题 spacing token，并保持 8px 网格
- shadcn/ui 组件通过 CSS 变量和 Tailwind 统一主题
- 辅助色背景使用 5% 透明度，边框使用 10% 透明度
- 图表配色严格按 `getChartColor(index)` 顺序使用

### ❌ Don't

- 不要在组件中硬编码颜色 hex 值
- 不要在组件中硬编码 `rgb()` / `rgba()` / `hsl()` 作为产品 UI 颜色
- 不要在组件中硬编码客户品牌相关字体、圆角、阴影、遮罩和组件尺寸；优先使用主题 token
- 不要为了客户定制去修改页面样式代码；应新增主题并切换 `themeId`
- 不要在 ECharts option / tooltip HTML 里写死颜色，必须从 `useChartTheme()` 派生
- 不要在多个文件中重复定义 shadcn/ui 组件的主题 token
- 不要使用 CSS 变量之外的颜色
- 不要使用字号 / 字重白名单之外的值
- 不要用色相近似的颜色代替规范配色
- 不要省略数据卡片的 24px 内间距规范

---

## 11. CSS 变量速查（`globals.css` 配置）

```css
:root {
  /* ─── 背景 / 容器层级 ─── */
  --bg-primary: #F7F7FB;          /* 页面全局背景（中性灰白） */
  --bg-secondary: #EEEEF6;        /* 表格表头、二级背景（靛米） */
  --bg-card: #FFFFFF;             /* 卡片、表格行、输入框 */
  --bg-card-hover: #F3F2FA;       /* 白底容器统一 hover 背景 */
  --bg-selected: #ECEAFD;         /* 持久选中态背景 */
  --bg-control: #F4F3FA;          /* 表单控件填充背景 */

  /* ─── 边框 / 分割线 ─── */
  --border-divider: #E4E3F0;      /* 靛灰 */

  /* ─── 文字色 ─── */
  --text-strong: #1E1B39;
  --text-regular: #3D3A56;
  --text-secondary: #6E6B8A;
  --text-decorative: #EEEEF7;   /* 灰底填充（仅 bg 用） */
  --text-disabled: #A5A3B8;     /* 装饰文字 / 禁用态文字 */
  --text-inverse: #FFFFFF;                     /* 深色 / 强调背景上的文字 */

  /* ─── 品牌 / 主色 ─── */
  --highlight: #4F46E5;
  --highlight-hover: #4338CA;                   /* 主按钮 hover */
  --highlight-active: #3730A3;                  /* 主按钮按下 */
  --highlight-foreground: #FFFFFF;              /* 主色背景上的文字 */
  --highlight-light: rgba(79, 70, 229, 0.08);     /* 主色弱化背景 / focus ring */
  --highlight-rgb: 79, 70, 229;                   /* 兼容 rgba(var(--highlight-rgb), ...) */

  /* ─── 通知 / 徽标 ─── */
  --color-notification-badge: #D1595D;          /* 通知徽标 / 语义红 */

  /* ─── 指标方向（红涨绿跌） ─── */
  --color-indicator-up: #D1595D;                /* 红涨 */
  --color-indicator-down: #4A9E63;

  /* ─── 风险语义 ─── */
  --color-risk-high: #D1595D;                   /* 高风险 / 指标红 */
  --color-risk-medium: #D6A84A;                 /* 中风险 */
  --color-risk-low: #6F8FC2;

  /* ─── 功能 / 状态色 ─── */
  --color-success: #4A9E63;
  --color-warning: #D6A84A;
  --color-danger: #D1595D;                      /* 指标红，与 brand 蓝独立 hue */
  --color-info: #6F8FC2;

  /* ─── 情绪文字色（背景用 color-mix(... 20%)） ─── */
  --color-sentiment-positive: #4A9E63;
  --color-sentiment-neutral: #8B91A8;
  --color-sentiment-negative: #D1595D;          /* = danger，避开 brand 蓝 */

  /* ─── 图表 11 色（按序使用；chart-1 是 brand 提亮版） ─── */
  --color-chart-1: #6366F1;
  --color-chart-2: #8E89D6;
  --color-chart-3: #6F8FC2;
  --color-chart-4: #6AA9CF;
  --color-chart-5: #5FB0A6;
  --color-chart-6: #74A883;
  --color-chart-7: #A6BF86;
  --color-chart-8: #D6B46A;
  --color-chart-9: #D68F6C;
  --color-chart-10: #C98AA7;
  --color-chart-11: #A78BC7;

  /* ─── 布局 ─── */
  --container-width: 1440px;
  --side-margin: 24px;

  /* ─── 字体 ─── */
  --font-sans: "Inter", "Roboto", -apple-system, "PingFang SC", "Helvetica Neue", "Noto Sans SC", Arial, sans-serif;
  --font-display: var(--font-sans);
  --font-data: "DIN Alternate", "SF Mono", "Fira Code", "Consolas", monospace;
  --font-size-body: 14px;
  --line-height-body: 1.75;

  /* ─── 圆角 ─── */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* ─── 间距 ─── */
  --space-xxs: 2px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-base: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-xxl: 48px;
  --space-section: 64px;

  /* ─── 层级 / 遮罩 / 链接 ─── */
  --shadow-card-hover: 0 4px 16px color-mix(in srgb, var(--text-strong) 8%, transparent);
  --shadow-popover: 0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent);
  --shadow-modal: 0 24px 72px color-mix(in srgb, var(--text-strong) 18%, transparent);
  --overlay-scrim: rgba(30, 27, 57, 0.5);
  --link-default: var(--highlight);
  --link-hover: var(--highlight-hover);
  --link-muted: var(--text-secondary);
  --link-legal: var(--color-info);

  /* ─── 组件语义 token ─── */
  --component-button-radius: var(--radius-md);
  --component-button-height: 40px;
  --component-button-padding-x: 16px;
  --component-card-radius: var(--radius-xl);
  --component-card-padding: 24px;
  --component-card-shadow: none;
  --component-card-hover-shadow: var(--shadow-card-hover);
  --component-input-radius: var(--radius-md);
  --component-input-height: 40px;
  --component-popover-radius: var(--radius-lg);
  --component-popover-padding: 8px;
  --component-popover-shadow: var(--shadow-popover);
  --component-modal-radius: var(--radius-xl);
  --component-modal-shadow: var(--shadow-modal);

  /* ─── 动效 token ─── */
  --motion-fast: 150ms;
  --motion-base: 250ms;
  --motion-slow: 400ms;
  --motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### 11.1 常用组合（语义化引用）

| 场景 | 写法 |
|---|---|
| 浮层阴影 | `box-shadow: 0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent)` |
| 半透明 hover tint | `background: color-mix(in srgb, var(--border-divider) 40%, transparent)` |
| 主色弱化背景 | `background: var(--highlight-light)` 或 `color-mix(in srgb, var(--highlight) 8%, transparent)` |
| 标签 6% bg | `background: color-mix(in srgb, var(--text-strong) 6%, transparent)` |
| 情绪 20% bg | `background: color-mix(in srgb, var(--color-sentiment-negative) 20%, transparent)` |

---

## 12. 待补充事项

以下需在项目推进中明确：

- **暗色模式**：是否支持？如需要则提供暗色色板
- **无障碍 (a11y)**：颜色对比度（WCAG）要求、键盘导航规则
- **暗色模式色板**：当前 §2 仅给亮色模式，暗色模式需要单独配（brand 在暗底上需提亮到 `#E04545` 左右才有足够对比）

图标 / 浮层 / SegmentedSwitcher 等通用规范已在 §5.7 ~ §5.9 落地，新增组件请优先复用既有 token。

---

## 13. 预览（Preview）

开发环境访问 `/dev/preview` 查看本规范的**实物呈现**：色板、字号字重、shadcn/ui 组件、shared 工具组件、13 个图表、5 类空状态、动画 utilities 等。

```bash
npm run dev
# 浏览器访问 http://localhost:3000/dev/preview
```

> 预览页仅在 `NODE_ENV === 'development'` 下可访问，生产环境返回 404。
> 源码：`src/app/(dev)/dev/preview/page.tsx`。

---

# Part 2. 图表组件目录与 API

# 图表组件库目录 (Chart Component Catalog)

> 导入路径: `@/components/charts`
> 设计规范: [DESIGN_SYSTEM.md](../../../DESIGN_SYSTEM.md) 第 6 节「图表规范」
> 主题配色: 11 色序列，来自 `--color-chart-{1..11}` CSS 变量

---

## 组件列表

### ChartLine — 折线图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartLine } from '@/components/charts'` |
| **适用场景** | 趋势分析、数值走势、预测 vs 实际对比、增长率折线 |
| **核心 Props** | `xData: string[]`, `series: { name, data, dashed? }[]` |
| **可选 Props** | `title`, `unit`, `showArea`, `smooth`, `dualSeries`, `height`, `loading`, `optionOverrides` |
| **双系列模式** | `dualSeries={true}` 使用 `#6366F1` + `#1E1B39` 双色 |

```tsx
<ChartLine
  xData={['1月','2月','3月']}
  series={[{ name: '数值', data: [120, 200, 150] }]}
  showArea
/>
```

---

### ChartBar — 柱状图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartBar } from '@/components/charts'` |
| **适用场景** | 平台分布、内容类型占比、分类对比 |
| **核心 Props** | `xData: string[]`, `series: { name, data }[]` |
| **可选 Props** | `title`, `unit`, `horizontal`, `stacked`, `barWidth`, `height`, `loading`, `optionOverrides` |

```tsx
<ChartBar
  xData={['抖音','小红书','微博']}
  series={[{ name: '数量', data: [300, 250, 180] }]}
  horizontal
/>
```

---

### ChartDonut — 环形图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartDonut } from '@/components/charts'` |
| **适用场景** | 情感分布、风险占比、平台占比、分类比例 |
| **核心 Props** | `data: { name, value }[]` |
| **可选 Props** | `title`, `centerText`, `innerRadius`, `outerRadius`, `height`, `loading`, `optionOverrides` |

```tsx
<ChartDonut
  data={[
    { name: '正面', value: 60 },
    { name: '中性', value: 25 },
    { name: '负面', value: 15 },
  ]}
  centerText="60%"
/>
```

---

### ChartRadar — 雷达图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartRadar } from '@/components/charts'` |
| **适用场景** | 多维评估、画像对比、能力对比 |
| **核心 Props** | `indicators: { name, max }[]`, `series: { name, values }[]` |
| **可选 Props** | `title`, `height`, `loading`, `optionOverrides` |

```tsx
<ChartRadar
  indicators={[
    { name: '影响力', max: 100 },
    { name: '活跃度', max: 100 },
    { name: '专业度', max: 100 },
  ]}
  series={[{ name: '系列 A', values: [80, 70, 90] }]}
/>
```

---

### ChartWordCloud — 词云图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartWordCloud } from '@/components/charts'` |
| **适用场景** | 关键词分析、关键词提取、标签词云 |
| **核心 Props** | `words: { name, value }[]` |
| **可选 Props** | `title`, `shape`, `height`, `loading`, `optionOverrides` |
| **颜色规则** | 按词频百分位自动映射：核心词 `#4F46E5`，普通词 `#6E6B8A`，低频词 50% 透明度 |

> **依赖**：`echarts-wordcloud@^2.1.0` 上游 peer 声明 ECharts 5，但运行时与 ECharts 6 兼容。
> 仓库已通过 `.npmrc`（`legacy-peer-deps=true`）放行，`npm install` 可直接安装。

```tsx
<ChartWordCloud
  words={[
    { name: '品牌', value: 100 },
    { name: '口碑', value: 80 },
    { name: '推荐', value: 60 },
  ]}
/>
```

---

### ChartStackedArea — 堆叠面积图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartStackedArea } from '@/components/charts'` |
| **适用场景** | 情绪走势、渠道数值趋势、多分类时间序列 |
| **核心 Props** | `xData: string[]`, `series: { name, data }[]` |
| **可选 Props** | `title`, `unit`, `smooth`, `height`, `loading`, `optionOverrides` |

```tsx
<ChartStackedArea
  xData={['Mon','Tue','Wed','Thu','Fri']}
  series={[
    { name: '正面', data: [120, 132, 101, 134, 90] },
    { name: '中性', data: [220, 182, 191, 234, 290] },
    { name: '负面', data: [30, 42, 31, 34, 19] },
  ]}
/>
```

---

### ChartMiniSparkline — 迷你趋势线

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartMiniSparkline } from '@/components/charts'` |
| **适用场景** | 表格行内趋势、卡片微型图、KPI 卡片趋势线 |
| **核心 Props** | `data: number[]` |
| **可选 Props** | `width` (默认120), `height` (默认32), `color` (默认 `#6366F1`) |
| **特点** | 无轴线、无网格、无 tooltip，纯视觉展示 |

```tsx
<ChartMiniSparkline data={[10, 23, 18, 35, 28, 40, 32]} />
```

---

### ChartBubble — 气泡图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartBubble } from '@/components/charts'` |
| **适用场景** | 多维数据对比、散点分布、投入产出分析 |
| **核心 Props** | `series: { name, data: [x, y, size][] }[]` |
| **可选 Props** | `title`, `unit`, `height`, `loading`, `optionOverrides` |
| **颜色规则** | 图例 100% 不透明度，气泡填充 40% 不透明度 |

```tsx
<ChartBubble
  series={[
    { name: '抖音', data: [[10, 20, 500], [15, 30, 800], [20, 10, 300]] },
    { name: '小红书', data: [[12, 25, 600], [18, 15, 400]] },
  ]}
/>
```

---

### ChartFunnel — 漏斗图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartFunnel } from '@/components/charts'` |
| **适用场景** | 转化漏斗、用户流程转化、销售漏斗 |
| **核心 Props** | `data: { name, value }[]` |
| **可选 Props** | `title`, `showLabel`, `height`, `loading`, `optionOverrides` |
| **透明度** | 顶层 100% → 底层 0%，线性递减 |

```tsx
<ChartFunnel
  data={[
    { name: '访问', value: 10000 },
    { name: '注册', value: 6000 },
    { name: '付费', value: 2000 },
    { name: '复购', value: 800 },
  ]}
/>
```

---

### ChartSankey — 桑基图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartSankey } from '@/components/charts'` |
| **适用场景** | 流量来源、内容流转、用户路径分析 |
| **核心 Props** | `nodes: { name }[]`, `links: { source, target, value }[]` |
| **可选 Props** | `title`, `height`, `loading`, `optionOverrides` |
| **连线规则** | 颜色跟随源节点，20% 不透明度 |

```tsx
<ChartSankey
  nodes={[{ name: '搜索' }, { name: '推荐' }, { name: '详情页' }, { name: '购买' }]}
  links={[
    { source: '搜索', target: '详情页', value: 500 },
    { source: '推荐', target: '详情页', value: 300 },
    { source: '详情页', target: '购买', value: 200 },
  ]}
/>
```

---

### ChartProportion — 占比图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartProportion } from '@/components/charts'` |
| **适用场景** | 大面积百分比展示、分类占比、预算分配 |
| **核心 Props** | `data: { name, value }[]` |
| **可选 Props** | `title`, `showPercentLabel`, `height`, `loading`, `optionOverrides` |
| **标签规则** | 最大扇区 48px，次大 28px，其余 20px，DIN Alternate 字体 |
| **对比 ChartDonut** | Donut 侧重小型占比 + 中心文字；Proportion 侧重大面积百分比展示 |

```tsx
<ChartProportion
  data={[
    { name: '品牌A', value: 45 },
    { name: '品牌B', value: 30 },
    { name: '品牌C', value: 25 },
  ]}
/>
```

---

### ChartFlow — 流程图

| 属性 | 说明 |
|------|------|
| **导入** | `import { ChartFlow } from '@/components/charts'` |
| **适用场景** | 步骤流程、审批流程、任务流 |
| **核心 Props** | `steps: { label, description? }[]` |
| **可选 Props** | `height`, `className` |
| **实现** | 纯 React + CSS，非 ECharts（不依赖 canvas） |
| **特点** | 起点/终点节点主色背景，超宽自动水平滚动 |

```tsx
<ChartFlow
  steps={[
    { label: '数据引用', description: '多平台数据' },
    { label: '数据清洗' },
    { label: '分析建模' },
    { label: '报告输出' },
  ]}
/>
```

---

## 底层组件

### EChartsBase — SSR-Safe 基座

| 属性 | 说明 |
|------|------|
| **导入** | `import { EChartsBase } from '@/components/charts'` |
| **用途** | 当上述预设组件不满足需求时，直接使用 EChartsBase 构建自定义图表 |
| **Props** | `option`, `height`, `width`, `loading`, `className`, `style`, `notMerge`, `lazyUpdate`, `onEvents`, `setOptionOpts` |
| **SSR** | 内部 dynamic import echarts，自动跳过 SSR |

---

## 工具函数

| 函数/常量 | 导入路径 | 用途 |
|-----------|---------|------|
| `CHART_COLORS` | `@/components/charts` | 11 色数组常量 |
| `DUAL_SERIES_COLORS` | `@/components/charts` | `['#6366F1', '#1E1B39']` 双系列专用 |
| `getChartColor(index)` | `@/components/charts` | 按索引安全取色（自动循环） |
| `makeTooltipFormatter(unit?)` | `@/components/charts` | 生成标准 tooltip 格式化函数（数字用 DIN Alternate 字体） |

---

## 扩展指南

添加新图表组件时：

1. 在 `src/components/charts/` 创建 `Chart[Name].tsx`
2. 标记 `'use client'`
3. 导入 `EChartsBase` + `chartTheme`
4. 定义面向业务数据的 Props 接口（不暴露 ECharts option）
5. 内部构建 option 传给 `EChartsBase`
6. 支持 `optionOverrides` escape hatch
7. 在 `index.ts` 中导出
8. 更新本文件 CATALOG.md

---

# Part 3. 预览页 / 导航 / 全局布局契约

# Preview Shell — 通用契约

> 本节定义规范包预览页的最小运行外壳：全局 Provider、示例导航、错误兜底和可迁移边界。它不是某个业务项目的产品架构。

---

## 1. 布局结构

```text
RootLayout
├─ TenantProvider      注入当前主题 token
├─ UserProvider        提供预览用占位用户
├─ page content        预览页 /dev/preview
└─ Toaster             全局消息提示
```

## 2. 预览页入口

- 页面：`src/app/(dev)/dev/preview/page.tsx`
- 全局样式：`src/app/globals.css`
- 主题：`src/themes/default.ts` + `src/themes/registry.ts`
- 图表主题：`src/components/charts/theme/chartTheme.ts`

## 3. 示例导航

示例导航数据位于 `src/lib/navigation.ts`，仅用于展示侧边栏、导航分组、选中态和折叠态等视觉规范。导入其他项目时，可以按目标项目的信息架构替换菜单文案和路由，但需要保留本规范的字号、颜色、间距、圆角、hover 与 selected 状态。

## 4. 全局 Context

`TenantContext` 提供默认主题、Logo 和本地预览设置；`UserContext` 提供占位用户。二者是预览页运行所需的轻量上下文，不绑定任何具体客户或业务域。

## 5. 错误兜底

- 路由不存在：`src/app/not-found.tsx`
- 全局未捕获：`src/app/error.tsx`

## 6. 复用边界

导入其他项目时，优先复制规范文档、Agent 规则和 token；如果目标项目也是 Next.js / React，再按需迁移 `src/` 中的预览页、主题、基础组件和图表组件。

---

# Part 4. Agent 设计与图表执行规则原文

> 这一部分用于追溯机器规则来源。实际导入 Agent / Cursor 时，优先使用根目录 `AGENT_RULES.mdc`。

## 4.1 Design System Rules

---
description: Design system rules — auto-injected when editing UI code
globs:
  - "src/**/*.tsx"
  - "src/**/*.ts"
  - "src/**/*.css"
  - "src/**/*.module.css"
---

# Design System Rules

> 单一权威来源：`/DESIGN_SYSTEM.md`

## Themes — ALWAYS use theme tokens, NEVER hardcode product styling

Theme system is mandatory:
- Source of truth: `DESIGN_SYSTEM.md`
- Theme contract: `src/themes/types.ts`
- Default theme: `src/themes/default.ts`
- Theme registry and CSS variable mapping: `src/themes/registry.ts`
- Runtime injection: `src/contexts/ThemeContext.tsx`
- Tenant selection: `src/contexts/TenantContext.tsx` via `themeId`
- Chart runtime colors: `src/components/charts/theme/chartTheme.ts` via `useChartTheme()`

New features and pages MUST be theme-ready by default. Customer customization must be implemented by adding `src/themes/<theme-id>.ts`, registering it in `registry.ts`, and switching tenant `themeId`. Do not add customer-specific style branches in pages/components.

Theme tokens cover colors, typography, radius, spacing, elevation/shadows, overlays, links, accents, component semantics, and shadcn/ui compatibility tokens. If an existing token cannot express a new semantic need, extend `AppTheme`, `themeToCssVariables()`, and all registered themes before using it in components.

`npm run lint` runs `npm run theme:check`. New production UI code must pass this scan: no hardcoded product UI color literals, no `text-white`, no legacy overlay, no legacy popup shadow. Explicit exceptions are theme files, `globals.css` defaults, development preview pages, and official platform/logo identity colors.

Shared default logo lives at `public/brand/logo.svg`. Settings-page uploads are browser-local previews only and must not be treated as committed tenant assets.

Allowed exception: external brand/content identity colors, such as platform logos and official channel colors in `ChannelIcons`, may keep their own brand colors.

### Core palette
- Primary/Highlight: `var(--highlight)` → #4F46E5
- Text strong (titles, KPI numbers, nav selected icon): `var(--text-strong)` → #1E1B39; at 6% for generic tag bg
- Text regular (body, table cells, nav default text/icon): `var(--text-regular)` → #3D3A56
- Text secondary (hints, labels, headers, icons, unselected checkbox): `var(--text-secondary)` → #6E6B8A
- Text decorative (background only): `var(--text-decorative)` → #EEEEF7
- Text disabled: `var(--text-disabled)` → #A5A3B8
- Text inverse: `var(--text-inverse)` → #FFFFFF, used on dark/strong backgrounds
- Border/divider: `var(--border-divider)` → #E4E3F0
- Background primary: `var(--bg-primary)` → #F7F7FB
- Background secondary (table headers): `var(--bg-secondary)` → #EEEEF6
- Card background: `var(--bg-card)` → #FFFFFF
- Card hover: `var(--bg-card-hover)` → #F3F2FA

### Indicator colors
- Up/growth: `var(--color-indicator-up)` (#D1595D)
- Down/decline: `var(--color-indicator-down)` (#4A9E63)

### Semantic colors (NOT generic red/green)
- High risk: `var(--color-risk-high)` solid bg `#D1595D`, text `#FFFFFF`, pill radius, h28px, px16
- Medium risk: `var(--color-risk-medium)` solid bg `#D6A84A`, text `#FFFFFF`, pill radius, h28px, px16
- Low risk: `var(--color-risk-low)` solid bg `#6F8FC2`, text `#FFFFFF`, pill radius, h28px, px16
- Success: `var(--color-success)`
- Warning: `var(--color-warning)`
- Danger/error: `var(--color-danger)` (intentionally distinct from brand blue)
- Info: `var(--color-info)`

### Sentiment colors
- Positive: `var(--color-sentiment-positive)`; background with `color-mix(in srgb, var(--color-sentiment-positive) 20%, transparent)`
- Neutral: `var(--color-sentiment-neutral)`; background with `color-mix(in srgb, var(--color-sentiment-neutral) 20%, transparent)`
- Negative: `var(--color-sentiment-negative)`; background with `color-mix(in srgb, var(--color-sentiment-negative) 20%, transparent)`

### Chart palette (use in order)
#6366F1 → #8E89D6 → #6F8FC2 → #6AA9CF → #5FB0A6 → #74A883 → #A6BF86 → #D6B46A → #D68F6C → #C98AA7 → #A78BC7

Use `--color-chart-{1..11}` variables. Auxiliary backgrounds: 5% opacity; borders: 10%.

For ECharts/canvas, CSS variables may not resolve inside options. Use `useChartTheme()` to get runtime values for `chartTheme`, `axisStyleX`, `axisStyleY`, `getChartColor`, tooltip colors, gradients, and loading masks. Never hardcode hex/rgb/hsl inside ECharts option or tooltip HTML.

## Typography

### Font families
- Chinese text: Inter (via `var(--font-sans)`)
- English text: Roboto (via `var(--font-sans)`, second in stack)
- Display text: via `var(--font-display)`
- Data numbers (KPI, metrics): DIN Alternate (via `var(--font-data)`)

### Platform heading sizes — ALL BOLD (weight 700)
- 大标题: 24px / 700
- 中标题: 20px / 700
- 小标题: 18px / 700
- 常规标题: 16px / 700

### Platform body sizes — REGULAR (weight 400)
- 正文: 14px / 400 (default)
- 辅助正文: 14px / 400 (minimum readable body size)
- 12px is restricted to tags, badges, chips, counters, and very short label forms only. Never use 12px for body copy, helper text, field names, links, table text, tooltip content, form errors, descriptions, or metadata.

### Allowed font sizes (ONLY these)
12 · 14 · 16 · 18 · 20 · 24 · 26 · 32 · 40 px

### Allowed font weights
400 (body) · 500 (labels, nav) · 600 (card titles) · 700 (headings, KPI numbers)

### Data display rules
- KPI big numbers: DIN Alternate, 40px, weight 700, color var(--text-strong)
- Metric indicators: DIN Alternate, 18px, weight 700
- Table header text: 14px, weight 500, color var(--text-secondary)
- Table body text: 14px, weight 400, color var(--text-regular)

## Spacing — 8px grid

All spacing values must be multiples of 4px, preferring 8px multiples:
4 · 8 · 16 · 24 · 32 · 48 · 64 · 96 px

Data card internal spacing:
- Title to border (top/left): 24px
- Title to number: 24px
- Label to number: 16px
- Label to border (bottom/left): 24px

## Components

### Tags/Labels
- Generic tag: bg `color-mix(in srgb, var(--text-strong) 6%, transparent)`, text `var(--text-secondary)`, 12px, height 24px, radius 4px, padding 0 8px
- Topic tag: same but 12px text, height 20px
- Risk tags: solid risk color bg, text `var(--text-inverse)` / `#FFFFFF`, 12px, height 28px, pill radius, padding 0 16px
- Sentiment tags: sentiment color at 20% bg, matching sentiment token as text, 12px, height 28px, pill radius, padding 0 16px

### Buttons
- Primary: bg `var(--highlight)`, text `var(--highlight-foreground)`, radius `var(--component-button-radius)`
- Standard height/padding: `var(--component-button-height)` / `var(--component-button-padding-x)`

### Form/Input components
- Height: `var(--component-input-height)`, bg `var(--bg-card)`, border `var(--border-divider)`, radius `var(--component-input-radius)`
- Text: var(--text-regular) 14px; placeholder: var(--text-secondary) 14px
- Focus/hover border: var(--highlight)
- Dropdown icon: 16×16px
- Multi-select tags: bg `var(--bg-control)`, radius 4px
- Error text: `var(--color-danger)`, 14px

### Tables
- Header: bg var(--bg-secondary), border var(--border-divider), text var(--text-secondary) 14px
- Body: bg `var(--bg-card)`, border `var(--border-divider)`, text `var(--text-regular)` 14px

### Cards
- Background: `var(--bg-card)`, border: `var(--border-divider)`, radius: `var(--component-card-radius)`
- Padding/shadow: `var(--component-card-padding)`, `var(--component-card-shadow)`
- Clickable card hover bg: var(--bg-card-hover) (#F3F2FA)

### Floating Surfaces (Select / Popover / DropdownMenu / 图表 tooltip)
Unified spec — only shadow lifts them, NO border:
- radius `var(--component-popover-radius)` · bg `var(--bg-card)` · padding `var(--component-popover-padding)` · gap-2
- shadow: `var(--component-popover-shadow)`
- Implementation class:
  `rounded-[var(--component-popover-radius)] bg-[var(--bg-card)] p-[var(--component-popover-padding)] shadow-[var(--component-popover-shadow)]`
- ECharts tooltip: borderWidth 0 · radius and shadow should derive from chart/theme helpers
- Sheet / Drawer / Dialog use `var(--overlay-scrim)`, `var(--component-modal-radius)`, and `var(--component-modal-shadow)`

### Icon Sizing (small interactive icons)
- Outer clickable wrapper: 16×16px
- Inner lucide icon: 14×14px (size={14})
- Applies to: InfoTooltip · RefreshStatusBadge · 类似行内点击图标

### Tabs / SegmentedSwitcher
- Container: bg `var(--bg-card)`, height 48px, radius 8px, border `var(--border-divider)`
- Active: bg `var(--highlight)`, text `var(--highlight-foreground)`, 16px/500-700, radius 6-20px
- Inactive: bg transparent, text var(--text-regular)
- **Hover (non-active, non-disabled)**:
  - pill 变体 → bg var(--bg-card-hover) + text var(--text-strong)
  - underline 变体 → bg `color-mix(in srgb, var(--text-secondary) 6%, transparent)`
  - Focus 同 hover（可达性）

## shadcn/ui Components

ALWAYS use shadcn/ui components from `@/components/ui/` for standard UI elements (Button, Select, Dialog, Table, Input, etc.). Customize via CSS variables and Tailwind classes, NEVER override component tokens inline.

## Empty State

- Use `EmptyState` from `@/components/shared/EmptyState`
- 5 variants: no-search, no-creation, no-data, processing, error
- 2 sizes: compact (200×130px), standard (400×280px)
- Text: 14px, var(--text-secondary)

## State / Hover conventions

| Scenario | Token |
|---|---|
| Text/icon hover | switch to `var(--text-strong)` or `var(--highlight)` |
| White card / pill hover bg | `var(--bg-card-hover)` (#F3F2FA) |
| Tint hover on container-less surface | `color-mix(in srgb, var(--border-divider) 40%, transparent)` or `... var(--text-secondary) 6%, transparent` |
| Persistent selected bg | `var(--bg-selected)` (#ECEAFD) |
| Focus | mirror hover (keyboard a11y); optional 主色 20% outline |
| Disabled | opacity 50%, cursor not-allowed |

## ECharts v6 compatibility

When a chart uses `yAxis.name` with `nameLocation: 'end'` AND top-positioned legend, MUST disable v6 anti-overlap:
- `yAxis.nameMoveOverlap: false`
- `grid.outerBoundsMode: 'none'` + bump `grid.top` to ≥ 64

Otherwise the chart silently collapses (canvas renders blank). See DESIGN_SYSTEM.md §6.4.

## Don'ts

- NEVER hardcode product UI colors as hex/rgb/rgba/hsl — use semantic theme tokens
- NEVER implement customer themes by editing page styles — add a theme and switch `themeId`
- NEVER hardcode customer brand-related fonts, radius, spacing, shadows, overlays, or component dimensions — use theme tokens
- NEVER hardcode colors in ECharts option or tooltip HTML — use `useChartTheme()` / `useAppTheme()`
- NEVER duplicate shadcn/ui component theme tokens across files
- NEVER use font sizes outside the allowed set
- NEVER use font weights outside 400/500/600/700
- NEVER use non-palette colors for charts
- NEVER skip 24px internal padding on data cards
- NEVER add `border` to floating surfaces (Select/Popover/Dropdown/Chart tooltip) — they rely on shadow only
- NEVER use a different shadow recipe for popups — must be `var(--component-popover-shadow)`

## 4.2 Chart Component Rules

---
description: Chart component library rules — auto-injected when editing UI code that may need charts
globs:
  - "src/**/*.tsx"
---

# 图表组件库使用规范

## 必读索引

需要图表功能时，**先读** `src/components/charts/CATALOG.md` 了解可用组件和 Props。

## 规则

1. **必须从** `@/components/charts` 导入图表组件，**禁止**内联 SVG / CSS 模拟图表
2. **禁止**安装其他图表库（如 recharts、chart.js、visx 等）
3. **禁止**在组件外部直接构建 ECharts option 对象 — 使用预设组件的 Props 传入业务数据
4. 如需高级定制，使用 `optionOverrides` prop 叠加配置
5. 如需全新图表类型，在 `src/components/charts/` 创建新组件并更新 `CATALOG.md`

## 快速查找

| 需求 | 组件 |
|------|------|
| 折线图、趋势线、面积折线 | `ChartLine` |
| 柱状图、条形图、堆叠柱状图 | `ChartBar` |
| 环形图、饼图、占比图 | `ChartDonut` |
| 雷达图、多维评估 | `ChartRadar` |
| 词云、关键词 | `ChartWordCloud` |
| 堆叠面积图、多分类趋势 | `ChartStackedArea` |
| 迷你趋势线（表格/卡片内嵌） | `ChartMiniSparkline` |
| 气泡图、散点图 | `ChartBubble` |
| 漏斗图、转化漏斗 | `ChartFunnel` |
| 桑基图、流向图 | `ChartSankey` |
| 占比图、大号百分比 | `ChartProportion` |
| 流程图、步骤流 | `ChartFlow` |
| 自定义图表（高级） | `EChartsBase` |

## 颜色规范

- 图表配色统一使用 `CHART_COLORS` 11 色序列（来自 DESIGN_SYSTEM.md）
- 双系列折线使用 `DUAL_SERIES_COLORS`（`#6366F1` + `#1E1B39`）
- 取色使用 `getChartColor(index)` 确保循环安全
- **禁止**在图表中硬编码颜色值

## 示例

```tsx
import { ChartLine, ChartDonut } from '@/components/charts';

<ChartLine
  xData={dates}
  series={[{ name: '数值', data: volumes }]}
  showArea
  unit="篇"
/>

<ChartDonut
  data={sentimentData}
  centerText="60%"
/>
```

## SSR 注意

ECharts 必须客户端渲染，所有图表组件已经在 `EChartsBase` 内部 dynamic import，自动跳过 SSR。如果你的页面是 Server Component，确保使用图表的子组件标记为 `'use client'`。

---

# Part 5. 工程约束与代码风格原文

> 这一部分包含原项目约束。导入其他项目时，必须保留其中与 UI、主题、图表、组件、字号、色彩相关的强约束；数据库、API、Git 等非设计项可按目标项目裁剪。

## 5.1 Constraints

# 项目约束规范

> 不可违反的核心约束 + 默认遵守的标准 + 实现层灵活度。

约束分三级：

- **L0 宪法**：不可违反，违反即拒绝合并
- **L1 规范**：默认遵守，特殊情况说明理由后可以例外
- **L2 实现**：自由发挥，不限制具体写法

---

## L0 宪法（不可违反）

### 技术栈版本

版本以 `package.json` 为准，主要锁定：

| 组件 | 版本 |
|---|---|
| Node | ≥ 20.x |
| Next.js | 16.x |
| React | 19.x |
| TypeScript | 5.x（严格模式） |
| Tailwind CSS | 4.x |
| ClickHouse 客户端 | `@clickhouse/client` ≥ 1.x |

### 目录结构（强制）

```
src/
├── app/                   # Next.js App Router
│   ├── api/features/      # 薄查询路由
│   └── ...
├── components/
│   ├── ui/                # shadcn/ui
│   ├── shared/            # 业务共享
│   └── charts/            # 图表组件库
├── hooks/                 # React hooks
├── lib/
│   └── clickhouse/        # 数据访问层（server-only）
├── stores/                # zustand stores
├── types/api/             # TS Type + Zod schema（前后端共用）
└── data/                  # mock 数据
```

### 类型唯一真相源

- 业务模型（DTO / Type / Schema）必须在 `src/types/api/` 定义
- **禁止**在组件内重复定义已有的类型
- 前后端共用同一份 Zod schema

### 数据访问边界

- ClickHouse 访问只能通过 `src/lib/clickhouse/`
- `src/lib/clickhouse/**/*.ts` 文件首行**必须**：`import 'server-only';`
- **禁止**在客户端组件 / 公开 API 暴露 ClickHouse client

### 图表组件

- 所有图表必须从 `@/components/charts` 导入
- **禁止**安装其他图表库（recharts / chart.js / visx 等）
- **禁止**内联 SVG / CSS 模拟图表
- **禁止**在组件外构建 ECharts option（应通过预设组件 Props 传入业务数据）

### API 响应包络（强制）

成功：`{ ok: true; data: T; computed_at: string; data_version?: string }`
失败：`{ ok: false; error: string; details?: unknown }`

详见 `docs/specs/shared/api-standards.md`。

### 设计规范（强制）

- **永远使用 CSS 变量**：`var(--highlight)` 等，**禁止硬编码 hex**
- **字号白名单**：仅允许 12 / 14 / 16 / 18 / 20 / 24 / 26 / 32 / 40px；12px 仅用于标签 / 徽标 / chip，常规文本最小 14px
- **字重白名单**：仅允许 400 / 500 / 600 / 700
- **间距**：8px 网格（4 / 8 / 16 / 24 / 32 / 48）

详见 `DESIGN_SYSTEM.md`。

### 语言约束

- **UI 文案使用中文**（不上 i18n 框架）
- 代码标识符（变量 / 函数 / 组件）**使用英文**
- Commit message subject **使用英文**（Conventional Commits）

> 与 demo_pod 的"全英文 UI"L0 强制不同：本项目面向中国市场，UI 直接中文。

---

## L1 规范（默认遵守）

### 命名规范

| 类型 | 规则 | 示例 |
|---|---|---|
| 组件 / 类名 | PascalCase | `UserProfile` |
| 文件 / 函数 | camelCase | `getUserInfo` |
| 常量 | UPPER_SNAKE | `MAX_RETRY` |
| CSS 类 | kebab-case | `.user-avatar` |
| Hook | use 前缀 | `useAuth` |
| 布尔变量 | is / has / can 前缀 | `isActive` / `hasPermission` |

### 文件后缀

| 类型 | 后缀 |
|---|---|
| React 组件 | `.tsx` |
| TypeScript 类型 / 纯逻辑 | `.ts` |
| CSS Modules | `.module.css` |
| 测试 | `.test.ts` / `.test.tsx` |
| Server Action | `.ts`（顶部 `'use server'`） |

### Git 提交

- 使用 Conventional Commits 格式：`<type>(<scope>): <subject>`
- Subject 使用英文，祈使语气
- 详见 `.cursor/rules/git.md`

### 错误处理

- API 路由统一使用 `error-codes.md` 中定义的错误码
- 不暴露内部错误细节给客户端（开发环境例外）

---

## L2 实现（自由）

### 自由发挥

以下范围内，开发者可自由选择：

- 组件内部状态管理方式（useState / useReducer）
- 样式实现细节（Tailwind utility / CSS Modules / 内联）
- 业务算法实现
- UI 交互细节（动画时长在规范内即可）
- 组件拆分粒度

### 限制

- 不要引入新依赖（如需引入先在 PR 中讨论）
- 不要破坏接口契约（修改 `src/types/api/*` 必须同步契约文档 + 灰度 data_version）
- 不要修改 `feature_*` 表的字段结构（数据团队配合）

---

## 违反后果

| 级别 | 处理 |
|---|---|
| L0 违反 | PR 必须重写后才能合并 |
| L1 违反 | Reviewer 要求修改，特殊情况经讨论可豁免 |
| L2 违反 | 通常无问题（除非偏离合理范围） |

## 5.2 Code Style

# 代码风格

---

## 注释原则

- 注释说明 **"为什么"**，不是"是什么"
- 复杂业务逻辑 / 非显然的取舍 / 历史包袱原因需要注释
- 简单代码不需要注释

```typescript
// ❌ 不好：设置用户状态为 1
user.status = 1;

// ✅ 好：激活用户以允许后续登录操作
user.status = 1;
```

## 函数设计

- 单一职责，合理长度（建议 < 50 行）
- 函数参数不超过 3 个，超过时用对象参数
- 避免深层嵌套（> 3 层考虑提前 return）

## 错误处理

- 提供有意义的错误信息
- 避免暴露敏感内容（数据库连接、密钥、堆栈）
- 使用项目统一的错误码体系（见 `docs/specs/shared/error-codes.md`）
- 生产环境不要把 stack trace 返给客户端

## 命名规范

| 类型 | 规则 | 示例 |
|------|------|------|
| 组件 / 类名 | PascalCase | `UserProfile` |
| 文件 / 函数 | camelCase | `getUserInfo` |
| 常量 | UPPER_SNAKE | `MAX_RETRY` |
| CSS 类 | kebab-case | `.user-avatar` |
| Hook | use 前缀 | `useAuth` |
| 布尔变量 | is / has / can 前缀 | `isActive` / `hasPermission` |
| 文件名 | kebab-case（多词） / camelCase（单词） | `user-profile.tsx` / `Button.tsx`（组件用 PascalCase 文件名也可） |

## TypeScript 风格

- 严格模式（`tsconfig.json` 中 `"strict": true`）
- 优先 `type` 而非 `interface`（除非需要 declaration merging）
- 必要时使用 `unknown` 而非 `any`
- 函数返回值显式类型（特别是导出的函数）
- 联合类型 + 判别字段（`{ ok: true; data } | { ok: false; error }`）

## React 风格

- 优先 Server Components（默认行为）
- 客户端组件明确标 `'use client'` 在文件首行
- 状态尽量上提，避免 prop drilling 用 Context 或 zustand
- `useEffect` 慎用，能用 derived state 就别 effect
- 列表 key 不要用 index，用稳定 ID

## CSS / Tailwind 风格

- 颜色统一 CSS 变量（不要写 `#4F46E5` / `#6366F1` 等产品色）
- 间距用 8px 网格（不要写 `gap-[7px]`）
- 优先 Tailwind utility class，复杂样式用 CSS Modules
- 组件级样式不要污染全局

## 导入顺序

```ts
// 1. 第三方
import { useState } from 'react';
import clsx from 'clsx';

// 2. 项目内
import { Button } from '@/components/ui/button';
import { useFeatureData } from '@/hooks/useFeatureData';

// 3. 类型
import type { RankScorePayload } from '@/types/api/rank-score';

// 4. 样式（如有 CSS Modules）
import styles from './styles.module.css';
```

## 文件后缀

| 类型 | 后缀 |
|------|------|
| React 组件 | `.tsx` |
| TypeScript 类型 / 逻辑 | `.ts` |
| CSS Modules | `.module.css` |
| 测试 | `.test.ts` / `.test.tsx` |
| Server Action | `.ts`（标记 `'use server'`） |

---

# Part 6. 便携迁移参考

> 注意：以下便携迁移参考保留了跨技术栈迁移表达；内联色值已按当前靛蓝 token 归一，旧色值不作为当前权威。

# Design System Spec — Portable

> **版本**：2026-05-19 · v1.1
> **目的**：技术栈无关、单文件、可直接复制的设计系统规范。目标项目无论用 React / Vue / Svelte，无论用 Tailwind / antd / Element / Naive UI / CSS Modules，都可以按此规范实现一致的视觉与交互。
>
> **品牌主色**：靛蓝 `#4F46E5`（可整体替换 CSS 变量值切换品牌色）
> **风格定位**：现代克制 · 数据驱动 · 蓝紫中性色调 · 扁平为主、靠层次而非阴影分层

---

## 0. 复用方式

把本文件放到目标项目根目录（或 `docs/`），跟它一起复制 §14 抽出来的 `design-tokens.css`。然后告诉目标项目的 AI agent：

> "项目里有 `design-system-portable.md` 和 `design-tokens.css`，前者是单一权威设计规范，后者是 CSS 变量。请按规范在本项目当前技术栈上实现等价组件，颜色一律用 `var(--xxx)`，禁止硬编码 hex。"

AI 会按这份规范在它自己的栈上重做组件，**不需要迁移代码**。

### 0.1 规则 vs 色值

| 类型 | 性质 | 跨项目可移植性 |
|---|---|---|
| **规则**（圆角、浮层规格、投影配方、状态机、字号字重白名单、间距网格、组件尺寸） | 视觉与交互的"语法" | **100% 通用，不可妥协** |
| **色值**（具体 hex / 透明度） | 品牌定制 | 按项目可调，但调过后整套同步替换 |

> 如果发现实际项目里的某个组件跟本规范的**规则**部分冲突，应该把组件改对，不是改规范。

---

## 1. 色彩体系

### 1.1 核心色板

| 角色 | 色值 | CSS 变量 | 用途 |
|---|---|---|---|
| **主色 / Highlight** | `#4F46E5` | `--highlight` | 品牌主色、选中、主按钮、链接强调 |
| 主色弱化 | `rgba(79, 70, 229, 0.08)` | `--highlight-light` | chip / tag 弱化背景 |
| 标题色 | `#1E1B39` | `--text-strong` | 页面标题、KPI 数字；6% 用作通用标签 bg |
| 正文色 | `#3D3A56` | `--text-regular` | 默认正文、表格内容 |
| 次文本色 | `#6E6B8A` | `--text-secondary` | 提示、表头、字段说明、图标默认色 |
| 装饰色（bg） | `#EEEEF7` | `--text-decorative` | 未选中 tab 灰底、浮起色块填充（**仅 bg**） |
| 禁用文字色 | `#A5A3B8` | `--text-disabled` | 即将上线灰字、禁用按钮文字、placeholder、pagination 灰态 |
| 分割线色 | `#E4E3F0` | `--border-divider` | 分割线、边框、选中导航底色（靛灰） |
| 页面背景 | `#F7F7FB` | `--bg-primary` | 页面全局底色（中性灰白） |
| 二级背景 | `#EEEEF6` | `--bg-secondary` | 表头、即将上线徽标背景（靛米） |
| **卡片背景** | `#FFFFFF` | `--bg-card` | 卡片、表格行、输入框、浮层底色 |
| **卡片 Hover** | `#F3F2FA` | `--bg-card-hover` | 白底卡片 / pill 按钮 hover 态 |
| 持久选中 | `#ECEAFD` | `--bg-selected` | 多选 / 单选选中态背景 |
| 控件填充 | `#F4F3FA` | `--bg-control` | 表单填充式控件背景 |

### 1.2 指标方向

| 方向 | 色值 | CSS 变量 |
|---|---|---|
| 上升 / 增长 | `#D1595D` | `--color-indicator-up` |
| 下降 / 回落 | `#4A9E63` | `--color-indicator-down` |

### 1.3 图表配色（按顺序使用）

11 色调色板，多系列图表按序取用；辅助背景 5% 透明度，辅助边框 10% 透明度。

| 序号 | 色值 | 名称 | CSS 变量 |
|---|---|---|---|
| 1 | `#6366F1` | 靛蓝（brand） | `--color-chart-1` |
| 2 | `#8E89D6` | 雪青 | `--color-chart-2` |
| 3 | `#6F8FC2` | 钢蓝 | `--color-chart-3` |
| 4 | `#6AA9CF` | 天蓝 | `--color-chart-4` |
| 5 | `#5FB0A6` | 青瓷 | `--color-chart-5` |
| 6 | `#74A883` | 橄榄 | `--color-chart-6` |
| 7 | `#A6BF86` | 薄荷 | `--color-chart-7` |
| 8 | `#D6B46A` | 鸡冠黄 | `--color-chart-8` |
| 9 | `#D68F6C` | 陶土 | `--color-chart-9` |
| 10 | `#C98AA7` | 玫红 | `--color-chart-10` |
| 11 | `#A78BC7` | 紫 | `--color-chart-11` |

双系列图配色：`#6366F1` + `#1E1B39`（chart-1 + 标题色）。

### 1.4 语义颜色（非通用红绿）

| 语义 | bg | 文字 | CSS 变量 |
|---|---|---|---|
| 高风险 | `#D1595D` | `#FFFFFF` | `--color-risk-high` |
| 低风险 | `#6F8FC2` | `#FFFFFF` | `--color-risk-low` |
| 错误提示 | — | `var(--color-danger)` 14px | 错误 / 危险语义，禁止复用 brand 主色 |
| 通知徽标 | `#D1595D` | 白 | `--color-notification-badge` |

### 1.5 情绪色（单一权威源）

情感标签（正面 / 中性 / 负面）统一使用以下 token，组件层禁止用其他色值表达情绪。背景一律 `color-mix(in srgb, <base> 20%, transparent)`。

| 情绪 | 文字 token | 文字色值 | 背景基色 |
|---|---|---|---|
| 正面 | `--color-sentiment-positive` | `#4A9E63` | `--color-indicator-down` (#4A9E63) @ 20% |
| 中性 | `--color-sentiment-neutral` | `#8B91A8` | `--color-sentiment-neutral` (#8B91A8) @ 20% |
| 负面 | `--color-sentiment-negative` | `#D1595D` | `--color-sentiment-negative` (#D1595D) @ 20% |

### 1.6 主色透明度规则

| 透明度 | 用途 |
|---|---|
| 100% | 按钮背景、选中态滑块 |
| 20% | 品牌强调标签背景、情绪/状态标签背景 |
| 10% | 词云核心词品牌背景 |
| 8% | `--highlight-light` 主色弱化背景 |
| 5% | 词云普通词品牌背景 |

---

## 2. 字体排版

### 2.1 字体栈

| 角色 | 字体 | CSS 变量 |
|---|---|---|
| 中文正文 | Inter | `--font-sans` |
| 英文正文 | Roboto（与 Inter 同栈） | `--font-sans` |
| 数据字体 | DIN Alternate | `--font-data` |

```css
--font-sans: "Inter", "Roboto", -apple-system, "PingFang SC", "Helvetica Neue", "Noto Sans SC", Arial, sans-serif;
--font-data: "DIN Alternate", "SF Mono", "Fira Code", "Consolas", monospace;
```

### 2.2 字号 · 字重白名单（违反必拒）

- **字号（px）**：`12 · 14 · 16 · 18 · 20 · 24 · 26 · 32 · 40`
- **字重**：`400（正文）· 500（标签 / 中等强调）· 600（卡片标题）· 700（标题 / KPI / 选中文字）`

### 2.3 平台字号规格

| 场景 | 字号 | 字重 |
|---|---|---|
| 大标题 | 24px | 700 |
| 中标题 | 20px | 700 |
| 小标题 | 18px | 700 |
| 常规标题 | 16px | 700 |
| 正文 | 14px | 400 |
| 标签 / chip | 12px | 400 |

> `12px` 仅用于标签 / 徽标 / chip / 计数徽标等短标签形态。正文、辅助说明、字段名、链接、表格文字、tooltip 内容、表单错误提示、元信息最小 14px。

### 2.4 数据展示专用

| 场景 | 字号 | 字重 | 字体 | 行高 |
|---|---|---|---|---|
| KPI 大数字 | 40px | 700 | DIN Alternate | 48px |
| 指标数字 | 18px | 700 | DIN Alternate | 26px |
| 辅助数字 | 16px | 700 | DIN Alternate | — |

---

## 3. 间距 · 圆角 · 投影

### 3.1 8px 网格

允许的间距值：`4 · 8 · 16 · 24 · 32 · 48 · 64 · 96` px。

数据卡片内边距固定 24px：标题→上/左边框 24、标题→数字 24、标签→数字 16、标签→下/左边框 24。

### 3.2 圆角白名单

| 圆角 | 用途 |
|---|---|
| 4px | 标签 / chip / 小徽标 |
| 6px | SegmentedSwitcher 单项、Action 按钮、筛选 chip |
| 8px | **卡片、输入框、浮层、图表 tooltip、Tabs 容器、数据卡片**（最常用） |
| 16px | 业务大卡片（监控卡片、详情面板、PageHeader 容器、二级背景容器） |
| 999 / pill | 主按钮、风险标签、情绪标签、头像、进度条 |

### 3.3 投影 token

| 场景 | 配方 |
|---|---|
| **浮层 / popup**（统一） | `0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent)` |
| 卡片 hover-lift | `0 4px 16px color-mix(in srgb, #1E1B39 8%, transparent)` + `transform: translateY(-2px)` |
| 抽屉左侧投影 | `-4px 0 24px color-mix(in srgb, var(--text-strong) 8%, transparent)` |
| Input focus ring | `0 0 0 3px var(--highlight-light)` |

> 卡片默认**无投影**，靠 `1px solid var(--border-divider)` 分层。投影是 hover / 浮层场景才出现。

---

## 4. UI 基础组件

### 4.1 Button

| Variant | bg | 文字 | 边框 | 备注 |
|---|---|---|---|---|
| default | `var(--highlight)` | 白 | — | 主操作 |
| outline | transparent | `var(--text-regular)` | `1px solid var(--border-divider)` | 次操作 |
| secondary | `var(--bg-secondary)` | `var(--text-regular)` | — | 弱次操作 |
| ghost | transparent | `var(--text-regular)` | — | hover 显形 |
| destructive | `var(--state-error)` 或 `--highlight` | 白 | — | 危险操作 |
| link | transparent | `var(--highlight)` | — | 文字按钮 |

尺寸：

| Size | 高度 | padding |
|---|---|---|
| xs | 28px | 0 12px |
| sm | 32px | 0 16px |
| default | 40px | 0 24px |
| lg | 48px | 0 32px |
| icon | 40x40px | — |

字号：默认 14px；常规按钮不降到 12px。只有标签式按钮、计数徽标或极短 chip 形态可使用 12px。圆角：8px（除主按钮可用 pill = 40px）。
按压反馈：`active:scale(0.97)`（见 §8.3）。

### 4.2 Badge

短状态徽标，**不可点击**（点击形态请用 Button）。

| Variant | bg | 文字 | 用途 |
|---|---|---|---|
| default | `var(--highlight)` | 白 | 强调态、计数 |
| secondary | `var(--bg-secondary)` | `var(--text-secondary)` | 默认 |
| outline | transparent | `var(--text-secondary)` + `1px solid --border-divider` | 中性 |
| destructive | 风险色实底 | `#FFFFFF` | 风险 / 错误 |
| ghost | transparent | `var(--text-secondary)` | 极简 |

规格：12px 字 · 高度 20-24px · 圆角 4px · padding 0 8px。

### 4.3 Table

| 属性 | 值 |
|---|---|
| 表头背景 | `var(--bg-secondary)` |
| 表头字色 / 字号 / 字重 | `var(--text-secondary)` · 14px · 500 |
| 表格行背景 | `var(--bg-card)` |
| 表格行字色 / 字号 / 字重 | `var(--text-regular)` · 14px · 400 |
| 边框 | `var(--border-divider)` |
| Hover 行 | `var(--bg-card-hover)` |

### 4.4 Tag

| 类型 | bg | 字色 | 字号 | 高度 | 圆角 | 内边距 |
|---|---|---|---|---|---|---|
| 通用标签 | `var(--text-strong)` 6% | `var(--text-secondary)` | 12px | 24px | 4px | 0 8px |
| 分类标签 | `var(--text-strong)` 6% | `var(--text-secondary)` | 12px | 20px | 4px | 0 8px |
| 平台标签（实心） | `var(--text-strong)` | 白 | 12px | 20px | 4px | 0 8px |
| 风险标签 | 风险色实底 | `#FFFFFF` | 12px | 28px | pill | 0 16px |
| 情绪标签 | 情绪基色 20% | 情绪文字 token | 12px | 28px | pill | 0 16px |
| 筛选 chip（命中） | `var(--highlight)` | `var(--highlight-foreground)` | 14px | 32px | 6px | 0 12px |
| 筛选 chip（未命中） | transparent | `var(--text-secondary)` + `1px solid --border-divider` | 14px | 32px | 6px | 0 12px |

### 4.5 Input / Form

| 属性 | 值 |
|---|---|
| 高度 | 40px |
| 背景 | `var(--bg-card)`（搜索框可用 `var(--bg-card-hover)`，筛选下拉用 `var(--bg-control)`） |
| 边框 | `1px solid var(--border-divider)` |
| 圆角 | 8px |
| 文字 / 占位 / 标签 | `var(--text-regular)` 14px / `var(--text-secondary)` 14px / `var(--text-secondary)` 14px |
| 下拉箭头 | 16×16px |
| Focus / Hover 边框 | `var(--highlight)` |
| **Focus 光晕**（见 §8.3） | `box-shadow: 0 0 0 3px var(--highlight-light)` |
| 错误边框 / 错误文字 | `var(--color-danger)` / `var(--color-danger)` 14px |

### 4.6 Skeleton / Separator / Progress

**Skeleton**（占位）：
- bg: `var(--border-divider)` 50% 不透明（或 `var(--bg-secondary)`）
- 圆角：跟随被替代的内容（文字行 4px / 头像 50%）
- 默认带柔和 shimmer 动画（200% bg 渐变循环），可选关闭

**Separator**：
- 颜色：`var(--border-divider)`
- 厚度：1px（vertical 时 height 自适应）

**Progress**（进度条）：
- 高度：6px（默认）/ 8px（强调）
- 背景：`var(--border-divider)`
- 填充：`var(--highlight)`
- 圆角：999 (pill)
- 文字标签（百分比）：`var(--font-data)` 18px / 700 / `--text-strong`，与进度条间距 8px

### 4.7 Tooltip（小型黑色 tooltip · 与浮层区分）

> 这是触发 hover 即出的**轻量提示**，跟 §4.9 浮层是两种形态。
> 用于：图标解释、按钮二级标签、收起状态导航名等场景。

| 属性 | 值 |
|---|---|
| 背景 | `var(--text-strong)` (#1E1B39) |
| 文字 | 白 · 14px |
| 圆角 | 6px |
| 内边距 | 4px 8px |
| 阴影 | `shadow-md` 或同浮层 shadow |
| 箭头 | 同色 fill |
| 延迟 | `delayDuration: 120-200ms` |

### 4.8 Card（数据卡片）

| 属性 | 值 |
|---|---|
| 背景 | `var(--bg-card)` |
| 边框 | `1px solid var(--border-divider)` |
| 圆角 | 8px（小卡）/ 16px（业务大卡 / 详情卡） |
| Hover 背景（可点击卡） | `var(--bg-card-hover)` |
| 可选 hover-lift | 见 §8.3 |
| 数据字号 / 字重 | 40px·700 KPI / 18px·700 指标 / 16px·400 标题 / 12px·400 辅助 |

### 4.9 浮层（Floating Surfaces）

> **关键规范**：所有"从触发点弹出的浮层"共用同一套 token，**仅靠阴影分层、不使用 border**。
> 适用：`Select 下拉` · `Popover` · `DropdownMenu` · `图表 tooltip`。
> 不适用：`Tooltip`（小型 §4.7）· `Sheet`（§4.11）· `Dialog`（§4.10）。

| 属性 | 值 |
|---|---|
| 背景 | `var(--bg-card)` (#FFFFFF) |
| 圆角 | 8px |
| 内边距 | 8px |
| 内部 item 间距 | 8px |
| **阴影** | `0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent)` |
| 边框 | **无** |
| Item hover 背景 | `color-mix(in srgb, var(--border-divider) 40%, transparent)` |
| Item selected 背景 | `var(--bg-selected)` |
| Item 高度 / padding | 36px / 0 12px |

#### Tailwind 实现

```tsx
<div className="rounded-lg bg-[var(--bg-card)] p-2 shadow-[0_4px_12px_0_color-mix(in_srgb,var(--text-secondary)_12%,transparent)]">
```

#### 纯 CSS 实现

```css
.popup-surface {
  background: var(--bg-card);
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent);
}
```

#### ECharts tooltip 实现

```ts
tooltip: {
  borderWidth: 0,
  backgroundColor: '#FFFFFF',         // 字面值，ECharts 对 var() 不稳定
  borderRadius: 8,
  padding: [8, 12],
  textStyle: { color: '#6E6B8A', fontSize: 14 },
  extraCssText: 'box-shadow: 0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent);',
}
```

> `extraCssText` 是注入 tooltip `<div>` 的 CSS 字符串，可放心用 `var()` + `color-mix()`；`backgroundColor` / `borderColor` 这两个字段必须传字面色值。

### 4.10 Dialog（居中模态）

| 属性 | 值 |
|---|---|
| 背景 | `var(--bg-card)` |
| 圆角 | 16px |
| 内边距 | 24px（header / body / footer 各 24） |
| 阴影 | `shadow-lg` 或同浮层 shadow 加强版 |
| 遮罩 | `rgba(0, 0, 0, 0.4)` |
| 关闭按钮 | 右上 16×16 icon，外 32×32 按钮，hover bg `--border-divider` |
| 标题 | 18px / 700 / `--text-strong` |
| 描述 | 14px / 400 / `--text-secondary` |
| 入场动画 | scale + fade-in，200ms `--motion-ease-out` |

### 4.11 Sheet（侧抽屉）

侧滑承载详情或编辑表单。**与浮层是不同形态**，不强加浮层规范。

| 属性 | 值 |
|---|---|
| 背景 | `var(--bg-card)` |
| 宽度 | 380px（标准） / 480px（宽版） |
| 高度 | 100vh |
| 左侧投影 | `-4px 0 24px color-mix(in srgb, var(--text-strong) 8%, transparent)` |
| Header | 16px 上下 padding + 24px 左 padding，底部 `1px solid --border-divider` |
| Header 标题 | 18px / 700 / `--text-strong` |
| Body padding | 24px |
| Body section 间距 | 24px |
| Footer | 16px 24px padding，两个按钮 1:1 平分 |
| 关闭按钮 | 同 Dialog（外 32×32，内 16×16） |
| 遮罩 | `rgba(0, 0, 0, 0.4)` |
| 入场动画 | slide-from-right，200ms `--motion-ease-out` |

### 4.12 Avatar

| 尺寸 | 用途 |
|---|---|
| 28×28 | 导航栏当前用户、列表行 |
| 40×40 | 卡片内账号头像 |
| 56×56 | 详情页大头像、用户菜单展开 |

- 形状：圆形（`border-radius: 50%`）
- Fallback bg：`var(--highlight)`，白字，字重 700
- Fallback 字号：尺寸 × 0.33（如 56 → 18px）
- 默认头像：陶土底 + 白色人形 SVG（参考 Vibe `DefaultUserAvatar`）

### 4.13 图标尺寸约定

| 场景 | 外层可点击区 | 内部图标 | 备注 |
|---|---|---|---|
| 小型行内交互图标（信息提示、刷新状态） | 16×16 | 14×14 | 鼠标命中 ≥16，视觉 14 |
| 表单内联图标（下拉箭头、清除） | — | 16×16 | 直接放图标 |
| 卡片操作按钮 | 36×36 | 16×16 | 与按钮高度对齐 |
| 导航 icon（展开态） | 36 容器 | 18×18 stroke 1.5 | 见 §5.1 |
| 导航 icon（收起态） | 40×40 容器 → 28×28 icon-bg | 18×18 stroke 1.5 | 见 §5.1 |
| 大型 hero icon | — | 24×24 | `size-6` |

### 4.14 SegmentedSwitcher（分段切换器）

容器规格：

| 属性 | sm | md (默认) |
|---|---|---|
| 容器高度 | 40px | 48px |
| 按钮高度 | 32px | 40px |
| 容器内 padding | 4px | 4px |
| 容器圆角 | 8px | 8px |
| 按钮圆角 | 6px | 6px |
| 字号 | 12px | 14px |
| 容器边框 | 无（透明） | 无（透明） |
| 容器背景 | transparent | transparent |

状态机：

| 状态 | pill 变体 bg | underline 变体 bg | 文字色 |
|---|---|---|---|
| 选中 | 滑块（`var(--highlight)`）覆盖 | 底部 2px 下划线 | pill→白 / underline→`var(--highlight)` |
| 默认 | `var(--text-decorative)` (#EEEEF7) | transparent | `var(--text-regular)` |
| **Hover**（非选中、非禁用） | `color-mix(in srgb, var(--text-secondary) 20%, transparent)` (灰 20%) | `color-mix(in srgb, var(--text-secondary) 6%, transparent)` | `var(--text-strong)` |
| Focus（键盘） | 同 Hover | 同 Hover | 同 Hover |
| Disabled | `var(--text-disabled)` (#A5A3B8) | transparent | inactive 色 + 50% opacity |

> 容器本身透明无 border；分层完全靠 pill 按钮的灰底 + 选中滑块的 brand 蓝。

滑块动画：220ms `var(--motion-ease-out)`，跟随选中按钮 transform。

---

## 5. 布局 / 业务组件

### 5.1 左侧导航 (Sidebar)

| 属性 | 值 |
|---|---|
| 展开宽度 | 208px |
| 收起宽度 | 56px |
| 切换动画 | `transition-[width] 200ms` |
| 容器 bg | `var(--bg-primary)` |
| 容器右边框 | `1px solid var(--border-divider)` |
| 容器高度 | 100vh（粘性顶部 `sticky top-0`） |

**品牌区（Brand）**：

| 状态 | 布局 |
|---|---|
| 展开 | logo (28×28) + 租户名 (18px / 700) · padding `pt-5 pb-3 px-4` |
| 收起 | 居中 logo (28×28)，**hover 切换为展开按钮**（同位置） · padding `pt-6 pb-3 px-3` |

**分组标题（GroupLabel · 仅展开）**：

| 属性 | 值 |
|---|---|
| 字号 / 字重 / 字色 | 14px / 400 / `var(--text-secondary)` |
| 行高 | 20px (`leading-5`) |
| 左 padding | 11px |
| 底部间距 | 4px (`mb-1`) |

**导航项（NavItem）**：

| 状态 | 展开 (h-9 = 36px) | 收起 (40×40 容器，内 28×28 icon-bg) |
|---|---|---|
| 默认 | bg transparent · 文字 `var(--text-regular)` | icon-bg transparent · icon 色 `var(--text-strong)` |
| Hover | bg `color-mix(in srgb, var(--border-divider) 40%, transparent)` · 文字 `var(--text-strong)` | icon-bg `var(--border-divider)` |
| **选中** | bg `var(--border-divider)` · 文字 `var(--text-strong)` | icon-bg `var(--border-divider)` · icon 色 `var(--text-strong)` |
| 即将上线 | 文字 `var(--text-decorative)` · hover 无反馈 · cursor not-allowed | icon 色 `var(--text-decorative)` |

- 项圆角：8px (`rounded-lg`)
- icon-bg 圆角（收起态）：6px (`rounded-md`)
- icon 尺寸：18×18，`strokeWidth: 1.5`
- 项 padding：`pl-[11px] pr-2` · gap 8px
- 项之间间距：4px (`space-y-1`)
- 分组之间间距：20px 展开 / 4px 收起
- 「即将上线」徽标：`rounded-sm bg-[var(--bg-secondary)] px-1.5 py-0.5 text-xs text-secondary`
- 收起态 hover 必须有 Tooltip（黑色 §4.7）显示项名

**底部区域**（通知 + 用户菜单）：

- 与导航主区上方 8px gap (`pt-2`)
- 容器 padding：`px-2 pb-6`
- 通知按钮（展开）：h-9 + 图标 18 + 文字"系统消息" + 右侧红色徽标
- 红色徽标：`bg: var(--color-notification-badge)` · 文字白 12px · 高 16 · `rounded-full px-1.5`
- 收起态用红点（小圆）：`size-2` · 右上偏移 -2 · `ring-2 ring-[var(--bg-primary)]`
- 用户菜单按钮（展开）：h-10 + Avatar 28 + 用户名 + 右侧下拉箭头 icon（外 28×28，内 16×16）
- 收起态：单独 Avatar 28×28 + Tooltip

### 5.2 PageHeader（顶部页头）

业务页面顶部区，组合：标题区 + 操作按钮区（+ 可选信号卡 / 子模块）。

| 属性 | 值 |
|---|---|
| 容器 | `var(--bg-card)` + `1px solid var(--border-divider)` + 圆角 **16px** + padding 24px |
| 容器最小高度 | 208px（含信号卡时）/ 88px（仅标题时） |
| 主标题 | 24px / 700 / `var(--text-strong)` |
| 副标题 | 14px / 400 / `var(--text-secondary)` · 标题下 8px |
| 操作按钮组 | 右上对齐，gap 8px |
| 操作按钮单体 | 36×36 · 圆角 8 · `1px solid --border-divider` · bg `var(--bg-card)` · icon 16 strokeWidth 1.75 |
| 标题区与子模块间距 | 24px |

子模块嵌入（如信号卡 / 待办分组）：
- 内容 grid `1.25fr 1fr` 或 `1fr 1fr`，间距 16
- 每个子卡：`var(--bg-primary)` bg + `1px solid --border-divider` + 圆角 16 + padding 16
- 子卡标题：16px / 700 / `--text-strong` + 时间标签 14 / `--text-secondary`

### 5.3 Breadcrumb（面包屑）

| 属性 | 值 |
|---|---|
| 容器 | `var(--bg-card)` + 圆角 16 + padding `0 16px` + 高度 48px |
| 文字 | 14px |
| 当前节点 | `var(--text-strong)` · 字重 500 |
| 历史节点 | `var(--text-secondary)` · 字重 400 |
| 分隔符 | `/` 或 chevron-right (12px)，色 `var(--text-decorative)` |
| 间距 | 节点间 gap 8px |

> **建议**：列表/首页可关闭面包屑（`showBreadcrumb=false`），详情页才显示路径。

### 5.4 通知中心 / 红点徽标

**计数徽标**（展开态导航 / 头部按钮）：
- bg：`var(--color-notification-badge)` (#D1595D)
- 文字：白 12px 字重 500
- 形状：`rounded-full px-1.5` · 高 16px
- 99+：超过 99 显示 `99+`

**红点**（收起态导航 / icon-only）：
- 形状：圆点 8×8
- bg：`var(--highlight)` 或 `--color-notification-badge`
- 位置：触发器右上 -2 偏移
- 外环：`ring-2 ring-[var(--bg-primary)]`（避免贴边突兀）

### 5.5 FilterBar（筛选条）

横向排列的筛选控件组合。

| 控件 | 尺寸 |
|---|---|
| Select 下拉 | 高 40 · 宽 208 · bg `var(--bg-control)` |
| 「高级筛选」按钮 | 高 40 · 宽 280 · bg `var(--bg-control)` · 圆角 8 · 文字+右 ListFilter icon (16, stroke 1.75) |
| 搜索框 | 高 40 · 宽 280 · bg `var(--bg-card-hover)` · 右侧 search icon (16) |
| 控件间距 | 12px |
| 行间距（多行） | 16px |

**命中筛选 chip 行**（高级筛选后展示）：
- 说明文字："高级筛选选中后展示为：" · 14px / `--text-secondary`
- chip：高 24 · 圆角 4 · bg `color-mix(in srgb, var(--border-divider) 50%, transparent)` · 文字 12px / `--text-regular` · padding 0 8
- chip 间距：8px
- 溢出折叠：`+N` chip 表示多余项

### 5.6 FilterDrawer（高级筛选侧抽屉）

继承 §4.11 Sheet 规范，特化字段：

| 属性 | 值 |
|---|---|
| 宽度 | 380px |
| Body 分组间距 | 24px |
| 分组标题 | 16px / 700 / `--text-strong` · 与 chip 区间距 12px |
| 内部筛选 chip | 高 32 · 圆角 6 · 字号 14 · padding 0 12 |
| chip 未选中 | bg transparent · `1px solid --border-divider` · 文字 `--text-secondary` 字重 500 |
| chip 选中 | bg `var(--highlight)` · 边框同 · 文字 `var(--highlight-foreground)` 字重 700 |
| Footer 按钮 | "清空"（outline） + "应用"（primary），1:1 flex，高 40 |

### 5.7 监控卡片（业务大卡）

通用结构：标题区 + 标签行 + 指标行。适配 MentionCard / CommentCard / 等业务变体。

| 属性 | 值 |
|---|---|
| 容器 | `var(--bg-card)` + `1px solid --border-divider` + 圆角 **16px** + padding 24px |
| 顶部内容 vs 状态标签 | `justify-between` + gap 16px |
| 头像 | 40×40 圆形 · bg `var(--highlight)` · 白字字重 700 · 字号 18px |
| 账号名 | 16px / 700 / `--text-strong` |
| 元信息（渠道·时间） | 14px / 400 / `--text-secondary` · 与账号名间距 2px |
| 标题 | 18px / 700 / `--text-strong` · 与头像区间距 12px |
| 摘要正文 | 14px / 400 / `--text-regular` · `line-height: 22px` · 与标题间距 8px |
| 状态标签（右上） | 风险标签 / 情绪标签（参 §4.4） |
| 分类标签行 | 顶部间距 16px · chip 间距 8px |

**MetricRow（指标行）**：

| 属性 | 值 |
|---|---|
| 顶部边框 | `1px solid --border-divider` |
| 顶部 padding | 16px |
| 顶部 margin | 16px |
| 单项 layout | inline-flex · gap 8px · 高度 22 |
| 单项 icon | 18×18 · strokeWidth 1.75 · 色 `--text-secondary` |
| 单项数字 | 14px / `--text-strong` |
| 项间距 | 32px |
| Hover Tooltip | 显示指标全名（如"阅读量"） |

### 5.8 详情页模块

通用 layout：左主区（`1fr`） + 右侧栏（320px），间距 16。

**摘要卡片（SummaryCard）**：
- 同 §5.7 容器规格（圆角 16、padding 24）
- 头部：左侧 sectionIcon + 标题 20px/700；右侧状态标签组（风险 + 情绪）
- 主体：14px/400/`--text-regular`，行高 22px

**Section 标题（详情页内）**：
- layout：`flex justify-between items-center`
- 标题左：sectionIcon (16×16 主色) + 文字 18px/700/`--text-strong` · gap 8
- 右副标题：14px/`--text-secondary`
- 底部：`border-bottom: 1px solid --border-divider` · padding-bottom 16 · margin-bottom 16

**KeyValuePreview**（标签 → 值）：
- layout：`flex justify-between` · 14px
- label：`--text-secondary` · value：`--text-strong`

**InfoBlock**（带 progress 的字段块）：
- 容器：`var(--bg-primary)` bg · 圆角 8 · padding 16（紧凑 12）
- label：14px / `--text-secondary` · 底部 8 间距
- value：DIN Alternate · 14-18px · 字重 400-700 · `--text-strong`
- progress 条：高 6 · 圆角 999 · bg `--border-divider` · fill `--highlight`

**Timeline / 时间轴模块**：
- 节点圆点：8×8 · `--highlight`
- 连线：`1px solid --border-divider`
- 单项 padding 上下 12

### 5.9 SidePanel（侧栏卡片）

详情页右栏的多 section 容器。

| 属性 | 值 |
|---|---|
| 容器 | `var(--bg-card)` + `1px solid --border-divider` + 圆角 **16px** |
| 单 section padding | 24px |
| section 之间 | 第 2 个起加 `border-top: 1px solid --border-divider` |
| section 标题 | 16px / 700 / `--text-strong` · 左侧带 4×16 圆角 2 的 `--highlight` 装饰条 · 与标题文字间距 8px · 与正文间距 16px |
| section 正文 | 14px |

### 5.10 状态标签（业务专用）

**ChannelBadge**（渠道徽标）：实心色块 + 白字，使用 ChannelIcons 套件的品牌色（见 §6.2）。规格同 §4.4 平台标签。

**RankBadge**（等级徽标）：
- S 级：`#1E1B39` 100% bg + 白字
- A / B 级：`#1E1B39` 60% / 30% bg + 白字
- 普通：透明 bg + `--text-secondary` + `1px solid --border-divider`
- 圆点（如有）：8×8，距文字 8

**SentimentTag**（情绪标签）：按 §1.5 token，pill 28×16，padding 0 16，字号 12。

**StatusStripe**（状态条状徽标）：
- 处理中：bg `--color-indicator-down` 20% · 文字 `--color-sentiment-positive`
- 待处理：bg `--highlight` 20% · 文字 `--color-sentiment-negative`
- 已忽略：bg `--text-secondary` 12% · 文字 `--text-secondary`

**RiskTag**（高/中/低风险）：按 §1.4。

---

## 6. 共享工具组件

### 6.1 Icon · lucide-react 包装器

> 项目里通常会有一个 `<Icon icon={...} />` 组件统一图标行为。

约定：

| 属性 | 默认值 |
|---|---|
| 容器尺寸 | 20×20px |
| icon 视觉尺寸 | 16×16（容器内居中） |
| strokeWidth | 1.3（或 1.5 用于导航 icon） |
| 默认颜色 | `var(--text-secondary)` |
| color prop | 接收任意 CSS 颜色 / token 引用 |
| size prop | 默认 20，可传 16 / 24 / 32 |

### 6.2 ChannelIcons · 社媒平台 LOGO

平台徽标库，每个平台有自己的品牌色 + 简化 SVG。

约定：

- 容器：方形或圆形，可传 size（默认 24 / 32 / 40）
- 品牌色：定义在 `CHANNEL_BRAND_COLOR` 字典里，由设计 / 业务确定
- 内部 SVG：白色或品牌色描边
- 卡片展示：`var(--bg-card)` bg + `1px solid --border-divider` + 圆角 8 + padding 12

### 6.3 DefaultUserAvatar（默认头像）

无头像时的兜底 SVG：

- 容器：圆形
- bg：`var(--highlight)`
- 内容：白色人形简化 SVG
- 尺寸：28 / 40 / 56（与 §4.12 Avatar 对齐）

### 6.4 AnimatedNumber · AnimatedProgress

**AnimatedNumber**（数字滚动）：
- 字体：`var(--font-data)` · 字号 40 / 700 / `--text-strong`
- 入场：从 0 滚动到目标值，时长 800-1200ms
- 缓动：`var(--motion-ease-out)`
- 千分位：自动添加

**AnimatedProgress**（进度条动画）：
- 规格同 §4.6 Progress
- 入场：宽度从 0 → target，时长 600ms `var(--motion-ease-out)`

### 6.5 DataPagination

列表分页控件。

| 属性 | 值 |
|---|---|
| 按钮尺寸 | 32×32 |
| 按钮圆角 | 6px |
| 默认 bg / 文字 | transparent / `var(--text-regular)` |
| Hover bg | `color-mix(in srgb, var(--border-divider) 40%, transparent)` |
| 当前页 bg / 文字 | `var(--highlight)` / 白 |
| 当前页字重 | 700 |
| **禁用态**：透明度 1 + 文字 `var(--text-decorative)` + 边框/底色不变（**禁止用 opacity 50% 让边框消失**）|
| 间距 | 4px |
| 省略号 `…` | 不可点击，色 `var(--text-decorative)` |
| 跳转输入 | `<Input>` 高 32 · 宽 56 · 圆角 6 |

### 6.6 InfoTooltip · 帮助提示

行内信息图标 + hover Tooltip。

| 属性 | 值 |
|---|---|
| 外按钮尺寸 | 16×16（命中区） |
| 内部 icon | 14×14 lucide `Info` |
| icon 色 | `var(--text-secondary)` |
| 触发 | hover 触发黑色 Tooltip（§4.7） |
| Tooltip 内容 | 短句解释 14px |

### 6.7 RefreshStatusBadge · 数据刷新状态

显示"距离上次刷新 X 分钟"的小徽标 + 可点击刷新。

| 属性 | 值 |
|---|---|
| 外按钮尺寸 | 16×16 |
| 内部 icon | 14×14 lucide `RefreshCw` |
| icon 色 | `var(--text-secondary)` |
| 刷新中动画 | `animate-spin` (1s linear infinite) |
| 文字 | 14px / `var(--text-secondary)`（"刚刚" / "X 分钟前"） |
| 默认刷新间隔 | 5 分钟 (300_000 ms) |

---

## 7. 图表规范

### 7.1 通用规则

| 属性 | 值 |
|---|---|
| 容器背景 / 边框 | `var(--bg-card)` / `var(--border-divider)` · 圆角 8 · padding 16 |
| 网格线 / 轴线 | `var(--border-divider)` |
| 单系列线条色 | `var(--highlight)` |
| 多系列线条色 | 按 §1.3 配色顺序 |
| 双系列线条色 | 主色 + 标题色 |
| 标题 | `#3D3A56` · 16px · 字重 500 |
| 单位 / 时间文字 | `#6E6B8A` · 14px |
| **Tooltip** | 见 §4.9 浮层规范；文字 `#6E6B8A` 14px，强调数字 `#1E1B39` |
| Legend 位置 | top-right（top 8 / right 12 / itemGap 16 / icon circle 8） |
| 字号统一 | textStyle / legend / axisLabel / tooltip 全部 14px |

### 7.2 折线图基线

- `symbol: 'none'`（不画数据点圆）
- `lineStyle.width: 1.5`
- `tooltip.axisPointer: { type: 'cross', label: { backgroundColor: '#6E6B8A' } }`
- 默认 **不要** 用 `areaStyle` 填充；面积图请用专门的堆叠面积图
- 多线条同名（实线段 + 虚线段拼接预测线）合法，legend 自动按 name 去重
- 双系列默认主色（实线）+ 标题色（实线 / 虚线表预测）

### 7.3 各图表特化

| 图表 | 关键规格 |
|---|---|
| **ChartBar** | 单系列宽 24（垂直）/ stack 自适应；圆角 4 (`[4,4,0,0]`) 或 stack 时不圆 |
| **ChartDonut** | 内圈半径 60% · 中心文字 24px DIN/700/`--text-strong` · legend 偏左排列 itemGap 24 |
| **ChartRadar** | 5-8 维度 · 雷达填充 20% 透明度 · 描边 1.5px |
| **ChartWordCloud** | 字号范围 [14, 26] · rotation 0 · 核心词背景 `--highlight` 10% · 普通词背景 `--highlight` 5% |
| **ChartStackedArea** | `symbol: 'none'` · `lineStyle.width: 1.5` · 渐变填充 10% → 3% |
| **ChartMiniSparkline** | 高 32-40 · 无 axis · 无 legend · 嵌入卡片内联使用 |
| **ChartBubble** | 图例 100% 不透明 · 气泡填充 40% 不透明 |
| **ChartFunnel** | 透明度 100% → 0% 线性递减 · descending 排序 · 文字 14px 居中 |
| **ChartSankey** | 节点宽 20 · 节点间距 8 · 连线跟随源节点 20% 透明度 · 节点文字 14px |
| **ChartProportion** | 最大扇区 48px DIN/700 · 次大 28 · 其余 20 |
| **ChartFlow**（纯 React 非 ECharts） | 节点 hover 高亮 · 连线 stroke `--border-divider` · 当前节点 `--highlight` 边框 |
| **EChartsBase** | 底层基座，**仅在预设组件不满足时使用**；自定 option 必须保留 axis/grid token 一致 |

### 7.4 ECharts v6 兼容注意

ECharts 6 默认开启「轴名/轴标签防重叠 + 防溢出」机制，与"顶部 legend + Y 轴 `nameLocation: 'end'`"组合会触发布局搬运、**可能让绘图区被挤没导致整张图不显示**。

需要在 Y 轴顶部展示 `name`（如"单位（万）"）的图，必须同时：

```ts
yAxis: {
  name: '单位（万）',
  nameLocation: 'end',
  nameGap: 16,
  nameMoveOverlap: false,                              // 关防重叠
  nameTextStyle: { color: '#6E6B8A', fontSize: 14, align: 'left' },
},
grid: { ...themeGrid, top: 64, outerBoundsMode: 'none' },  // 关防溢出 + 抬高 top
```

参考：[Apache ECharts 6 Upgrade Guide — Label Position](https://github.com/apache/echarts-handbook/blob/master/contents/en/basics/release-note/v6-upgrade-guide.md)。

### 7.5 跨技术栈替代

若目标项目不用 ECharts，按以下映射等价实现：

| 图表类型 | Recharts | Chart.js | ApexCharts |
|---|---|---|---|
| 折线 | `<LineChart>` | `LineController` | `area` / `line` |
| 柱状 | `<BarChart>` | `BarController` | `bar` |
| 环形 | `<PieChart>` + innerRadius | `DoughnutController` | `donut` |
| 雷达 | `<RadarChart>` | `RadarController` | `radar` |
| 配色 | 全部按 §1.3 注入主题 | 同 | 同 |
| Tooltip 视觉 | 按 §4.9 定制容器 | 同 | 同 |

---

## 8. 状态 · 交互 · 动效

### 8.1 状态约定

| 状态 | 处理方式 |
|---|---|
| Hover（文字 / icon） | transition 200ms ease，色值切到 `var(--text-strong)` 或 `var(--highlight)` |
| Hover（白底卡片 / pill） | 背景切到 `var(--bg-card-hover)` |
| Hover（半透明 tint，无底色容器） | `color-mix(in srgb, var(--text-secondary) 6%, transparent)` 或 `color-mix(in srgb, var(--border-divider) 40%, transparent)` |
| Selected（持久选中） | `var(--bg-selected)` + 文字 `var(--text-strong)` |
| Active（按下） | 主色加深（约 `#C96A4D`）或 `scale(0.97)`（见 §8.3） |
| Focus（键盘） | 镜像 hover；输入框走 `0 0 0 3px var(--highlight-light)` 光晕 |
| Disabled | opacity 50%，cursor not-allowed |

### 8.2 动效 token

| Token | 值 | 用途 |
|---|---|---|
| `--motion-fast` | 150ms | 微反馈（hover bg、focus ring） |
| `--motion-base` | 250ms | 常规过渡（折叠、滑块、入场） |
| `--motion-slow` | 400ms | 大区块切换 |
| `--motion-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 默认缓出 |
| `--motion-ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | 双向过渡 |

### 8.3 全局动效 utilities

> 这些 utility 应该在目标项目 `globals.css` 里全局注册一次，业务组件直接加 className 即可使用。

#### `.hover-lift` · 卡片悬浮上抬

```css
.hover-lift {
  transition: box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}
.hover-lift:hover {
  box-shadow: 0 4px 16px color-mix(in srgb, #1E1B39 8%, transparent);
  transform: translateY(-2px);
}
```

#### `.animate-fade-in` · 入场淡入

```css
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
.animate-fade-in { animation: fadeIn var(--motion-base) var(--motion-ease-out) both; }
```

#### `.animate-slide-up` · 入场上滑

```css
@keyframes slideUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-slide-up { animation: slideUp var(--motion-base) var(--motion-ease-out) both; }
```

#### 按钮按压反馈

```css
button,
[role="button"] {
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease,
    opacity 0.2s ease,
    transform 0.1s ease;
}
button:active:not(:disabled),
[role="button"]:active:not(:disabled) {
  transform: scale(0.97);
}
```

#### Input focus ring

```css
input:not([type="checkbox"]):not([type="radio"]),
textarea, select {
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}
input:focus, textarea:focus, select:focus {
  border-color: var(--highlight);
  box-shadow: 0 0 0 3px var(--highlight-light);
}
```

#### Scrollbar 细滚动条

```css
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-thumb { background: transparent; border-radius: 3px; }
*:hover::-webkit-scrollbar-thumb { background: var(--border-divider); }
::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--border-divider) 70%, var(--text-secondary));
}
* { scrollbar-width: thin; scrollbar-color: transparent transparent; }
*:hover { scrollbar-color: var(--border-divider) transparent; }
```

#### 减少动效（无障碍）

```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in, .animate-slide-up {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .hover-lift:hover { transform: none !important; }
}
```

---

## 9. 响应式断点

| 断点 | 宽度 | 用途 |
|---|---|---|
| Desktop | > 1024px | 完整布局 |
| Tablet | 768–1024px | 收起右侧栏 |
| Mobile | < 768px | 单列布局、汉堡菜单 |
| Small | < 480px | 极简布局 |

---

## 10. 空状态

### 10.1 变体

| 变体 | 文案 | 场景 |
|---|---|---|
| `no-search` | 暂无搜索内容 | 搜索结果为空 |
| `no-creation` | 您还未开始创作 | 用户无创建内容 |
| `no-data` | 暂无数据 | 数据列表 / 图表无数据 |
| `processing` | 数据整理中 | 异步任务进行中 |
| `error` | 系统出错了 | 服务端错误 |

### 10.2 尺寸

| 尺寸 | 插图区域 | 适用场景 |
|---|---|---|
| `compact` | 200×130px | 卡片内、侧边栏 |
| `standard` | 400×280px | 页面级空状态 |

### 10.3 通用规格

- 文字：14px · `var(--text-secondary)`
- 布局：居中
- 可选底部操作按钮（按 §4.1）

### 10.4 内联空提示（轻量）

不需要插图的轻量空提示（如"暂无重点评论"）：

```css
{
  margin-top: 16px;
  border-radius: 8px;
  border: 1px solid color-mix(in srgb, var(--highlight) 50%, transparent);
  background: color-mix(in srgb, var(--highlight) 5%, transparent);
  padding: 12px 16px;
  color: var(--text-secondary);
  font-size: 14px;
}
```

---

## 11. Do · Don't

### ✅ Do

- 颜色一律 `var(--xxx)`，使用前在 §1 或 §14 找对应 token
- 字号 / 字重严格在白名单内
- 间距用 8px 倍数
- 浮层（Select / Popover / Dropdown / 图表 tooltip）全部按 §4.9 同一套 token，**只靠 shadow 分层**
- 小型黑色 Tooltip（§4.7）与浮层是两种形态，不要混用
- 数据数字一律 DIN Alternate
- 图表配色按 §1.3 顺序，不要随机色
- 标签 6% bg、辅助色 5% bg、辅助色 10% border、情绪 20% bg —— 都用 `color-mix(...)` 实现
- Hover / Focus / Selected 三态都要落，键盘用户优先
- 导航 / 卡片 / 表单尺寸严格按 §5 / §4 表格
- Tailwind 项目：`color-mix()` 写法用 `bg-[color-mix(in_srgb,var(--x)_n%,transparent)]`（下划线代替空格）

### ❌ Don't

- 任何地方硬编码 hex 颜色值（情绪 / 风险 / 文字 / 背景一律 token）
- 字号 / 字重用白名单之外的值
- 数据卡片省略 24px 内边距
- **浮层加 border**——只用 shadow
- **浮层用其他 shadow 配方**——必须 `0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent)`
- 图表用调色板外的色
- 在 ECharts 6 上写 `yAxis.name` + 顶部 legend 不加 `nameMoveOverlap: false` + `outerBoundsMode: 'none'`
- 内联 SVG 模拟图表 / 安装多个图表库
- `<button disabled>` 触发器套 Radix Tooltip——用 `aria-disabled` 替代
- 分页禁用按钮用 opacity 50%（会让边框消失）——直接换 `--text-decorative` 文字色
- 左侧导航的项圆角用 16（必须 8，icon-bg 用 6）
- 业务大卡圆角用 8（必须 16）

---

## 12. AI Agent 工作约束

如目标项目用 AI agent 实施，将以下规则注入到项目的 rules（`.cursor/rules/*.mdc` / `CLAUDE.md` / `AGENTS.md`）：

1. 颜色必须 `var(--xxx)`，违反必拒
2. 字号 / 字重在白名单外必拒
3. 新增组件时，按 §4 / §5 / §6 对应章节实现
4. 图表必须按 §7 规范封装；用 ECharts 时按 §7.4 处理 v6 兼容
5. 浮层 (Select / Popover / Dropdown / 图表 tooltip) 一律按 §4.9
6. 左侧导航 / PageHeader / 卡片层级 按 §5.1 / §5.2 / §5.7
7. 状态机（hover / focus / selected）一律按 §8.1
8. 不引入新依赖必须先在对话中讨论

---

## 13. 给目标项目 AI 的初始 Prompt 模板

```
项目根目录有以下两份文件，请把它们作为 UI 实施的**单一权威来源**：

- design-system-portable.md  ← 完整设计规范（颜色 / 字体 / 间距 / 组件 / 业务布局 / 交互 / 图表 / 动效）
- design-tokens.css           ← CSS 变量定义（直接 @import 即可）

请遵守：
1. 任何颜色一律 var(--xxx)，禁止硬编码 hex
2. 字号 / 字重严格在白名单内
3. 浮层 (Select / Popover / Dropdown / 图表 tooltip) 一律按 §4.9
4. 黑色小 Tooltip (§4.7) 跟浮层是两种形态，不混用
5. Hover / Focus / Selected 三态都要实现
6. 卡片层级：小卡 8 圆角、业务大卡 16 圆角
7. 左侧导航严格按 §5.1（208/56 双宽、项 36 高、icon 18 stroke 1.5、项圆角 8、icon-bg 圆角 6）
8. 图表先看 §7；用 ECharts 时按 §7.4 处理 v6 兼容
9. 全局 utilities（.hover-lift / .animate-fade-in / .animate-slide-up / button press / focus ring）按 §8.3 注册
10. 不引入额外的图表库 / UI 库，除非先在对话中讨论

技术栈：[此处填写目标项目栈，例如 "Vue 3 + Element Plus + ECharts"]
```

---

## 14. CSS 变量定义（直接复制到 `:root`）

```css
:root {
  /* ─── 背景 / 容器层级 ─── */
  --bg-primary: #F7F7FB;
  --bg-secondary: #EEEEF6;
  --bg-card: #FFFFFF;
  --bg-card-hover: #F3F2FA;
  --bg-selected: #ECEAFD;
  --bg-control: #F4F3FA;

  /* ─── 边框 / 分割线 ─── */
  --border-divider: #E4E3F0;

  /* ─── 文字 ─── */
  --text-strong: #1E1B39;
  --text-regular: #3D3A56;
  --text-secondary: #6E6B8A;
  --text-decorative: #EEEEF7;   /* 灰底填充（bg 用） */
  --text-disabled: #A5A3B8;     /* 装饰文字 / 禁用态 */

  /* ─── 品牌 / 主色 ─── */
  --highlight: #4F46E5;
  --highlight-light: rgba(79, 70, 229, 0.08);
  --highlight-rgb: 79, 70, 229;

  /* ─── 通知 / 徽标 ─── */
  --color-notification-badge: #D1595D;

  /* ─── 指标方向 ─── */
  --color-indicator-up: #D1595D;
  --color-indicator-down: #4A9E63;

  /* ─── 风险语义 ─── */
  --color-risk-high: #D1595D;
  --color-risk-low: #6F8FC2;

  /* ─── 情绪文字色（背景 = 各基色 @ 20%） ─── */
  --color-sentiment-positive: #4A9E63;
  --color-sentiment-neutral: #8B91A8;
  --color-sentiment-negative: #D1595D;

  /* ─── 图表 11 色（按序使用） ─── */
  --color-chart-1: #6366F1;
  --color-chart-2: #8E89D6;
  --color-chart-3: #6F8FC2;
  --color-chart-4: #6AA9CF;
  --color-chart-5: #5FB0A6;
  --color-chart-6: #74A883;
  --color-chart-7: #A6BF86;
  --color-chart-8: #D6B46A;
  --color-chart-9: #D68F6C;
  --color-chart-10: #C98AA7;
  --color-chart-11: #A78BC7;

  /* ─── 布局 ─── */
  --container-width: 1440px;
  --side-margin: 24px;

  /* ─── 字体 ─── */
  --font-sans: "Inter", "Roboto", -apple-system, "PingFang SC", "Helvetica Neue", "Noto Sans SC", Arial, sans-serif;
  --font-data: "DIN Alternate", "SF Mono", "Fira Code", "Consolas", monospace;

  /* ─── 动效 ─── */
  --motion-fast: 150ms;
  --motion-base: 250ms;
  --motion-slow: 400ms;
  --motion-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### 14.1 常用 color-mix 一行写法

| 场景 | 写法 |
|---|---|
| 浮层阴影 | `box-shadow: 0 4px 12px color-mix(in srgb, var(--text-secondary) 12%, transparent)` |
| 半透明 hover tint | `background: color-mix(in srgb, var(--border-divider) 40%, transparent)` |
| 弱 hover tint | `background: color-mix(in srgb, var(--text-secondary) 6%, transparent)` |
| 主色弱化背景 | `background: var(--highlight-light)` 或 `color-mix(in srgb, var(--highlight) 8%, transparent)` |
| 标签 6% bg | `background: color-mix(in srgb, var(--text-strong) 6%, transparent)` |
| 情绪 20% bg | `background: color-mix(in srgb, var(--color-sentiment-negative) 20%, transparent)` |
| 风险标签实底 | `background: var(--color-risk-high); color: #FFFFFF` |
| 抽屉左侧阴影 | `box-shadow: -4px 0 24px color-mix(in srgb, var(--text-strong) 8%, transparent)` |

---

## 15. 变更记录

| 日期 | 版本 | 主要变化 |
|---|---|---|
| 2026-05-19 | **v1.1** | 全面补齐：扩充 §4（Badge / Skeleton / Tooltip / Dialog / Sheet / Avatar）；新增 §5 布局/业务组件章节（Sidebar / PageHeader / Breadcrumb / Notification / FilterBar / FilterDrawer / 监控卡片 / 详情页 / SidePanel / 状态标签）；新增 §6 共享工具组件（Icon wrapper / ChannelIcons / DefaultAvatar / AnimatedNumber / AnimatedProgress / DataPagination / InfoTooltip / RefreshStatusBadge）；§7 增加每个图表的特化规格 + 跨技术栈替代；§8 新增全局动效 utilities 完整 CSS（hover-lift / fade-in / slide-up / press / focus ring / scrollbar）；§10 新增内联空提示规范。 |
| 2026-05-19 | v1.0 | 初版。落地浮层统一规范（§4.9）、图标尺寸约定（§4.13）、SegmentedSwitcher 状态机（§4.14）、ECharts v6 兼容（§7.4）、卡片 hover 背景与持久选中 token（§1.1 / §8.1）。 |

---

## 16. 与本规范配套但**不放入本文件**的内容

- 组件源码（React / Vue / Svelte 实现）
- shadcn/ui Tailwind compatibility tokens（HSL 格式 `--background`, `--primary` 等）
- 项目业务相关的设计 token（如品牌 logo、产品 slug）
- 业务术语 / 文案规范
- 业务专用色板（如 stage / module / action 颜色，每个项目自定义）

---

> 本文件是**单一权威设计规范**。任何视觉决策都应回到本文件验证；如果本文件没覆盖到，先在本文件补规范，再写代码——而不是在代码里隐式定义新规则。
