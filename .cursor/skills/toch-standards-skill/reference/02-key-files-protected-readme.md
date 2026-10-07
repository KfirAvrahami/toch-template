# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

---

## [KEY-FILES]

### src/styles.scss
- PURPOSE: Global entry file. Uses `@use` to pull in partials; contains only document-level base rules (`html`, `body`, box-sizing, `@import` for fonts, `direction: rtl`).
- REQUIRED (STANDARDS:[SCSS]:split-variables-and-global): Keep this file as the entry point only — `@use` partials, plus `html`/`body` base rules.
- FORBIDDEN (STANDARDS:[SCSS]:no-h-utils-in-styles-entry): Do not define utility classes or `:root` token blocks directly in `src/styles.scss` — place them in the dedicated partials below.
- REQUIRED: Set `direction: rtl` on `html, body` for RTL projects.
- REQUIRED: Set `font-family` on `html, body` here — never in a component.
- REQUIRED: Use only self-hosted or system fonts — no `@import url(external)` calls. This project deploys to a private network with no internet access.
- EXAMPLE:
  ```scss
  // src/styles.scss
  @use './styles/variables';
  @use './styles/global';
  @use './styles/overlay';
  ```

### src/styles/variables.scss
- PURPOSE: Single source of all CSS custom properties (design tokens).
- REQUIRED: All color, typography, and spacing tokens defined here as `:root { --token: value }` and `[data-theme] { --token: value }`.
- FORBIDDEN: Hardcode any design value (color, font, size) in a component SCSS file.

### src/styles/global.scss
- PURPOSE: Shared utility classes used across multiple features (e.g. scroll helpers, animation utilities, shared layout helpers).
- REQUIRED: Only classes the template or app actually uses.
- FORBIDDEN: Hardcode component-specific styles here — those belong in the component's own `.scss` file.

### src/app/base/base.component.ts
- PURPOSE: Abstract directive providing RxJS lifecycle streams.
- USE WHEN: A component subscribes to an Observable and needs automatic teardown.
- PATTERN: `someObservable$.pipe(takeUntil(this.destroyed$)).subscribe(...)`.
- DO NOT USE: For components that only use Signals — Signals clean up automatically.
- FORBIDDEN: Override `ngOnDestroy` without calling `super.ngOnDestroy()`.

### src/app/base/base-sap-api.service.ts
- PURPOSE: Abstract base for SAP OData services.
- REQUIRED: Every `adapter.sap.ts` that calls SAP extends this class.
- REQUIRED: Set `protected readonly service = 'ZREAL_SRV_NAME'` in each concrete class.
- FORBIDDEN: Use `'ZTEMP_SRV'` in production code — it is a template placeholder.
- BEHAVIOR: Reads force JSON (`$format=json` + `accept: application/json`; OData V2 defaults to XML), send
  `sap-language` from the active `LOCALE_ID` (`he-IL` -> `HE`), time out after 30s and retry once.
  `$count` gets no `$format` (it is plain text). Writes are never retried (no double submit).
- FORBIDDEN: Hard-code `sap-language` or `$format` in an adapter — the base sets both.

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
| `src/app/core/services/auth/adapters/api/adapter.mock.ts` | Auth mock — must match the interface exactly |
| `src/app/core/services/auth/adapters/api/adapter.sso.ts` | Auth SSO adapter — network-specific implementation |
| `src/app/core/services/auth/adapters/providers.ts` | Auth provider wiring — changes affect the entire auth flow |
| `src/app/core/services/auth/auth.service.ts` | Auth service — changes affect every component using the current user |

RULE: If you believe a change to one of these files is needed, stop and ask the user to confirm explicitly before making any edit.

---

## [BUILD-DEPLOY]

PURPOSE: These projects ship to SAP as a BSP application (no Node runtime on the server). The Angular
  app is built to static files and uploaded to the SAP UI5 ABAP repository via Grunt. Dev runs locally
  and proxies OData calls to a SAP gateway.

### Build
REQUIRED: Production build is `ng build`. The deployable output is the browser bundle:
  `dist/<project-name>/browser`, or `dist/<project-name>/browser/<lang>` (e.g. `.../browser/he`) when the
  project builds one bundle per locale. The deploy task uploads that folder, not the `dist/` root.
FORBIDDEN: Hand-edit anything under `dist/` — it is generated.

