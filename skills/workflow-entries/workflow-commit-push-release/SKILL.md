---
name: workflow-commit-push-release
description: Safely stage, craft conventional commits, push to remote repository, tag releases, and execute release verification.
---

# Workflow Entry: Commit, Push & Release

Canonical lifecycle contract: `workflows/commit-push-release.md`

## Instructions

1. **Read Canonical Workflow:** Read `workflows/commit-push-release.md` completely before taking action.
2. **Resolve Request:** Run `node scripts/context.mjs resolve "<user-request>"` with the user's actual prompt to load relevant rules, skills, and context.
3. **Adhere to Gates & Stops:** Follow all phases, quality gates, and stop/escalation conditions defined in `workflows/commit-push-release.md` and `orchestrator/SHARED.md`.
4. **Authority Boundary:** Selecting this entry does not grant autonomous execution, merge, release, or waiver authority without explicit evidence and user consent.
