# Vibe 设计系统套件

[English](./README.md) · **简体中文**

[![CI](https://github.com/LeonAgents/vibe-design-system-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/LeonAgents/vibe-design-system-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> **给 AI 一个品牌色，收获一整套不像 "AI 做的" 的设计系统。**

一套可移植、对 AI 友好的设计系统，专为用 Cursor / Claude Code / Codex **vibecoding 的 ToB Web 产品**打造。把它放进项目，AI 从第一行代码起就遵守统一规范——告别"AI 紫、图标不统一、卡片不规范、正文 12px"的千篇一律界面。

你只给它**一个品牌主色**，它就派生出一整套自洽的主题：品牌色阶、暖/冷中性色、11 色图表板、shadcn/ui 桥接 token——并由机器可读的 Agent 规则强制约束，让每一屏都"在系统内"。

> 本仓库的默认主题 **Claude 珊瑚 `#D97757`** 本身就是用这套机制、由一个品牌色派生出来的——你看到的就是它的产出。

![设计系统预览](docs/images/preview-default.png)

同一套系统，仅换一个品牌色就完全变样——Claude 珊瑚（默认）、靛蓝、科技蓝：

| `default` Claude `#D97757` | `indigo` 靛蓝 `#4F46E5` | `tech-blue` 科技蓝 `#1769AA` |
| --- | --- | --- |
| ![Claude 珊瑚](docs/images/preview-default-hero.png) | ![靛蓝](docs/images/preview-indigo.png) | ![科技蓝](docs/images/preview-tech-blue.png) |

---

## 为什么需要它

用 AI 写 ToB 前端，真正费人的不是写不出来，而是写出来之后：

- **每个新页面都在重复纠正同一批毛病。** 又是紫色渐变、又是 emoji 当图标、又是 12px 的正文——这页刚改完，下一页 AI 接着犯。
- **一眼就被看出是"AI 糊的"。** 千篇一律的 AI 紫、居中大标题、圆角大卡片，这种廉价感在交付给客户或老板时，悄悄拉低整个产品的可信度。
- **项目一变大就走样。** 没有统一规范，颜色、间距、圆角各写各的；页面越多、协作的人越多，越花越乱。
- **换个客户就得返工。** 想把品牌色从 A 换成 B，得在几十个文件里手动找替换，费时还容易漏。

这套套件把"设计品味"沉淀成 AI 能读懂、能遵守的规范，从根上解决这些问题。

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
