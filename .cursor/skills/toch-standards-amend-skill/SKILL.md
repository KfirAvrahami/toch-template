---
name: toch-standards-amend
description: >-
  Process TOCH standards review submissions in plain language; generate formal
  REQUIRED/FORBIDDEN rules and optional examples; append to user-amendments and
  optionally promote into STANDARDS.md and reference splits. Use when the user
  runs /toch-standards-review, says TOCH standards review, submits the review
  form, or confirms promoting a convention from chat.
---

# TOCH standards amend

Process review submissions and update project standards. Do **not** use this skill for normal coding tasks — use `toch-standards-skill` instead.

## Review form (user fills)

```markdown
## Add TOCH rule

- **Rule** (plain language):
  > ...

- **Good example** (optional):
  > ...

- **Bad example** (optional):
  > ...

- **Scope**: template-wide | project-only

- **Promote**: yes | no

- **Context** (optional):
  > ...
```

**Required fields:** `Rule`, `Scope`, `Promote`. If any are missing, ask the user to complete them before continuing.

**Free-form OK:** A plain-language rule in chat (e.g. “never use rem for gap”) counts as **Rule**; infer **Scope** and **Promote** from context or ask.

## Workflow

### 1. Parse

Read the user message (slash command, pasted form, or chat summary). Extract Rule, optional Good/Bad examples, Scope, Promote, and optional Context.

Before inferring Scope, read `name` in [package.json](../../../package.json) and record the detected **Repo mode**: `template` if `name === "angular-20-template"`, otherwise `project`. Use this as the default Scope when the user did not provide one (see Scope guidance below).

### 2. Generate formal rule (agent)

Read [STANDARDS.md](../../../STANDARDS.md) and the matching reference file(s) for the topic. Then produce a **proposal** with:

| Field | How to derive |
|-------|----------------|
| **Change type** | `new-rule` (default); `change-rule` if updating an existing Rule ID; `deprecate` if removing a rule; `project-override` if Scope is `project-only` |
| **Target section** | Best-fit `[SECTION]` tag (e.g. `[SCSS]`, `[SERVICES]`, `[ANTI-PATTERNS]`) |
| **Severity** | `REQUIRED`, `FORBIDDEN`, `DEFAULT`, or `ASK` — match existing labels in that section |
| **Rule ID** | `STANDARDS:[SECTION]:kebab-slug` (3–6 words from the rule; reuse existing ID when changing a rule) |
| **Formal wording** | One clear line in STANDARDS voice — imperative, no app-specific names unless Scope is `project-only` |
| **Examples** | If Good/Bad provided: `EXAMPLE` and/or `ANTI-PATTERN` blocks using project code style |

**Scope guidance:**

- **Default when user didn't specify:** `template-wide` if Repo mode is `template` (`package.json#name === "angular-20-template"`), otherwise `project-only`. The user's explicit Scope in the form always wins.
- `template-wide` → generic wording; edit `reference/01`–`07` + `STANDARDS.md` when promoting.
- `project-only` → rules for this repo after `initProjName` (not the template source); app-specific wording allowed; promote under `## [PROJECT-AMENDMENTS]` in [08-user-amendments.md](../toch-standards-skill/reference/08-user-amendments.md) only (`Change type: project-override`).

**Show the proposal** before writing files:

```markdown
### Proposed standard

| Field | Value |
|-------|-------|
| Repo mode | template / project |
| Change type | … |
| Target section | `[SECTION]` |
| Rule ID | `STANDARDS:[SECTION]:slug` |
| Severity | REQUIRED / FORBIDDEN / … |
| Formal rule | … |

**Examples** (if any): …
```

If the target section is unclear, ask before promoting.

### 3. Inbox (always)

Append a dated row to `## Inbox` in [../toch-standards-skill/reference/08-user-amendments.md](../toch-standards-skill/reference/08-user-amendments.md):

| Date | Source | Change type | Target section | Rule ID | Promote | Summary |
|------|--------|-------------|----------------|---------|---------|---------|

