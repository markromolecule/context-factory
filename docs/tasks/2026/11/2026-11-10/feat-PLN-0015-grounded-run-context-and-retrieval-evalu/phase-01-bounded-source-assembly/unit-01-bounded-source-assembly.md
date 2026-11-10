---
title: "Assemble bounded, labeled source context"
type: unit
parent: "phase-01-bounded-source-assembly"
unit: "01.01"
task_branch: "feat/PLN-0015-grounded-run-context-and-retrieval-evalu"
base_commit: "5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e"
status: planned
created: "2026-11-10"
tags: [task, unit, retrieval]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Assemble bounded, labeled source context

> Task branch: `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`; base commit: `5ec9b5f3e8204b804ad72a5e10dbd0c4524dfe1e`. Depends on: none.

## Objective

Turn the existing selected source bundle into a deterministic, provenance-labeled data section with a pre-dispatch budget result, without changing provider dispatch in this unit.

## Context packet

- Verified released brief: `docs/discovery/grounded-run-context-and-retrieval-evaluations/brief.md`; user confirmed the two goals on 2026-11-10. This unit serves AC-01, AC-02, and AC-03.
- Current `buildContextBundle` in `orchestrator/rules/prompt-compiler.mjs` reads every `selection.selectedPaths` entry and stores `{path, hash, content}`; it obtains the hash through a separate file read, so a concurrent source edit could make the hash disagree with the captured content. `compilePrompt` currently places only binding directives in the system prompt. `scripts/context-core.mjs` returns `selection.budget.maxRecommendedTokens` but only warns; no dispatch gate exists.
- Plan decision D-01 chooses stable whole-source omission for optional content and a hard failure when required input does not fit. The final rendered request and system text, including labels and binding directives, must be counted with a conservative local estimate. Provider-reported usage remains separate.
- Treat retrieved text as untrusted data. Use a serialization/labeling form that cannot be broken by a source containing a fake closing delimiter or instruction-like text. The source path and hash must identify the exact content sent.
- Implementation files are `.mjs`; current TypeScript preflight is unsupported for JavaScript scope, so no TypeScript PASS is claimed. Global rules below apply; refresh hashes if their source changes.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md contentHash:sha256:de1623af4b2ce5c31b5b242dd0c20aa0df701469bd9900bf2909c74656bda622
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
- [directive:cf.quality.reject-unbounded-work][mode:evidence-blocking] rules/global/code-quality.md contentHash:sha256:e6541ae8c0d45302fb3237af77b20d2aa58c551a60e5c989f093eecff7b820fe
- [directive:cf.sec.untrusted-input-boundaries][mode:evidence-blocking] rules/global/security-guardrails.md contentHash:sha256:12a5ee167f7c74c9e381f7a336c5930bbe08e8da687f82dcffa39c15125cd0d3
</language_rules>

> Applicable rule text takes precedence over conflicting steps. These source hashes are selection receipts, not code verification.

## Preconditions / Expected state from dependencies

- `git symbolic-ref --quiet --short HEAD` must equal `feat/PLN-0015-grounded-run-context-and-retrieval-evalu`; stop on detached or mismatched HEAD.
- Run `node scripts/context.mjs handoff:verify-brief docs/discovery/grounded-run-context-and-retrieval-evaluations/brief.md`; stop if stale.
- No predecessor unit. Confirm current compiler and tests still match the facts above before editing.

## Scope

**In scope:**
- `orchestrator/rules/prompt-compiler.mjs`
- `evals/tests/rules/prompt-compiler.test.mjs`
- `context-lock.json`

**Out of scope:** `orchestrator/runner.mjs`, CLI option parsing, resolver routing, dataset evaluation, provider SDKs, and host application code. If the required/optional classification needs a resolver contract change, reconcile this unit and the master plan before editing `scripts/context-core.mjs`.

## Steps

1. Add a pure assembly function at the existing bundle seam. It accepts the request, system prompt with compiled directives, selection and source bundle, and an explicit effective cap. Preserve ordered source entries with exact repository-relative path, `sha256:` hash, and full content. Derive each hash from the same bytes captured as `content` (or detect a changed file and fail) so provenance cannot be stale between reads. Validate safe paths before rendering.
2. Classify the shared contract, selected workflow, and applicable rule text as required; classify supporting knowledge and procedures as optional unless an explicit task contract requires them. Document the policy in the returned receipt and keep stable priority/order. Omit only whole optional entries; include omitted paths/hashes in a compact receipt. If required content exceeds the cap, return a typed failure before provider dispatch can occur.
3. Count a conservative estimate over the fully rendered request and system input, including source labels, hashes, delimiters, and binding text. Use the existing intent cap as the default input and permit a validated explicit cap from the caller in the later runner unit. Never label the estimate as actual provider token usage.
4. Render source content as a data section with safe escaping/serialization and a plain instruction-boundary preface. Preserve `validatePromptIntegrity` behavior for binding directives; a source body containing prompt-looking text must not alter the directive block.
5. Regenerate `context-lock.json` after changing the manifest-tracked compiler and test. The lock refresh belongs to this unit so lint and doctor can pass before its atomic commit.

## Verification

- **Unit and boundary tests:** `node --test evals/tests/rules/prompt-compiler.test.mjs`. Cases: KISS/YAGNI-like two-source bundle has exact paths, hashes computed from the captured bodies, and full content; a source change during capture cannot yield a mismatched hash; exact-cap input fits; one-unit overflow rejects required content; optional overflow omits a whole file in stable order; repeated assembly is byte-stable; unsafe path rejects; fake closing delimiter and instruction-like text remain serialized data; binding directive text survives. Update the existing injected hash test to reflect the chosen same-byte hash contract.
- **Host checks:** From repository root, run configured `pnpm run lint`, `pnpm run test`, `pnpm run test:unit`, `pnpm run build`, and `node scripts/context.mjs doctor` at the changed revision and record command, exit code, scope, revision/diff identity, and result in the unit receipt. `typecheck` is unconfigured in `package.json`; report it as such, not PASS.
- **Human evidence:** Review the required/optional classification and source-data boundary against AC-02/AC-03; record the review and rule-selection hashes in the unit receipt. Binding metadata and doctor alone do not verify code.

## Rollback

Revert this unit's changes in the three scoped files on the task branch. No persisted data or public host application state changes.

## Definition of done

- [ ] AC-01, AC-02, and AC-03 have positive and negative test results tied to the revision.
- [ ] Branch and brief preconditions hold; only declared files changed in this unit.
- [ ] Focused tests and applicable configured host checks pass; absent checks are labeled unconfigured.
- [ ] Source authority and whole-file omission receive independent review evidence.
- [ ] Changes are reviewed and committed on the task branch before Unit 02.01.
