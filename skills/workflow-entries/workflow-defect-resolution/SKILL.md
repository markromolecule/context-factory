---
name: workflow-defect-resolution
description: Resolve a defect by reproducing it, establishing root cause, adding regression evidence, and applying the smallest safe fix.
---

# Workflow Entry: Defect Resolution

Canonical lifecycle contract: `workflows/defect-resolution.md`

## Instructions

1. **Read Canonical Workflow:** Read `workflows/defect-resolution.md` completely before taking action.
2. **Resolve Request:** Run `node scripts/context.mjs resolve "<user-request>"` with the user's actual prompt to load relevant rules, skills, and context.
3. **Adhere to Gates & Stops:** Follow all phases, quality gates, and stop/escalation conditions defined in `workflows/defect-resolution.md` and `orchestrator/SHARED.md`.
4. **Authority Boundary:** Selecting this entry does not grant autonomous execution, merge, release, or waiver authority without explicit evidence and user consent.
