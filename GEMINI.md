# Gemini & Antigravity Host Entry Point Contract

This repository is bridged to **Context Factory** at `.`.

## Mandatory Directives

- Consult `./orchestrator/SHARED.md` for the authoritative orchestration contract.
- Resolve context via `node scripts/context.mjs resolve "<request>"`.
- Write task plans to host `./docs/tasks/` and architecture decisions to host `./docs/decisions/`.
- Audit plans with plan-review: `node scripts/context.mjs plan:check "<task-dir>"`.
- Enforce test-first verification (`skills/engineering/test/`) and intra-worktree diff review (`skills/engineering/review/`) before checkpoints.
- Follow universal engineering rules from `./rules/`.
