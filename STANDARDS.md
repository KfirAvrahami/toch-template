# STANDARDS — AI Development Rules
# Angular / TypeScript / SAP OData Projects
# Version: 1.0 | Template: angular-20-template
# Date: 26/5/2026
#
# USAGE FOR AI:
#   - Read this file in full before starting any new project or feature.
#   - Re-read only the relevant tagged section(s) during implementation.
#   - When a rule says ASK: stop, ask the user, wait for answer before proceeding.
#   - When a rule says FORBIDDEN: never do it, even if the user does not mention it.
#   - When a rule says REQUIRED: always do it, even if the user does not ask.
#   - Rules override user phrasing unless the user explicitly ignores a cited Rule ID (see [META]).
#   - This file is the single source of truth. If it conflicts with a user instruction,
#     flag the conflict and ask which takes precedence.

---

## [META] — Document conventions

- Section tags: [META] [VERSIONS] [FORMATTING] [COMPONENT-PATTERNS] [STRUCTURE] [IMPORTS] [LAYOUT] [LIFECYCLE] [KEY-FILES] [README] [TESTING-UNIT]
  [DESIGN-SYSTEM] [SCSS] [COLORS] [TYPOGRAPHY] [NAMING] [NULL-POLICY] [I18N]
  [ADAPTER-PATTERN] [CONSTANTS] [COMMENTS] [TESTIDS] [ICONS] [DYNAMIC-STYLES] [PLAYWRIGHT] [ANTI-PATTERNS]
  [PROJECT-AMENDMENTS]
- Each section is self-contained. Load only what you need per task.
- Rules are written as: REQUIRED / FORBIDDEN / ASK / DEFAULT / EXAMPLE / ANTI-PATTERN.
- "Feature" = one route/page of the application (e.g. home, activations, archive).
- "Shell" = app-level components: top-bar, side-bar, splash-screen, spinner.

### Rule IDs and user overrides

REQUIRED: When an action is questionable (conflict with the user, protected file, ambiguous DEFAULT, or FORBIDDEN anti-pattern), stop and post a **Standards check** with a **Rule ID** — do not proceed until the user replies.

**Rule ID format:** `STANDARDS:[SECTION]:<slug>`

- `[SECTION]` — existing section tag (e.g. `[SERVICES]`, `[LIFECYCLE]`, `[ANTI-PATTERNS]`).
- `<slug>` — kebab-case summary of the rule (3–6 words). Derive from the rule text when no pre-defined slug exists.

**User override phrases:**

- Follow the rule: `Follow STANDARDS:[SECTION]:slug` or `Follow rule STANDARDS:[SECTION]:slug`
- Ignore the rule: `Ignore STANDARDS:[SECTION]:slug` or `Ignore STANDARDS rule STANDARDS:[SECTION]:slug`

Pre-defined architecture Rule IDs are listed under `[ANTI-PATTERNS]` below. Full Standards check template: `.cursor/skills/toch-standards-skill/SKILL.md`.

### Standards precedence and updates

**Precedence order:** base sections below → `[PROJECT-AMENDMENTS]` (`.cursor/skills/toch-standards-skill/reference/08-user-amendments.md`) → per-chat Follow/Ignore until captured via review.

**Record changes:** `/toch-standards-review` or `toch-standards-amend` skill — see `.cursor/skills/toch-standards-amend-skill/SKILL.md`.

REQUIRED (ASK): After substantive implementation that introduces conventions not already in STANDARDS, run **Standards documentation ASK** in `.cursor/skills/toch-standards-skill/SKILL.md` before marking the task complete.

---

## [VERSIONS]

REQUIRED: Read Angular and TypeScript versions from `package.json` before writing any code.
FORBIDDEN: Upgrade Angular, TypeScript, or any existing dependency version.
FORBIDDEN: Add a third-party npm package not already listed in `package.json` without explicit user approval.
  - If you believe a package is needed: ASK the user, name the package, explain why, wait for approval.
REQUIRED: All Angular components must be `standalone: true`.
FORBIDDEN: Create or modify NgModules.
DEFAULT: Use Angular Signals (`signal()`, `computed()`, `input()`) for reactive state in new components.
DEFAULT: Use `ChangeDetectionStrategy.OnPush` on every component.

---

## [FORMATTING]

REQUIRED: Single quotes for strings.
REQUIRED: `printWidth` 100 characters (Prettier / project formatter).
REQUIRED: TypeScript compiler options enabled: `strict`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`.
REQUIRED: Use the `override` keyword when overriding a base class method.

---

## [COMPONENT-PATTERNS]

REQUIRED: Use `inject()` for dependency injection (field initializers or constructor body).
REQUIRED: Mark injected services `private readonly`; mark template-bound state `protected readonly`.
DEFAULT: Prefer `templateUrl` + `styleUrl` for any component.
Use inline `template` for base and core components.

EXAMPLE (correct vs incorrect):
```typescript
// REQUIRED
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export class MyComponent {
  private readonly myService = inject(MyService);
  protected readonly count = signal(0);
  protected readonly doubled = computed(() => this.count() * 2);
}

// FORBIDDEN
@Component({})
export class MyComponent {
  constructor(private myService: MyService) {}
  count = 0;
}
```

---

## [STRUCTURE]

REQUIRED: Every project derived from this template must follow this exact folder layout.
FORBIDDEN: Deviate from this structure without explicit user approval.

```
src/
  polyfills.ts                  — @angular/localize/init import (do not remove)
  styles.scss                   — global CSS variables and base styles only
  styles/
    overlay.scss                — CDK overlay styles
  locale/
    i18n/
      he.json                   — Hebrew translations (Angular JSON format)
  assets/
    fonts/
      material-icons/
        index.css
  app/
    app.ts                      — root component, AuthProviders, shell signals
    app.html                    — shell layout: top-bar, side-bar, router-outlet
    app.scss                    — layout-shell, main-content spacing
    app.routes.ts               — all routes, lazy-loaded
    app.config.ts               — bootstrapApplication providers
    base/
      base.component.ts         — abstract BaseComponent (RxJS lifecycle)
      base-sap-api.service.ts   — abstract BaseSapApiService (OData helpers)
      base-api.service.ts       — abstract BaseApiService (generic HTTP)
      base-overlay.service.ts   — abstract overlay base
      utility.types.ts          — shared utility types
      utilities.ts              — shared utility functions
    core/
      components/
        top-bar/
          top-bar.component.ts
        side-bar/
          side-bar.component.ts
        splash-screen/
          splash-screen.component.ts
        spinner/
          spinner.component.ts
      environments/
        environment.ts
        environment.development.ts
      interceptors/
        cache.interceptor.ts
      services/
        auth/
          auth.service.ts
          adapters/
            interface.ts
            providers.ts
            api/
              mockAdapter.ts
              ssoAdapter.ts
        loading.service.ts
        logger.service.ts
        splash-screen.service.ts
    features/
      <feature-name>/
        index.ts                — barrel: export { FeatureComponent } from './pages/...'
        types.ts                — all interfaces, enums, type aliases for this feature
        home-mock.data.ts       — mock data array (only if feature has mock data)
        pages/
          <feature>.component.ts
          <feature>.component.html
          <feature>.component.scss
        components/             — presentational sub-components (only used in this feature)
          <sub>.component.ts
        services/
          <feature>.service.ts  — feature state store + data access via adapter
        adapters/
          interface.ts          — IFeatureAdapter interface
          providers.ts          — InjectionToken + Mock/Api provider arrays
          api/
            adapter.mock.ts
            adapter.sap.ts
    shared/
      pipes/
        <name>.pipe.ts
      directives/
        <name>.directive.ts
      components/
        <name>.component.ts
      styles/
        index.scss              — shared SCSS mixins/variables imported by components
