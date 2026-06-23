# 终结「AI 味」：写给 Vibe Coder 的设计系统

> 别再让 AI 生成辣眼睛的界面。一套专为 AI 提示词优化的 `DESIGN_SYSTEM.md` 规范与组件库。

[English](./README.md) · **简体中文**

[![CI](https://github.com/LeonAgents/vibe-design-system-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/LeonAgents/vibe-design-system-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

![设计系统预览](docs/images/preview-default.png)

同一套系统，仅换一个品牌色就完全变样——Claude 珊瑚（默认）、靛蓝、科技蓝：

| `default` Claude `#D97757` | `indigo` 靛蓝 `#4F46E5` | `tech-blue` 科技蓝 `#1769AA` |
| --- | --- | --- |
| ![Claude 珊瑚](docs/images/preview-default-hero.png) | ![靛蓝](docs/images/preview-indigo.png) | ![科技蓝](docs/images/preview-tech-blue.png) |

---

## 起因：AI 写的前端，总差一口气

我在 vibe coding 的过程里，反复撞上同一个前端问题：**AI 生成的页面普遍偏丑，而且你越不约束它，那股「AI 味」越重。** 一眼假的界面背后，是一堆很基础、却反复出现的 UI 毛病：

- **布局乱** —— 元素胡乱堆叠，没有清晰的分区与对齐。
- **没有排版，全是文案堆砌** —— 信息一坨坨平铺，没有层级、留白和节奏。
- **正文字号偏小** —— 动不动就 12px，长时间阅读很累。
- **配色不统一** —— 同一个产品里颜色各写各的，红绿蓝乱入。
- **主色与辅助色搭配不合理** —— 要么撞色，要么就是那股标志性的「AI 紫」。
- **组件不复用** —— 同一类图表在好几个页面各画一遍，样式还各不一样。

根因不是 AI「不会」，而是**没人给它一套它能读懂、能遵守的规范**。这个套件就是那套规范。

## 它怎么解决

把"设计品味"写成 AI 能读懂、能强制遵守的东西——一份人读规范 `DESIGN_SYSTEM.md` + 机器规则 `AGENT_RULES.mdc` + 一套设计 token 与组件。放进项目，AI 从第一行代码起就"在系统内"：用 token、排版有层级、字号达标、配色统一、相同图表复用同一个组件。

而且**换肤只需一个品牌色**——你给一个主色，它就派生出整套自洽主题：品牌色阶、暖/冷中性色、11 色图表板、shadcn/ui token。

> 本仓库默认主题 **Claude 珊瑚 `#D97757`** 就是用这套机制、由一个品牌色派生出来的——你看到的就是它的产出。

---

## 它给你什么

- 🎨 **一条命令换肤** —— `npm run theme:new -- "#你的色"`，自动算出色阶、中性色、图表板、shadcn token。换客户、换品牌，几秒搞定。
- 🤖 **给 AI 装上设计规范** —— `AGENT_RULES.mdc` 让 Cursor / Claude Code 从第一句 prompt 起就用 token、不硬编码、不跑偏。
- 🚫 **拒绝 "AI 感" 配色** —— 图表多色板不是算法瞎凑的，而是手工调好的和谐母板（详见下文）。
- 🧱 **开箱即用的参考实现** —— Next.js + React + Tailwind + shadcn/ui，含 13 个图表组件和一个完整预览页。
- 🛡️ **自动护栏** —— `npm run lint` 会扫出硬编码颜色、`text-white` 等违规，CI 里直接卡住，规范不靠自觉。
- 📦 **零依赖、可移植** —— 核心是文档 + token + 规则，任何框架都能用最小集合接入。

---

## 快速开始

```bash
# 1. 安装并启动预览（开箱即用，无需额外参数）
npm install
npm run dev
# 打开 http://localhost:3000/dev/preview —— 顶部可一键切换主题
```

### 换成你的品牌色（30 秒）

```bash
# 2. 用一个品牌色生成主题
npm run theme:new -- "#E5484D" --id rose --name "玫瑰红"

# 3. 在 src/themes/registry.ts 注册（加进 themes 和 themeList），刷新预览页即可看到
```

就这两步。生成器会从这一个颜色派生出：

- **品牌色阶**：`primary / hover / active`、自动对比的前景色、`light`、`rgb`；
- **中性色**：背景 / 文字 / 边框都带一点品牌色相倾向；
- **图表板**：11 个和谐的低饱和色；
- **shadcn/ui token**：`H S% L%` 三元组，完整兼容 shadcn。

> 没有 Node 环境？把品牌色连同 [`docs/theme-authoring.md`](./docs/theme-authoring.md) 交给你的 AI agent——规则一致，并可用 [`schemas/app-theme.schema.json`](./schemas/app-theme.schema.json) 校验输出。

### 接入你的项目（按需选最小路径）

```
只需要设计数值（任意框架）？
  └─ 复制 design-tokens.css，直接用里面的 CSS 变量。完成。

用 React + Tailwind + shadcn/ui？
  └─ 复制 src/themes/（token 契约 + registry），接上 ThemeContext，
     并把 AGENT_RULES.mdc 加入你的 agent 规则目录。

想要全套（图表、预览、共享组件）？
  └─ 把本仓库当模板，整体迁移 src/。
```

**无论哪条路径，都把 `AGENT_RULES.mdc` + `DESIGN_SYSTEM.md` 放进 AI 的规则目录**——这是让 AI"在系统内"写代码的关键。

---

## 拒绝 "AI 感" 配色

最容易暴露"AI 做的"的，就是那套刺眼、不协调的图表配色。

本套件的图表色板**不是从主色凭空算的**，而是以一组**手工调好的、低饱和、跨色相的 11 色母板**为基础，整体**旋转到你的品牌色相**，同时保持每个颜色的饱和度与明度——设计师调好的和谐关系被完整保留。换任何品牌色，色板都协调耐看。

语义色（成功 / 警告 / 危险 / 风险 / 情感）则**刻意固定**：无论品牌色是什么，红永远代表危险、绿永远代表成功。

---

## 包含内容

| 路径 | 说明 |
| --- | --- |
| `DESIGN_SYSTEM.md` | 唯一人读规范（色彩、排版、组件、图表、Agent 规则、工程约束）。 |
| `AGENT_RULES.mdc` | 给 Cursor / AI agent 的机器规则，复制到 agent 规则目录即可。 |
| `design-tokens.css` | 默认主题的纯 CSS 变量——**自动生成**，框架无关。 |
| `docs/theme-authoring.md` | 「一个品牌色 → 整套主题」的契约（脚本 + AI 两条路径）。 |
| `schemas/app-theme.schema.json` | 主题的 JSON Schema，用于校验 AI 生成的主题。 |
| `scripts/generate-theme.mjs` | 零依赖主题生成器。 |
| `src/` | Next.js + React + Tailwind + shadcn/ui 参考实现，以及 `/dev/preview` 预览页。 |

---

## 技术栈与命令

Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui · TypeScript · ECharts 6。
需要 Node ≥ 20.11（`npm run tokens:build` 用到 Node 类型擦除，需 Node ≥ 22.6）。

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动预览页 `http://localhost:3000/dev/preview`。 |
| `npm run theme:new -- "#hex" --id <id> --name <名称>` | 从品牌色生成主题。 |
| `npm run tokens:build` | 由默认主题重新生成 `design-tokens.css`。 |
| `npm run theme:check` | 扫描源码中的硬编码颜色 / 不规范样式。 |
| `npm run lint` / `npm run typecheck` | ESLint（含 token 扫描）/ TypeScript。 |

**自动护栏**：`npm run lint` 会运行 token 扫描（`scripts/check-theme-tokens.mjs`），对硬编码产品色、`text-white`、旧版遮罩、旧版浮层阴影直接报错——确保 AI 生成的代码始终在系统内。

---

## 一键部署

把预览页一键部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LeonAgents/vibe-design-system-kit)

## 参与贡献

欢迎 issue 与 PR，详见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

## 许可

[MIT](./LICENSE) © LeonAgents
