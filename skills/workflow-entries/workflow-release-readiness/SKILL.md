---
name: workflow-release-readiness
description: Decide whether a change set is ready to release using evidence across behavior, quality, operations, security, accessibility, and recovery.
---

# Workflow Entry: Release Readiness

Canonical lifecycle contract: `workflows/release-readiness.md`

## Instructions

1. **Read Canonical Workflow:** Read `workflows/release-readiness.md` completely before taking action.
2. **Resolve Request:** Run `node scripts/context.mjs resolve "<user-request>"` with the user's actual prompt to load relevant rules, skills, and context.
3. **Adhere to Gates & Stops:** Follow all phases, quality gates, and stop/escalation conditions defined in `workflows/release-readiness.md` and `orchestrator/SHARED.md`.
4. **Authority Boundary:** Selecting this entry does not grant autonomous execution, merge, release, or waiver authority without explicit evidence and user consent.
