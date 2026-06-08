# TOCH standards (excerpt from repo STANDARDS.md)

> Source of truth for edits remains [STANDARDS.md](../../../STANDARDS.md) at repo root. This file is a split copy for the skill.

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
    mockAdapter.ts — implements IFeatureAdapter with hardcoded data
    apiAdapter.ts  — implements IFeatureAdapter calling SAP via BaseSapApiService
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

FORBIDDEN: Import `MockAdapter` or `ApiAdapter` class directly in a component or service.
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
FORBIDDEN: Call `HttpClient` directly from components or feature services (see `reference/07-anti-patterns-dictionary-checklist.md`).

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
