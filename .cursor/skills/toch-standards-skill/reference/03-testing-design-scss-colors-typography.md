# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

---

## [TESTING-UNIT]

Unit testing is not yet implemented in this template.
Do NOT write unit tests unless the user explicitly requests it.

IF NO:
  - Proceed without tests.

FORBIDDEN: Write tests using Jest — use Jasmine/Karma only (already configured).
FORBIDDEN: Add `@angular/testing` or any test utility not already in `package.json`.

---

## [DESIGN-SYSTEM]

### Before writing any SCSS for a new project or feature:

STEP 1 — Check for Figma:
  ASK: "Do you have a Figma link for this feature/project?"
  IF YES:
    - Use the Figma MCP tool to extract: colors, font family, font sizes, spacing, border radii.
    - Map all colors to CSS custom property tokens in `src/styles/variables.scss`.
    - Do not invent colors — use only what Figma provides.
  IF NO:
    ASK: "What font family should be used?" (wait for answer)
    ASK: "What is the primary color and background color?" (wait for answer)
    FORBIDDEN: Proceed with placeholder or invented colors.

STEP 2 — Define tokens before components:
  - Write all tokens into `src/styles/variables.scss` `:root` block FIRST.
  - Only then write component SCSS that references those tokens.

---

## [SCSS]

REQUIRED — Units:
  - `width`, `height`, `margin`: use `%`, `vw`, `vh`. FORBIDDEN: `rem` for these.
  - `padding`, `gap`, `margin`: use `%`, `vw`, `vh`. FORBIDDEN: `rem` for these.
  - FORBIDDEN (STANDARDS:[SCSS]:no-dynamic-viewport-units): Do not use dynamic or per-orientation viewport units (`dvh`, `dvw`, `dvmin`, `dvmax`, `svh`, `svw`, `svmin`, `svmax`, `lvh`, `lvw`, `lvmin`, `lvmax`) anywhere — in `.scss`, inline styles, or design-token values. Use the static equivalents (`vh`, `vw`, `vmin`, `vmax`) instead.
  - Font sizes: use `rem` or `clamp()`.
  - FORBIDDEN: Fixed `px` values for layout dimensions (borders and shadows: `px` is acceptable).

REQUIRED — Nesting:
  - SCSS class nesting MUST mirror the HTML DOM hierarchy exactly.
  - A class nested inside another in SCSS = that element is a DOM child of the parent.
  - FORBIDDEN: Nest a class that is not a DOM descendant of the parent selector.
  - EXAMPLE (correct):
    ```scss
    .doc-card {                  // <article class="doc-card">
      .doc-card__header { }      //   <div class="doc-card__header">
      .doc-card__status { }      //   <span class="doc-card__status">
    }
    ```

REQUIRED — No magic numbers:
  - Extract any repeated or non-obvious numeric value to a CSS variable or SCSS variable.
  - EXAMPLE: `border-radius: var(--radius-card)` not `border-radius: 0.875rem` repeated everywhere.

ALLOWED:
  - Negative `letter-spacing` values in `em` units for typography (e.g. `letter-spacing: -0.015em`).

FORBIDDEN:
  - Negative margins (`margin: -Xpx`, `margin-top: -Xrem`, etc.) — use `transform` only when semantically justified, never as a layout hack.
  - Negative `rem`/`px` values on layout offsets (except typography `letter-spacing` in `em`).
  - `!important` — if you feel you need it, restructure the selector specificity instead.
  - Inline styles in HTML templates (`style="..."`) — use CSS classes.
  - `px` for font sizes.
  - Hardcoded color hex/rgb values in component SCSS — always `var(--token)`.

REQUIRED — Component encapsulation:
  - Every component MUST have its own `.scss` file.
  - FORBIDDEN: `styles: [...]` inline array in any component decorator — always use `styleUrl`.
  - DEFAULT: Component styles scoped to the component; avoid global selectors in component stylesheets.
  - REQUIRED: Use CSS custom properties from `src/styles/variables.scss` — never hardcode colors or spacing in component SCSS.

