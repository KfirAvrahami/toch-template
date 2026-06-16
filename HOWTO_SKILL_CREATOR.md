### Creating and improving agent skills

Use skill-creator when you want to **write a new Cursor agent skill** or **improve an existing one** (e.g. better triggering, revised instructions, new test cases). For updating TOCH coding rules, see [HOWTO_UPDATE_STANDARDS.md](HOWTO_UPDATE_STANDARDS.md) instead.

skill-creator is already bundled at [`.agents/skills/skill-creator/`](.agents/skills/skill-creator/) — no install needed.

---

## Two ways to start

- **Free-form (fastest)** — describe what you want in chat, e.g.:
  - *"Create a skill for SAP OData error handling."*
  - *"Improve the toch-standards-skill description so it triggers more reliably."*
- **Explicit** — ask the agent to follow [.agents/skills/skill-creator/SKILL.md](.agents/skills/skill-creator/SKILL.md) for the full workflow.

---

## Basic loop (agent handles details)

1. Describe intent — what should the skill do and when should it trigger?
2. Agent drafts `SKILL.md` (frontmatter + instructions)
3. Agent writes 2–3 test prompts; you review
4. Agent runs prompts with and without the skill; you review outputs
5. Iterate until satisfied
6. Optional: optimize the `description` field for better auto-triggering

---

## When to use skill-creator for standards validation

skill-creator runs the **full** validation tier only — you must ask for it explicitly. It does not run on its own.

Use it when light validation is not enough: triggering feels wrong, many reference files changed, or you want benchmark stats and description tuning.

For light checks and the amend flow, see [HOWTO_SKILL_VALIDATION.md](HOWTO_SKILL_VALIDATION.md).

---

## Where skills live

| Kind | Path | Notes |
|------|------|-------|
| Template skill | `.cursor/skills/<name>/SKILL.md` | Ships with the template; PRs welcome |
| Project skill | `.cursor/skills/<name>/SKILL.md` | Commit to project repo only (after `npm run initProjName`) |
| skill-creator | `.agents/skills/skill-creator/` | Bundled; tracked in `skills-lock.json` |

---

## Minimal `SKILL.md` shape

```markdown
---
name: my-skill
description: >-
  One sentence — what it does AND trigger phrases the user is likely to say.
---

# My skill

Instructions for the agent.
```

Put long reference material in sibling files (e.g. `reference/*.md`) and link from `SKILL.md`.

---

## Related howtos

| Doc | Purpose |
|-----|---------|
| [HOWTO_UPDATE_STANDARDS.md](HOWTO_UPDATE_STANDARDS.md) | Add or change TOCH rules (amend flow) |
| [HOWTO_SKILL_VALIDATION.md](HOWTO_SKILL_VALIDATION.md) | Validate standards skill after edits; automatic vs manual explained |
| [SKILL-CREATOR-TEST-PROMPTS.md](.cursor/skills/toch-standards-skill/SKILL-CREATOR-TEST-PROMPTS.md) | Full manual regression catalog for standards skill |
