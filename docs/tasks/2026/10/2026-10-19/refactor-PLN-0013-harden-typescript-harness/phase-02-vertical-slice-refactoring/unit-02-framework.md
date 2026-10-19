---
title: "Bind TypeScript and frameworks to real package scope"
type: unit
parent: "phase-02-vertical-slice-refactoring"
unit: "02.02"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 02.02: Bind TypeScript and frameworks to real package scope

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: 02.01.

## Objective

Bind TypeScript and frameworks to real package scope so AC-05 can be judged from executable evidence.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; decision D-01 removes runtime conformance, D-02 keeps factory host entries, D-03 preserves catalog layers, D-04 requires scoped coverage, D-05 measures context budgets.
- Current evidence: `scripts/framework-scope.mjs` already avoids sibling framework inheritance in one path, but resolver framework and language scoring remains broad. JS/JSX must retain applicable gates without a TypeScript label.
- Acceptance AC-05: Scope and package evidence determine TypeScript/framework applicability. This unit stands alone; its steps and test cases supply the receipt.
- Scope is JavaScript implementation and Markdown catalog/configuration; no TypeScript-only directive is claimed for an `.mjs` source.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
</language_rules>

> Applicable rule text takes precedence over conflicting steps. Refresh hashes if canonical rule content changes before execution.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` must equal `refactor/PLN-0013-harden-typescript-harness`; stop on detached HEAD, wrong branch, dirty unrelated state, or changed target base.
- Verify the released brief with `node scripts/context.mjs handoff:verify-brief docs/discovery/typescript-agent-harness-solidification/brief.md`.
- Dependencies 02.01 have committed verification receipts; stop if any required check failed.

## Scope

**In scope:**
- `scripts/framework-scope.mjs`
- `scripts/context-core.mjs`
- `evals/tests/resolver/framework-scope.test.mjs` (new)

**Out of scope:** Host product code, unrelated dirty files, historical task records, and work reserved for another unit.

## Steps

1. Build fixture monorepo with root, sibling, and nested Next/React/Solid packages, plus TS/TSX and JS/JSX files; record package.json evidence per path.
2. Apply framework rules only when the affected file resolves to the owning package; avoid prompt-only or sibling inference for material scoped work.
3. Require path and language applicability before TypeScript directives; keep global/security selection and return explicit unsupported coverage when no matching TypeScript rule applies.

## Verification

- **Test choice and cases:** Integration tests in new `evals/tests/resolver/framework-scope.test.mjs`; `node --test evals/tests/resolver/framework-scope.test.mjs`. Cross-package leakage and JS/JSX TypeScript labels must fail.
- **Evidence gate:** Record command, exit code, touched files, Git revision, binding/rule hashes, and any required human receipt. A unit is blocked if a required tool or check is unavailable. Do not use the removed runtime `conform` command.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 records the exact owner and affected files; any expansion is documented before editing.
- `cf.evidence.verification`: the named negative and positive cases in Verification produce a command, exit code, and revision-bound receipt; missing tools block completion.
- `cf.quality.tests-for-behavior-changes`: the specified behavior or contract tests fail on the named regression before the implementation is accepted.

## Rollback

Revert scope commit; preserve fixture package graph and observed baseline.

## Definition of done

- [ ] AC-05 has a linked result and negative case evidence.
- [ ] Branch and dependency preconditions hold; only declared scope changed.
- [ ] Tests above pass and outputs are recorded against the current revision.
- [ ] Human evidence, when required by the selected workflow, is attached.
- [ ] Changes are reviewed and committed on the task branch; no unresolved blockers remain.
