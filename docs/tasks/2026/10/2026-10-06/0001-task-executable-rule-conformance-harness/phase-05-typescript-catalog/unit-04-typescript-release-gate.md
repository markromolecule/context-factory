---
title: "TypeScript Coverage, Synchronization, and Release Gate"
type: unit
parent: "phase-05-typescript-catalog"
unit: "05.04"
branch: "task/0001/phase-05/typescript-release-gate"
worktree: ".worktrees/0001/phase-05/typescript-release-gate"
status: planned
created: "2026-10-06"
tags: [task, unit, release, sync, doctor]
depends_on: ["05.01", "05.02", "05.03"]
parallelizable_with: []
---

# Unit 05.04: TypeScript Coverage, Synchronization, and Release Gate

## Objective

Audit the full TypeScript/global/SOLID catalog, synchronize every canonical index/lock/version surface, run the complete guardrail suite, and produce the hard developer checkpoint.

## Context packet

- Context maintenance requires source, manifest, maps, schemas, evaluations, lock, doctor, and reported version to agree.
- Phase 6 is forbidden until the developer reviews this checkpoint and explicitly continues.
- AC-11 and AC-13.

<language_rules>
- `rules/global/evidence-and-claims.md`: Record exact commands, exit codes, counts by status/mode, digest, and unresolved findings.
- `rules/global/architecture-conformance.md`: Verify core has no TypeScript-specific branches beyond adapter registration/composition.
- `rules/global/code-quality.md`: Reject duplicated verifier policy or dead compatibility paths.
</language_rules>

## Preconditions

- Units 05.01–05.03 are merged into the phase branch.

## Scope

**In scope:** new `evals/catalog-coverage.test.mjs`; `context-manifest.json`; `context-lock.json`; generated docs maps/indexes affected by `npm run sync`; `package.json` version and release documentation only if the repository release convention requires them; task evidence/status fields.

**Out of scope:** Laravel adapter/rules and new behavior beyond defect fixes required to make existing ACs pass.

## Steps

1. Add coverage tests that count classified, unsupported, automated, evidence-blocking, and advisory directives without false aggregation.
2. Run all focused and adversarial tests; repair only in-scope release integration defects or return findings to the owning unit.
3. Run `npm run sync`, inspect generated diffs, update version intentionally, verify lock, lint, evals, and doctor.
4. Record context version, lock digest, inventory/coverage counts, exact results, compatibility impact, and rollback status.
5. Stop and present the developer checkpoint; do not provision Phase 6 worktrees.

## Verification

- **Integration/regression:** all Phase 1–5 tests and `npm test`.
- **Architecture:** adapter dependency-direction assertions.
- **Release:** `npm run sync`; `npm run lint`; `npm test`; `npm run doctor`; lock check command supported by CLI.

## Rollback

Revert generated sync/version changes with this unit; retain verified Phase 1–4 code and report catalog coverage as partial.

## Definition of done

- [ ] AC-11 and TypeScript portion of AC-13 pass.
- [ ] Doctor/evals/lock are green with fresh evidence.
- [ ] Developer checkpoint contains no unsupported completion claims.
- [ ] Execution stops before Phase 6.