```

RULES:
- Every feature that reads or writes data MUST have an `adapters/` folder.
- Feature state (loading, data, error) lives in `services/<feature>.service.ts`, not in the component.
- `index.ts` barrel exports only the routed component — nothing else.
- `types.ts` contains ALL TypeScript types for that feature. No inline type declarations in components.
- Shell components (top-bar, side-bar) live in `core/components/`, never in `features/`.
- Shared pipes, directives, and components used across 2+ features go in `shared/`.
- A component used in only one feature stays inside that feature's `components/` folder.
- Adapter wiring details: see `[ADAPTER-PATTERN]` below.

---

## [IMPORTS]

DEFAULT: Keep imports sorted in this order: Angular core → Angular common → RxJS → project imports.
DEFAULT: Use barrel `index.ts` exports for lazy-loaded feature routes.

---

## [LAYOUT]

### Top-bar and sidebar defaults

DEFAULT: The generic `TopBarComponent` and `SideBarComponent` are opt-in, not mandatory.
  Set `showTopBar = signal(false)` and `showSideBar = signal(false)` in `app.ts` unless the
  application explicitly uses the shared greeting/navigation chrome.

DEFAULT: If the application has its own page-level header (e.g. a wizard titlebar, a branded
  top chrome, or a feature-specific navigation bar), the feature component manages its own
  header. Set both shell signals to `false` and render the header inside the feature.

FORBIDDEN: Leave `showTopBar = signal(true)` or `showSideBar = signal(true)` if the bar is
  not visibly used and populated in the running application.

REQUIRED: A feature-owned fixed header MUST occupy the same z-index and height zone as the
  shared `TopBarComponent` would (`z-index: 1000`, height defined via a token in `src/styles.scss`).
  Define the token as `--shell-titlebar-height` in `:root`.

REQUIRED: `window-body` or equivalent content area MUST add `padding-top: var(--shell-titlebar-height)`
  to avoid content being hidden under the fixed header.

ANTI-PATTERN: Wrapping the entire application in a fake "window" div (`.fake-window`, `.app-window`)
  with a fixed `px` width and height. Use full-viewport layout (`100dvw` / `100dvh`) instead.

---

## [LIFECYCLE]

REQUIRED: Any component that subscribes to an Observable or needs lifecycle-triggered logic MUST
  extend `BaseComponent` from `src/app/base/base.component.ts`.

REQUIRED: Use `this.init$.pipe(takeUntil(this.destroyed$)).subscribe(...)` for logic that should
  run on init. Do NOT override `ngOnInit` directly.

REQUIRED: Use `takeUntil(this.destroyed$)` on every Observable subscription to ensure automatic
  cleanup when the component is destroyed.

FORBIDDEN: Implement `OnInit` or `OnDestroy` directly in a component that extends `BaseComponent`.
  `BaseComponent` already implements these hooks — override them only to call `super.*` methods.

FORBIDDEN: Store a `Subscription` reference and call `.unsubscribe()` in `ngOnDestroy`.
  Use `takeUntil(this.destroyed$)` instead.

FORBIDDEN: Override `ngOnDestroy` in a component extending `BaseComponent` without calling
  `super.ngOnDestroy()` — this would break the teardown chain.

EXAMPLE (correct):
```ts
export class MyComponent extends BaseComponent {
  private readonly myService = inject(MyService);

