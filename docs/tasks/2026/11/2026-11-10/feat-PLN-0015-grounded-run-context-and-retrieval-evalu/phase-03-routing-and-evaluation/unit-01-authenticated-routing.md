---
title: "Route authenticated endpoint requests"
type: unit
parent: "phase-03-routing-and-evaluation"
unit: "03.01"
task_branch: "feat/PLN-0015-grounded-run-context-and-retrieval-evalu"
base_commit: "5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e"
status: planned
created: "2026-11-10"
tags: [task, unit, routing]
depends_on: ["02.01"]
parallelizable_with: []
---

# Unit 03.01: Route authenticated endpoint requests

> Task branch: `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`; base commit: `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e`. Depends on: 02.01.

## Objective

Make a common authenticated endpoint request select the feature workflow and security guardrails while keeping ordinary order-domain requests outside security routing.

## Context packet

- Verified released brief: `docs/discovery/grounded-run-context-and-retrieval-evaluations/brief.md`; user confirmed scope on 2026-11-10. This unit serves AC-04.
- On 2026-11-10, `node app/cli/bin/context-cli.mjs resolve 'implement an authenticated orders endpoint' --json` returned `workflow:null` and no `rules/global/security-guardrails.md`. Current `scripts/context-core.mjs` routes explicit `authentication` and `authorization` but omits the adjective `authenticated` in both security detection and feature-delivery hints.
- `evals/tests/resolver/intent-routing.test.mjs` already tests authorization defects, general features, direct questions, and knowledge selection. Add a targeted positive and nearby negative cases rather than changing every workflow threshold.
- Unit 02.01 must have committed the bounded direct-run payload. Expected state: routing changes feed the same selected paths into that payload, without changing its budget or instruction contract.
- `.mjs` implementation has no TypeScript preflight PASS; use global code quality, evidence, and security directives below.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
- [directive:cf.sec.untrusted-input-boundaries][mode:evidence-blocking] rules/global/security-guardrails.md contentHash:sha256:12a5ee167f7c74c9e381f7a336c5930bbe08e8da687f82dcffa39c15125cd0d3
</language_rules>

> Applicable rule text takes precedence over conflicting steps. Refresh hashes before execution if source rules change.

## Preconditions / Expected state from dependencies

- `git symbolic-ref --quiet --short HEAD` must equal `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`.
- Verify the released brief; confirm Units 01.01 and 02.01 are committed with passing receipts. Stop if provider input or selection output shape changed and reconcile this unit.

## Scope

**In scope:**
- `scripts/context-core.mjs`
- `evals/tests/resolver/intent-routing.test.mjs`
- `context-lock.json`

**Out of scope:** Rule catalog text, `orchestrator/runner.mjs`, CLI provider adapters, dataset evaluation, and unrelated intent or framework routing.

## Steps

1. Add a failing resolver case for the exact authenticated orders endpoint request. Assert `skills/workflows/feature-delivery/SKILL.md` and `rules/global/security-guardrails.md` are present, with a selection reason; then add ordinary order endpoint and order-list wording that must not trigger security solely from the domain noun.
2. Extend the narrow existing authentication intent recognition or shared term normalization to cover `authenticated` and the directly relevant inflection. Keep explicit workflow commands and defect routing precedence intact. Do not lower the generic workflow score threshold for every request to satisfy this example.
3. Inspect resulting selected paths and budget estimate for the positive case; ensure security and feature guidance are present and no unrelated knowledge notes are loaded. Record any changed selection reason or budget delta.
4. Regenerate `context-lock.json` for the changed manifest-tracked resolver and test before the unit's host checks.

## Verification

- **Unit behavior tests:** `node --test evals/tests/resolver/intent-routing.test.mjs`. Positive: exact authenticated orders request routes to feature-delivery and security rule. Negative: ordinary orders endpoint, order listing, and unrelated direct question do not acquire security rule. Regression: an authorization defect still selects defect resolution and security guidance.
- **Host checks:** From repository root, run `pnpm run lint`, `pnpm run test`, `pnpm run test:unit`, `pnpm run build`, and `node scripts/context.mjs doctor` for the changed revision and record command, scope, exit code, revision/diff identity, and result. Typecheck is unconfigured.
- **Human evidence:** Inspect whether the synonym boundary could match unrelated text and record the review plus current rule hashes. A resolver selection receipt does not verify host code behavior.

## Rollback

Revert the three scoped files for this unit on the task branch. The prior routing behavior returns; no persisted data changes.

## Definition of done

- [ ] AC-04 positive and negative cases pass with recorded output.
- [ ] Recorded branch, brief, and dependency receipts are current.
- [ ] Only declared files changed; routing precedence and budget are reviewed.
- [ ] Configured checks pass with revision-bound receipts; absent checks are unconfigured.
- [ ] Changes are committed on the task branch before Unit 03.02.
