#!/usr/bin/env node
/**
 * build-tokens-css.mjs — 由默认主题生成静态的 design-tokens.css。
 *
 * design-tokens.css 是给"非 React / 非本仓库"项目复用的可移植产物。它不是手写的，
 * 而是从 src/themes/default.ts 经由 src/themes/cssVars.ts 的同一份映射生成，
 * 因此和运行时注入的 CSS 变量永远一致，不存在两份真相。
 *
 * 依赖 Node 的类型擦除（--experimental-strip-types，Node 22.6+ / 24 内置），
 * 直接导入 .ts。被导入的 default.ts / cssVars.ts 只含 `import type`，可被安全擦除。
 *
 * 用法：node --experimental-strip-types scripts/build-tokens-css.mjs
 * 推荐通过 npm script 调用：npm run tokens:build
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const { defaultTheme } = await import(pathToFileURL(join(ROOT, 'src/themes/default.ts')).href);
const { themeToCssVariables } = await import(pathToFileURL(join(ROOT, 'src/themes/cssVars.ts')).href);

const vars = themeToCssVariables(defaultTheme);
const body = Object.entries(vars)
  .map(([key, value]) => `  ${key}: ${value};`)
  .join('\n');

const css = `/* 此文件由 scripts/build-tokens-css.mjs 自动生成，请勿手改。 */
/* 来源：src/themes/default.ts → src/themes/cssVars.ts。 */
/* 重新生成：npm run tokens:build */
:root {
${body}
}
`;

writeFileSync(join(ROOT, 'design-tokens.css'), css, 'utf8');
console.info('✓ 已生成 design-tokens.css（来源主题：' + defaultTheme.id + '）');
