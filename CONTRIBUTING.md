# Contributing

Thanks for your interest in improving Vibe Design System Kit!

## Development setup

```bash
npm install
npm run dev        # http://localhost:3000/dev/preview
```

Requires Node ≥ 20.11 (Node ≥ 22.6 if you need to run `npm run tokens:build`).

## The golden rule

**Product UI must use semantic theme tokens — never hardcode colors, fonts, radius, spacing, shadows, or component dimensions.**

`npm run lint` runs both ESLint and the token scanner (`scripts/check-theme-tokens.mjs`), which fails the build on hardcoded product colors, `text-white`, legacy overlays, and legacy popover shadows. Allowed exceptions: theme files, `globals.css`, dev preview pages, and official platform/logo brand colors.

## Common tasks

**Add or change a theme**

```bash
npm run theme:new -- "#4F46E5" --id my-theme --name "My Theme"
# then register it in src/themes/registry.ts (themes + themeList)
```

See [`docs/theme-authoring.md`](./docs/theme-authoring.md) for the full derivation rules and the AI-authoring contract.

**Regenerate the portable token file** (after changing the default theme)

```bash
npm run tokens:build   # regenerates design-tokens.css from src/themes/default.ts
```

`design-tokens.css` is generated, not hand-edited. CI verifies it stays in sync.

**Extend the token contract**

If an existing token can't express a need, extend the contract first:
`src/themes/types.ts` → `src/themes/cssVars.ts` → every registered theme in `src/themes/`.

## Before opening a PR

Run the full check:

```bash
npm run typecheck
npm run lint
npm run build
```

Keep changes focused, match the surrounding code style, and update docs/screenshots when behavior or visuals change.

## Reporting issues

Use the issue templates. For bugs, include repro steps, expected vs actual, and your Node/OS versions.
