# Angular 20 Template

TOCH starter template for Angular / TypeScript / SAP OData projects with adapter-pattern architecture, i18n, and AI coding standards.

## Tech stack

- Angular 20.2+ (standalone components, signals, OnPush)
- TypeScript 5.8 (strict mode)
- RxJS 7.8
- Angular CDK (overlays)
- Angular Material (SVG icons via `MatIconRegistry`)
- `@angular/localize` (Hebrew production builds)
- `@toch/sap-utils` (local SAP OData helpers)

## Folder structure

```
src/
  polyfills.ts              — @angular/localize/init
  styles.scss               — global entry (@use partials)
  styles/
    variables.scss          — CSS design tokens (:root)
    global.scss             — shared utility classes (e.g. .btn)
    overlay.scss            — CDK overlay styles
  locale/i18n/he.json       — Hebrew translations
  assets/
    fonts/material-icons/   — Material Icons font CSS
    icons/                  — SVG icons for mat-icon
  app/
    app.ts                  — root shell component
    app.config.ts           — bootstrap providers (auth, HTTP, icons)
    app.routes.ts           — lazy-loaded routes
    base/                   — abstract bases (HTTP, SAP, lifecycle)
    core/
      components/           — shell: top-bar, side-bar, splash, spinner
      environments/         — prod + dev API paths
      interceptors/         — HTTP cache interceptor
      services/             — auth, loading, logger, splash, icon registry
    features/<name>/        — one route per feature
      index.ts              — barrel: routed component only
      types.ts              — feature types
      pages/                — routed page component
      services/             — feature state store
      adapters/             — mock + API adapters (data features)
    shared/                 — cross-feature pipes, directives, components
```

## Run locally

```bash
npm install
npm start              # English source locale + dev environment
npm run start:he       # Hebrew UI + dev environment
```

Dev server proxies `/api/**` to SAP Gateway when `proxy.config.json` is configured.

## Build for production

```bash
ng build
```

Production build localizes to Hebrew (`localize: ["he"]`) and outputs to `dist/angular-20-template/browser/he/`.

## Deploy to SAP BSP

Configure `Gruntfile.js` with your SAP server, BSP container, and credentials, then:

```bash
ng build
grunt deploy --user=YOUR_USER --pass=YOUR_PASS --tr=YOUR_TRANSPORT
```

## Architecture

### Adapter pattern

Data-fetching features expose an adapter interface and register `Mock` or `Api` providers at the **route** level. Components and feature services inject the token — never a concrete adapter class.

See `src/app/features/page2/` for the reference implementation.

### Auth

`AuthProviders.Mock` is wired in `app.config.ts` for local development. Swap to `AuthProviders.Sso` for production SSO. Components read the current user via `AuthService.getCurrentUser()`.

### i18n

- Source locale (English): default `npm start`
- Hebrew dev: `npm run start:he`
- Every user-visible template string uses `i18n="@@key"`
- TypeScript UI strings use `$localize`:@@key:...`
- Keys are mirrored in `src/locale/i18n/he.json`

### Icons

SVG assets live in `src/assets/icons/`. `IconRegistryService` registers them at bootstrap; templates use `<mat-icon svgIcon="name">`.

## Glossary / Cookbook

| Term | Hebrew | Definition |
|------|--------|------------|
| Adapter | מתאם | Abstraction that swaps mock data for SAP OData without changing components |
| Feature | פיצ'ר | One routed page area under `src/app/features/<name>/` |
| Shell | מעטפת | App-level chrome: top-bar, side-bar, splash-screen, spinner |
| OData | — | SAP REST protocol consumed via `BaseSapApiService` |
| BSP | — | SAP Business Server Pages deployment target for this template |

## Standards

Development rules live in [STANDARDS.md](STANDARDS.md). Cursor loads split references from `.cursor/skills/toch-standards-skill/reference/`.
