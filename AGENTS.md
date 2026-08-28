# Host Project AI Agent Instructions & Context Factory Bridge

This repository uses **Context Factory** (located at `.`) for development standards, rules, workflows, subagents, and skills.

## Mandatory Directives & Agent Execution Contract

1. **Shared Contract:** Read the shared orchestration contract in `./orchestrator/SHARED.md` before executing tasks.
2. **Context Resolution:** Deterministically resolve required context before non-trivial changes:
   `node scripts/context.mjs resolve "<task description>"`
3. **Universal Standards:** Follow rules in `./rules/`, workflows in `./workflows/`, and skills in `./skills/`.
4. **Project Specifics:** Combine universal factory rules with project-specific rules in `./rules/` or `./.agents/rules/`.

## Generated Documentation Scoping Contract

- **Task Plans & Breakdowns:** All implementation plans, phase breakdowns, and task files MUST be written to `./docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/` in **this host repository**, NEVER inside `.`.
- **Architecture Decisions (ADRs):** All architectural decision records MUST be saved to `./docs/decisions/` in **this host repository**.
- **Templates:** Always load templates from `./docs/templates/Task.md`, `Phase.md`, and `Decision.md`.

## Session Slash Commands & Quick Actions

| Command | Action | Execution |
| :--- | :--- | :--- |
| `/plan`, `[PLAN]` | Scaffold phased plan in `./docs/tasks/` | `node scripts/context.mjs task:new "<title>"` |
| `/resolve` | Resolve matching context rules & skills | `node scripts/context.mjs resolve "<prompt>"` |
| `/doctor` | Verify context and lock health | `node scripts/context.mjs doctor` |
