---
title: "Skills Directory Map"
type: moc
tags: [skills, engineering, productivity, taxonomy]
---

# Skills Directory Map

The Context Factory organizes its 18 canonical procedural skills into two primary categories:

1. **[[skills/engineering/README|Engineering & Coding Skills]] (`skills/engineering/`):** Hands-on implementation, exploration, performance profiling, refactoring, code review, security auditing, test-first authoring, static type hardening, and verification.
2. **[[skills/productivity/README|Productivity & Discovery Skills]] (`skills/productivity/`):** Pre-planning requirement grilling, context specification, documentation reporting, phased planning, plan review, ADR authoring, knowledge grounding, session management, and triage.

---

## Category Index

| Group | Path | Skills Included | Focus Area |
| :--- | :--- | :--- | :--- |
| **Engineering** | `skills/engineering/` | `execute`, `explore`, `perf`, `refactor`, `review`, `security`, `test`, `types`, `verify` | Direct code manipulation, architecture verification, performance, types, and testing |
| **Productivity** | `skills/productivity/` | `adr`, `context`, `docs`, `grill`, `grounding`, `plan`, `plan-review`, `session`, `triage` | Requirements, planning, documentation, knowledge, sessions, and triage |

---

> [!IMPORTANT]
> **Group README Synchronization Invariant:**
> 1. Update the respective group `README.md` (`skills/engineering/README.md` or `skills/productivity/README.md`).
> 2. Ensure every skill has a corresponding wiki link to its `SKILL.md` in its group index table.
> 3. Run `node scripts/context.mjs doctor` to verify that `scripts/validate-context.mjs` passes group synchronization checks.
