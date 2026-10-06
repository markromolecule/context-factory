---
title: "Conformance Port, Waiver Policy, and Evidence Gate"
type: unit
parent: "phase-03-typescript-enforcement"
unit: "03.01"
branch: "task/0001/phase-03/conformance-evidence-gate"
worktree: ".worktrees/0001/phase-03/conformance-evidence-gate"
status: planned
created: "2026-10-06"
tags: [task, unit, conformance, waiver, evidence]
depends_on: ["02.02", "02.03"]
parallelizable_with: []
---

# Unit 03.01: Conformance Port, Waiver Policy, and Evidence Gate

## Objective

Define the lean adapter port and aggregate per-directive evidence into the only success status accepted by downstream lifecycle gates.

## Context packet

- Blocking directives require PASS or an active human-authorized waiver.
- Preserve PASS, FAIL, WAIVED, NOT_AUTOMATABLE, TOOL_UNAVAILABLE, and UNSUPPORTED as distinct states.
- Evidence-blocking rules require named human evidence; agents cannot supply authority.
- AC-05 and AC-06; SC-05 and SC-06.

<language_rules>
- `rules/solid/dependency-inversion.md`: The orchestrator owns a lean adapter contract; concrete stack/tool adapters depend on it.
- `rules/solid/interface-segregation.md`: Adapter input contains only binding, changed scope, capabilities, and an injected command service.
- `rules/solid/liskov-substitution.md`: Every adapter result obeys identical statuses, evidence shape, timeout, and unsupported semantics.
- `rules/global/evidence-and-claims.md`: Result success is derived only from recorded per-directive evidence.
</language_rules>

## Preconditions

- Binding and prompt/plan gates from Phase 2 are merged.

## Scope

**In scope:** new `orchestrator/conformance/conformance-orchestrator.mjs`, `adapter-contract.mjs`, `waiver-policy.mjs`, `evidence-gate.mjs`; new `evals/conformance-gate.test.mjs`.

**Out of scope:** TypeScript commands, CLI formatting, workflow prose, and bridge files.

## Steps

1. Define runtime-validated adapter registration and result contracts without stack conditionals.
2. Validate waiver authority, exact scope, rule ID, expiry/review trigger, rationale, and compensating evidence; reject agent/self authority.
3. Aggregate directive results deterministically and calculate coverage without counting unsupported/advisory as enforced.
4. Derive blocking success/failure and invalidate reports when binding/diff hashes change.
5. Test every state transition, mixed-result report, timeout, thrown adapter error, stale hash, and waiver failure mode.

## Verification

- **Unit tests:** waiver policy and result aggregation.
- **Contract tests:** substitute fake adapters and assert LSP-compatible behavior.
- **Security tests:** forged authority and path/scope broadening reject.
- Command: `node --test evals/conformance-gate.test.mjs`.

## Rollback

Remove orchestrator modules/tests; bindings and prompt compilation remain usable in advisory compatibility mode.

## Definition of done

- [ ] AC-05 and AC-06 pass.
- [ ] No agent-provided field can activate a waiver.
- [ ] Coverage and success calculations preserve all distinct states.
- [ ] Architecture review confirms inward dependency direction.
