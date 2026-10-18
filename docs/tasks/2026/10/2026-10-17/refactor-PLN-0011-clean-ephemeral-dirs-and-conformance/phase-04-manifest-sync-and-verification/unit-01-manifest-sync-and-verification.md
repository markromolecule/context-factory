---
title: "Unit 04.01: Manifest Sync, Lockfile Refresh, Docs Update, and Final Verification"
type: unit
parent: "phase-04-manifest-sync-and-verification"
unit: "04.01"
task_branch: "refactor/PLN-0011-clean-ephemeral-dirs-and-conformance"
base_commit: "c7524e96a0e97bacdb848bdee05abd9203ef5e96"
status: planned
created: "2026-10-17"
tags: [task, unit, manifest, lock, release]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 04.01: Manifest Sync, Lockfile Refresh, Docs Update, and Final Verification

> Phase: phase-04-manifest-sync-and-verification · Depends on: 03.01 · Parallelizable with: none  
> Task branch: refactor/PLN-0011-clean-ephemeral-dirs-and-conformance · Base commit: c7524e96a0e97bacdb848bdee05abd9203ef5e96

## Objective

Synchronize `context-manifest.json` by removing deleted paths, regenerate `context-lock.json`, update documentation (`README.md`, `orchestrator/SHARED.md`), and run all diagnostic checks to achieve 100% HEALTHY verification.

## Context packet

- `context-manifest.json` currently references deleted tools (`orchestrator/conformance/*`, `evals/tests/conformance/*`), schemas (`conformance-report`, `conformance-result`), and datasets (`evals/datasets/conformance/*`).
- `context-lock.json` pins file content hashes and must be refreshed.
- `README.md` and `orchestrator/SHARED.md` contain instructions regarding `context-cli conform` and language adapters that should be removed.
- Serves Acceptance Criterion `AC-04`.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
- [directive:ts.type-safety.ban-any][mode:automated-blocking] rules/typescript/common/type-safety.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 03.01 completed.
- Git working branch is `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance`.

## Scope

**In scope:**
- `context-manifest.json`
- `context-lock.json`
- `README.md`
- `orchestrator/SHARED.md`
- `scripts/context.mjs`
- `scripts/validate-context.mjs`

**Out of scope:**
- Modifying historical task logs.

## Steps

1. In `context-manifest.json`:
   - Under `tools`: remove all 8 `orchestrator/conformance/*` entries and all 8 `evals/tests/conformance/*` entries.
   - Under `schemas`: remove `schemas/conformance-report.schema.json` and `schemas/conformance-result.schema.json`.
   - Under `datasets`: remove all 8 `evals/datasets/conformance/*` entries.
2. In `orchestrator/SHARED.md`:
   - Remove references to `context-cli conform` from the quality gates.
3. In `README.md`:
   - Remove `context-cli conform` from commands list and quick start cards.
4. Regenerate lockfile:
   - Run `node scripts/context.mjs lock`.
5. Execute end-to-end verification:
   - Run `node scripts/validate-context.mjs`.
   - Run `npm test`.
   - Run `node app/cli/bin/context-cli.mjs doctor`.

## Verification

- **Automated Tests:**
  - Test type: Full system health verification — validates manifest integrity, lockfile synchronization, and evaluation suite.
  - Commands:
    - `node scripts/validate-context.mjs`
    - `node app/cli/bin/context-cli.mjs doctor`
    - `npm test`

## Rollback

- `git checkout HEAD -- context-manifest.json context-lock.json README.md orchestrator/SHARED.md`

## Definition of done

- [ ] Maps to acceptance criteria: AC-04
- [ ] Executed on recorded task branch `refactor/PLN-0011-clean-ephemeral-dirs-and-conformance`
- [ ] Changes committed cleanly to task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] `doctor` diagnostic reports HEALTHY with zero failures
