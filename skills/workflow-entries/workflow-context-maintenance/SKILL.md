---
name: workflow-context-maintenance
description: Evolve Context Factory rules, skills, workflows, orchestration, and architecture without duplication, drift, or invalid inventory.
---

# Workflow Entry: Context Maintenance

Canonical lifecycle contract: `workflows/context-maintenance.md`

## Instructions

1. **Read Canonical Workflow:** Read `workflows/context-maintenance.md` completely before taking action.
2. **Resolve Request:** Run `node scripts/context.mjs resolve "<user-request>"` with the user's actual prompt to load relevant rules, skills, and context.
3. **Adhere to Gates & Stops:** Follow all phases, quality gates, and stop/escalation conditions defined in `workflows/context-maintenance.md` and `orchestrator/SHARED.md`.
4. **Authority Boundary:** Selecting this entry does not grant autonomous execution, merge, release, or waiver authority without explicit evidence and user consent.
