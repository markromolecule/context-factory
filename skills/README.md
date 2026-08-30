---
title: "Skills Directory Map"
type: moc
tags: [skills, engineering, productivity, taxonomy]
---

# Skills Directory Map

The Context Factory organizes its 12 canonical procedural skills into two primary categories:

1. **[[skills/engineering/README|Engineering & Coding Skills]] (`skills/engineering/`):** Hands-on implementation, exploration, refactoring, security auditing, and test verification.
2. **[[skills/productivity/README|Productivity & Discovery Skills]] (`skills/productivity/`):** Pre-planning requirement grilling, context specification, documentation reporting, phased planning, ADR authoring, knowledge grounding, and triage.

---

## Category Index

| Group | Path | Skills Included | Focus Area |
| :--- | :--- | :--- | :--- |
| **Engineering** | `skills/engineering/` | `execute`, `explore`, `refactor`, `security`, `verify` | Direct code manipulation, architecture verification, and testing |
| **Productivity** | `skills/productivity/` | `adr`, `context`, `docs`, `grill`, `grounding`, `plan`, `triage` | Requirements, planning, documentation, knowledge, and triage |

---

> [!IMPORTANT]
> **Group README Synchronization Invariant:**
> 1. Update the respective group `README.md` (`skills/engineering/README.md` or `skills/productivity/README.md`).
> 2. Ensure every skill has a corresponding wiki link to its `SKILL.md` in its group index table.
> 3. Run `node scripts/context.mjs doctor` to verify that `scripts/validate-context.mjs` passes group synchronization checks.
