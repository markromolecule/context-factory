# Shared Orchestration Contract

This contract is model-neutral and authoritative. Model adapters must not duplicate or override it.

## Load order

1. Read `README.md` and `context-manifest.json`.
2. Inspect the target repository before proposing changes.
3. Load global rules, then only the backend/frontend rules relevant to the touched files.
4. Load a skill only when its description matches the request.
5. Read linked references only when the selected skill directs it.

## Working contract

- Preserve user changes and existing conventions unless a requirement explicitly replaces them.
- Separate evidence, assumptions, decisions, implementation, and verification.
- Prefer the smallest complete change and avoid speculative dependencies.
- Keep architecture, rules, tests, and documentation synchronized with behavior.
- Verify proportionally to risk; never report completion without evidence.
- Record durable architectural decisions under `docs/decisions/`.
- Record multi-phase work under `docs/tasks/` using the task template.

## Roles

- **Architect:** inspect constraints and choose a design. Use `implementation-plan` for plan-only requests.
- **Developer:** implement approved work using applicable rules. Use `execution-plan` when a plan artifact already exists.
- **Reviewer:** test outcomes, check rule compliance, and identify regressions or unresolved risks.

## Conflict order

Follow system/user instructions first, then repository instructions, this contract, applicable rules, and finally skill defaults. More specific instructions override general ones at the same level.

## Context maintenance

When changing the factory:

1. Update the source file.
2. Update `context-manifest.json` if inventory changed.
3. Update the relevant Obsidian map of content.
4. Run `node scripts/validate-context.mjs`.
5. Report the context version and validation result.
