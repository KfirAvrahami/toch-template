# After Transfer TODO

This document lists all changes that must be made after transferring this project to the company network.

---

## 1. Initialize the project

Run the init script once. It will interactively prompt for all project-specific values and fill in every placeholder across `angular.json`, `package.json`, and `Gruntfile.js` in one shot:

```bash
npm run initProjName
```

The script will ask for:

| Prompt | Replaces | Files |
|---|---|---|
| Project name | `angular-20-template` | `angular.json`, `package.json` |
| SAP Gateway hostname | `COPY_AFTER_TRANSFER` | `Gruntfile.js` |
| BSP container name | `bsp_application: 'PLACEHOLDER'` | `Gruntfile.js` |
| BSP description | `bsp_application_description: 'PLACEHOLDER'` | `Gruntfile.js` |
| SAP package | `package: 'PLACEHOLDER'` | `Gruntfile.js` |

> `username`, `password`, and `change_request_id` are intentionally left as `PLACEHOLDER` in `Gruntfile.js` — they are passed at runtime by the pipeline via `--user`, `--pass`, and `--tr`.

---

## 2. Add `.npmrc` file and switch `@toch/sap-utils` to registry

**a)** Add a `.npmrc` file to the project root configured to point at the company Artifactory npm registry.

**b)** In `package.json`, change the `@toch/sap-utils` dependency from the local file reference to the registry version:

```json
"@toch/sap-utils": "^1.8.0"
```

Then run `npm install`. All packages — including `@toch/sap-utils` — will be resolved from Artifactory.

---

## 3. Fill in the dev proxy target

`proxy.config.json` is already wired into `ng serve` via `angular.json`. You only need to fill in the actual SAP Gateway host:

```json
{
  "/api/**": {
    "target": {
      "host": "<your-sap-gateway-host>",
      "protocol": "https:",
      "port": "443"
    },
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": "/sap/opu/odata/sap"
    }
  }
}
```

> This only affects local development (`ng serve`). In production, the app is deployed directly on the SAP server so no proxy is needed.

---

## 4. Replace the SAP OData service name

`src/app/base/base-sap-api.service.ts` contains a placeholder service name:

```ts
protected readonly service = 'ZTEMP_SRV';
```

Replace `ZTEMP_SRV` with the real OData service name in every service that extends `BaseSapApiService`.

---

## 5. Switch auth from Mock to SSO

### a) Switch the provider in `src/app/app.ts`

Change:

```ts
providers: [...AuthProviders.Mock],
```

To:

```ts
providers: [...AuthProviders.Sso],
```

### b) Implement `SsoAuthAdapter` in `src/app/core/services/auth/adapters/api/ssoAdapter.ts`

The current implementation throws an error. Implement `getUser()` to return the authenticated user from your SSO mechanism (e.g. reading a cookie or a response header set by the SAP server).

The returned object must conform to the `AuthUser` interface defined in `src/app/core/services/auth/adapters/interface.ts`.

---

## 6. Delete the Page 2 feature

`src/app/features/page2` is a demo feature used to verify the template works. It must be removed before going live.

### Steps

1. Delete the `src/app/features/page2/` folder
2. Remove the `page-2` route from `src/app/app.routes.ts` (including its `Page2ApiProviders` import)
3. Remove the `/page-2` nav link from the side bar component (`src/app/core/components/side-bar/`)

---

## 7. Add Material Icons font

`src/assets/fonts/material-icons/index.css` is a placeholder. Replace it with the actual Material Icons stylesheet from the network project.

---

## 8. Configure Grunt for SAP ABAP upload

`Gruntfile.js` is already filled in by `npm run initProjName` (step 1). Verify the values look correct, then review `temp_gruntfile.js` in the project root for the reference best-practice implementation if you need to make further adjustments.

Credentials (`username`, `password`) and transport request are passed at runtime by the pipeline — do not hardcode them.

### Deploy command

```bash
npm run build:prod && grunt deploy --user=X --pass=Y --tr=Z
```

The pipeline calls this with variables substituted (e.g. `--user="$(fiori_user)" --pass="$(fiori_pass_to_use)"`).

The build output is uploaded from `dist/<project-name>/browser/he` — the Hebrew production build.

---

## 9. Matomo logger

`src/app/core/services/logger.service.ts` has a `LoggerType.Matomo` enum value but the implementation is a stub (currently falls back to `console.log`).

To be implemented separately.
