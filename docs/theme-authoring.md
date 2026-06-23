# 主题生成契约（Theme Authoring Contract）

本文件规定「给定一个品牌主色 → 产出一套完整主题」的标准做法。它同时面向人和 AI Coding Agent。

> 单一权威：token 形状以 `src/themes/types.ts` 为准，校验以 `schemas/app-theme.schema.json` 为准，
> 派生规则以本文件 + `scripts/generate-theme.mjs` 为准。

---

## 两条路径

### 路径 A（推荐）：用确定性脚本

只要环境有 Node（≥20.11）：

```bash
npm run theme:new -- "#D97757" --id claude    --name "Claude 珊瑚" --neutral-hue 42 --neutral-chroma 0.65
npm run theme:new -- "#4F46E5" --id indigo    --name "靛蓝"
npm run theme:new -- "#E5484D" --id rose      --name "玫瑰红" --description "热情、醒目，适合营销与活动平台。"
```

可选参数：

- `--neutral-hue <0-360>`：中性色相。默认跟随品牌色相（背景/文字带一点品牌倾向）。设为某个固定值可解耦。
- `--neutral-chroma <0-1>`：中性饱和度系数。`0` = 纯灰中性，`1`（默认）= 带品牌色倾向的中性。
- `--stdout`：只打印不写文件。

脚本输出 `src/themes/<id>.ts`，之后在 `src/themes/registry.ts` 注册即可（见末尾「注册」）。

### 路径 B：AI 手写（无 Node 环境，或要更细的人工微调）

让 AI 严格按下方「派生规则」产出一个满足 `schemas/app-theme.schema.json` 的对象，再写成 `src/themes/<id>.ts`。

---

## 派生规则（脚本与 AI 必须一致）

把 token 分成三类：

### 1. 品牌派生（随主色变化）

| token | 规则 |
| --- | --- |
| `brand.primary` | = 输入主色 |
| `brand.hover` | 主色 **L−6、S×0.85**（变暗的同时略降饱和，避免发"荧光"） |
| `brand.active` | 主色 **L−17、S×0.72** |
| `brand.foreground` | 主色相对亮度 > 0.45 用深色 `#1E1B39`，否则反白 `#FFFFFF` |
| `brand.light` | `rgba(r, g, b, 0.08)` |
| `brand.rgb` | `r, g, b` |
| `link.default` / `link.hover` | = `brand.primary` / `brand.hover` |
| `shadcn.primary` / `shadcn.ring` | = 主色转 `H S% L%` |

### 2. 中性派生（带品牌色相的克制灰白）

所有背景/文字/分隔线统一用 **品牌色相**（或 `--neutral-hue`），只固定一组 S/L 梯度，复刻"克制中式数据平台"的质感：

| token | S% | L% |
| --- | --- | --- |
| `background.primary` | 33 | 98 |
| `background.secondary` | 24 | 95 |
| `background.cardHover` / `control` / `text.decorative` | 33 | 96 |
| `background.selected` | 75 | 96（品牌倾向更明显） |
| `border.divider` | 21 | 92 |
| `text.strong` | 36 | 16 |
| `text.regular` | 19 | 28 |
| `text.secondary` | 12 | 48 |
| `text.disabled` | 12 | 68 |

`background.card` 恒为 `#FFFFFF`，`text.inverse` 恒为 `#FFFFFF`。
shadcn 浅中性：`secondary/muted/accent` = `H 31% 95%`，`border/input` = `H 31% 92%`。

### 3. 固定不变（与品牌无关）

**语义色绝不能随品牌色变**，否则"红=危险、绿=成功"的认知会被破坏：

- `status` / `risk` / `sentiment` / `indicator` / `notification`：固定低饱和红绿金蓝
  （`#D1595D` 红、`#4A9E63` 绿、`#D6A84A` 金、`#6F8FC2` 蓝、`#8B91A8` 中性）。
- `accent`：固定装饰色。
- `typography` / `radius` / `spacing` / `shadow` / `overlay` / `component`：结构 token，全部沿用母板。

### 4. 图表多色板（`chart`，11 色）

**固定高质量母板 + 品牌色相旋转**，这是避免"AI 感"的关键，不要从主色凭空生成：

1. 母板（已调好的低饱和、跨色相、和谐 11 色）：

   ```
   #6366F1 #8E89D6 #6F8FC2 #6AA9CF #5FB0A6 #74A883
   #A6BF86 #D6B46A #D68F6C #C98AA7 #A78BC7
   ```

2. 计算 `hueShift = 品牌色相 − 母板第一色色相`。
3. 把母板每个颜色的色相整体旋转 `hueShift`，**保持各自的 S 和 L 不变**。

这样色板的相对色相间距、低饱和质感被完整保留，只是整体转向品牌色系。

---

## 给 AI 的可直接粘贴提示词

```
你在为 Vibe 设计系统生成一套新主题。

输入：品牌主色 = <在此填 #RRGGBB>；主题 id = <kebab-case>；主题名 = <名称>。

请严格遵循 docs/theme-authoring.md 的「派生规则」：
1. 品牌派生：hover = 主色 L−6 S×0.85；active = 主色 L−17 S×0.72；foreground 按相对亮度
   0.45 阈值选深色 #1E1B39 或反白 #FFFFFF；light = rgba(r,g,b,0.08)；rgb = "r, g, b"。
2. 中性派生：背景/文字/分隔线统一用品牌色相，S/L 用文档给定的梯度表。
3. 语义色（status/risk/sentiment/indicator/notification）、accent、以及所有结构 token
   （typography/radius/spacing/shadow/overlay/component）保持文档中的固定值，绝不随品牌色改变。
4. chart：取文档母板 11 色，整体色相旋转 (品牌色相 − 母板第一色色相)，保持各色 S/L 不变。

输出一个满足 schemas/app-theme.schema.json 的 JSON 对象（不要多余字段），
然后据此生成 src/themes/<id>.ts（参考 src/themes/default.ts 的写法）。
```

---

## 注册

生成主题文件后，在 `src/themes/registry.ts` 注册：

```ts
import { roseTheme } from './rose';

export const themes = {
  default: defaultTheme,
  'tech-blue': techBlueTheme,
  'jade-green': jadeGreenTheme,
  rose: roseTheme, // 新增
};

export const themeList = [defaultTheme, techBlueTheme, jadeGreenTheme, roseTheme];
```

要把某主题设为默认导出的静态 token：改 `DEFAULT_THEME_ID`，并跑 `npm run tokens:build` 重新生成 `design-tokens.css`。

之后运行 `npm run dev`，在 `/dev/preview` 切换查看。
