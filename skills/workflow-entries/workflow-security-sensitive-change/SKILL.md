---
name: workflow-security-sensitive-change
description: Deliver changes across trust boundaries with explicit threat modeling, security gates, adversarial verification, and safe release controls.
---

# Workflow Entry: Security-Sensitive Change

Canonical lifecycle contract: `workflows/security-sensitive-change.md`

## Instructions

1. **Read Canonical Workflow:** Read `workflows/security-sensitive-change.md` completely before taking action.
2. **Resolve Request:** Run `node scripts/context.mjs resolve "<user-request>"` with the user's actual prompt to load relevant rules, skills, and context.
3. **Adhere to Gates & Stops:** Follow all phases, quality gates, and stop/escalation conditions defined in `workflows/security-sensitive-change.md` and `orchestrator/SHARED.md`.
4. **Authority Boundary:** Selecting this entry does not grant autonomous execution, merge, release, or waiver authority without explicit evidence and user consent.