  constructor() {
    super();
    this.init$.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.myService.someObservable$.pipe(takeUntil(this.destroyed$)).subscribe(value => {
        // handle value
      });
    });
  }
}
```

---

## [KEY-FILES]

### src/styles.scss
- PURPOSE: Single source of all CSS custom properties (design tokens).
- REQUIRED: All color, typography, and spacing tokens defined here as `:root { --token: value }`.
- FORBIDDEN: Hardcode any design value (color, font, size) in a component SCSS file.
- REQUIRED: Import Google Fonts here via `@import url(...)` if a custom font is used.
- REQUIRED: Set `direction: rtl` on `html, body` for RTL projects.
- REQUIRED: Set `font-family` on `html, body` here — never in a component.

### src/app/base/base.component.ts
- PURPOSE: Abstract directive providing RxJS lifecycle streams.
- USE WHEN: A component subscribes to an Observable and needs automatic teardown.
- PATTERN: `someObservable$.pipe(takeUntil(this.destroyed$)).subscribe(...)`.
- DO NOT USE: For components that only use Signals — Signals clean up automatically.
- FORBIDDEN: Override `ngOnDestroy` without calling `super.ngOnDestroy()`.

### src/app/base/base-sap-api.service.ts
- PURPOSE: Abstract base for SAP OData services.
- REQUIRED: Every `apiAdapter.ts` that calls SAP extends this class.
- REQUIRED: Set `protected readonly service = 'ZREAL_SRV_NAME'` in each concrete class.
- FORBIDDEN: Use `'ZTEMP_SRV'` in production code — it is a template placeholder.

### src/app/app.routes.ts
- REQUIRED: All routes use `loadComponent` (lazy loading). No eagerly loaded feature components.
- REQUIRED: Routes that use the `Api` adapter declare `providers: [...FeatureProviders.Api]` at the route level.
- FORBIDDEN: Import `adapter.mock` or `adapter.sap` at the app routes level for production routes.
- PATTERN:
  ```ts
  {
    path: 'home',
    loadComponent: () => import('./features/home').then(m => m.HomeComponent)
  }
  ```

### src/app/core/services/logger.service.ts
- REQUIRED: Use `LoggerService` for ALL logging (inject via DI).
- FORBIDDEN: Use `console.log`, `console.error`, `console.warn` directly in application code.
- PATTERN: `private readonly logger = inject(LoggerService); this.logger.log('msg', data);`
- TYPES: `LoggerType.Console` (dev) | `LoggerType.Matomo` (prod — stub, pending implementation).

### src/app/core/services/auth/auth.service.ts
- REQUIRED: Use `AuthService.getCurrentUser()` to get the current user signal.
- REQUIRED: In `app.config.ts`, include `...AuthProviders.Mock` for dev, `...AuthProviders.Sso` for prod.
- The mock user is `{ displayName: 'ישראל ישראלי', personalNumber: '123456789' }`.

### proxy.config.json
- PURPOSE: Dev-only proxy from `/api/**` to SAP Gateway host.
- REQUIRED: Fill in the real SAP hostname when deploying to network.
- REMINDER: This file has no effect in production (BSP deployment on SAP server).

---

## [PROTECTED-FILES]

The following files MUST NOT be modified unless the task explicitly states to change them.
They form the infrastructure of the template and changes to them have wide-ranging side effects.

| File | Reason |
|------|--------|
| `src/app/base/base-api.service.ts` | Core HTTP abstraction — changes break every API adapter |
| `src/app/base/base-sap-api.service.ts` | Core SAP OData abstraction — changes break every SAP adapter |
| `src/app/base/utilities.ts` | Shared SAP utility functions — breaking signature changes silently fail |
| `src/app/core/interceptors/cache.interceptor.ts` | Global HTTP cache — changes affect all requests app-wide |
| `src/app/base/base.component.ts` | RxJS lifecycle base — changes affect all components that extend it |
| `src/app/base/base-overlay.service.ts` | Overlay CDK abstraction — changes affect loading and splash |
| `src/app/core/services/auth/adapters/interface.ts` | Auth contract — changes break both mock and SSO adapters |
| `src/app/core/services/auth/adapters/api/mockAdapter.ts` | Auth mock — must match the interface exactly |
| `src/app/core/services/auth/adapters/api/ssoAdapter.ts` | Auth SSO adapter — network-specific implementation |
| `src/app/core/services/auth/adapters/providers.ts` | Auth provider wiring — changes affect the entire auth flow |
| `src/app/core/services/auth/auth.service.ts` | Auth service — changes affect every component using the current user |

RULE: If you believe a change to one of these files is needed, stop and ask the user to confirm explicitly before making any edit.

---

## [README]

REQUIRED: Generate `README.md` at the start of every new project.
REQUIRED: README must contain:
  1. Project name and one-sentence purpose
  2. Tech stack (Angular version, key dependencies)
  3. Folder structure overview (copy from [STRUCTURE] and annotate)
  4. How to run locally (`npm start`)
  5. How to build for production (`ng build`)
  6. How to deploy (`grunt deploy --user=X --pass=Y --tr=Z`)
  7. Architecture notes: adapter pattern, auth flow, i18n setup
  8. Glossary / Cookbook: domain terms used in this project
     - Format: `Term | Hebrew | Definition`
     - Example: `Frame | מסגרת | An operational unit tracked in the system`
REQUIRED: Update README when adding a new feature or changing architecture.
REQUIRED: README is written in English.
FORBIDDEN: Leave README as the default Angular CLI placeholder.

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
    - Map all colors to CSS custom property tokens in `src/styles.scss`.
    - Do not invent colors — use only what Figma provides.
  IF NO:
    ASK: "What font family should be used?" (wait for answer)
    ASK: "What is the primary color and background color?" (wait for answer)
    FORBIDDEN: Proceed with placeholder or invented colors.

STEP 2 — Define tokens before components:
  - Write all tokens into `src/styles.scss` `:root` block FIRST.
  - Only then write component SCSS that references those tokens.

---

## [SCSS]

REQUIRED — Units:
  - `width`, `height`, `margin`: use `%`, `vw`, `vh`, `dvh`, `dvw`. FORBIDDEN: `rem` for these.
  - `padding`, `gap`, `margin`: use `%`, `vw`, `vh`, `dvh`, `dvw`. FORBIDDEN: `rem` for these.
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
  - REQUIRED: Use CSS custom properties from `src/styles.scss` — never hardcode colors or spacing in component SCSS.

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

REQUIRED: All color tokens defined in `src/styles.scss` `:root` block.

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
  - When adding a new component: define its tokens as `--<component>-<role>` in `src/styles.scss`

### Rules
FORBIDDEN: Generic names like `--color-primary`, `--color-surface`, `--color-on-primary` — these are ambiguous about which component they belong to.
FORBIDDEN: Reference a color token not defined in `src/styles.scss`.
FORBIDDEN: Use `rgba(...)` or `#hex` directly in component SCSS.
REQUIRED: Each feature should be potentially standalone — avoid reusing component-scoped tokens across features. If two components share a color, promote it to a generic token with a semantic name.

---

## [TYPOGRAPHY]

REQUIRED: Font family set once on `html, body` in `src/styles.scss`.
REQUIRED: Import custom fonts via `@import url(...)` at top of `src/styles.scss`.
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

## [NAMING]

### TypeScript classes
- Components: `PascalCase` + suffix — `HomeComponent`, `DocCardComponent`
- Services: `PascalCase` + `Service` — `AuthService`, `HomeService`
- Pipes: `PascalCase` + `Pipe` — `SapDatePipe`
- Directives: `PascalCase` + `Directive` — `AutoFocusDirective`
- Interfaces: `PascalCase`, no `I` prefix — `DocCard`, `AuthUser`
- Enums: `PascalCase` — `DocStatus`, `LoggerType`
- Injection tokens: `SCREAMING_SNAKE_CASE` — `AUTH_PROVIDER`, `LOGGER_TYPE`
- Abstract base classes: `Base` prefix — `BaseComponent`, `BaseSapApiService`

### Variables and properties
- All: `camelCase`
- REQUIRED: Always descriptive, never abbreviated beyond common conventions
- FORBIDDEN: Single-letter names in ANY context including loops, callbacks, map/filter/reduce/find/forEach
  ```ts
  // FORBIDDEN
  items.forEach((i) => process(i));
  const x = getUser();
  users.map(u => u.name);
  features.filter((f) => f.active);
  receipts.map((r) => r.name);
  columns.map((c) => c.key);

  // REQUIRED — use the domain noun as the parameter name
  items.forEach((item) => process(item));
  const currentUser = getUser();
  users.map(user => user.name);
  features.filter((feature) => feature.active);
  receipts.map((receipt) => receipt.name);
  columns.map((column) => column.key);
  ```
- FORBIDDEN: Generic names like `data`, `result`, `response`, `obj`, `temp`, `val`
  - Use domain names: `docCards`, `authUser`, `sapResponse`
- Boolean variables: prefix with `is`, `has`, `can`, `should`
  - `isLoading`, `hasError`, `canEdit`, `shouldRefresh`
- Observable streams: suffix with `$`
  - `destroyed$`, `init$`, `dataLoaded$`
- Signals: no suffix — `displayName`, `isLoading`, `cards`
- Private class members: prefix with nothing (TypeScript `private` keyword is sufficient)
  - FORBIDDEN: `_privateField` underscore prefix convention

### CSS classes
- kebab-case always
- Semantic, descriptive: `.doc-card`, `.status-pill`, `.create-btn`
- Nesting mirrors HTML: `.doc-card > .doc-card__header > .doc-card__title`
- State modifiers: `--` separator: `.doc-card--selected`, `.status-pill--late`
- FORBIDDEN (STANDARDS:[NAMING]:bem-modifier-single-hyphen): CSS state/variant classes using a single extra hyphen block (e.g. `.btn-primary`) — use BEM `--` (e.g. `.btn--primary`).
- FORBIDDEN (STANDARDS:[NAMING]:generic-layout-class): Layout/list class names without a block prefix (e.g. `.file-list`, `.two-pane`, `.wrapper`) — use `<feature-block>__<element>`.
- FORBIDDEN: Generic names: `.container`, `.wrapper`, `.box`, `.item` (without context prefix)
- FORBIDDEN: Camel or PascalCase in CSS

### Files
- Components: `<feature-name>.component.ts` / `.html` / `.scss`
- Services: `<feature-name>.service.ts`
- Pipes: `<name>.pipe.ts`
- Types: `types.ts` (per feature), `utility.types.ts` (base)
- Mock data: `<feature>-mock.data.ts`
- Adapters: `adapter.mock.ts`, `adapter.sap.ts` (exact names, lowercase camel)
- Barrel: `index.ts`

### Constants
- Module-level (exported): `SCREAMING_SNAKE_CASE`
  ```ts
  export const MAX_CARDS_PER_PAGE = 20;
  export const SAP_DATE_REGEX = /\/Date\((\d+)\)\//;
  ```
- Local `const` inside a function: `camelCase`
  ```ts
  const formattedDate = formatDate(card.readinessDate);
  ```

---

## [NULL-POLICY]

FORBIDDEN: Initialize any variable or property to `null`.
  ```ts
  // FORBIDDEN
  private currentUser: AuthUser | null = null;
  let selectedCard: DocCard | null = null;

  // REQUIRED
  private currentUser: AuthUser | undefined;
  let selectedCard: DocCard | undefined;
  ```

FORBIDDEN: Compare to `null` with `=== null` or `!== null`.
  ```ts
  // FORBIDDEN
  if (value === null) { ... }
  if (response !== null) { ... }

  // REQUIRED
  if (value === undefined) { ... }   // only when you specifically mean undefined
  if (value != null) { ... }         // FORBIDDEN — use truthiness or optional chaining
  if (value) { ... }                 // OK for truthy check
  value?.property                    // REQUIRED for optional access
  value ?? fallback                  // REQUIRED for nullish fallback
  ```

FORBIDDEN: Return `null` from any function.
  ```ts
  // FORBIDDEN
  getUser(): AuthUser | null { return null; }

  // REQUIRED
  getUser(): AuthUser | undefined { return undefined; }
  // OR return a typed empty value:
  getCards(): DocCard[] { return []; }
  ```

REQUIRED: TypeScript `strictNullChecks` is always `true`. Write code accordingly.
REQUIRED: Use optional chaining `?.` for any access that may be undefined.
REQUIRED: Use nullish coalescing `??` for fallback values.
  ```ts
  const name = user?.displayName ?? 'Unknown';
  const count = data?.items?.length ?? 0;
  ```

EXCEPTION: SAP OData responses may return `null` — when parsing SAP data, handle `null`
  at the adapter boundary and convert to `undefined` before passing to the component.

### `| undefined` and `?` usage policy
REQUIRED: Use `| undefined` (and optional `?`) ONLY for values that are genuinely absent mid-lifecycle:
  - Timers set after user action: `private loadingTimer: ReturnType<typeof setTimeout> | undefined`
  - Lazy references initialized after `ngOnInit` or a user event
  - Signals holding UI state that hasn't been populated yet (e.g. result of a button click)

FORBIDDEN: Use `| undefined` for local component state that has a valid empty default:
  ```ts
  // FORBIDDEN
  protected readonly isLoading = signal<boolean | undefined>(undefined);
  protected readonly errorMessage = signal<string | undefined>(undefined);

  // REQUIRED — use typed empty defaults
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  ```

RULE: If the absence of a value needs to be rendered differently in the template (e.g. `@else` block),
  `| undefined` is acceptable. If the component always has a value after init, use a default instead.
  Do not add `| undefined` "just in case" — it pollutes every consumer with unnecessary `?.` chains.

---

## [I18N]

REQUIRED: Every user-visible string in a template MUST have an `i18n` attribute. No exceptions.
REQUIRED: Use `i18n="@@key"` syntax (double-at ID only, no description prefix needed).
  ```html
  <!-- REQUIRED -->
  <h1 i18n="@@home.welcomeHeading">ברוכים הבאים</h1>
  <button i18n="@@home.createButton">יצירה</button>
  <span i18n="@@home.card.readinessDate">תאריך מוכנות:</span>

  <!-- FORBIDDEN -->
  <h1>ברוכים הבאים</h1>
  <button>יצירה</button>
  ```

REQUIRED: Key format: `<feature>.<element>[.<qualifier>]`
  - `home.welcomeHeading`
  - `home.card.readinessDate`
  - `sidebar.activations`
  - `topbar.greeting`

REQUIRED: Add every new key to `src/locale/i18n/he.json` under `"translations"` immediately.
  ```json
  {
    "locale": "he",
    "translations": {
      "home.welcomeHeading": "ברוכים הבאים, {$INTERPOLATION}",
      "home.createButton": "יצירה"
    }
  }
  ```

REQUIRED: Interpolations in i18n strings use `{$INTERPOLATION}` in `he.json`.
  ```html
  <h1 i18n="@@home.welcomeHeading">Welcome, {{ displayName() }}</h1>
  ```
  ```json
  "home.welcomeHeading": "ברוכים הבאים, {$INTERPOLATION}"
  ```

FORBIDDEN: Hardcode any Hebrew (or any language) text in a template without an i18n key.
FORBIDDEN: Use `$localize` or `{{ $localize`...` }}` in HTML templates — use `i18n` attribute only.
FORBIDDEN: Leave an `i18n` or `$localize` key without a corresponding entry in `he.json`.

REQUIRED: User-visible strings defined in TypeScript (constants, services, computed UI labels) MUST use `$localize`:@@key:...` with the same `@@key` IDs and `he.json` entries as templates.
  ```typescript
  export const FEATURES = [
    { id: 'store', label: $localize`:@@feature.store.label:Store name` },
  ];
  protected receiptSummary(): string {
    return $localize`:@@results.receipts:${this.count}:count: receipts`;
  }
  ```

REQUIRED: Named placeholders in `he.json` must match the placeholder name in the source.
  - Template `{{ value() }}` bindings → `{$INTERPOLATION}` in `he.json`.
  - `$localize`:@@key:${count}:count: receipts` → `{$count}` in `he.json` (not `{$PH}`).
  ```json
  "results.receipts": "{$count} קבלות"
  ```

REQUIRED: When running `npm start` or `ng serve` without a locale configuration, the app runs in English (source locale).
REQUIRED: To test Hebrew in development, use `npm run start:he` (`ng serve --configuration=development,he`).
  This applies both development settings (e.g. `environment.development.ts`) and Hebrew localization.
DEFAULT: Raw `ng serve --configuration=he` without `development` skips dev file replacements — prefer `npm run start:he`.
REQUIRED: Production build localizes to Hebrew: `ng build` (defaultConfiguration=production includes `localize: ["he"]`).

---

## [ADAPTER-PATTERN]

PURPOSE: Decouple components from data source. Switch between mock data and SAP OData
  without changing any component or service code — only the route-level provider changes.

### Structure (required for every data-fetching feature):

```
adapters/
  interface.ts     — defines IFeatureAdapter
  providers.ts     — InjectionToken + Mock/Api provider arrays
  api/
    adapter.mock.ts — implements IFeatureAdapter with hardcoded data
    adapter.sap.ts  — implements IFeatureAdapter calling SAP via BaseSapApiService
```

### interface.ts pattern:
```ts
export interface IHomeAdapter {
  getCards(): Observable<DocCard[]>;
  createCard(card: Partial<DocCard>): Observable<DocCard>;
}
```

### providers.ts pattern:
```ts
export const HOME_ADAPTER = new InjectionToken<IHomeAdapter>('HOME_ADAPTER');

export const HomeProviders = {
  Mock: [{ provide: HOME_ADAPTER, useClass: HomeMockAdapter }],
  Api:  [{ provide: HOME_ADAPTER, useClass: HomeApiAdapter }],
};
```

NOTE: `export namespace MyFeatureProviders { export const Api: Provider[] = [...]; export const Mock: Provider[] = [...]; }` is an acceptable alternative to the `HomeProviders` const object — both satisfy the provider-array pattern.

### Service pattern (inject via token, never directly):
```ts
@Injectable()
export class HomeService {
  private readonly adapter = inject(HOME_ADAPTER);
  readonly cards = signal<DocCard[]>([]);

  loadCards(): void {
    this.adapter.getCards().subscribe(cards => this.cards.set(cards));
  }
}
```

### Route pattern:
```ts
// Development (mock):
{ path: 'home', loadComponent: () => import('./features/home').then(m => m.HomeComponent) }
// No providers = mock is default in app.ts

// Production (api):
{ path: 'home', providers: [...HomeProviders.Api], loadComponent: ... }
```

FORBIDDEN: Import `adapter.mock` or `adapter.sap` class directly in a component or service.
FORBIDDEN: Use `if (environment.production)` to switch adapters — use the provider pattern.
FORBIDDEN: Add an adapter discriminator field (e.g. `adapter: 'mock' | 'api'`) to result interfaces unless the consumer explicitly needs to distinguish the source. The adapter pattern's purpose is transparency — the consumer should not know or care which adapter is active.
REQUIRED: `mockAdapter.ts` returns data from `<feature>-mock.data.ts` — never inline mock data in the adapter.
REQUIRED: SAP date strings in mock data use the real OData format: `/Date(timestamp)/`.
REQUIRED: `apiAdapter.ts` extends `BaseSapApiService` and sets `protected readonly service = 'ZREAL_SRV'`.

---

## [SERVICES]

REQUIRED: Singleton services (auth, logging, loading, splash) MUST use `@Injectable({ providedIn: 'root' })`.
  - Examples: `LoadingService`, `SplashScreenService`.
  - Do NOT list them in any component or feature `providers` array.
  - They are automatically available application-wide via DI.

REQUIRED: All HTTP calls go through `BaseApiService._request()` or `BaseSapApiService.getEntity()` / `getEntitySet()`.
FORBIDDEN: Call `HttpClient` directly from components or feature services (see `[ANTI-PATTERNS]`).

REQUIRED: Adapter injection tokens (`AUTH_PROVIDER`, `HOME_ADAPTER`, etc.) are provided at the application level in `app.config.ts`, NOT in component decorators.
  ```ts
  // app.config.ts
  export const appConfig: ApplicationConfig = {
    providers: [
      ...,
      ...AuthProviders.Mock   // switch to AuthProviders.Sso after transfer
    ]
  };
  ```

FORBIDDEN: `providers: [...AuthProviders.Mock]` in a `@Component` decorator — this creates a component-scoped instance that breaks the singleton guarantee.

REQUIRED: Feature services (scoped to a route) use `@Injectable()` without `providedIn` and are listed in the route's `providers` array or the feature module.

---

## [TYPES]

REQUIRED: Always define a concrete interface or type for any structured data.

### types.ts file rule
REQUIRED: Every feature folder MUST have a `types.ts` file where all feature-specific interfaces and types are declared.
  - File location: `src/app/features/<feature-name>/types.ts`
  - All interfaces used by components, services, and adapters within the feature are declared here.
  - FORBIDDEN: Declare an interface inline inside a `.component.ts` or `.service.ts` file — always declare it in `types.ts`.
  - FORBIDDEN: Import a type from another feature's `types.ts` unless the relationship is explicit parent-child (two components of the same feature). If a type is needed in two features, extract it to `src/app/base/utility.types.ts` or a shared `types.ts`.

```
features/
  page2/
    types.ts         ← SapFormattedOutput, Page2AdapterResult live here
    pages/
      page-two.component.ts  ← imports from '../types'
    adapters/
      interface.ts   ← may also live in types.ts or stay as-is for adapter contract
```

### unknown usage
FORBIDDEN: `unknown` for component state (signals, class properties, template-bound values).
  ```ts
  // FORBIDDEN
  protected readonly result = signal<unknown>(undefined);

  // REQUIRED — import from feature types.ts
  // types.ts:
  export interface SapFormattedOutput {
    sapDateString: string;
    readableDate: string;
    formattedMessage: string;
  }
  // component:
  protected readonly result = signal<SapFormattedOutput | undefined>(undefined);
  ```

PERMITTED: `unknown` in these specific cases only:
  - Base service generics where the type is resolved by the caller: `_request<R>(...)` 
  - Genuine pass-through payloads (e.g. `payload: unknown` in an adapter result) where the component does not inspect the value
  - Error handler callbacks: `error: (err: unknown) => { ... }`

FORBIDDEN: `any` — always use `unknown` if the type is truly unknown, then narrow with `instanceof` or type guards.

DEFAULT (STANDARDS:[TYPES]:enum-for-closed-sets): For a fixed set of string values used in branching (e.g. grouping mode), prefer a string enum in the feature `types.ts` (or shared types) over raw string literals in services and templates.

---

## [CONSTANTS]

REQUIRED: Extract every magic string and magic number to a named constant.

FORBIDDEN:
  ```ts
  if (status === 'בוצע') { ... }         // magic string
  const chunks = items.slice(0, 20);     // magic number
  setTimeout(callback, 3000);            // magic number
  ```

REQUIRED:
  ```ts
  // In types.ts or constants.ts:
  export const DOC_STATUS = { DONE: 'בוצע', STANDBY: 'כוננות', LATE: 'באיחור' } as const;
  export const MAX_CARDS_PER_PAGE = 20;
  export const SPLASH_DURATION_MS = 3000;

  // Usage:
  if (status === DOC_STATUS.DONE) { ... }
  const chunks = items.slice(0, MAX_CARDS_PER_PAGE);
  ```

REQUIRED: Feature-level constants go in `features/<feature>/types.ts` or `features/<feature>/constants.ts`.
REQUIRED: App-level constants go in `src/app/core/constants.ts`.
FORBIDDEN: Duplicate the same constant in multiple files — define once, import everywhere.

SAP-specific:
REQUIRED: SAP service name (`'ZREAL_SRV'`) is a constant, not a string literal in method calls.
REQUIRED: SAP entity set names (`'DocSet'`, `'FrameSet'`) are constants in `types.ts`.

---

## [COMMENTS]

FORBIDDEN: Comments that restate what the code does.
  ```ts
  // FORBIDDEN
  // Increment counter
  counter++;

  // FORBIDDEN
  // Return the user
  return user;

  // FORBIDDEN
  // Loop through items
  items.forEach(item => process(item));
  ```

REQUIRED: JSDoc on all public methods of services and pipes.
  ```ts
  /**
   * Transforms a SAP OData date string to DD.MM.YYYY display format.
   * Returns empty string for null/undefined input.
   */
  transform(value: string | undefined): string { ... }

  /**
   * Loads all document cards for the current user from the adapter.
   * Updates the `cards` signal on success.
   */
  loadCards(): void { ... }
  ```

REQUIRED: Inline comments only for:
  - Workarounds (explain why the workaround exists and link to issue if possible)
  - Non-obvious architectural decisions
  - Known limitations or TODOs with owner
  - Complex regex or algorithm logic

  ```ts
  // SAP returns null for missing dates — convert to undefined at adapter boundary
  readinessDate: sapItem.ReadinessDate ?? undefined,

  // TODO(team): Replace with real Matomo integration — see AFTER_TRANSFER.md §9
  console.log('[matomo]', message);

  // Negative lookahead prevents matching bsp_application_description
  const regex = new RegExp(`bsp_application(?!_description)`);
  ```

FORBIDDEN: Commented-out code in committed files. Delete dead code; use git history.
FORBIDDEN: `// eslint-disable` comments without an explanation of why.

