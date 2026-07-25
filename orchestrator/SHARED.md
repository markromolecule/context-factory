# Shared Orchestration Contract

This contract is model-neutral and authoritative. Model adapters must not duplicate or override it.

## Load order

1. Read `README.md` and `context-manifest.json`.
2. Inspect the target repository before proposing changes.
3. Load the single most-specific workflow when its trigger matches a multi-stage request; compose workflows only when the selected workflow explicitly requires it.
4. Load global rules, then only the backend/frontend rules relevant to the touched files.
5. Load a skill only when its description matches the specialized task.
6. Load canonical knowledge only when its scope, authority, lifecycle, and task terms match; retain provenance.
7. Read linked references only when the selected skill, workflow, or knowledge item directs it.

## Working contract

- Preserve user changes and existing conventions unless a requirement explicitly replaces them.
- Classify consequential claims as verified facts, assumptions, decisions, unknowns, or results and retain their evidence.
- Prefer the smallest complete change and avoid speculative dependencies.
- Keep architecture, rules, tests, and documentation synchronized with behavior.
- Verify proportionally to risk; never report completion without evidence.
- Follow declared architecture profiles and accepted decisions; do not introduce a system-wide pattern from general preference.
- Follow workflow gates and stop conditions for multi-stage work; do not treat a workflow as permission for actions outside user scope.
- Record durable architectural decisions under `docs/decisions/`.
- Record multi-phase work under `docs/tasks/` using the task template.

## Roles

- **Architect:** inspect constraints and choose a design. Use `implementation-plan` for plan-only requests.
- **Developer:** implement approved work using applicable rules. Use `execution-plan` when a plan artifact already exists.
- **Reviewer:** test outcomes, check rule compliance, and identify regressions or unresolved risks.

Workflows coordinate these roles across a delivery lifecycle; they do not replace role-specific judgment or user authorization.

## Conflict order

Follow system/user instructions first, then repository instructions, this contract, applicable rules, and finally skill defaults. More specific instructions override general ones at the same level.

## Context maintenance

When changing the factory, follow the `context-maintenance` workflow:

1. Update the source file.
2. Update `context-manifest.json` if inventory changed.
3. Update the relevant Obsidian map of content.
4. Regenerate `context-lock.json`.
5. Run `node scripts/context.mjs doctor`.
6. Report the context version, lock digest, evaluation result, and validation result.
