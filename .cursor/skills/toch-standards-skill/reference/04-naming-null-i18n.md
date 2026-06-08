# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

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
- Adapters: `mockAdapter.ts`, `apiAdapter.ts` (exact names, lowercase camel)
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
