---
title: "Change identity and report verifier"
type: unit
parent: "phase-03-conformance-receipts"
unit: "03.01"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
branch: "task/PLN-0004/p03-receipt-identity"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; separate unit checkout permits this disjoint slice to run safely."
checkout_path: ".worktrees/PLN-0004/task-base"
worktree: ".worktrees/PLN-0004/phase-03/receipt-identity"
status: planned
created: "2026-10-07"
tags: [task, unit, cli]
depends_on: []
parallelizable_with: ["02.01"]
---

# Unit 03.01: Change identity and report verifier

> Phase: 03-conformance-receipts · Depends on: none · Parallelizable with: 02.01
> Task branch: `feat/PLN-0004-task-focused-submodule-cli-ux` · Unit branch: `task/PLN-0004/p03-receipt-identity` · Worktree: `.worktrees/PLN-0004/phase-03/receipt-identity`

## Objective

Define a deterministic content-bound changed-code identity and a strict verifier for conformance reports.

## Context packet

- **Source outcome:** The released discovery brief requires compact post-submodule setup and an authoritative, current conformance gate. ADR 0026 governs submodule onboarding, ADR 0029 owns conformance policy, and ADR 0032 selects the task-focused facade with optional gates.
- **Verified current state:** `evaluateConformance()` currently defaults `diffHash` to sorted changed path names; `verifyReportFreshness()` only compares caller-provided hashes. The report schema has no identity algorithm marker and rejects extra properties.
- **Acceptance criteria:** AC-07, AC-08.
- **Binding decision:** Add an explicit identity algorithm/version marker and reuse the authoritative verdict/binding; strict CI rejects legacy path-only reports. Keep compatibility for consumers that merely read old reports.
- **Execution boundary:** Native Node.js ESM, no new runtime dependency. Revalidate source paths and current Git state in the unit checkout; a planning rule hash is not a `preflight` receipt.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.policy][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md sourceHash:sha256:07fa2d10c26bc1fd7efdf216561ed2c23a3b5f618ff78202b01cdde32f140711
- [directive:cf.solid.srp-single-actor-boundary][mode:evidence-blocking] rules/solid/single-responsibility.md sourceHash:sha256:e55efdc0a22162771f1a48e1ad4133da68843da3ce9535cadbf111f20a9ba90f
</language_rules>

**Rule-satisfaction mapping:** Hash verified source bytes, validate untrusted paths/report JSON, and leave conformance verdict authority in the existing orchestrator. Applicable language rules take precedence over contradictory procedural steps. No active waiver is assumed; evidence-blocking directives need real named human evidence at execution.

## Preconditions

- A fresh task-base checkout contains the approved brief/ADR/plan and no unrelated user edits; confirm this unit's `depends_on` commits are integrated.
- Create `task/PLN-0004/p03-receipt-identity` at the correct task/phase base in `.worktrees/PLN-0004/phase-03/receipt-identity` only when parallel execution is justified; serial execution may use the isolated task worktree under ADR 0031.
- Compile an execution-time `context-cli preflight` for the actual modified file scope before code changes. Stop on missing binding or incompatible stack.

## Scope

**In scope:**
- `orchestrator/conformance/change-identity.mjs` (new)
- `orchestrator/conformance/report-verifier.mjs` (new)
- `orchestrator/conformance/conformance-orchestrator.mjs`
- `schemas/conformance-report.schema.json`
- `evals/tests/conformance/receipt-identity.test.mjs` (new)

**Out of scope:** Do not create a new rule engine, change waiver verdict semantics, or accept path-only hashes in strict verification.

## Steps

1. Define a versioned canonical identity from a selected Git base plus sorted changed path/status entries and SHA-256 of current file contents or deletion markers; include rename/mode status. Ensure identical path lists with different bytes produce different identities.
2. Reject out-of-root paths and ambiguous/missing base revisions; compare the same identity in a CI checkout. Handle empty applicable code scope as not applicable, never PASS.
3. Extend report schema additively with identity metadata and make strict verifier require the new version, PASS verdict, active binding hash, matching scope/content identity, and persisted artifact. Legacy reports remain parseable but fail strict verification.
4. Keep verdict aggregation and human waiver policy in their existing modules; verify no duplicate policy is introduced.

## Verification

- **Test type and reason:** Unit + contract + architecture: same-path edit, rename, deletion, base change, traversal, stale binding, legacy report, and current PASS; this catches false freshness and report-schema drift. Manual import review confirms verifier consumes authoritative verdict.
- **Named cases:** Same path/new bytes rejected; changed base rejected; missing report false; FAIL/BLOCKED false; content-bound current PASS true.
- **Focused command:** `node --test evals/tests/conformance/receipt-identity.test.mjs`.
- **Conformance gate:** Run `node app/cli/bin/context-cli.mjs conform "Verify unit 03.01 receipt-identity" --stack typescript --scope <actual-modified-files> --out .context-runs/PLN-0004/03.01/conformance-report.json --json` after the final unit diff. Supply named human evidence only if a real human provided it. Record actual report ID, verdict, diffHash, bindingHash, output path, and exit code; `FAIL` or `BLOCKED` stops the unit.
- **Review:** `git diff --check`, inspect `git status --short`, and compare the committed unit diff with this scope fence before phase integration.

## Rollback

Disable strict identity verification/generator together; retain old report read compatibility without claiming CI enforcement.

## Definition of done

- [ ] AC-07, AC-08 has the named passing test evidence and no unreported skip.
- [ ] The changed files stay inside this unit's scope, with implementation/import boundaries reviewed.
- [ ] The checkout has a clean commit and a real current `PASS` conformance receipt; required human evidence is named, not generated by an agent.
- [ ] The phase integration branch receives this reviewed commit in dependency order; task-owned worktree cleanup occurs after integration.
