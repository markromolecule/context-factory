---
name: execution-plan
description: Execute an existing implementation-plan artifact phase by phase, update its checkboxes and evidence, verify the resulting code, and record justified deviations. Use when a user asks to implement, execute, continue, or finish a previously written plan file.
---

# Execute an Existing Plan

This skill consumes a plan; it does not invent a replacement plan.

## Start

1. Locate the user-specified plan or the relevant task directory/file under `docs/tasks/`.
2. Read the master plan (`README.md` / `<type>-<id>-<feature>.md`) and all associated phase files (`phase-01-...md`, etc.). Inspect every referenced source boundary.
3. Confirm prerequisites, current state, and any already-completed work from evidence.
4. If the plan is missing or a decision would materially change scope, report the blocker and request direction.

## Execute

- Work in dependency order through the phase files and keep at most one phase active.
- Modify only in-scope files plus necessary tests, generated artifacts, and documentation.
- Follow applicable rules from `context-manifest.json`.
- Run the narrowest useful verification after each task and broader checks at phase boundaries.
- Mark checkboxes and phase status complete only after its outcome exists and its stated verification passes.
- Record commands/results in the phase artifact's and master plan's Verification section.
- Record deviations with reason, impact, and user approval when scope changes materially.
- Continue across phases without artificial approval pauses unless the plan/user requires a checkpoint or the next action is high-impact.

## Database and configuration changes

- Review generated migration SQL before applying it.
- Record forward and rollback/mitigation steps.
- Update `.env.example` without exposing secrets.
- Regenerate Prisma/Kysely types and typecheck all consumers.

## Completion

Run the plan's final checks, confirm every acceptance criterion, update documentation/decisions, and leave unresolved items unchecked with an explanation. Report changed behavior, verification evidence, migrations/configuration, deviations, and remaining risks.
