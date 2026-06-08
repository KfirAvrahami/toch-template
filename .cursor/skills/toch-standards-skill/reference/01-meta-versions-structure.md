# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

---

# STANDARDS — AI Development Rules
# Angular / TypeScript / SAP OData Projects
# Version: 1.0 | Template: angular-20-template
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

Pre-defined architecture Rule IDs are listed under `[ANTI-PATTERNS]` in `reference/07-anti-patterns-dictionary-checklist.md`. Full Standards check template: `.cursor/skills/toch-standards-skill/SKILL.md`.

### Standards precedence and updates

**Precedence order:** base `reference/01`–`07` → `reference/08-user-amendments.md` (`[PROJECT-AMENDMENTS]`) → per-chat Follow/Ignore until captured via review.

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
DEFAULT: Prefer inline `template` for small components; use `templateUrl` + `styleUrl` for complex ones.

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
            mockAdapter.ts
            apiAdapter.ts
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
- Adapter wiring details: see `[ADAPTER-PATTERN]` in `reference/05-architecture-services-types-constants.md`.

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

