---
title: "Resolver boundaries and host guidance"
type: unit
parent: "phase-03-routing-and-docs"
unit: "03.01"
task_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
base_commit: "fa8f5db00cb0d113589190ed15d6752ab3612831"
status: planned
created: "2026-10-11"
tags: [task, unit, resolver]
depends_on: ["01.01"]
parallelizable_with: ["02.01"]
---

# Unit 03.01: Resolver Boundaries and Host Guidance

> Task branch: `feat/PLN-0009-codex-and-claude-workflow-discovery` · Base: `fa8f5db00cb0d113589190ed15d6752ab3612831`

## Objective

Preserve appropriate workflow selection from ordinary task requests and explain native invocation accurately.

## Context packet

The released brief and user decision require both implicit routing and visible host entries. `scripts/context-core.mjs` uses `ACTION_TERMS`, `ROUTING_HINTS`, agent defaults, and a relevance threshold; selected output includes a reason. A direct question mentioning “workflow” is not necessarily a lifecycle request. Ambiguous tasks should not receive a confident selection without a clear action and target. `app/cli/core/indexer.mjs` generates `docs/Workflows.md` with “Session Slash Commands & Prefix Triggers,” though these slash-like strings are internal resolver aliases, not registrations in either host. `README.md` also describes editor bridging. ADR 0038 and the released brief fix native syntax: Codex `/skills` or `$workflow-<slug>`; Claude Code `/workflow-<slug>`. The 12 adapters from Unit 01.01 stay canonical pointers. This unit serves AC-03 and AC-07. It is independent of Unit 02.01 after Unit 01.01; use the shared branch serially.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
- [directive:cf.quality.reject-duplicate-policy][mode:evidence-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
</language_rules>

**Rule satisfaction:** Keep one resolver owner for routing logic, test behavior before editing it, and document syntax without copying lifecycle gate policy.

## Preconditions

- Verify exact task branch and Unit 01.01 commit/receipt; stop for unrelated dirty state.
- Read resolver selection and evaluation schema, current routing cases, indexer generator, `README.md`, `docs/Workflows.md`, ADR 0038, and current native host syntax. Recompile binding hashes.

## Scope

**In scope:** `scripts/context-core.mjs` (only for a failing routing case), `evals/tests/bridge/workflow-routing.test.mjs` (new), `evals/cases/workflow-discovery.json` (new), `evals/cases/direct-question.json`, `evals/cases/slash-commands.json` (only if existing cases need updating), `app/cli/core/indexer.mjs` (workflow-doc wording), `docs/Workflows.md` (generated), `README.md`.

**Out of scope:** canonical workflow gates, adapter source files, host link installer, unrelated resolver ranking, and claims that Codex registers literal `/workflow-*` commands.

## Steps

1. Add failing cases for an actionable feature/defect/maintenance request with the expected workflow and inspectable reason; a direct “how do I run plan check?” question with no forced delivery workflow; and a genuinely ambiguous task with no unjustified winner. Include explicit legacy alias compatibility.
2. Change `scripts/context-core.mjs` only if a named case fails. Keep action-sensitive selection, deterministic hints, and transparent reasons; avoid broad keyword rules that turn every workflow mention into a lifecycle.
3. Change `generateWorkflowsMoc` in `app/cli/core/indexer.mjs` so generated docs distinguish resolver aliases from native entries. Add Codex and Claude invocation examples to generated and hand-written guidance, with canonical workflow links and no second gate text.
4. Regenerate docs, run focused and full resolver evaluations, doctor, fresh preflight/conform, review scope, and commit on PASS.

## Verification

- **Unit/contract tests:** `node --test evals/tests/bridge/workflow-routing.test.mjs` checks selection and reason semantics; without it direct questions may trigger unwanted delivery work.
- **Evaluation integration:** `node evals/run-evals.mjs` covers resolver case metadata and regression; `node scripts/context.mjs doctor` checks generated docs and inventory.
- **Conformance gate:** Fresh `node app/cli/bin/context-cli.mjs preflight` and `node app/cli/bin/context-cli.mjs conform` for exact scope, persisted PASS receipt and hashes; stop on FAIL/BLOCKED.

## Rollback

Revert resolver/test/docs changes together and regenerate `docs/Workflows.md` from the reverted indexer. Existing internal aliases remain functional.

## Definition of done

- [ ] AC-03 and AC-07 cases pass, including negative boundaries.
- [ ] Generated and hand-written syntax guidance agrees.
- [ ] Exact task branch, scoped diff, and review confirmed.
- [ ] Fresh unit conformance PASS receipt verified and change committed.
