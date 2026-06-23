import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['src'];
const ALLOWED_EXTENSIONS = new Set(['.ts', '.tsx', '.css', '.md']);

const EXCLUDED_PATH_PREFIXES = [
  'src/themes/',
  'src/app/globals.css',
  'src/app/(dev)/',
  'src/components/shared/ChannelIcons.tsx',
  'src/components/charts/CATALOG.md',
];

const checks = [
  {
    name: 'hardcoded color literal',
    pattern: /#[0-9A-Fa-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/g,
    message: '产品 UI 颜色必须走主题 token；平台官方 logo 色只能放在允许例外文件中。',
  },
  {
    name: 'text-white',
    pattern: /\btext-white\b/g,
    message: '反白文字使用 var(--text-inverse) 或 var(--highlight-foreground)。',
  },
  {
    name: 'legacy overlay',
    pattern: /\bbg-black\/40\b/g,
    message: '遮罩使用 var(--overlay-scrim)。',
  },
  {
    name: 'legacy popover shadow',
    pattern: /shadow-\[0_4px_12px|shadow-lg/g,
    message: '浮层 / 弹层阴影使用组件级 shadow token。',
  },
];

function isExcluded(path) {
  return EXCLUDED_PATH_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix));
}

function extensionOf(path) {
  const match = path.match(/\.[^.]+$/);
  return match?.[0] ?? '';
}

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (entry === 'node_modules' || entry === '.next' || entry === '.git') continue;
      walk(fullPath, files);
      continue;
    }

    const rel = relative(ROOT, fullPath);
    if (isExcluded(rel)) continue;
    if (!ALLOWED_EXTENSIONS.has(extensionOf(rel))) continue;
    files.push(rel);
  }

  return files;
}

const violations = [];

for (const targetDir of TARGET_DIRS) {
  for (const relPath of walk(join(ROOT, targetDir))) {
    const content = readFileSync(join(ROOT, relPath), 'utf8');
    const lines = content.split('\n');

    for (const check of checks) {
      for (const [lineIndex, line] of lines.entries()) {
        check.pattern.lastIndex = 0;
        if (!check.pattern.test(line)) continue;

        violations.push({
          path: relPath,
          line: lineIndex + 1,
          name: check.name,
          message: check.message,
          snippet: line.trim(),
        });
      }
    }
  }
}

if (violations.length > 0) {
  console.error('Theme token check failed:\n');

  for (const violation of violations) {
    console.error(
      `${violation.path}:${violation.line} [${violation.name}] ${violation.message}`,
    );
    console.error(`  ${violation.snippet}\n`);
  }

  process.exit(1);
}

console.info('Theme token check passed.');
