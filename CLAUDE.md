# Context Factory

For direct questions and trivial edits, use the relevant files; skip the workflow below.

For changes to code, plans, or docs:

1. Read `orchestrator/SHARED.md`. Run `node scripts/context.mjs resolve "<request>"`. Read relevant results, explicitly named files, and the files being changed. The resolver suggests context; it does not limit what you may inspect.
2. Write plans under `docs/tasks/` and ADRs under `docs/decisions/`. The `plan` skill creates a task branch when a plan is needed. Run `node scripts/context.mjs plan:check "<task-dir>"` before presenting a plan.
3. For code changes, verify the recorded task branch when a plan exists. Write a failing test first for behavior changes, review your diff against the task's allowed files and tests, and run relevant checks. Follow required `preflight` and `conform` gates in the shared contract; stop on `FAIL` or `BLOCKED`.

For changes to this factory's instructions, rules, skills, or workflows, update its inventory and lock, then run `node scripts/context.mjs doctor`.

Report what passed, failed, or was not run. `doctor` checks factory health; task completion also requires evidence that the requested outcome works.