### Dev serve (against SAP)
DEFAULT: Local dev is `ng serve` with an Angular proxy config (`proxy.config.json`, referenced by the
  `serve` target's `proxyConfig` in `angular.json`) to forward OData calls to a SAP gateway and avoid CORS.
  Keep the real gateway host OUT of the committed file — use a placeholder:
```json
{
  "/api": {
    "target": "https://your-sap-gateway-host.example.com",
    "secure": true,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "/sap/opu/odata/sap" }
  }
}
```

### Deploy (SAP BSP upload, S/4HANA 2023)
REQUIRED: Pin the deploy tools to these EXACT versions in `devDependencies` (no `^`/`~`):
  `grunt` `1.4.1`, `grunt-nwabap-ui5uploader` `2.2.0`, `ui5-nwabap-deployer-core` `2.2.0`.
REQUIRED: Lock the deployer's dependencies with this npm `overrides` block, plus the matching yarn
  `resolutions` block (one entry per line below, prefixed `ui5-nwabap-deployer-core/`):
```json
"overrides": {
  "ui5-nwabap-deployer-core": {
    ".": "2.2.0",
    "axios": "0.21.4",
    "retry-axios": "2.6.0",
    "xmldoc": "1.2.0",
    "yazl": "2.5.1"
  }
}
```
REQUIRED: `grunt deploy` runs two tasks, in this order:
  1. `prepareDeploy` — copies the marker files (see below) from the project root into the build output.
  2. `deployAbap` — uploads the build output with `ui5-nwabap-deployer-core`'s `deployUI5toNWABAP`.
  The `nwabap_ui5uploader` task is NOT run. Its config block only holds `resources.cwd` / `resources.src`;
  do not put `conn` / `auth` / `ui5` options there (the uploader no longer reads them).
REQUIRED: Collect the files with `dot: true` (so the dot-named marker files are included) and read them
  as binary (`encoding: null`):
```js
const files = grunt.file
  .expand({ cwd: cwd, filter: 'isFile', dot: true }, src) // src: ['**/*.*', '.Ui5RepositoryBinaryFiles', '.Ui5RepositoryTextFiles']
  .map((filePath) => ({ path: filePath, content: grunt.file.read(cwd + '/' + filePath, { encoding: null }) }));

require('ui5-nwabap-deployer-core').deployUI5toNWABAP(
  {
    conn: { server: upload.hostname, client: upload.client, useStrictSSL: false }, // self-signed on-prem cert
    auth: { user: upload.username, pwd: upload.password },
    ui5: {
      package: upload.package, bspcontainer: upload.bsp_application,
      bspcontainer_text: upload.bsp_application_description, transportno: upload.change_request_id,
      create_transport: false, language: 'HE'
    }
  },
  files,
  logger // { log, error, logVerbose } -> grunt.log / grunt.verbose
);
```
REQUIRED: Credentials and transport come from the command line, NEVER from a committed file:
  `npm run deploy -- --user=X --pass=Y --tr=Z` (optional: `--bspname=A --bspdesc=B --pkg=C`).
  The `deploy` task copies them into `settings.upload`, then fails fast (`grunt.fail.fatal`) before
  uploading anything if the host, `--user`, `--pass`, or `--tr` (unless the package is `$TMP`) is missing.
DEFAULT: Mask the password in the deployer's verbose log (`"pwd":"***"`).
FORBIDDEN: Combine `--pass` with `--verbose` — grunt echoes the raw command-line options in verbose mode.

### Marker files (S/4HANA 2023)
REQUIRED: Commit `.Ui5RepositoryBinaryFiles` and `.Ui5RepositoryTextFiles` at the PROJECT ROOT. Each line
  is a regex for a file TYPE (not a file path). SAP stores matches of the binary list as MIME objects and
  matches of the text list as codepage-aware text objects. Baseline content:
```
.Ui5RepositoryBinaryFiles      .Ui5RepositoryTextFiles
^.*\.woff$                     ^.*\.md$
^.*\.woff2$                    ^.*\.map$
^.*\.ttf$                      ^.*\.txt$
^.*\.otf$                      ^.*\.webmanifest$
^.*\.eot$
^.*\.mp3$
^.*\.svg$
^.*\.ico$
^.*\.wasm$
```
RULE: When the upload fails with `/UI5/UI5_REP_LOAD/072` ("Type of file <path> is unknown"), add that
  file's extension to one list. Open the file in a text editor: unreadable content → binary list;
  readable text → text list. A type belongs to ONE list only.
REQUIRED: Keep both files LF-only — in `.gitattributes`: `.Ui5RepositoryBinaryFiles text eol=lf` and
  `.Ui5RepositoryTextFiles text eol=lf`.
NOTE: Reference implementation: the `zcheckit_angular` project.
NOTE: Stricter TypeScript can fail the pipeline build in `sweetalert2` calls — cast the options:
  `Swal.fire({ ... } as SweetAlertOptions)` with `import Swal, { SweetAlertOptions } from 'sweetalert2';`.

ANTI-PATTERN: Committing real SAP hostnames, usernames, passwords, or transport numbers to the repo.

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

