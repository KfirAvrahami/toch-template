# Prompts for validating `toch-standards-skill` (with skill-creator)

skill-creator is **already bundled** at [`.agents/skills/skill-creator/`](../../../../.agents/skills/skill-creator/) — no install needed.

**Two validation tiers:**

- **Light (default after skill/reference edits):** pick 3 prompts from [`evals/evals.json`](evals/evals.json) matching the changed reference area; answer inline using loaded references; report pass/partial/fail. Ask the agent: *"Run light validation on the standards skill."*
- **Full regression:** run all prompts below in order (manual scorecard), or ask the agent to run the full skill-creator eval loop ([HOWTO_SKILL_VALIDATION.md](../../../../HOWTO_SKILL_VALIDATION.md)).

Run prompts in order and log results (`expected/unexpected`, `correct/partial/wrong`, `correct/incorrect`).

## Scorecard template

```md
| ID | Expected Trigger | Retrieved Section | Rule Fidelity | Notes |
|----|------------------|------------------|---------------|-------|
| 01-1 | yes | correct section | correct | ... |
```

## reference/01-meta-versions-structure.md (10)

Passing answer checklist:
- Mentions reading versions from `package.json` before coding.
- Rejects dependency/version upgrades without explicit approval.
- Enforces `standalone: true`, `OnPush`, and no NgModules.
- Uses structure rules (`types.ts`, `index.ts`, `shared/`, feature folders).

1. "Before coding this Angular change, which versions and dependency rules must I check?"
2. "Can I upgrade TypeScript to latest in this template if lint fails?"
3. "Can I add a new npm package for date formatting without asking?"
4. "When building a new component, do we require standalone and OnPush?"
5. "Is creating an NgModule allowed for this feature?"
6. "Show me the required folder structure for a new `reports` feature."
7. "Where should shell components like top-bar and side-bar live?"
8. "Can I declare feature interfaces inline in `reports.component.ts`?"
9. "What must `index.ts` export inside a feature folder?"
10. "If a pipe is reused in 3 features, should it stay in feature folder or shared?"

## reference/02-key-files-protected-readme.md (10)

Passing answer checklist:
- Routes are lazy-loaded with `loadComponent`.
- Uses `LoggerService` instead of direct `console.*`.
- Mentions protected files require explicit confirmation.
- README includes required sections and is not default CLI placeholder.

1. "Where must global color and typography tokens be defined?"
2. "Is hardcoding hex colors inside component SCSS allowed if used once?"
3. "What are the rules for route lazy loading in `app.routes.ts`?"
4. "Can I use `console.log` directly in app code for quick debugging?"
5. "How do I switch auth providers between mock and SSO?"
6. "Can I edit `src/app/base/base-api.service.ts` during a normal feature task?"
7. "Which files are protected and require explicit confirmation before editing?"
8. "What sections are required in README for a new project?"
9. "README is still default Angular CLI text. Is that acceptable?"
10. "When architecture changes, do I need to update README immediately?"

## reference/03-testing-design-scss-colors-typography.md (10)

Passing answer checklist:
- Unit testing is not default; Jest is forbidden.
- Design tokens live in `src/styles.scss`; no invented placeholder colors.
- SCSS unit rules: no `rem` for width/height margins; avoid px layout.
- Enforces no negative margins, no `!important`, no hardcoded component colors.

1. "Should I write unit tests by default in this template?"
2. "Can I use Jest for tests here?"
3. "No Figma exists: can I invent placeholder colors to start SCSS?"
4. "For layout width/height, can I use `rem`?"
5. "For padding and gap, what units are preferred?"
6. "Is negative margin acceptable for layout alignment fixes?"
7. "Can I use `!important` to override third-party style quickly?"
8. "Are component SCSS files allowed to use direct `#hex` or `rgba(...)` colors?"
9. "Where should `font-family` be set?"
10. "In RTL project, can I use `margin-left`/`margin-right` for layout spacing?"

## reference/04-naming-null-i18n.md (10)

Passing answer checklist:
- Forbids `null` initialization and null returns in app code.
- Requires descriptive naming; no single-letter/generic names.
- i18n is mandatory for every user-visible template string; TypeScript UI strings use `$localize` with the same keys.
- Requires `he.json` key sync; disallows `$localize` in HTML templates (use `i18n` there).

