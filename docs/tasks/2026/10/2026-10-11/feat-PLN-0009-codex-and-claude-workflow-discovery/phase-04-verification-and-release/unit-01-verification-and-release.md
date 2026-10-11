---
title: "Whole-diff and live-host evidence"
type: unit
parent: "phase-04-verification-and-release"
unit: "04.01"
task_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
base_commit: "fa8f5db00cb0d113589190ed15d6752ab3612831"
status: verified
created: "2026-10-11"
tags: [task, unit, verification]
depends_on: ["02.01", "03.01"]
parallelizable_with: []
---

# Unit 04.01: Whole-Diff and Live-Host Evidence

> Task branch: `feat/PLN-0009-codex-and-claude-workflow-discovery` · Base: `fa8f5db00cb0d113589190ed15d6752ab3612831`

## Objective

Reconcile the final inventory and verify actual Codex and Claude behavior separately from factory health.

## Context packet

The released brief's AC-01–08 and ADR 0038 require four distinct evidence layers: entry inventory, valid target, resolver selection, and live canonical gate adherence. Unit 01.01 creates 12 thin entry sources and factory links; Unit 02.01 bridges and audits linked/submodule hosts; Unit 03.01 handles ordinary-language routing and syntax docs. Their commits and PASS receipts are prerequisites. `npm run sync` generates inventory/maps, `npm run lock` updates `context-lock.json`, `node scripts/context.mjs doctor` reports factory health, and `node evals/run-evals.mjs` exercises resolver cases. None alone proves native host invocation. User accepted Codex `/skills` or `$name` and Claude Code `/name`; each host needs its own observed smoke check. This unit serves AC-01, AC-02, AC-08 and final AC-03–07 reconciliation.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.completion][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.run-existing-checks][mode:automated-blocking] rules/global/code-quality.md sourceHash:sha256:953a9cc78d05e2ea55c2dce6dc259ab34c330cf3b5e94efc135105acd8833dce
</language_rules>

**Rule satisfaction:** Record exact command output, live host observations, skipped checks, and independent receipt validation. A factory PASS cannot be reported as host proof; do not mark the task complete without both host checks.

## Preconditions

- Verify exact task branch, clean status except this unit, and the committed outputs, reviews, and PASS receipts of 01.01, 02.01, and 03.01.
- Read final manifest, maps, lock, generated links, tests, evaluation cases, bridge audit output, and current host documentation. Confirm access to both hosts before a completion claim.

## Scope

**In scope:** `context-manifest.json`, `context-lock.json`, `docs/Skills.md`, `docs/Workflows.md`, `evals/tests/bridge/workflow-entry-contract.test.mjs` (only if a final gap is found), `evals/tests/bridge/bridge-conformance.test.mjs` (only if a final gap is found), `evals/tests/bridge/workflow-routing.test.mjs` (only if a final gap is found), `docs/tasks/2026/10/2026-10-11/feat-PLN-0009-codex-and-claude-workflow-discovery/README.md` (evidence ledger).

**Out of scope:** New feature behavior without a failing test and reviewed unit scope amendment, unrelated host application files, automatic deployment, push, tag, or merge.

## Steps

1. Recheck one-to-one manifest mapping and both factory and representative host links. Measure all entry names and skill-list size; record any observed truncation. Run factory and linked/submodule audits plus collision/broken-target negatives.
2. Run focused contract, bridge, and routing tests; `npm run sync`, `npm run lock`, `npm run lint`, `node evals/run-evals.mjs`, and `node scripts/context.mjs doctor`. Verify changed generated files and update the finalization ledger.
3. In a real Codex session, find an entry through `/skills` or `$name`, invoke it on a bounded sample request, and capture the selected canonical file, required input, and stop condition. Repeat independently in Claude Code with `/workflow-<slug>`. Use a harmless planning/discovery request; do not infer results from filesystem checks or simulate a host UI.
4. Compile a whole-diff preflight binding for all affected files and run conform. Independently verify persisted report ID, PASS verdict, diff hash, and binding hash. Run `git diff --check` and an independent review of all changed files vs plan scope.
5. Mark each AC passed only with its command/host evidence. If either host is unavailable or fails discovery/gate behavior, record unresolved/device-pending equivalent and stop finalization. Do not merge or push from this unit.

## Verification

- **Integration/contract checks:** `node --test evals/tests/bridge/workflow-entry-contract.test.mjs evals/tests/bridge/bridge-conformance.test.mjs evals/tests/bridge/workflow-routing.test.mjs`; without these, final catalog changes can break a previously passing seam.
- **Full regression:** `npm run lint`, `node evals/run-evals.mjs`, `node scripts/context.mjs doctor`, and `git diff --check`.
- **Manual host contract:** Separate Codex and Claude discovery/invocation transcripts or screenshots identifying canonical workflow and a real required gate/stop. This catches a host behavior failure that automated factory tests cannot.
- **Conformance gate:** Fresh whole-diff `node app/cli/bin/context-cli.mjs preflight`, `node app/cli/bin/context-cli.mjs conform`, and receipt verification with named human evidence for evidence-blocking directives; FAIL/BLOCKED stops progression.

## Rollback

Revert the task branch's owned adapter, bridge, resolver, and generated catalog commits in reverse dependency order. In hosts, remove only entries proven generated and still pointing at the recorded factory source. Preserve unowned paths. No database migration is involved.

## Definition of done

- [x] AC-01–08 have exact unit test or live host evidence, with factory and host results separated.
- [x] Manifest/maps/lock, lint, evaluations, doctor, and whole-diff review pass.
- [x] Separate Codex and Claude smoke evidence proves discovery, canonical load, and stop condition.
- [x] Fresh whole-diff conformance PASS receipt verified; finalization ledger updated.
- [x] Task branch remains unmerged and unpushed pending separate authorization.