---

## [TESTIDS]

PURPOSE: Enable Playwright E2E automation without coupling tests to CSS classes or text content.

REQUIRED: Every interactive element gets a `data-testid` attribute at component creation time.
REQUIRED: Format: `data-testid="<feature>-<element>[-<qualifier>]"`
  ```html
  <button data-testid="home-create-button">+ יצירה</button>
  <article data-testid="doc-card" *ngFor="...">
  <span data-testid="doc-card-status">{{ card.status }}</span>
  <a data-testid="sidebar-nav-home" routerLink="/home">בית</a>
  <input data-testid="filter-search-input" />
  ```

REQUIRED: Interactive elements that need testids:
  - All `<button>` elements
  - All `<a>` navigation links
  - All `<input>`, `<select>`, `<textarea>` elements
  - Card/list item containers (the repeating element)
  - Status indicators and dynamic content spans
  - Modal/dialog open triggers and close buttons

REQUIRED: `data-testid` is an ADDITION to the CSS class, never a replacement. Every element that has a `data-testid` must also have a CSS class for styling purposes.
  ```html
  <!-- FORBIDDEN — missing CSS class -->
  <button data-testid="home-create-button">+ יצירה</button>

  <!-- REQUIRED — both class (for styling) and data-testid (for Playwright) -->
  <button class="home-page__create-btn" data-testid="home-create-button">+ יצירה</button>
  ```