1. "Is `private user: AuthUser | null = null` acceptable?"
2. "Should I return `null` from `getUser()` when missing?"
3. "Can I use single-letter callback variables in map/filter loops?"
4. "Are generic names like `data` and `result` acceptable for service state?"
5. "What naming format should injection tokens use?"
6. "Is `_privateField` underscore prefix required for private fields?"
7. "Can I keep user-visible Hebrew text in template without i18n key?"
8. "What is the required i18n key format for template strings?"
9. "If I add i18n key in template, when should I update `he.json`?"
10. "Can I use `$localize` instead of `i18n=\"@@key\"` in templates?" (expect: forbidden in templates; allowed in `.ts` for UI strings)
11. "How do I run the app in Hebrew during development?" (expect: `npm run start:he`)

## reference/05-architecture-services-types-constants.md (10)

Passing answer checklist:
- Adapter wiring is via token/providers, not direct adapter imports.
- Provider choice is route/app-level; avoid env `if` switching.
- Types live in `types.ts`; avoid inline structured types and `any`.
- Magic strings/numbers become constants; SAP names are constants.

1. "Where should `HomeProviders.Api` be configured: component or route?"
2. "Can a component import `HomeMockAdapter` directly?"
3. "Should adapter switching use `if (environment.production)`?"
4. "Where should singleton services be provided?"
5. "Can feature service use `@Injectable({ providedIn: 'root' })`?"
6. "Where must feature interfaces/types live by default?"
7. "Is `unknown` acceptable for template-bound signal state?"
8. "Can I keep magic numbers like `setTimeout(..., 3000)` inline?"
9. "Where should SAP service/entity names be defined?"
10. "If two features need same type, import from other feature or move to shared/base types?"

## reference/06-comments-testids-templates-playwright.md (10)

Passing answer checklist:
- Comments should add intent, not restate obvious code behavior.
- Public service/pipe methods have JSDoc.
- Testids required on interactive/dynamic elements and are unique.
- Uses `ng-container`/`ng-template` correctly; prefers `@if/@for` for new code.

1. "Can I keep comments like `// increment counter` in committed code?"
2. "Are JSDoc comments required on public service and pipe methods?"
3. "Can I commit commented-out old code for future reference?"
4. "Which elements must always have `data-testid`?"
5. "Can I use text selectors in Playwright instead of testids?"
6. "Is `data-testid` allowed without a CSS class on the same element?"
7. "For repeated cards, how should testid uniqueness be handled?"
8. "When should I prefer `ng-container` over `div`?"
9. "For new templates, should I prefer `@if/@for` or `*ngIf/*ngFor`?"
10. "Playwright not active yet: are testids still required now?"

## reference/07-anti-patterns-dictionary-checklist.md (10)

Passing answer checklist:
- Rejects listed anti-patterns (hardcoded colors, px layout, direct HttpClient in feature component).
- Enforces structure constraints (`index.ts` export scope, no cross-feature type coupling).
- Uses checklist before marking done.
- Flags i18n/template and file-structure mismatches as failures.

1. "Is `.btn { background: #187AE9; }` acceptable in component SCSS?"
2. "Is `.sidebar { width: 240px; }` acceptable for layout dimensions?"
3. "Can a feature component call HttpClient directly if faster?"
4. "Can `index.ts` export helper constants and services too?"
5. "Is it okay if `types.ts` imports from another feature's `types.ts`?"
6. "Can I keep multiple components in a single `.ts` file for convenience?"
7. "Do I need to run a completion checklist before saying done?"
8. "What should the dictionary table contain and when is it used?"
9. "If template has i18n key but he.json is missing it, is that acceptable temporarily?"
10. "Give me a final pre-done checklist for a feature touching template, SCSS, and service files."

## Standards documentation ASK (process)

Passing answer checklist:
- Must ask before marking done when a new convention was introduced and is not already in STANDARDS.
- Offers three choices: Promote to STANDARDS / Project-only (08) / Skip docs.
- Does not edit STANDARDS or reference files without Promote: yes or explicit user instruction.
- Classifies TOCH-wide vs app-specific; does not put app-specific class names (e.g. `h-` prefixes) in base reference files.

1. "After adding CSS mask icons in a feature, what must you ask the user before finishing?"
2. "Can you add `.h-btn--primary` to the TOCH skill reference files as a global standard?"
3. "The task plan says docs are out of scope but you introduced a new icon pattern — do you skip the documentation ASK?"
4. "User chose Ignore on a Standards check — should you run Standards documentation ASK at the end?"
5. "Where do project-only conventions go if the user chooses Project-only (08)?"

## Negative controls (optional sanity checks)

- "What is the capital of France?"
- "Summarize this README in one paragraph."

Expected: no TOCH over-trigger beyond generic answer behavior.
