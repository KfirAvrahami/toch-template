---
name: toch-standards-skill
description: >-
  Applies TOCH Angular / TypeScript / SAP OData project rules from split STANDARDS
  reference files. Use when implementing or reviewing Angular features, SCSS and design
  tokens, i18n, adapters, services, naming, null policy, testids, templates, or when
  the user asks to follow STANDARDS, TOCH standards, or this template’s conventions.
---

# TOCH standards skill

## Activation

`.cursor/rules/toch-standards.mdc` has `alwaysApply: true` — load this skill and the relevant
`reference/*.md` files for **every** task in this repo.

## Repo mode (template vs project)

Detect mode by reading `name` in [package.json](../../../package.json):

| `package.json#name` | Mode | Meaning |
|---------------------|------|---------|
| `angular-20-template` | **template** | This is the template source repo; conventions should generally live in `STANDARDS.md` + `reference/01`–`07`. |
| anything else | **project** | The template was renamed via `npm run initProjName`; app-specific conventions belong in [reference/08-user-amendments.md](reference/08-user-amendments.md). |

The mode biases the **default Scope** when promoting new conventions (see Standards documentation ASK below and the amend skill). The user can always override it explicitly in the review form.

## When to use

**Required for every code change** in this repository, including:

- Any change under `src/app/` (components, services, routes, adapters, templates).
- Styling work (`*.scss`, `src/styles.scss`, design tokens).
- New features, refactors, or code reviews where template rules matter (i18n, testids).
- When the user mentions `STANDARDS.md`, TOCH rules, SAP OData adapters, or this template.

## Quick routing (former `.cursor/rules`)

| Former rule | Reference file(s) |
|-------------|-------------------|
| code-style | `01`, `03`, `06` |
| angular-conventions | `01`, `05`, `07` |
| feature-structure | `01`, `05` |
| icons / SVG / decorative graphics | `06` (`[ICONS]`) |

## Rule priority

Interpret rules from the reference files using the same labels as the source:

- **REQUIRED**: always follow unless the user explicitly ignores a cited Rule ID.
- **FORBIDDEN**: never do it unless the user explicitly ignores that cited Rule ID.
- **ASK**: stop and ask the user; wait before continuing.
- **DEFAULT**: preferred approach when not contradicted by the task.

An override applies only after the user replies `Ignore STANDARDS:[SECTION]:slug` (or clearly says to ignore the Rule ID you cited). Until then, do not implement the conflicting action.

## Rule IDs

Each standard line can be cited with a stable **Rule ID**:

```
STANDARDS:[SECTION]:<slug>
```

| Part | Example | Meaning |
|------|---------|---------|
| Prefix | `STANDARDS` | Fixed namespace |
| Section | `[SERVICES]` | Tag from the reference file (e.g. `[LIFECYCLE]`, `[ANTI-PATTERNS]`) |
| Slug | `http-via-base-only` | Kebab-case summary of the rule (about 3–6 words from the rule text) |

**Build the slug** from the rule’s key phrase (lowercase, hyphens, no special characters). Examples:

- `STANDARDS:[SERVICES]:http-via-base-only`
- `STANDARDS:[COMPONENT-PATTERNS]:use-inject-not-constructor-di`
- `STANDARDS:[ANTI-PATTERNS]:feature-httpclient` (pre-defined slugs in `reference/07`)

**User replies** (verbatim phrases the user can copy):

- Follow: `Follow STANDARDS:[SECTION]:slug` or `Follow rule STANDARDS:[SECTION]:slug`
- Ignore: `Ignore STANDARDS:[SECTION]:slug` or `Ignore STANDARDS rule STANDARDS:[SECTION]:slug`

## Standards check (when user must decide)

Run a Standards check **before** implementing when:

- The user’s instruction conflicts with **REQUIRED** or **FORBIDDEN**
- You are about to violate a **FORBIDDEN** anti-pattern (especially in `reference/07`)
- You will edit a **protected** file without prior authorization in the task
- It is unclear whether a **DEFAULT** applies

Do **not** run a Standards check for routine compliance the user already asked for (e.g. “add OnPush”, “use signals”) when there is no conflict.

**Message template** — use this structure and wait for the user’s reply:

```markdown
### Standards check

| Field | Value |
|-------|-------|
| Rule ID | `STANDARDS:[SECTION]:slug` |
| Severity | REQUIRED / FORBIDDEN / ASK / DEFAULT |
| Source | `reference/0N-....md` → `[SECTION]` |
| Rule | (one-sentence quote from the standard) |
| Proposed action | (what you would do if the rule applies) |

Reply with **one** of:
- `Follow STANDARDS:[SECTION]:slug`
- `Ignore STANDARDS:[SECTION]:slug`
```

After **Follow**: implement per the standard. After **Ignore**: proceed with the proposed action and note the override in your summary.

## Standards documentation ASK (before task complete)