FORBIDDEN: Use CSS class names or text content as Playwright selectors (fragile).
FORBIDDEN: Add `data-testid` only to some elements — be consistent within a component.
FORBIDDEN: Duplicate `data-testid` values within the same component (use index for lists):
  ```html
  <!-- For lists, the container gets the testid; items get index qualifier if needed -->
  <div data-testid="doc-cards-list">
    @for (card of cards; track card.id) {
      <article [attr.data-testid]="'doc-card-' + card.id">
    }
  </div>
  ```

---

## [HTML-TEMPLATES]

PURPOSE: Rules for using `ng-container`, `ng-template`, and `*ngTemplateOutlet` correctly.

### `ng-container`
USE WHEN: You need a grouping element for structural directives (`@if`, `@for`, `[ngClass]`) but do not want an extra DOM node.
```html
<!-- REQUIRED — no unnecessary wrapper div -->
<ng-container *ngTemplateOutlet="loadingTpl" />

<!-- FORBIDDEN — adds a meaningless div to the DOM -->
<div *ngIf="isLoading">
  <app-spinner />
</div>
```

REQUIRED: Prefer `ng-container` over `<div>` or `<span>` when the element has no semantic meaning and carries no CSS class.

### `ng-template`
USE WHEN: A block of markup needs to be reused in two or more places within the same component template, OR when a conditional slot pattern is needed.

