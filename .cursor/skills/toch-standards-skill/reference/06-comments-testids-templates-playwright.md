# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

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

  <!-- REQUIRED -->
  <div [style.--progress-w]="progressWidth()"></div>
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

REQUIRED: `[class.modifier]` bindings are acceptable for boolean state classes.

REQUIRED: Hardcoded color hex values inside TypeScript component methods MUST use CSS token
  references (`var(--token)`) rather than hex/rgb literals. Define the tokens in `src/styles.scss`.

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

