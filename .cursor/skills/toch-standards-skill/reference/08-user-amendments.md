# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

---

## [PROJECT-AMENDMENTS] — Precedence

REQUIRED: For this repo, rules documented here (with a Rule ID) override conflicting base STANDARDS in `reference/01`–`07` and [STANDARDS.md](../../../STANDARDS.md) when you cite that Rule ID in a Standards check.

**Precedence order:**

1. Base STANDARDS + `reference/01`–`07`
2. This file (`08-user-amendments`) — Inbox + Changelog + rules under `[PROJECT-AMENDMENTS]`
3. Per-chat `Follow` / `Ignore` — session only until captured via `/toch-standards-review` or **TOCH standards review**

**Updates:** run `/toch-standards-review` (plain-language rule + optional examples) or invoke the `toch-standards-amend` skill. See `.cursor/skills/toch-standards-amend-skill/SKILL.md`.

---

## Inbox (pending promotion)

| Date | Source | Change type | Target section | Rule ID | Promote | Summary |
|------|--------|-------------|----------------|---------|---------|---------|

---

## Changelog (promoted or kept as project-only)

| Date | Rule ID | Promoted | Files touched | Notes |
|------|---------|----------|---------------|-------|
| 2026-06-03 | STANDARDS:[PROJECT-AMENDMENTS]:split-variables-and-global, no-h-utils-in-styles-entry | yes | 08-user-amendments.md, src/styles/variables.scss, src/styles/global.scss, src/styles.scss | Split tokens and h-* utilities out of styles.scss entry |
| 2026-06-04 | STANDARDS:[ICONS]:* (4 rules) | yes | STANDARDS.md, reference/06, SKILL.md, 07, 01 | Code review: CSS mask icons, no inline decorative SVG |
| 2026-06-04 | STANDARDS:[NAMING]:bem-modifier-single-hyphen, generic-layout-class | yes | STANDARDS.md, reference/04 | Code review: BEM `--` modifiers and prefixed layout classes |
| 2026-06-04 | STANDARDS:[TYPES]:enum-for-closed-sets | yes | STANDARDS.md, reference/05 | Code review: string enums for closed branching sets |
| 2026-06-04 | (process) Standards documentation ASK | yes | SKILL.md, toch-standards.mdc, STANDARDS.md [META], reference/01, reference/07 | Required ask before task complete when new conventions introduced |

---

## Project-only rules

REQUIRED (STANDARDS:[PROJECT-AMENDMENTS]:split-variables-and-global): Define CSS custom properties (`:root`, `[data-theme]`) in `src/styles/variables.scss`. Define shared utility classes in `src/styles/global.scss` (only classes the template or app actually uses). Keep `src/styles.scss` as the global entry file: `@use` partials plus document-level base rules (`html`, `body`, box-sizing).

FORBIDDEN (STANDARDS:[PROJECT-AMENDMENTS]:no-h-utils-in-styles-entry): Define utility classes or `:root` token blocks directly in `src/styles.scss`.

EXAMPLE (correct):

```scss
// src/styles.scss
@use './styles/variables';
@use './styles/global';
@use './styles/overlay';
```

ANTI-PATTERN: Placing utility class blocks or `:root { --token: … }` in `src/styles.scss` instead of the dedicated partials.
