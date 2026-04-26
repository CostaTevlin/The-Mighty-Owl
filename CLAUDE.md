# Otto — Project Instructions

## Source of Truth

### User Flow (Canvas)
`/Users/konstantinnaumenko/Documents/Obsidian/my-startups/The Mighty Owl/Otto v1.0 – User Flow.canvas`

This canvas reflects the **actual current state** of the app — every screen, every navigation path, every conditional branch. After any change that adds, removes, or modifies a screen or flow (new screen, renamed action, changed navigation target, new error state), **update the canvas before closing the task**. Nodes marked `*(TBD)*` are designed in Figma but not yet implemented.

### Flow Logic / PRD
`/Users/konstantinnaumenko/Documents/Obsidian/my-startups/The Mighty Owl/Otto v1.0 – User Flow Logic.md`

Treat this as the **PRD**. It captures the reasoning behind every decision: credit system rules, API branching logic, confidence state behaviour, context inputs per category, and the distinction between implemented and TBD screens. Read it before making any product or UX decision. Update it whenever the flow logic changes.

### Decision Log
`/Users/konstantinnaumenko/Documents/Obsidian/my-startups/The Mighty Owl/Decision log.md`

A running record of every product, UX, and technical decision made during development. **Append an entry here whenever you make a non-trivial decision** — a choice between two approaches, a deliberate trade-off, a behaviour change, or anything a future session would otherwise have to rediscover. Do not log routine implementation details; log decisions where the *why* matters.

Each entry follows this format:
```
## YYYY-MM-DD — [Topic]

### N. [Short decision title]
**Decision:** What was decided.
**Rationale:** Why — the constraint, trade-off, or prior incident that drove the choice.
**Files:** Affected files, if any.
```

---

## Figma

Always access Figma via the **Figma Desktop Bridge plugin** (MCP server ID `5bd5f5f8-6aad-4787-afad-f890df9c461f`). Use `get_metadata` to explore structure and `get_design_context` or `get_screenshot` to inspect specific screens. Never guess at design details — pull them from Figma directly.

---

## Project Context

- **App:** Otto — AI-powered home appliance assistant. Snap a photo → get step-by-step instructions.
- **Stack:** Astro + Tailwind (frontend) · Supabase Edge Functions (backend) · Claude Haiku 4.5 Vision (AI) · localStorage credits (no auth required)
- **Prototype:** `/applianceai-prototype/` — the live web prototype
- **Brand:** Otto the otter. Colours: `otto-amber` (#E8820C) primary, `otto-teal` (#1A8A7A) secondary, warm cream neutrals. Fonts: Plus Jakarta Sans (headings), Geist (body).
- **Credits:** Free tier = 3 scans (device-local). Lifetime Pro = $9.99 / 500 credits. Top-up = $2.99 / 150 credits. Credit is **not** deducted when `needsBetterPhoto: true`.

## Key Files

| File | Purpose |
|---|---|
| `applianceai-prototype/src/pages/index.astro` | All state management, event listeners, API calls |
| `applianceai-prototype/src/components/` | Individual screen components (one per screen) |
| `applianceai-prototype/tailwind.config.mjs` | Design tokens (`otto-*` palette) |
| `supabase/functions/analyze/index.ts` | Claude Vision edge function |
| `Otto (prototype)/otto-brand-guidelines_1.html` | Brand reference |