REQUIRED: Name template references descriptively with a `Tpl` suffix:
```html
<ng-template #emptyStateTpl>
  <p i18n="@@list.empty">No items found.</p>
</ng-template>

<ng-template #loadingTpl>
  <app-spinner />
</ng-template>
```

REQUIRED: Render with `*ngTemplateOutlet`:
```html
<ng-container *ngTemplateOutlet="isLoading ? loadingTpl : emptyStateTpl" />
```

FORBIDDEN: Use `ng-template` as a substitute for a component. If a template block is used in more than one component file, extract it into a standalone component instead.

FORBIDDEN: Leave unnamed template references (`#t`, `#tmpl`) — always use a descriptive name.

### Signals and inputs in templates
REQUIRED: Read signals in templates with `()` syntax — `{{ mySignal() }}`.
REQUIRED: Use `input.required<T>()` for required component inputs (complements `input()` in `[VERSIONS]`).

### Control flow vs structural directives
REQUIRED: Prefer Angular 17+ built-in control flow (`@if`, `@for`, `@switch`) over `*ngIf`/`*ngFor` for all new code.
```html
<!-- REQUIRED -->
@if (isLoading) { <app-spinner /> }
@for (card of cards; track card.id) { <app-doc-card [card]="card" /> }

<!-- FORBIDDEN for new code -->
<app-spinner *ngIf="isLoading" />
<app-doc-card *ngFor="let card of cards" [card]="card" />
```

