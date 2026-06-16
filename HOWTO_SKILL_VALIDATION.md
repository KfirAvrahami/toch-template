### Validating the standards skill

Use this after you edit [toch-standards-skill/SKILL.md](.cursor/skills/toch-standards-skill/SKILL.md), any `reference/*.md`, or mirrored sections in [STANDARDS.md](STANDARDS.md). **Skip it** for normal feature work — the agent already loads standards on every task.

There is **no CI or hook** that runs validation for you. You (or the agent when you agree) run checks when you change rules or the skill.

---

## When you change a rule (amend flow)

1. Rule is written to `STANDARDS.md` / `reference/*.md`
2. Agent asks: **add a test prompt?** → **Yes** updates [SKILL-CREATOR-TEST-PROMPTS.md](.cursor/skills/toch-standards-skill/SKILL-CREATOR-TEST-PROMPTS.md) and [evals/evals.json](.cursor/skills/toch-standards-skill/evals/evals.json); **Skip** leaves them unchanged
3. Agent asks: **run light validation?** → **Yes** runs 3 quick checks; **Skip** skips

See [HOWTO_UPDATE_STANDARDS.md](HOWTO_UPDATE_STANDARDS.md) for the amend flow.

---

## Three ways to validate

### 1. Light — quick check (use after most edits)

- Agent picks 3 questions from [`evals/evals.json`](.cursor/skills/toch-standards-skill/evals/evals.json) related to what you changed
- Answers using the reference files; reports pass / partial / fail
- Fast — no extra tools

**Say:** *"Run light validation on the standards skill."*

After editing reference files, the agent may offer this without you asking.

### 2. Full — deep check (use when triggering feels wrong)

- Runs the [skill-creator](.agents/skills/skill-creator/SKILL.md) loop: multiple test runs, benchmark viewer, optional description tuning
- Slow — only when you need it

**Say:** *"Run full skill-creator validation on the standards skill."*

See [HOWTO_SKILL_CREATOR.md](HOWTO_SKILL_CREATOR.md).

### 3. Manual catalog — exhaustive check

- Work through all prompts in [SKILL-CREATOR-TEST-PROMPTS.md](.cursor/skills/toch-standards-skill/SKILL-CREATOR-TEST-PROMPTS.md) (~80+)
- Use before a big release or after large standards refactors
- Grows when you choose **Yes** at the test prompt ask during amend

---

## What evals.json checks (12 curated prompts)

| Area | Example |
|------|---------|
| `reference/01` | Versions from package.json; no silent upgrades |
| `reference/02` | Protected files need explicit OK |
| `reference/03` | No rem for layout width/height |
| `reference/04` | No null init; i18n required |
| `reference/05` | Adapters via token, not env if-switch |
| `reference/06` | data-testid on interactive elements |
| `reference/07` | No direct HttpClient in features |
| `reference/08` | Project-only rules go to 08 only |
| Process | Documentation ASK before task done |
| Negative | Unrelated questions don't trigger TOCH |

New rules appear in `evals.json` only if you chose **Yes** at the test prompt ask.
