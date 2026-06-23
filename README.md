# Vibe Design System Kit

**English** · [简体中文](./README.zh-CN.md)

[![CI](https://github.com/LeonAgents/vibe-design-system-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/LeonAgents/vibe-design-system-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

> **Give your AI one brand color. Get back a full design system that doesn't look "AI-made."**

A portable, AI-friendly design system for **B2B web products you vibe-code** with Cursor / Claude Code / Codex. Drop it in, and your AI codes on-system from the first line — no more "AI-purple, mismatched-icons, off-spec-cards, 12px-body-text" look.

You give it **one brand color**. It derives a complete, coherent theme: brand ramp, warm/cool neutrals, an 11-color chart palette, and shadcn/ui bridge tokens — all enforced by machine-readable agent rules so every screen stays on-system.

> This repo's default theme — **Claude coral `#D97757`** — was itself generated from a single brand color with this exact pipeline. What you see is its output.

![Design system preview](docs/images/preview-default.png)

The same system, transformed by a single brand color — Claude coral (default), indigo, tech blue:

| `default` Claude `#D97757` | `indigo` `#4F46E5` | `tech-blue` `#1769AA` |
| --- | --- | --- |
| ![Claude coral](docs/images/preview-default-hero.png) | ![indigo](docs/images/preview-indigo.png) | ![tech blue](docs/images/preview-tech-blue.png) |

---

## Why this exists

When you vibe-code a B2B frontend, the painful part isn't getting code out — it's everything after:

- **You re-fix the same mistakes on every screen.** Purple gradients again, emoji-as-icons again, 12px body text again. Fix one page, the AI repeats it on the next.
- **It screams "AI-generated."** The same AI-purple, centered hero headings, oversized rounded cards — that cheap look quietly destroys credibility the moment you hand it to a client or your boss.
- **It drifts the moment the project grows.** With no shared spec, colors, spacing, and radii get reinvented per file; the bigger it gets, the messier it looks.
- **Re-skinning for a new client is a manual hunt-and-replace** across dozens of files — easy to miss spots, easy to break.

This kit captures "design taste" as rules an AI can read and obey — fixing all of the above at the root.

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
