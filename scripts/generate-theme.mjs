#!/usr/bin/env node
/**
 * generate-theme.mjs — 从一个品牌主色派生一套完整主题。
 *
 * 设计原则：
 * - 结构 token（排版 / 圆角 / 间距 / 阴影 / 组件尺寸）与品牌色无关，直接沿用母板。
 * - 语义色（success / warning / danger / info / risk / sentiment / indicator）与品牌色无关，
 *   保持固定，确保"红=危险、绿=成功"的认知不被换色破坏。
 * - 仅"和品牌相关的颜色"才派生：品牌色阶、带品牌色相的中性背景/文字、图表多色板、shadcn 桥接。
 * - 图表多色板采用"固定高质量母板 + 品牌色相旋转"：保留母板调好的低饱和、和谐的色相间距，
 *   整体旋转到品牌色相，避免简单算法生成的"AI 感"。
 *
 * 用法：
 *   node scripts/generate-theme.mjs <brandHex> --id <id> --name <名称> [--description <描述>]
 *                                   [--neutral-hue <0-360>] [--neutral-chroma <0-1>] [--stdout]
 *
 * 示例：
 *   node scripts/generate-theme.mjs "#4F46E5" --id default --name "靛蓝"
 *   node scripts/generate-theme.mjs "#E5484D" --id rose --name "玫瑰红"
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

/* ----------------------------------------------------------------------------
 * 色彩工具（零依赖）
 * -------------------------------------------------------------------------- */

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function round(n, digits = 0) {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

function parseHex(hex) {
  let h = hex.trim().replace(/^#/, '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) {
    throw new Error(`无法解析颜色：${hex}（请使用 #RRGGBB 或 #RGB）`);
  }
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function toHex({ r, g, b }) {
  const c = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

function rgbToHsl({ r, g, b }) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  const d = max - min;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: s * 100, l: l * 100 };
}

function hslToRgb({ h, s, l }) {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hp >= 0 && hp < 1) [r, g, b] = [c, x, 0];
  else if (hp < 2) [r, g, b] = [x, c, 0];
  else if (hp < 3) [r, g, b] = [0, c, x];
  else if (hp < 4) [r, g, b] = [0, x, c];
  else if (hp < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const m = ln - c / 2;
  return { r: (r + m) * 255, g: (g + m) * 255, b: (b + m) * 255 };
}

function hexToHsl(hex) {
  return rgbToHsl(parseHex(hex));
}

function hslToHex(h, s, l) {
  return toHex(hslToRgb({ h, s, l }));
}

/** 相对亮度（WCAG），用于决定前景文字用深色还是反白 */
function relativeLuminance({ r, g, b }) {
  const f = (v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** "H S% L%" —— shadcn / Tailwind 使用的 HSL 字符串格式 */
function toShadcn(hex) {
  const { h, s, l } = hexToHsl(hex);
  return `${round(h)} ${round(s)}% ${round(l)}%`;
}

/* ----------------------------------------------------------------------------
 * 母板：结构 + 语义色（与品牌无关，保持固定）
 * -------------------------------------------------------------------------- */

// 图表母板：调好的低饱和、跨色相、和谐的 11 色。换色时整体按色相旋转。
const CHART_MASTER = [
  '#6366F1', '#8E89D6', '#6F8FC2', '#6AA9CF', '#5FB0A6', '#74A883',
  '#A6BF86', '#D6B46A', '#D68F6C', '#C98AA7', '#A78BC7',
];

// 中性色阶梯：以品牌色相为基底（可被 --neutral-hue / --neutral-chroma 覆盖），
// 仅 S / L 固定，复刻母板"带品牌色相的克制中性灰白"质感。
const NEUTRAL_LADDER = {
  bgPrimary:    { s: 33, l: 98 },
  bgSecondary:  { s: 24, l: 95 },
  bgCardHover:  { s: 33, l: 96 },
  bgSelected:   { s: 75, l: 96 }, // 选中态带更明显的品牌色倾向
  bgControl:    { s: 33, l: 96 },
  divider:      { s: 21, l: 92 },
  textStrong:   { s: 36, l: 16 },
  textRegular:  { s: 19, l: 28 },
  textSecondary:{ s: 12, l: 48 },
  textDecorative:{ s: 33, l: 96 },
  textDisabled: { s: 12, l: 68 },
  // shadcn 浅中性
  shSecondary:  { s: 31, l: 95 },
  shSecondaryFg:{ s: 19, l: 28 },
  shMutedFg:    { s: 12, l: 48 },
  shBorder:     { s: 31, l: 92 },
};

// 品牌色阶：变暗的同时略微降饱和，避免深色发"荧光"，复刻手工调色的柔和质感。
const BRAND_HOVER_DL = -6;
const BRAND_HOVER_DS = 0.85;
const BRAND_ACTIVE_DL = -17;
const BRAND_ACTIVE_DS = 0.72;

// 与品牌无关、固定的部分（语义色 + 结构 token），直接来自当前权威母板。
const FIXED = {
  notification: { badge: '#D1595D' },
  indicator: { up: '#D1595D', down: '#4A9E63' },
  risk: { high: '#D1595D', medium: '#D6A84A', low: '#6F8FC2' },
  status: { success: '#4A9E63', warning: '#D6A84A', danger: '#D1595D', info: '#6F8FC2' },
  sentiment: { positive: '#4A9E63', neutral: '#8B91A8', negative: '#D1595D' },
  accent: { one: '#D6B46A', two: '#D68F6C', premium: '#74A883', standard: '#6AA9CF' },
  typography: {
    fontSans: '"Inter", "Roboto", -apple-system, "PingFang SC", "Helvetica Neue", "Noto Sans SC", Arial, sans-serif',
    fontDisplay: '"Inter", "Roboto", -apple-system, "PingFang SC", "Helvetica Neue", "Noto Sans SC", Arial, sans-serif',
    fontData: '"DIN Alternate", "SF Mono", "Fira Code", Consolas, monospace',
    bodyFontSize: '14px',
    bodyLineHeight: '1.75',
  },
  radius: { xs: '4px', sm: '6px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
  spacing: {
    xxs: '2px', xs: '4px', sm: '8px', md: '12px', base: '16px', lg: '24px',
    xl: '32px', xxl: '48px', section: '64px', pageX: '24px', cardPadding: '24px',
  },
  overlay: { scrim: 'rgba(30, 27, 57, 0.5)' },
  link: { muted: '#6E6B8A', legal: '#6F8FC2' },
  component: {
    button: { radius: '8px', height: '40px', paddingX: '16px' },
    card: {
      radius: '16px', padding: '24px', shadow: 'none',
      hoverShadow: '0 4px 16px color-mix(in srgb, #1E1B39 8%, transparent)',
    },
    input: { radius: '8px', height: '40px' },
    popover: { radius: '12px', padding: '8px', shadow: '0 4px 12px color-mix(in srgb, #6E6B8A 12%, transparent)' },
    modal: { radius: '16px', shadow: '0 24px 72px color-mix(in srgb, #1E1B39 18%, transparent)' },
  },
  shadow: {
    none: 'none',
    card: 'none',
    cardHover: '0 4px 16px color-mix(in srgb, #1E1B39 8%, transparent)',
    popover: '0 4px 12px color-mix(in srgb, #6E6B8A 12%, transparent)',
    modal: '0 24px 72px color-mix(in srgb, #1E1B39 18%, transparent)',
  },
};

/* ----------------------------------------------------------------------------
 * 派生
 * -------------------------------------------------------------------------- */

function deriveTheme({ brand, id, name, description, neutralHue, neutralChroma }) {
  const brandRgb = parseHex(brand);
  const brandHsl = rgbToHsl(brandRgb);
  const nHue = neutralHue ?? brandHsl.h;
  const nChroma = neutralChroma ?? 1;

  const neutral = (key) => {
    const { s, l } = NEUTRAL_LADDER[key];
    return hslToHex(nHue, s * nChroma, l);
  };

  // 品牌色阶
  const brandPrimary = toHex(brandRgb);
  const brandHover = hslToHex(brandHsl.h, brandHsl.s * BRAND_HOVER_DS, clamp(brandHsl.l + BRAND_HOVER_DL, 0, 100));
  const brandActive = hslToHex(brandHsl.h, brandHsl.s * BRAND_ACTIVE_DS, clamp(brandHsl.l + BRAND_ACTIVE_DL, 0, 100));
  const brandFg = relativeLuminance(brandRgb) > 0.45 ? '#1E1B39' : '#FFFFFF';
  const brandLight = `rgba(${brandRgb.r}, ${brandRgb.g}, ${brandRgb.b}, 0.08)`;
  const brandRgbStr = `${brandRgb.r}, ${brandRgb.g}, ${brandRgb.b}`;

  // 图表：固定母板按品牌色相旋转
  const masterHue0 = hexToHsl(CHART_MASTER[0]).h;
  const hueShift = brandHsl.h - masterHue0;
  const chart = CHART_MASTER.map((hex) => {
    const { h, s, l } = hexToHsl(hex);
    return hslToHex(h + hueShift, s, l);
  });

  const textStrong = neutral('textStrong');
  const textSecondary = neutral('textSecondary');

  const tokens = {
    background: {
      primary: neutral('bgPrimary'),
      secondary: neutral('bgSecondary'),
      card: '#FFFFFF',
      cardHover: neutral('bgCardHover'),
      selected: neutral('bgSelected'),
      control: neutral('bgControl'),
    },
    border: { divider: neutral('divider') },
    text: {
      strong: textStrong,
      regular: neutral('textRegular'),
      secondary: textSecondary,
      decorative: neutral('textDecorative'),
      disabled: neutral('textDisabled'),
      inverse: '#FFFFFF',
    },
    brand: {
      primary: brandPrimary,
      hover: brandHover,
      active: brandActive,
      foreground: brandFg,
      light: brandLight,
      rgb: brandRgbStr,
    },
    notification: { ...FIXED.notification },
    indicator: { ...FIXED.indicator },
    risk: { ...FIXED.risk },
    status: { ...FIXED.status },
    sentiment: { ...FIXED.sentiment },
    chart,
    typography: { ...FIXED.typography },
    radius: { ...FIXED.radius },
    spacing: { ...FIXED.spacing },
    shadow: { ...FIXED.shadow },
    overlay: { ...FIXED.overlay },
    link: {
      default: brandPrimary,
      hover: brandHover,
      muted: FIXED.link.muted,
      legal: FIXED.link.legal,
    },
    accent: { ...FIXED.accent },
    component: JSON.parse(JSON.stringify(FIXED.component)),
    shadcn: {
      background: toShadcn(neutral('bgPrimary')),
      foreground: toShadcn(textStrong),
      card: toShadcn(neutral('bgPrimary')),
      cardForeground: toShadcn(textStrong),
      popover: '0 0% 100%',
      popoverForeground: toShadcn(textStrong),
      primary: toShadcn(brandPrimary),
      primaryForeground: brandFg === '#FFFFFF' ? '0 0% 100%' : toShadcn(brandFg),
      secondary: `${round(nHue)} ${round(NEUTRAL_LADDER.shSecondary.s * nChroma)}% ${NEUTRAL_LADDER.shSecondary.l}%`,
      secondaryForeground: toShadcn(neutral('shSecondaryFg')),
      muted: `${round(nHue)} ${round(NEUTRAL_LADDER.shSecondary.s * nChroma)}% ${NEUTRAL_LADDER.shSecondary.l}%`,
      mutedForeground: toShadcn(neutral('shMutedFg')),
      accent: `${round(nHue)} ${round(NEUTRAL_LADDER.shSecondary.s * nChroma)}% ${NEUTRAL_LADDER.shSecondary.l}%`,
      accentForeground: toShadcn(textStrong),
      destructive: toShadcn(FIXED.status.danger),
      destructiveForeground: '0 0% 100%',
      border: `${round(nHue)} ${round(NEUTRAL_LADDER.shBorder.s * nChroma)}% ${NEUTRAL_LADDER.shBorder.l}%`,
      input: `${round(nHue)} ${round(NEUTRAL_LADDER.shBorder.s * nChroma)}% ${NEUTRAL_LADDER.shBorder.l}%`,
      ring: toShadcn(brandPrimary),
    },
  };

  return { id, name, description, tokens };
}

/* ----------------------------------------------------------------------------
 * 序列化为 TS 主题文件
 * -------------------------------------------------------------------------- */

function camelVar(id) {
  return id.replace(/[-_](\w)/g, (_, c) => c.toUpperCase()) + 'Theme';
}

function serialize(theme) {
  const t = theme.tokens;
  // 单引号字符串字面量，转义内部的反斜杠与单引号，与代码库风格一致。
  const q = (v) => `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
  const chartLines = t.chart.map((c) => `      '${c}',`).join('\n');
  return `import type { AppTheme } from './types';

export const ${camelVar(theme.id)}: AppTheme = {
  id: ${q(theme.id)},
  name: ${q(theme.name)},
  description: ${q(theme.description)},
  tokens: {
    background: {
      primary: '${t.background.primary}',
      secondary: '${t.background.secondary}',
      card: '${t.background.card}',
      cardHover: '${t.background.cardHover}',
      selected: '${t.background.selected}',
      control: '${t.background.control}',
    },
    border: {
      divider: '${t.border.divider}',
    },
    text: {
      strong: '${t.text.strong}',
      regular: '${t.text.regular}',
      secondary: '${t.text.secondary}',
      decorative: '${t.text.decorative}',
      disabled: '${t.text.disabled}',
      inverse: '${t.text.inverse}',
    },
    brand: {
      primary: '${t.brand.primary}',
      hover: '${t.brand.hover}',
      active: '${t.brand.active}',
      foreground: '${t.brand.foreground}',
      light: '${t.brand.light}',
      rgb: '${t.brand.rgb}',
    },
    notification: {
      badge: '${t.notification.badge}',
    },
    indicator: {
      up: '${t.indicator.up}',
      down: '${t.indicator.down}',
    },
    risk: {
      high: '${t.risk.high}',
      medium: '${t.risk.medium}',
      low: '${t.risk.low}',
    },
    status: {
      success: '${t.status.success}',
      warning: '${t.status.warning}',
      danger: '${t.status.danger}',
      info: '${t.status.info}',
    },
    sentiment: {
      positive: '${t.sentiment.positive}',
      neutral: '${t.sentiment.neutral}',
      negative: '${t.sentiment.negative}',
    },
    chart: [
${chartLines}
    ],
    typography: {
      fontSans: ${q(t.typography.fontSans)},
      fontDisplay: ${q(t.typography.fontDisplay)},
      fontData: ${q(t.typography.fontData)},
      bodyFontSize: '${t.typography.bodyFontSize}',
      bodyLineHeight: '${t.typography.bodyLineHeight}',
    },
    radius: {
      xs: '${t.radius.xs}',
      sm: '${t.radius.sm}',
      md: '${t.radius.md}',
      lg: '${t.radius.lg}',
      xl: '${t.radius.xl}',
      full: '${t.radius.full}',
    },
    spacing: {
      xxs: '${t.spacing.xxs}',
      xs: '${t.spacing.xs}',
      sm: '${t.spacing.sm}',
      md: '${t.spacing.md}',
      base: '${t.spacing.base}',
      lg: '${t.spacing.lg}',
      xl: '${t.spacing.xl}',
      xxl: '${t.spacing.xxl}',
      section: '${t.spacing.section}',
      pageX: '${t.spacing.pageX}',
      cardPadding: '${t.spacing.cardPadding}',
    },
    shadow: {
      none: '${t.shadow.none}',
      card: '${t.shadow.card}',
      cardHover: '${t.shadow.cardHover}',
      popover: '${t.shadow.popover}',
      modal: '${t.shadow.modal}',
    },
    overlay: {
      scrim: '${t.overlay.scrim}',
    },
    link: {
      default: '${t.link.default}',
      hover: '${t.link.hover}',
      muted: '${t.link.muted}',
      legal: '${t.link.legal}',
    },
    accent: {
      one: '${t.accent.one}',
      two: '${t.accent.two}',
      premium: '${t.accent.premium}',
      standard: '${t.accent.standard}',
    },
    component: {
      button: {
        radius: '${t.component.button.radius}',
        height: '${t.component.button.height}',
        paddingX: '${t.component.button.paddingX}',
      },
      card: {
        radius: '${t.component.card.radius}',
        padding: '${t.component.card.padding}',
        shadow: '${t.component.card.shadow}',
        hoverShadow: '${t.component.card.hoverShadow}',
      },
      input: {
        radius: '${t.component.input.radius}',
        height: '${t.component.input.height}',
      },
      popover: {
        radius: '${t.component.popover.radius}',
        padding: '${t.component.popover.padding}',
        shadow: '${t.component.popover.shadow}',
      },
      modal: {
        radius: '${t.component.modal.radius}',
        shadow: '${t.component.modal.shadow}',
      },
    },
    shadcn: {
      background: '${t.shadcn.background}',
      foreground: '${t.shadcn.foreground}',
      card: '${t.shadcn.card}',
      cardForeground: '${t.shadcn.cardForeground}',
      popover: '${t.shadcn.popover}',
      popoverForeground: '${t.shadcn.popoverForeground}',
      primary: '${t.shadcn.primary}',
      primaryForeground: '${t.shadcn.primaryForeground}',
      secondary: '${t.shadcn.secondary}',
      secondaryForeground: '${t.shadcn.secondaryForeground}',
      muted: '${t.shadcn.muted}',
      mutedForeground: '${t.shadcn.mutedForeground}',
      accent: '${t.shadcn.accent}',
      accentForeground: '${t.shadcn.accentForeground}',
      destructive: '${t.shadcn.destructive}',
      destructiveForeground: '${t.shadcn.destructiveForeground}',
      border: '${t.shadcn.border}',
      input: '${t.shadcn.input}',
      ring: '${t.shadcn.ring}',
    },
  },
};
`;
}

/* ----------------------------------------------------------------------------
 * CLI
 * -------------------------------------------------------------------------- */

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) {
        args[key] = true;
      } else {
        args[key] = next;
        i++;
      }
    } else {
      args._.push(a);
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const brand = args._[0] || args.brand;
  if (!brand) {
    console.error('用法: node scripts/generate-theme.mjs <brandHex> --id <id> --name <名称> [--description <描述>] [--neutral-hue <0-360>] [--neutral-chroma <0-1>] [--stdout]');
    process.exit(1);
  }
  const id = args.id || 'custom';
  const name = args.name || id;
  const description = args.description || `由品牌色 ${brand} 派生的主题。`;
  const neutralHue = args['neutral-hue'] !== undefined ? Number(args['neutral-hue']) : undefined;
  const neutralChroma = args['neutral-chroma'] !== undefined ? Number(args['neutral-chroma']) : undefined;

  const theme = deriveTheme({ brand, id, name, description, neutralHue, neutralChroma });
  const ts = serialize(theme);

  if (args.stdout) {
    process.stdout.write(ts);
    return;
  }

  const outPath = join(ROOT, 'src', 'themes', `${id}.ts`);
  writeFileSync(outPath, ts, 'utf8');
  console.info(`✓ 已生成主题文件: src/themes/${id}.ts`);
  console.info(`  品牌主色 : ${theme.tokens.brand.primary}  hover ${theme.tokens.brand.hover}  active ${theme.tokens.brand.active}`);
  console.info(`  图表板   : ${theme.tokens.chart.join(' ')}`);
  console.info('\n下一步：在 src/themes/registry.ts 中注册它（themes / themeList），即可在 /dev/preview 切换。');
}

main();
