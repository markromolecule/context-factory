---
title: "Evaluate source-dependent answers"
type: unit
parent: "phase-03-routing-and-evaluation"
unit: "03.02"
task_branch: "feat/PLN-0015-grounded-run-context-and-retrieval-evalu"
base_commit: "5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e"
status: planned
created: "2026-11-10"
tags: [task, unit, evaluation]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 03.02: Evaluate source-dependent answers

> Task branch: `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`; base commit: `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e`. Depends on: 03.01.

## Objective

Make offline evaluations distinguish routing checks from answers derived from retrieved sources, and fail when required evidence is withheld or changed.

## Context packet

- Verified released brief: `docs/discovery/grounded-run-context-and-retrieval-evaluations/brief.md`; user confirmed scope on 2026-11-10. This unit serves AC-05 and AC-06.
- Current `evals/run-evals.mjs` passes `dataset.goldenOutput` as `fixture` to `executeRun`, then compares the returned output to `dataset.goldenOutput`. The mock provider returns a fixture verbatim. The six existing datasets mostly assert workflow/status and can still act as routing datasets after the fixture is removed.
- `evals/tests/rules/prompt-compiler.test.mjs` is an existing manifest-listed test file and already exercises `executeRun` with custom capture providers. Extend it with a narrow deterministic provider that reads the labeled source section, constructs an answer and path/hash provenance from received content, and never receives the expected answer as input. This proves the harness data path, not general live-model reasoning. Current `doctor` and `pnpm run test` run `evals/run-evals.mjs`, while CI invokes only `pnpm run doctor`; without an added CI step, this Node test would not guard later changes.
- Units 01.01 and 02.01 must have committed the bounded prompt contract; Unit 03.01 must have committed authenticated-request routing. Expected state: KISS/YAGNI source text can reach the custom provider and selected security guidance reaches the authenticated endpoint provider input.
- `.mjs` implementation has no TypeScript preflight PASS; use global evidence and code-quality directives below.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.evidence.completion][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
- [directive:cf.quality.reject-untestable-code][mode:evidence-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
</language_rules>

> Applicable rule text takes precedence over conflicting steps. Refresh hashes before execution if rule sources change.

## Preconditions / Expected state from dependencies

- `git symbolic-ref --quiet --short HEAD` must equal `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`.
- Verify the released brief and passing, committed receipts for Units 01.01, 02.01, and 03.01. Stop and reconcile if the source-section representation or route output differs from this packet.

## Scope

**In scope:**
- `evals/run-evals.mjs`
- `evals/tests/rules/prompt-compiler.test.mjs`
- `.github/workflows/context-factory.yml`
- `context-lock.json`

**Out of scope:** Production resolver/runner/provider changes, new model SDKs, live-model CI, dataset schema migration, and claims about general model quality. If existing dataset expectations require a format change, amend this unit's scope and master plan before changing dataset files.

## Steps

1. Remove `fixture: dataset.goldenOutput` from the dataset call to `executeRun`. Keep the expected output as an assertion only. Label existing dataset results as routing/mock contract evidence rather than grounded answer quality.
2. Add a source-dependent test using the actual `executeRun` prepared provider input for a KISS/YAGNI request. The deterministic provider must parse source paths, hashes, and bodies from the received source section, derive a narrow answer from the note bodies, and return cited provenance. The expected answer is held by the test, never passed to the provider.
3. Add negative variations at the assembly/provider seam: remove the needed note, alter its body without updating the expected hash, and supply a canned golden answer without source evidence. Each must fail either provenance or answer assertions. Verify an unrelated note is not cited.
4. Run existing routing datasets without fixture injection and inspect any failures as real behavior changes. Add a pull-request CI step after doctor that runs `node --test evals/tests/rules/prompt-compiler.test.mjs evals/tests/cli/run-budget.test.mjs evals/tests/resolver/intent-routing.test.mjs`; a failing grounded-answer test must make CI fail. Document that offline source-dependent tests prove wiring and evidence use under a deterministic provider, while live-model answer quality remains unmeasured.
5. Regenerate `context-lock.json` for the changed manifest-tracked evaluation runner and test before the unit's host checks.

## Verification

- **Integration and regression tests:** `node --test evals/tests/rules/prompt-compiler.test.mjs evals/tests/cli/run-budget.test.mjs evals/tests/resolver/intent-routing.test.mjs` for source-dependent positive, omission, mutation, stale hash, canned-answer negative, budget, and routing cases; `node scripts/context.mjs eval` for all six existing dataset paths without golden-output fixture injection. The new grounded-answer test must fail against the old unaugmented `executeRun` and pass after Units 01.01/02.01. Verify the CI workflow runs the same Node command and propagates a nonzero exit status.
- **Host checks:** From repository root, run `pnpm run lint`, `pnpm run test`, `pnpm run test:unit`, `pnpm run build`, and `node scripts/context.mjs doctor` at the changed revision. Record command, scope, exit code, revision/diff identity, and result; typecheck is unconfigured in `package.json`.
- **Human evidence:** Review whether the answer assertion truly depends on received source bodies and whether the report accurately limits the claim to offline harness behavior. Record selected hashes and reviewer receipt; neither doctor nor a passing deterministic provider proves live model quality.

## Rollback

Revert this unit's evaluation runner and test changes on the task branch. Previous fixture-fed datasets return; no persisted application or remote state is changed.

## Definition of done

- [ ] AC-05 and AC-06 have source-dependent positive and negative results with recorded commands.
- [ ] Branch, brief, and all predecessor receipts remain current.
- [ ] Only the four scoped files changed; no golden expected answer is supplied to the provider.
- [ ] Focused and configured host checks pass with revision-bound receipts; absent checks are unconfigured.
- [ ] The final report states the offline evaluation limit and the task branch is ready for implementation verification under the already approved plan-review packet.
