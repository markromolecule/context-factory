# Claude Code Host Project Instructions

This project uses **Context Factory** at `.` for engineering workflows and standards.

## Execution Rules
- Review `./orchestrator/SHARED.md` for orchestrator directives.
- Context resolution: `node scripts/context.mjs resolve "<prompt>"`.
- Write task plans to `./docs/tasks/` and ADRs to `./docs/decisions/` in this repository.
- Verify work using `node scripts/context.mjs doctor`.
