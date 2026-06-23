// 此文件是 ESLint 配置模板。
// 项目根目录有 hook 保护，无法直接由 AI agent 写入 eslint.config.mjs。
// 请手动复制本文件内容到 /eslint.config.mjs（项目根目录）。
//
// cp docs/templates/eslint.config.mjs.template eslint.config.mjs

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // 强制使用 import type 区分类型与值
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      // 警告 console.log（生产环境应使用专门的 logger）
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'next-env.d.ts',
    'public/**',
  ]),
]);

export default eslintConfig;