REQUIRED — Margins:
  - FORBIDDEN: `margin: 0` or any `margin-*: 0` (including `margin-inline-start: 0`). Remove the rule, it is implicit.
  - FORBIDDEN: Margin for layout offset of sibling elements — use `gap`, `padding`, or `grid`/`flex` layout instead.
  - When margin is unavoidable, it MUST use `vw`/`vh`/`%` for layout offset, never a fixed `rem` value.

REQUIRED — Layout dimensions:
  - `width`, `height`, `margin` (layout offset): MUST use `vw`, `vh`, `%`.
  - `padding`, `gap`, `margin`: MUST use `vw`, `vh`, `%`.
  - `border-radius`, `font-size`: use `rem` or `clamp()`.
  - FORBIDDEN: `rem` for layout widths, heights, padding, gap, or margin.

REQUIRED — RTL:
  - Set `direction: rtl` on `html, body` in `src/styles.scss` for Hebrew projects.
  - Use logical properties (`margin-inline-start`, `padding-inline-end`) where possible.
  - FORBIDDEN: Use `margin-left`/`margin-right` for layout spacing in RTL projects — use `margin-inline-*` or `gap`.

---

## [COLORS]

REQUIRED: All color tokens defined in `src/styles/variables.scss` `:root` block.

### Token scope rules
Two categories of tokens exist. Use the correct category — do NOT mix them.

**Generic tokens** (shared across all features, `--color-*` prefix):
  - `--color-bg` — page background
  - `--color-text` — default text
  - `--color-text-light` — secondary text
  - `--color-text-muted` — tertiary/disabled text
  - `--color-link` — hyperlink color
  - `--color-border` — default border
  - `--color-border-subtle` — low-contrast border
  - `--color-error` — error state
  - `--color-shadow-soft` / `--color-shadow-strong` — shadow layers
  - `--color-status-done` / `--color-status-done-bg`
  - `--color-status-standby` / `--color-status-standby-bg`
  - `--color-status-late` / `--color-status-late-bg`

**Component-scoped tokens** (owned by one component, prefixed with component name):
  - `--topbar-bg` / `--topbar-bg-hover` / `--topbar-text` — top-bar component only
  - `--sidebar-bg` / `--sidebar-bg-soft` — side-bar component only
  - `--spinner-ring-color` / `--spinner-track-color` / `--spinner-glow` — spinner/splash only
  - When adding a new component: define its tokens as `--<component>-<role>` in `src/styles/variables.scss`

### Rules
FORBIDDEN: Generic names like `--color-primary`, `--color-surface`, `--color-on-primary` — these are ambiguous about which component they belong to.
FORBIDDEN: Reference a color token not defined in `src/styles/variables.scss`.
FORBIDDEN: Use `rgba(...)` or `#hex` directly in component SCSS.
REQUIRED: Each feature should be potentially standalone — avoid reusing component-scoped tokens across features. If two components share a color, promote it to a generic token with a semantic name.

---

## [TYPOGRAPHY]

REQUIRED: Font family set once on `html, body` in `src/styles.scss`.
REQUIRED: Use only self-hosted or system fonts. FORBIDDEN: `@import url(external)` — the app runs on a private network with no internet access. Self-host any custom `.woff2` under `src/assets/fonts/` and reference it with `src: url(...)` pointing to the local asset.
REQUIRED: Font sizes use `rem` (base = browser default 16px).
REQUIRED: Heading sizes use `clamp(minRem, preferredVw, maxRem)` for fluid scaling.
FORBIDDEN: Set `font-family` in a component SCSS file.
FORBIDDEN: Use `px` for font sizes.

SCALE GUIDANCE (adjust per Figma):
  - Body: `1rem` (16px)
  - Small/muted: `0.875rem` (14px)
  - Label: `0.8125rem` (13px)
  - Subheading: `clamp(1.25rem, 2.5vw, 2.5rem)`
  - Heading: `clamp(2.5rem, 5vw, 5rem)`

---