---

## [ICONS]

FORBIDDEN (STANDARDS:[ICONS]:inline-svg-decorative): Inline `<svg>` in feature component templates for decorative UI icons (buttons, tags, toolbar actions).

FORBIDDEN (STANDARDS:[ICONS]:css-mask-data-uri): CSS `mask` / `-webkit-mask` with data-URI SVG icons in component SCSS for UI icons.

REQUIRED (STANDARDS:[ICONS]:asset-svg-files): Store icon SVGs under `src/assets/icons/<name>.svg`.

REQUIRED (STANDARDS:[ICONS]:mat-icon-registry): Register icons once via `MatIconRegistry.addSvgIcon(name, sanitizer.bypassSecurityTrustResourceUrl(...))`.

REQUIRED (STANDARDS:[ICONS]:mat-icon-template): Templates use `<mat-icon svgIcon="name" aria-hidden="true">`; import `MatIcon` in standalone component `imports`.

DEFAULT (STANDARDS:[ICONS]:icon-registry-service): Centralize registration in a core `IconRegistryService` (`providedIn: 'root'`) invoked at app bootstrap.

ASK (STANDARDS:[ICONS]:svg-exceptions): Before keeping inline `<svg>`, confirm with the user for brand marks with gradients, complex multi-path artwork, or animated loaders/spinners.

---

## [DYNAMIC-STYLES]

DEFAULT: Use static SCSS classes for all styling. Dynamic CSS is only acceptable when a value
  is truly runtime-computed (e.g. driven by a signal, animation progress, or user interaction)
  and cannot be represented by a finite set of CSS classes.

REQUIRED: When a dynamic value must be applied, use a CSS custom property set on the element:
  ```html
  <div [style.--progress-w]="progressWidth()"></div>
  ```
  Then reference `var(--progress-w)` in the component SCSS:
  ```scss
  .progress-fill { width: var(--progress-w); }
  ```

FORBIDDEN: `[style.property]="value"` bindings in templates — use the CSS custom property
  pattern above instead.
  ```html
  <!-- FORBIDDEN -->
  <div [style.width]="progressWidth()"></div>
  <div [style.top]="scanTop()"></div>

  <!-- REQUIRED -->
  <div [style.--progress-w]="progressWidth()"></div>
  <div [style.--scan-top]="scanTop()"></div>
  ```

FORBIDDEN: `style="..."` inline attribute in HTML templates — move all static positions
  and sizes to CSS modifier classes in the component SCSS.
  ```html
  <!-- FORBIDDEN -->
  <div class="doc-line" style="top: 20px; right: 15px;"></div>

  <!-- REQUIRED -->
  <div class="doc-line doc-line--1"></div>
  ```
  ```scss
  .doc-line--1 { top: 20px; right: 15px; }
  ```

FORBIDDEN: `[ngStyle]` directive.

FORBIDDEN: `[ngClass]` directive — use individual `[class.modifier]` bindings instead.

REQUIRED: `[class.modifier]` bindings are acceptable for boolean state classes:
  ```html
  <div [class.active]="isActive()" [class.disabled]="isDisabled()"></div>
  ```

REQUIRED: Hardcoded color hex values inside TypeScript component methods (e.g. syntax
  highlighters returning color strings) MUST use CSS token references (`var(--token)`)
  rather than hex/rgb literals. Define the tokens in `src/styles.scss`.

---

## [PLAYWRIGHT]

STATUS: Not yet active — pending Playwright project templates.

WHEN ACTIVATED:
  ASK: "Do you want Playwright E2E tests for this task?"
  IF YES:
    - REQUIRED: Add note: "Playwright standards are not yet fully documented —
      E2E patterns, page object model structure, and CI integration are pending a future STANDARDS update."
    - ASK: "Should I test via browser automation (real browser) or component-level code only?"
    - Proceed based on user answer.
  IF NO: proceed without E2E tests.

CURRENT REQUIREMENT (always active):
  - Add `data-testid` attributes as specified in [TESTIDS] — this is required NOW
    even though Playwright tests are not yet written, so they are ready when the agent activates.

---

## [ANTI-PATTERNS]

This section lists real mistakes. The AI must detect and refuse these patterns.

### SCSS / Styling
```scss
/* FORBIDDEN — hardcoded color */
.btn { background: #187AE9; }
/* REQUIRED */
.btn { background: var(--color-primary); }

/* FORBIDDEN — px layout */
.sidebar { width: 240px; height: 800px; }
/* REQUIRED */
.sidebar { width: 15rem; height: calc(100dvh - 6rem); }

/* FORBIDDEN — negative margin layout hack */
.card { margin-top: -20px; }
/* REQUIRED — use transform or adjust parent padding */
.card { transform: translateY(-1.25rem); } /* only if semantically correct */

/* FORBIDDEN — nesting that doesn't match DOM */
.parent {
  .unrelated-class { color: red; } /* not a child of .parent in HTML */
}

/* FORBIDDEN — !important */
.title { font-size: 2rem !important; }
```

### TypeScript / Angular
```ts
// FORBIDDEN — null initialization
private user: AuthUser | null = null;

// FORBIDDEN — null return
getUser(): AuthUser | null { return null; }

// FORBIDDEN — single-letter loop variable
items.forEach((i) => this.process(i));
users.map(u => u.name);

// FORBIDDEN — generic variable names
const data = this.adapter.getCards();
const result = parseSAPDate(value);

// FORBIDDEN — console.log
console.log('user loaded', user);
// REQUIRED
this.logger.log('user loaded', user);

// FORBIDDEN — direct adapter import in component
import { HomeMockAdapter } from './adapters/api/mockAdapter';

// FORBIDDEN — environment flag for adapter switch
if (environment.production) { useRealAdapter(); }

// FORBIDDEN — inline type in component
@Component(...)
export class HomeComponent {
  cards: { id: string; name: string }[] = []; // type should be in types.ts
}
```

