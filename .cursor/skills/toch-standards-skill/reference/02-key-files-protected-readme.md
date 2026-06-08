# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

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
- FORBIDDEN: Import `MockAdapter` or `ApiAdapter` at the app routes level for production routes.
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

