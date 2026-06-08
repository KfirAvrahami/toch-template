# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

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

### Dynamic Styles
```
FORBIDDEN: [style.width]="value()" — use [style.--my-token]="value()" + SCSS var(--my-token)
FORBIDDEN: style="top: 12px; right: 8px;" inline attributes — move to SCSS modifier classes
FORBIDDEN: [ngStyle] directive
FORBIDDEN: [ngClass] directive — use [class.modifier] instead
FORBIDDEN: Hardcoded hex/rgb values in TypeScript methods returning style strings —
  use CSS token references (var(--token)) and define tokens in src/styles.scss
```

### Lifecycle / Subscriptions
```
FORBIDDEN: implements OnInit, OnDestroy in components with Observable subscriptions —
  extend BaseComponent instead
FORBIDDEN: private sub?: Subscription; this.sub?.unsubscribe() in ngOnDestroy —
  use takeUntil(this.destroyed$) instead
FORBIDDEN: ngOnDestroy override in BaseComponent subclass without calling super.ngOnDestroy()
```

### Naming / Callbacks
```
FORBIDDEN: Single-letter callback parameter names in array methods:
  map((f) => ...), filter((r) => ...), forEach((c) => ...), find((i) => ...)
REQUIRED: Use the domain noun as the parameter name:
  map((feature) => ...), filter((receipt) => ...), forEach((column) => ...)
```

---

## [DICTIONARY]

Domain terms used across projects. Format: `Term | Hebrew | Definition`

| Term | Hebrew | Definition |
|------|--------|------------|

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
