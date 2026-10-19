---
title: "Reconcile factory host entries and bridge ownership"
type: unit
parent: "phase-03-integration-tests"
unit: "03.01"
task_branch: "refactor/PLN-0013-harden-typescript-harness"
base_commit: "e53ab5b1489618bedeee44292716acd1cd91249c"
status: planned
created: "2026-10-19"
tags: [task, unit]
depends_on: ["02.04"]
parallelizable_with: []
---

# Unit 03.01: Reconcile factory host entries and bridge ownership

> Task branch: `refactor/PLN-0013-harden-typescript-harness`; base commit: `e53ab5b1489618bedeee44292716acd1cd91249c`. Depends on: 02.04.

## Objective

Reconcile factory host entries and bridge ownership so AC-08 can be judged from executable evidence.

## Context packet

- Released brief: `docs/discovery/typescript-agent-harness-solidification/brief.md`; decision D-01 removes runtime conformance, D-02 keeps factory host entries, D-03 preserves catalog layers, D-04 requires scoped coverage, D-05 measures context budgets.
- Current evidence: Factory `.agents/skills.json` lacks a workflows entry referenced by README; `.claude/CLAUDE.md` contains npm instructions despite ADR 0040. User D-02 keeps both directories.
- Acceptance AC-08: Factory entries and bridge agree; collision, link, idempotence, and pnpm profile pass. This unit stands alone; its steps and test cases supply the receipt.
- Scope is JavaScript implementation and Markdown catalog/configuration; no TypeScript-only directive is claimed for an `.mjs` source.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:4c42d15b81106b8bb6c117edd3d88808740db4f09f175f0112588990d887fa25
</language_rules>

> Applicable rule text takes precedence over conflicting steps. Refresh hashes if canonical rule content changes before execution.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` must equal `refactor/PLN-0013-harden-typescript-harness`; stop on detached HEAD, wrong branch, dirty unrelated state, or changed target base.
- Verify the released brief with `node scripts/context.mjs handoff:verify-brief docs/discovery/typescript-agent-harness-solidification/brief.md`.
- Dependencies 02.04 have committed verification receipts; stop if any required check failed.

## Scope

**In scope:**
- `.agents/skills.json`
- `.agents/README.md`
- `.claude/CLAUDE.md`
- `.claude/settings.json`
- `app/cli/core/bridge-generator.mjs`
- `scripts/validate-context.mjs`
- `tests/bridge/bridge-generator.test.mjs`
- `tests/bridge/bridge-multi-editor.test.mjs`

**Out of scope:** Host product code, unrelated dirty files, historical task records, and work reserved for another unit.

## Steps

1. Declare which factory-local entries are owned, generated, or user-owned and reconcile skill/workflow inventory with manifest and lock without deleting factory host discovery.
2. Replace active npm guidance with pnpm and test bridge generation across Codex and Claude profiles, preserving existing unrelated files and reporting collisions.
3. Exercise broken symlink, collision, repeat generation, and profile-specific output in temporary hosts; verify mapping and lock checks fail on drift.

## Verification

- **Test choice and cases:** Bridge integration tests: `node --test tests/bridge/bridge-generator.test.mjs tests/bridge/bridge-multi-editor.test.mjs`, `node scripts/validate-context.mjs`. Existing user-owned fixture must survive unchanged.
- **Evidence gate:** Record command, exit code, touched files, Git revision, binding/rule hashes, and any required human receipt. A unit is blocked if a required tool or check is unavailable. Do not use the removed runtime `conform` command.

## Rule satisfaction

- `cf.evidence.scope-fencing`: step 1 records the exact owner and affected files; any expansion is documented before editing.
- `cf.evidence.verification`: the named negative and positive cases in Verification produce a command, exit code, and revision-bound receipt; missing tools block completion.
- `cf.quality.tests-for-behavior-changes`: the specified behavior or contract tests fail on the named regression before the implementation is accepted.

## Rollback

Revert host-entry/generator commit; remove only files recorded as generated and owned.

## Definition of done

- [ ] AC-08 has a linked result and negative case evidence.
- [ ] Branch and dependency preconditions hold; only declared scope changed.
- [ ] Tests above pass and outputs are recorded against the current revision.
- [ ] Human evidence, when required by the selected workflow, is attached.
- [ ] Changes are reviewed and committed on the task branch; no unresolved blockers remain.
