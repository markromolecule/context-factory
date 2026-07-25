---
title: "Context reliability harness"
type: task
status: completed
created: "2026-07-25"
tags: [task, context, llm, reliability]
---

# Context reliability harness

## Outcome

Make Context Factory mechanically resist unsupported claims and architecture drift by adding evidence contracts, deterministic context resolution, structured LLM knowledge, behavioral evaluations, and synchronization checks.

## Acceptance criteria

| ID | Criterion | Verification |
|---|---|---|
| AC-01 | Agents distinguish verified facts, assumptions, decisions, unknowns, and results. | Evidence rule and shared contract validation |
| AC-02 | Architecture changes inspect current boundaries and record durable decisions. | Architecture rule, skill, workflow, and resolver evaluation |
| AC-03 | A dependency-free CLI resolves context, creates bundles, explains runs, checks health, and runs evaluations. | CLI smoke tests and evaluation suite |
| AC-04 | Canonical LLM Wiki notes have authority, provenance, ownership, lifecycle, and review metadata. | Knowledge schema and validator fixtures |
| AC-05 | Inventory, maps, generated lock data, Wiki links, and vault topology remain synchronized. | `node scripts/validate-context.mjs` |
| AC-06 | Behavioral scenarios detect incorrect context selection and unsupported completion behavior. | `node scripts/context.mjs eval` |

## Scope

- Shared orchestration and context-maintenance contracts.
- Global rules, specialized skills, and an architecture-change workflow.
- Machine-readable knowledge metadata and templates.
- Context resolver, immutable bundle/trace output, lockfile, doctor, and evaluator.
- Stronger manifest and vault synchronization validation.

## Non-goals

- Calling an LLM provider or choosing a model.
- A hosted vector database, web dashboard, or multi-agent runtime.
- Retrofitting architecture profiles into external projects.

## Constraints and decisions

- Use only Node.js standard-library dependencies.
- Keep Markdown as the canonical human- and machine-readable knowledge source.
- Select context deterministically from metadata and explicit evaluation expectations.
- Preserve existing user work; do not commit or stage changes.
- Follow [[docs/decisions/0004-deterministic-context-harness|ADR 0004]].

## Phases

- [x] Phase 1 — inspect current contracts, inventory, validation, and vault state.
- [x] Phase 2 — add evidence, architecture, grounding, and verification context.
- [x] Phase 3 — implement the context CLI, knowledge schema, lockfile, and evaluations.
- [x] Phase 4 — update manifest, maps, architecture, templates, and synchronization checks.
- [x] Phase 5 — run validation/evaluations and reconcile all findings.

## Verification

- `node --check scripts/context-core.mjs` — passed.
- `node --check scripts/context.mjs` — passed.
- `node --check scripts/validate-context.mjs` — passed.
- `node scripts/context.mjs bundle "Implement webhook signature verification, replay protection, and secret rotation"` — created immutable run `552bda1bed9c2f6c` with ten selected sources.
- `node scripts/context.mjs explain 552bda1bed9c2f6c` — reported the selected workflow, rules, required security skill, paths, and hashes.
- `node scripts/context.mjs doctor` — structural validation, lock verification, and all seven behavioral evaluations passed.
- `git diff --check` — passed.

## Deviations

- The conflicting nested `docs/.obsidian/` vault was preserved as ignored `docs/.obsidian.disabled/`; the root `.obsidian/` remains canonical.
- The pre-existing edit to `rules/backend/schema-db.md` was preserved and not modified by this task.

## Result

Context Factory 3.0.0 now has deterministic context compilation, evidence-backed completion contracts, architecture conformance, structured LLM Wiki knowledge, a complete canonical lock, behavioral regression cases, and CI enforcement.
