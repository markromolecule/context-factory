---
title: "Synchronize Manifest, Re-generate Lockfile, and Validate Health"
type: unit
parent: "phase-04-manifest-sync-and-doctor-verification"
unit: "04.01"
task_branch: "refactor/PLN-0006-decommission-laravel-and-php-stack"
base_commit: "d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6"
status: planned
created: "2026-10-09"
tags: [task, unit, manifest, doctor]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 04.01: Synchronize Manifest, Re-generate Lockfile, and Validate Health

> Phase: phase-04-manifest-sync-and-doctor-verification · Depends on: 03.01 · Parallelizable with: none
> Task branch: refactor/PLN-0006-decommission-laravel-and-php-stack · Base commit: d0aa38c5a6474f3eb00b8f83f86510ba59bb4cb6

## Objective

Re-index `context-manifest.json` and regenerate `context-lock.json` with zero dangling references to decommissioned files, and verify whole-system health across `lint`, `test`, and `doctor`.

## Context packet

- Purged 23 Laravel rules, the Laravel conformance adapter, fixtures, and tests in prior units.
- Manifest and lockfile must reflect the pure TypeScript state of the repository.
- `app/cli/commands/doctor.mjs` checks lockfile integrity, manifest syntax, .agents symlinks, editor config, conformance enforcement, and evaluations.
- Serves Acceptance Criterion AC-07.

<language_rules>
- [directive:cf.evidence.integrity][mode:evidence-blocking] rules/global/evidence-and-claims.md
- [directive:cf.quality.run-existing-checks][mode:evidence-blocking] rules/global/code-quality.md
- [directive:cf.evidence.completion][mode:evidence-blocking] rules/global/evidence-and-claims.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` exactly matches `refactor/PLN-0006-decommission-laravel-and-php-stack`; stop if detached or mismatched.
- Units 01.01, 02.01, and 03.01 complete.

## Scope

**In scope:**
- `scripts/generate-manifest.mjs`
- `context-manifest.json`
- `context-lock.json`

**Out of scope:**
- Modifying production TypeScript rules or adapters.

## Steps

1. Run `node scripts/generate-manifest.mjs` (or `node scripts/context.mjs sync`) to rebuild `context-manifest.json` removing deleted Laravel rules, adapter, fixtures, and tests, and adding new TypeScript test/case files.
2. Regenerate `context-lock.json` using `node scripts/generate-lockfile.mjs` (or `node scripts/context.mjs lock`).
3. Run `npm run lint` and verify clean rule catalog syntax.
4. Run `npm test` and verify all evaluations and unit tests pass.
5. Run `node scripts/context.mjs doctor` and verify 100% HEALTHY diagnostic with zero errors or warnings.

## Verification

- **Automated Tests:**
  - Test type(s): integration & system verification tests — ensures that manifest, lockfile, and full diagnostic suites pass without dangling references or failures.
  - Cases: `npm run lint` passes; `npm test` passes 100%; `node scripts/context.mjs doctor` outputs HEALTHY verdict.
  - Commands: `npm run lint`, `npm test`, `node scripts/context.mjs doctor`
- **Conformance Gate:**
  - Command: `context-cli conform --scope context-manifest.json context-lock.json --out .context-runs/PLN-0006-U0401/conformance-report.json`
  - Conformance Report: `[report.id]` (Verdict: PASS)

## Rollback

- Revert changes to `context-manifest.json` and `context-lock.json` via git checkout on the task branch.

## Definition of done

- [ ] Maps to acceptance criteria: AC-07
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
- [ ] Conformance report passes (PASS) with zero blocking violations
