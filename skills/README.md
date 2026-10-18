---
title: "Skills Directory Map"
type: moc
tags: [skills, engineering, productivity, taxonomy]
---

# Skills Directory Map

The Context Factory organizes its 12 canonical procedural skills into two primary categories:

1. **[[skills/engineering/README|Engineering & Coding Skills]] (`skills/engineering/`):** Hands-on implementation, performance profiling, modular refactoring, security auditing, and test-first authoring.
2. **[[skills/productivity/README|Productivity & Discovery Skills]] (`skills/productivity/`):** Pre-planning requirement grilling, context specification, phased planning, plan review, ADR authoring, knowledge grounding, and session management.

---

## Category Index

| Group | Path | Skills Included | Focus Area |
| :--- | :--- | :--- | :--- |
| **Engineering** | `skills/engineering/` | `execute`, `perf`, `refactor`, `security`, `test` | Implementation, performance profiling, modular refactoring, security auditing, and testing |
| **Productivity** | `skills/productivity/` | `adr`, `context`, `grill`, `grounding`, `plan`, `plan-review`, `session` | Requirements, planning, knowledge, decisions, and session management |

---

> [!IMPORTANT]
> **Group README Synchronization Invariant:**
> 1. Update the respective group `README.md` (`skills/engineering/README.md` or `skills/productivity/README.md`).
> 2. Ensure every skill has a corresponding wiki link to its `SKILL.md` in its group index table.
> 3. Run `node scripts/context.mjs doctor` to verify that `scripts/validate-context.mjs` passes group synchronization checks.