- **Date:** today (YYYY-MM-DD).
- **Source:** `chat` | `standards-check` | `manual` — infer from context.
- **Summary:** one line from the user’s plain-language **Rule** (not the generated formal line).

### 4. Promote (only if `Promote: yes`)

Map `[SECTION]` → reference file (edit **and** mirror in [STANDARDS.md](../../../STANDARDS.md)):

| Section tags | Reference file |
|--------------|----------------|
| META, VERSIONS, FORMATTING, COMPONENT-PATTERNS, STRUCTURE, IMPORTS, LAYOUT, LIFECYCLE | `reference/01-meta-versions-structure.md` |
| KEY-FILES, PROTECTED-FILES, README | `reference/02-key-files-protected-readme.md` |
| TESTING-UNIT, DESIGN-SYSTEM, SCSS, COLORS, TYPOGRAPHY | `reference/03-testing-design-scss-colors-typography.md` |
| NAMING, NULL-POLICY, I18N | `reference/04-naming-null-i18n.md` |
| ADAPTER-PATTERN, SERVICES, TYPES, CONSTANTS | `reference/05-architecture-services-types-constants.md` |
| COMMENTS, TESTIDS, HTML-TEMPLATES, DYNAMIC-STYLES, PLAYWRIGHT, ICONS | `reference/06-comments-testids-templates-playwright.md` |
| ANTI-PATTERNS, DICTIONARY, CHECKLIST | `reference/07-anti-patterns-dictionary-checklist.md` |
| PROJECT-AMENDMENTS | `reference/08-user-amendments.md` |

**Insert** under the target `## [SECTION]` block:

- Formal rule line: `SEVERITY (Rule ID): wording` — omit `(Rule ID)` only for unnumbered EXAMPLE/ANTI-PATTERN lines.
- Optional `EXAMPLE` / `ANTI-PATTERN` blocks from Good/Bad examples.
- For `deprecate`: remove or strike the old line and add a one-line note in Changelog Notes.

**Mirror** the same line(s) into the matching `## [SECTION]` in `STANDARDS.md`.

**Project-only:** if Scope is `project-only`, add the rule under `## Project-only rules` in `08-user-amendments.md` with its Rule ID (do not add to `reference/01`–`07` unless the user explicitly chose template-wide).

**Checklist:** if the rule affects review gates, add or update the matching row in `reference/07-anti-patterns-dictionary-checklist.md`.

### 5. Changelog

The `## Changelog` in `08-user-amendments.md` tracks **project-only** rule history (Scope: `project-only`). Template-wide promotions are recorded by their edits to `STANDARDS.md` + `reference/01`–`07` and by git history — do **not** log them here.

When promotion finishes (or user keeps `Promote: no` but you still record the inbox item for traceability):

- If Scope is `project-only` and `Promote: yes`: move the inbox row to `## Changelog` in `08-user-amendments.md` and remove it from Inbox.
- If Scope is `template-wide`: remove the row from Inbox on promotion; do **not** append to Changelog.
- If `Promote: no`, **leave** the row in Inbox (do not delete until promoted later), regardless of scope.

Changelog columns:

| Date | Rule ID | Promoted | Files touched | Notes |

- **Promoted:** yes | no.
- **Files touched:** paths edited.
- **Notes:** optional Context from the form.

### 6. Summary

Reply with: Rule ID, generated formal rule (one line), files changed, whether promoted, and how to cite on future Standards checks (`Follow` / `Ignore`).

## Rules

- **Never** promote without `Promote: yes` or explicit user confirmation after the proposed diff.
- **Never** promote without showing the **Proposed standard** block first (same turn is fine when `Promote: yes`).
- Generated formal wording must match STANDARDS style; preserve the user’s **intent**, not necessarily their exact words.
- If `Promote: no`, inbox only — include the proposal so the user can promote later with `Promote: yes`.
- If `Promote: yes` but target section is unclear, ask before editing.
