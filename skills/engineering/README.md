---
title: "Engineering Skills"
type: moc
tags: [skills, engineering, coding]
---

# Engineering & Coding Skills

The **Engineering** group contains procedural skills for exploring target codebases, executing approved implementation phases, refactoring complex files, auditing security boundaries, and verifying changes against live test suites.

---

## Skills Inventory

| Skill | Slash Commands | Purpose & Responsibilities | Companion Resources |
| :--- | :--- | :--- | :--- |
| [[skills/engineering/execute/SKILL|execute]] | `/execute`, `/exec`, `[EXEC]` | Execute approved task plans strictly one phase at a time with mandatory verification stops | `agents/openai.yaml` |
| [[skills/engineering/explore/SKILL|explore]] | `/explore`, `[EXPLORE]` | Map code entry points, contracts, database models, test suites, and project conventions | — |
| [[skills/engineering/refactor/SKILL|refactor]] | `/refactor`, `[REFACTOR]` | Decompose lengthy (>200 lines) or multi-responsibility files into modular single-responsibility components | `agents/openai.yaml` |
| [[skills/engineering/security/SKILL|security]] | `/sec`, `/security`, `[SEC]`, `[SECURITY]` | Threat-model and audit trust boundaries, authentication, credentials, data isolation, and replay risks | — |
| [[skills/engineering/verify/SKILL|verify]] | `/verify`, `/release`, `[RELEASE]`, `[QA]` | Audit implementation claims against fresh command outputs, typechecks, and test suites | — |

---

## Group Maintenance & Synchronization Invariant

> [!IMPORTANT]
> **Enforced Contract:**
> - Every skill in `skills/engineering/` must be documented in the table above.
> - `scripts/validate-context.mjs` strictly verifies that all subfolders in `skills/engineering/` containing a `SKILL.md` are linked in this file.
> - Run `node scripts/context.mjs doctor` after adding, renaming, or removing an engineering skill.
