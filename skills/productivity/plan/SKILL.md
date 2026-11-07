---
name: plan
description: Turn a released discovery brief into a phased implementation plan with self-contained, dependency-ordered units for later execution. Use for requests to plan an implementation, design approach, migration, or task breakdown, including /plan and [PLAN]. Do not use for executing or reviewing a plan, or for resolving open product requirements.
compatibility: Requires git, node, scripts/context.mjs, and docs/templates/ in Context Factory.
---
# Plan

## Access declaration

- **Reads:** released brief, grounding evidence, repository code/tests/configuration, decisions, and applicable rules.
- **Writes:** task branch and plan artifacts under `docs/tasks/`.
- **Exposes to:** `plan-review` through the master plan and unit files.

Write a plan that another session can execute one unit at a time. **Do not edit production code.** If the user also asks for implementation, finish planning and obtain the required plan review before using `execute`.

## Unit boundary

Each unit is a standalone context packet: it must make sense without the planning chat, master plan, or other units. Repeat the relevant facts and decisions in each unit. Size by one responsibility, contract, or boundary. If two units can only work together, combine them; if one unit has multiple independent outcomes, split it.

For an explicitly requested plan of an isolated change with one seam, no public contract, schema, data, authorization, or dependency change, and a small file scope, use one phase and one unit. The repository's feature workflow allows direct implementation without a plan for such changes; do not trigger this skill solely because the work is small.

## Stop and report

- An unresolved product, scope, or requirements question needs `grill`.
- The released brief is missing, fails `handoff:verify-brief`, or conflicts with current evidence.
- The intended base is behind its upstream, HEAD is detached, or unrelated checkout changes would be disturbed.
- An existing task branch has a different plan identity or is not already checked out for this task.
- `scripts/context.mjs` is missing or fails, a previewed plan ID changes at scaffold time, or `plan:check` remains failing after two focused repair attempts.

Preserve user changes; do not stash, reset, or discard them. Report the exact failing gate and remaining draft artifacts. For branch and scaffold mechanics, including safe resume, read [branching.md](references/branching.md) before creating or resuming a plan.

## Work

1. Run `node scripts/context.mjs handoff:verify-brief <brief>` and read the released brief end to end. Restate the outcome, non-goals, and measurable `AC-NN` criteria. Use its grounded evidence rather than reopening the upstream `context` specification. Confirm material claims against the current repository before planning.
2. Follow [branching.md](references/branching.md) to verify the base and checkout, preview `task:new`, create the single task branch, and scaffold. Resume an existing plan only when its identity and branch match. The scaffold records the branch and base SHA in the generated artifacts; preserve those values.
3. Inspect affected source, tests, configuration, schemas, and consumers. Distinguish verified facts, assumptions, open technical choices, and out-of-scope work. Cite inspected paths; label proposed new files as new.
4. For each material unresolved technical choice, follow [`rules/global/1-3-1-rule.md`](../../../rules/global/1-3-1-rule.md): define one decision, compare three viable approaches, and recommend one. Record the comparison in the master decision ledger. Do not invent a third option; if fewer than three are viable, explain the constraint for review. Route durable, cross-cutting decisions to [`adr`](../adr/SKILL.md). Product decisions return to `grill`; `plan-review` handles approval before execution.
5. Check responsibilities and dependencies against [`knowledge/principles/`](../../../knowledge/principles/). Group units into phases, give each unit explicit `depends_on` edges, and record a topological execution order for the serial task branch.
6. Assign specific, justified tests to each unit using [test-matrix.md](references/test-matrix.md). Name the behavior, boundary, and command; do not write “add tests.”
7. Fill the scaffold using `docs/templates/Task.md`, `Phase.md`, and `Unit.md`. Set the master frontmatter `discovery_brief` to the verified brief path relative to the master file. The master plan maps goals, scenarios, constraints, and decisions through `AC-NN` to units and verification. Record risks and migration, environment, security, observability, and rollback impact where relevant. Every unit includes its goal, scope fences, expected state from dependencies, concrete files and steps, tests, unit-scoped `<language_rules>`, and rollback. Read [example-unit.md](references/example-unit.md) if unit specificity is unclear. Rule bindings need applicable directive IDs, paths, modes, and hashes from the current rule sources or binding receipt; the scaffold does not populate them. Cite an active, authorized waiver for any intentional rule deviation.
8. Run `node scripts/context.mjs plan:check <task-dir>` and repair reported failures. Then inspect what the validator cannot judge: product decisions are resolved upstream; material technical choices are recorded; unit packets stand alone; tests match changed seams; and the stated order respects dependencies. If execution changes a contract or decision, mark downstream units stale for reconciliation.

## Handoff

Report the master plan and task folder paths, task branch and 40-character base SHA, phase/unit summary, and linearized order. State any unresolved gate as a draft, not a completed plan. Planning artifacts are committed only when the user or active workflow requests a commit; plan review remains a separate approval gate.
