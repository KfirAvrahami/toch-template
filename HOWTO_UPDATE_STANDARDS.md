### Updating standards

Use the amend flow when you want to add or change a TOCH rule (the agent loads them from [STANDARDS.md](STANDARDS.md) and `.cursor/skills/toch-standards-skill/reference/`).

**Two ways to start:**

- **Free-form (fastest)** — just say it in chat, e.g. *“Add a TOCH standard: never use rem for gap. Promote it.”* The agent infers Scope from repo mode and asks only if something is ambiguous.
- **Structured form** — run **`/toch-standards-review`** to get the full template (Rule, Good/Bad examples, Scope, Promote, Context). Use when you want to be explicit, or include examples.

Either way the agent follows [.cursor/skills/toch-standards-amend-skill/SKILL.md](.cursor/skills/toch-standards-amend-skill/SKILL.md):

1. Provide at minimum a **Rule** in plain language and (ideally) **Promote: yes/no**.
   - **Scope** — `template-wide` or `project-only`; if omitted, defaults from repo mode (template name `angular-20-template` → template-wide; renamed project → project-only)
   - **Promote** — `yes` to write the rule now, `no` to inbox only
   - Optional: good/bad examples, context
2. Review the agent’s **Proposed standard** (Rule ID, severity, formal wording), then confirm.
3. **Where it lands:**
   - **Template-wide** → [STANDARDS.md](STANDARDS.md) + matching `reference/01`–`07` file
   - **Project-only** → [reference/08-user-amendments.md](.cursor/skills/toch-standards-skill/reference/08-user-amendments.md) only (Changelog tracks project-only promotions)

During normal coding, the agent may ask how to record a new convention (Promote to STANDARDS / Project-only / Skip docs) before finishing a task — same amend flow if you choose to promote.