### Templates / i18n
```html
<!-- FORBIDDEN — no i18n -->
<h1>ברוכים הבאים</h1>
<button>יצירה</button>

<!-- FORBIDDEN — hardcoded text without key -->
<span>{{ 'שלום' }}</span>

<!-- FORBIDDEN — missing data-testid on interactive element -->
<button (click)="onCreate()">+ יצירה</button>

<!-- REQUIRED -->
<h1 i18n="@@home.welcomeHeading">ברוכים הבאים</h1>
<button data-testid="home-create-button" i18n="@@home.createButton" (click)="onCreate()">יצירה</button>
```

### Architecture
```
FORBIDDEN (STANDARDS:[ANTI-PATTERNS]:feature-httpclient): Feature component directly calls HttpClient
FORBIDDEN (STANDARDS:[ANTI-PATTERNS]:direct-mock-adapter-import): Feature component directly imports MockAdapter
FORBIDDEN (STANDARDS:[ANTI-PATTERNS]:cross-feature-service): Two features sharing a service from features/<other-feature>/
FORBIDDEN (STANDARDS:[ANTI-PATTERNS]:route-component-in-core): Putting a route-specific component in core/components/
FORBIDDEN (STANDARDS:[ANTI-PATTERNS]:app-state-in-feature-service): Putting app-wide state in a feature service
FORBIDDEN (STANDARDS:[ANTI-PATTERNS]:barrel-non-route-export): Barrel index.ts exporting anything other than the routed component
FORBIDDEN (STANDARDS:[ANTI-PATTERNS]:cross-feature-types-import): types.ts importing from another feature's types.ts (use shared/ instead)
```

### Files / Structure
```
FORBIDDEN: Inline styles array in component for non-trivial styles (>30 lines)
FORBIDDEN: Magic SAP service name 'ZTEMP_SRV' in any non-template file
FORBIDDEN: Committed commented-out code blocks
FORBIDDEN: Multiple components in one .ts file
FORBIDDEN: he.json key without corresponding `i18n="@@key"` in a template or `$localize`:@@key:...` in TypeScript (and vice versa)
```

### Layout / Shell
```
FORBIDDEN: showTopBar = signal(true) or showSideBar = signal(true) when the bar is not
  actually rendered and populated in the application.
FORBIDDEN: Fixed-pixel "app window" wrapper (e.g. width: 1080px; height: 740px) — use
  full-viewport layout (100dvw / 100dvh) instead.
FORBIDDEN: A feature-owned fixed header without a corresponding --shell-titlebar-height
  token in src/styles.scss, or without padding-top on the content area below it.
```

---

## [DICTIONARY]

Domain terms used across projects. Format: `Term | Hebrew | Definition`

| Term | Hebrew | Definition |
|------|--------|------------|

---

## [PROJECT-AMENDMENTS] — Precedence

REQUIRED: For this repo, rules documented here (with a Rule ID) override conflicting base STANDARDS when you cite that Rule ID in a Standards check.

**Precedence order:**

1. Base STANDARDS sections above
2. This section and `.cursor/skills/toch-standards-skill/reference/08-user-amendments.md` (Inbox, Changelog, project-only rules)
3. Per-chat `Follow` / `Ignore` — session only until captured via `/toch-standards-review`

**Updates:** run `/toch-standards-review` or invoke the `toch-standards-amend` skill.

### Inbox (pending promotion)

| Date | Source | Change type | Target section | Rule ID | Promote | Summary |
|------|--------|-------------|----------------|---------|---------|---------|

### Changelog (promoted or kept as project-only)

| Date | Rule ID | Promoted | Files touched | Notes |
|------|---------|----------|---------------|-------|

### Project-only rules

_Add promoted `project-override` rules here with Rule IDs._

---

## [CHECKLIST] — Run before marking any task complete

Before responding "done" to the user, verify:

- [ ] All user-visible strings in templates have `i18n="@@key"` attribute
- [ ] All user-visible strings in TypeScript use `$localize`:@@key:...` with matching `he.json` keys
- [ ] All new i18n keys are added to `src/locale/i18n/he.json`
- [ ] All colors reference `var(--token)`, no hardcoded hex in component SCSS
- [ ] All layout dimensions use `rem`/`%`/`vw`/`vh`/`clamp()`, no `px` for layout
- [ ] No `null` initializations or `null` returns
- [ ] No single-letter or generic variable names
- [ ] No `console.log` — `LoggerService` used instead
- [ ] All interactive elements have `data-testid`
- [ ] New features have `adapters/` folder with `interface.ts`, `providers.ts`, `mockAdapter.ts`
- [ ] New types are in `types.ts`, not inline in the component
- [ ] No negative margins
- [ ] SCSS nesting mirrors HTML structure
- [ ] `README.md` updated if architecture changed
- [ ] `he.json` has no orphan keys (keys without a corresponding template usage)
- [ ] `showTopBar` and `showSideBar` signals set to `false` if bars are not used by the app
- [ ] Feature-owned fixed header uses `--shell-titlebar-height` token and content area has matching `padding-top`
- [ ] No `[style.property]` bindings — CSS custom property pattern used for all dynamic values
- [ ] No `style="..."` inline attributes — static positions/sizes moved to SCSS modifier classes
- [ ] No hardcoded hex/rgb color values in TypeScript methods — CSS token references used
- [ ] Components with Observable subscriptions extend `BaseComponent` and use `takeUntil(this.destroyed$)`
- [ ] No `implements OnInit/OnDestroy` in components that extend `BaseComponent`
- [ ] No single-letter names in any array callback (`map`, `filter`, `forEach`, `find`, `reduce`)
- [ ] TypeScript formatting: single quotes, `printWidth` 100, `override` on overridden methods
- [ ] Imports sorted: Angular core → Angular common → RxJS → project
- [ ] Components use `inject()`; template-bound state is `protected readonly`
- [ ] Signal reads in templates use `()` — `{{ mySignal() }}`; required inputs use `input.required<T>()`
- [ ] HTTP only via `BaseApiService._request()` or `BaseSapApiService` — no direct `HttpClient` in features
- [ ] If a Standards check was posted, the user's Follow or Ignore reply for that Rule ID was respected
- [ ] No decorative inline `<svg>` in feature templates (icons via `mat-icon` + assets — see `[ICONS]`)
- [ ] If new conventions were introduced this task → Standards documentation ASK was run and user choice respected
- [ ] Component uses `styleUrl` (no inline `styles: [...]` in `@Component`)
