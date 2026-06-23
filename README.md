# Fixing the "AI Look": A Design System for Vibe Coders

> Stop shipping eye-searing AI-generated UIs. A prompt-optimized `DESIGN_SYSTEM.md` spec and component library for AI coding.

**English** · [简体中文](./README.zh-CN.md)

[![CI](https://github.com/LeonAgents/vibe-design-system-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/LeonAgents/vibe-design-system-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

![Design system preview](docs/images/preview-default.png)

The same system, transformed by a single brand color — Claude coral (default), indigo, tech blue:

| `default` Claude `#D97757` | `indigo` `#4F46E5` | `tech-blue` `#1769AA` |
| --- | --- | --- |
| ![Claude coral](docs/images/preview-default-hero.png) | ![indigo](docs/images/preview-indigo.png) | ![tech blue](docs/images/preview-tech-blue.png) |

---

## The story

While vibe-coding, I kept hitting the same frontend problem: **AI-generated pages are just kind of ugly — and the less you constrain the model, the stronger the "AI look" gets.** Behind those tell-tale screens is a pile of basic, recurring UI mistakes:

- **Messy layout** — elements crammed together with no clear sections or alignment.
- **No typography, just walls of text** — everything dumped flat, with no hierarchy, whitespace, or rhythm.
- **Tiny body text** — 12px out of the box, exhausting to read for long.
- **Inconsistent colors** — every part of the same product picks its own.
- **Brand + accent colors that clash** — or just default to the signature "AI purple."
- **No component reuse** — the same chart gets re-drawn on page after page, each one slightly different.

The root cause isn't that the AI *can't* — it's that **nobody gave it a spec it can read and obey.** This kit is that spec.

## How it fixes it

It turns "design taste" into something an AI can read and is forced to follow: a human-readable `DESIGN_SYSTEM.md`, machine rules in `AGENT_RULES.mdc`, and a set of design tokens and components. Drop it in, and the AI stays on-system from the first line — uses tokens, builds real hierarchy, hits minimum font sizes, keeps colors consistent, and reuses one component for the same chart everywhere.

And **re-skinning takes a single brand color** — give it one, and it derives a complete, coherent theme: brand ramp, warm/cool neutrals, an 11-color chart palette, and shadcn/ui tokens.

> This repo's default theme — **Claude coral `#D97757`** — was itself generated from one brand color with this exact pipeline. What you see is its output.

---

## What you get

- 🎨 **One-command re-theming** — `npm run theme:new -- "#yourcolor"` derives the ramp, neutrals, chart palette, and shadcn tokens. New client, new brand, done in seconds.
- 🤖 **Design rules your AI obeys** — `AGENT_RULES.mdc` makes Cursor / Claude Code use tokens, never hardcode, never drift — from the first prompt.
- 🚫 **No "AI-slop" palettes** — the chart colors aren't algorithmically guessed; they come from a hand-tuned, harmonious master (see below).
- 🧱 **A real reference implementation** — Next.js + React + Tailwind + shadcn/ui, with 13 chart components and a full preview page.
- 🛡️ **Automated guardrails** — `npm run lint` flags hardcoded colors, `text-white`, and more, and fails CI. Consistency isn't left to discipline.
- 📦 **Zero-dependency & portable** — the core is docs + tokens + rules; integrate the minimal set into any framework.

---

## Quick start

```bash
# 1. Install and run the preview (works out of the box)
npm install
npm run dev
# open http://localhost:3000/dev/preview — switch themes from the top bar
```

### Re-theme to your brand color (30 seconds)

```bash
# 2. Generate a theme from one brand color
npm run theme:new -- "#E5484D" --id rose --name "Rose"

# 3. Register it in src/themes/registry.ts (add to themes + themeList), then refresh
```

That's it. From that single color the generator derives:

- **Brand ramp** — `primary / hover / active`, auto-contrast `foreground`, `light`, `rgb`
- **Neutrals** — backgrounds, text, and borders subtly tinted with the brand hue
- **Chart palette** — 11 harmonious, low-saturation colors
- **shadcn/ui tokens** — `H S% L%` triplets for full shadcn compatibility

> No Node? Hand the brand color plus [`docs/theme-authoring.md`](./docs/theme-authoring.md) to your AI agent — same rules, validated against [`schemas/app-theme.schema.json`](./schemas/app-theme.schema.json).

### Integrate into your project (pick the smallest path)

```
Just need design values (any framework)?
  └─ Copy design-tokens.css → use the CSS variables. Done.

On React + Tailwind + shadcn/ui?
  └─ Copy src/themes/ (token contract + registry), wire ThemeContext,
     and add AGENT_RULES.mdc to your agent's rules dir.

Want the full thing (charts, preview, shared components)?
  └─ Use this repo as a template; migrate src/ wholesale.
```

**Either way, drop `AGENT_RULES.mdc` + `DESIGN_SYSTEM.md` into your AI's rules dir** — that's what keeps the AI on-system.

---

## No "AI-slop" palettes

The fastest tell of an AI-made UI is a harsh, clashing chart palette.

This kit's chart colors are **not synthesized from the brand color**. They start from a hand-tuned, low-saturation, full-spectrum **11-color master**, then rotate as a set to your brand hue while keeping each color's saturation/lightness — so the designed, harmonious relationships survive any re-theme.

Semantic colors (success / warning / danger / risk / sentiment) stay **fixed on purpose**: whatever the brand color, red always means danger and green always means success.

---

## What's inside

| Path | What it is |
| --- | --- |
| `DESIGN_SYSTEM.md` | The single human-readable spec (color, type, components, charts, agent rules, constraints). |
| `AGENT_RULES.mdc` | Machine rules for Cursor / AI coding agents. Copy into your agent's rules dir. |
| `design-tokens.css` | The default theme as plain CSS variables — **auto-generated**, framework-agnostic. |
| `docs/theme-authoring.md` | The "one brand color → full theme" contract (script + AI paths). |
| `schemas/app-theme.schema.json` | JSON Schema for a theme; validate AI-authored themes against it. |
| `scripts/generate-theme.mjs` | Zero-dependency theme generator. |
| `src/` | Next.js + React + Tailwind + shadcn/ui reference implementation and the live `/dev/preview`. |

---

## Stack & commands

Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui · TypeScript · ECharts 6.
Requires Node ≥ 20.11 (`npm run tokens:build` uses Node's type-stripping and needs Node ≥ 22.6).

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the preview at `http://localhost:3000/dev/preview`. |
| `npm run theme:new -- "#hex" --id <id> --name <name>` | Generate a theme from a brand color. |
| `npm run tokens:build` | Regenerate `design-tokens.css` from the default theme. |
| `npm run theme:check` | Scan source for hardcoded colors / off-spec styling. |
| `npm run lint` / `npm run typecheck` | ESLint (+ theme check) / TypeScript. |

**Guardrails:** `npm run lint` runs a token scan (`scripts/check-theme-tokens.mjs`) that fails on hardcoded product colors, `text-white`, legacy overlays, and legacy popover shadows — keeping AI-generated code on-system.

---

## Deploy your own

One-click deploy the preview to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/LeonAgents/vibe-design-system-kit)

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE) © LeonAgents
