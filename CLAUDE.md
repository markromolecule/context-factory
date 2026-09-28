# Claude Code Host Project Instructions

This project uses **Context Factory** at `.` for engineering workflows and standards.

## Execution Rules
- Review `./orchestrator/SHARED.md` for orchestrator directives.
- Context resolution: `node scripts/context.mjs resolve "<prompt>"`.
- Write task plans to `./docs/tasks/` and ADRs to `./docs/decisions/` in this repository.
- Audit plans with plan-review: `node scripts/context.mjs plan:check "<task-dir>"`.
- Enforce test-first verification (`skills/engineering/test/`) and intra-worktree diff review (`skills/engineering/review/`) before checkpoints.
- Verify work using `node scripts/context.mjs doctor`.