**REQUIRED:** Before marking a substantive task **done**, if any trigger below fired, **stop and ask the user** how to record what was introduced. Use the `AskQuestion` tool when available; otherwise post the three options in plain text and **wait** for a reply. Do **not** skip because the task plan listed only source files or said docs were out of scope.

**Triggers:**

- You implemented a pattern **not already** in `STANDARDS.md` / loaded references (e.g. CSS mask icons).
- You fixed the same standards gap **twice** in one session.
- The user gave a **code review / standards cleanup** list that implies new team policy.
- The user chose **Ignore** on a Standards check and the exception should be recorded.

**Ask the user to choose one:**

| Option | Meaning |
|--------|---------|
| **Promote to STANDARDS** | Run `/toch-standards-review` or [toch-standards-amend skill](../toch-standards-amend-skill/SKILL.md) with plain-language **Rule**, **Scope: template-wide**, **Promote: yes**. (default in template mode) |
| **Project-only (08)** | Same flow with **Scope: project-only** → [08-user-amendments.md](reference/08-user-amendments.md) only (rules for this repo after `initProjName`, not the template source). (default in project mode) |
| **Skip docs** | No edits to STANDARDS, references, or skill; convention lives in code only. |

**Classification guidance:**

- **TOCH template-wide** → recommend **Promote to STANDARDS** (generic wording; no app-specific class names such as `h-` prefixes in skill reference text).
- **App/product-specific** → recommend **Project-only (08)** or **Skip**; **never** add to base `reference/01`–`07` unless the user chooses Promote to STANDARDS.

**Never** edit STANDARDS or reference files without `Promote: yes` from a review submission or explicit user instruction (e.g. “update STANDARDS”, “run standards review”, “TOCH skill self-update”).

**If the user chooses Promote to STANDARDS**, run `/toch-standards-review` with their plain-language rule, **Scope**, and **Promote: yes** (optional good/bad examples welcome).

## Workflow

1. **Scope**: infer which areas apply (structure, SCSS, i18n, adapters, types, etc.).
2. **Load**: read [reference/08-user-amendments.md](reference/08-user-amendments.md) **always**, then the other reference file(s) below that match the task; use [STANDARDS.md](../../../STANDARDS.md) at repo root if you need the full single file. Project rules in `08` override conflicting base standards when cited by Rule ID.
3. **Apply**: enforce REQUIRED/FORBIDDEN first, then defaults and style rules.
4. **Questionable action**: if step 3 would conflict with the user or a standard → Standards check (Rule ID + template) → wait for Follow/Ignore before continuing.
5. **Protected files**: before editing infrastructure files listed in the standards, confirm with the user if the task did not already authorize it (use a Standards check with the relevant Rule ID).
6. **Done**: run through the checklist in `reference/07-anti-patterns-dictionary-checklist.md` when finishing a substantive task.
7. **Documentation ASK**: if any trigger in “Standards documentation ASK” fired → ask the user (three options) → only then run amend, update `08` only, or stop without doc edits.

## Reference index (read as needed)

| File | Topics |
|------|--------|
| [reference/01-meta-versions-structure.md](reference/01-meta-versions-structure.md) | META, VERSIONS, FORMATTING, COMPONENT-PATTERNS, STRUCTURE, IMPORTS, LAYOUT, LIFECYCLE |
| [reference/02-key-files-protected-readme.md](reference/02-key-files-protected-readme.md) | KEY-FILES, PROTECTED-FILES, README |
| [reference/03-testing-design-scss-colors-typography.md](reference/03-testing-design-scss-colors-typography.md) | TESTING-UNIT, DESIGN-SYSTEM, SCSS, COLORS, TYPOGRAPHY |
| [reference/04-naming-null-i18n.md](reference/04-naming-null-i18n.md) | NAMING, NULL-POLICY, I18N |
| [reference/05-architecture-services-types-constants.md](reference/05-architecture-services-types-constants.md) | ADAPTER-PATTERN, SERVICES, TYPES, CONSTANTS |
| [reference/06-comments-testids-templates-playwright.md](reference/06-comments-testids-templates-playwright.md) | COMMENTS, TESTIDS, HTML-TEMPLATES, ICONS, DYNAMIC-STYLES, PLAYWRIGHT |
| [reference/07-anti-patterns-dictionary-checklist.md](reference/07-anti-patterns-dictionary-checklist.md) | ANTI-PATTERNS, DICTIONARY, CHECKLIST |
| [reference/08-user-amendments.md](reference/08-user-amendments.md) | PROJECT-AMENDMENTS, Inbox, Changelog (always load) |

**Update standards:** `/toch-standards-review` or [toch-standards-amend skill](../toch-standards-amend-skill/SKILL.md).

## Skill-creator validation

After creating or editing this skill, use the **skill-creator** skill to sanity-check triggers and coverage (positive prompts, negative prompts, topic spot-checks). See [SKILL-CREATOR-TEST-PROMPTS.md](SKILL-CREATOR-TEST-PROMPTS.md).
