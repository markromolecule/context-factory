---
name: workflow-dependency-upgrade
description: Upgrade runtimes, frameworks, libraries, and tooling through bounded compatibility analysis and verified migration steps.
---

# Workflow Entry: Dependency Upgrade

Canonical lifecycle contract: `workflows/dependency-upgrade.md`

## Instructions

1. **Read Canonical Workflow:** Read `workflows/dependency-upgrade.md` completely before taking action.
2. **Resolve Request:** Run `node scripts/context.mjs resolve "<user-request>"` with the user's actual prompt to load relevant rules, skills, and context.
3. **Adhere to Gates & Stops:** Follow all phases, quality gates, and stop/escalation conditions defined in `workflows/dependency-upgrade.md` and `orchestrator/SHARED.md`.
4. **Authority Boundary:** Selecting this entry does not grant autonomous execution, merge, release, or waiver authority without explicit evidence and user consent.
