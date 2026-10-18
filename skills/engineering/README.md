---
title: "Engineering Skills"
type: moc
tags: [skills, engineering, coding]
---

# Engineering & Coding Skills

The **Engineering** group contains procedural skills for executing approved implementation phases, profiling performance bottlenecks, refactoring complex files, auditing security boundaries, and authoring test-first suites.

---

## Skills Inventory

| Skill | Slash Commands | Purpose & Responsibilities | Companion Resources |
| :--- | :--- | :--- | :--- |
| [[skills/engineering/execute/SKILL | execute]] | `/execute`, `/exec`, `[EXEC]` | Execute approved task plans strictly one phase at a time with mandatory verification stops | `agents/openai.yaml` |
| [[skills/engineering/perf/SKILL | perf]] | `/perf`, `[PERF]` | Profile runtime bottlenecks, detect ORM N+1 queries, audit ESR composite indexes, and optimize async waterfalls | — |
| [[skills/engineering/refactor/SKILL | refactor]] | `/refactor`, `[REFACTOR]` | Decompose lengthy (>200 lines) or multi-responsibility files into modular single-responsibility components | `agents/openai.yaml` |
| [[skills/engineering/security/SKILL | security]] | `/sec`, `/security`, `[SEC]`, `[SECURITY]` | Threat-model and audit trust boundaries, authentication, credentials, data isolation, and replay risks | — |
| [[skills/engineering/test/SKILL | test]] | `/test`, `[TEST]` | Turn a unit's Verification section into real tests, written test-first (failing assertions first, then implementation) | `agents/openai.yaml` |

---

## Group Maintenance & Synchronization Invariant

> [!IMPORTANT]
> **Enforced Contract:**
>
> - Every skill in `skills/engineering/` must be documented in the table above.
> - `scripts/validate-context.mjs` strictly verifies that all subfolders in `skills/engineering/` containing a `SKILL.md` are linked in this file.
> - Run `node scripts/context.mjs doctor` after adding, renaming, or removing an engineering skill.
