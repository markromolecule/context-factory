---
title: "Make CLI exports and generated CI executable"
type: unit
parent: "phase-01-boundary-analysis"
unit: "01.02"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 01.02: Make CLI exports and generated CI executable

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: 01.01.

## Objective

Make CLI exports and generated CI executable so AC-02 can be judged from executable evidence.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; decision D-01 removes runtime conformance, D-02 keeps factory host entries, D-03 preserves catalog layers, D-04 requires scoped coverage, D-05 measures context budgets.
- Current evidence: `app/cli/index.mjs` exports missing `commands/conform.mjs`; `github-gate-generator.mjs` emits a `conform` step. D-01 requires configured pnpm host checks and honest unconfigured outcomes.
- Acceptance AC-02: Public CLI index imports; no active generated command invokes missing conform; CI executes emitted checks. This unit stands alone; its steps and test cases supply the receipt.
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
- Dependencies 01.01 have committed verification receipts; stop if any required check failed.

## Scope

**In scope:**
- `app/cli/index.mjs`
- `app/cli/core/github-gate-generator.mjs`
- `scripts/harness-cli.mjs`
- `evals/tests/cli/github-gate.test.mjs`
- `app/cli/README.md`

**Out of scope:** Host product code, unrelated dirty files, historical task records, and work reserved for another unit.

## Steps

1. Remove the dangling public export and dead dispatcher/help references; enumerate every generated check and verify its command exists for the selected host profile.
2. Generate explicit pnpm lint/typecheck/test/build steps only when configured, with clear unavailable or required-check failure semantics; retain foreign package-manager rejection.
3. Test the emitted fixture in a temporary host, including missing scripts, configured scripts, failed scripts, and a public `index.mjs` import.

## Verification

- **Test choice and cases:** Contract/integration tests exercise generated YAML and execute each emitted command in a fixture; `node --test evals/tests/cli/github-gate.test.mjs` plus `node --input-type=module -e 'import("./app/cli/index.mjs")'`. A missing command or false green must fail.
- **Evidence gate:** Record command, exit code, touched files, Git revision, binding/rule hashes, and any required human receipt. A unit is blocked if a required tool or check is unavailable. Do not use the removed runtime `conform` command.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 records the exact owner and affected files; any expansion is documented before editing.
- `cf.evidence.verification`: the named negative and positive cases in Verification produce a command, exit code, and revision-bound receipt; missing tools block completion.
- `cf.quality.tests-for-behavior-changes`: the specified behavior or contract tests fail on the named regression before the implementation is accepted.

## Rollback

Revert CLI/CI commit; keep prior generated fixture for comparison.

## Definition of done

- [ ] AC-02 has a linked result and negative case evidence.
- [ ] Branch and dependency preconditions hold; only declared scope changed.
- [ ] Tests above pass and outputs are recorded against the current revision.
- [ ] Human evidence, when required by the selected workflow, is attached.
- [ ] Changes are reviewed and committed on the task branch; no unresolved blockers remain.
