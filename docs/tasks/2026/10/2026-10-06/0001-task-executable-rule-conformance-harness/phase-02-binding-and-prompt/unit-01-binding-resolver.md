---
title: "Binding Compiler and Artifact-Aware Resolver"
type: unit
parent: "phase-02-binding-and-prompt"
unit: "02.01"
branch: "task/0001/phase-02/binding-resolver"
worktree: ".worktrees/0001/phase-02/binding-resolver"
status: verified
created: "2026-10-06"
tags: [task, unit, resolver, binding]
depends_on: ["01.02"]
parallelizable_with: ["02.02"]
---

# Unit 02.01: Binding Compiler and Artifact-Aware Resolver

## Objective

Compile deterministic bindings from declared stack, workflow, exact planned/changed scope, descriptor applicability, source hashes, and valid waivers, replacing broad request-only enforcement claims.

## Context packet

- `scripts/context-core.mjs:300-352` defaults to TypeScript when stack evidence is absent; `:380-393` includes all `alwaysApply` rules for an action.
- The resolver must retain legacy informational selection but require explicit stack plus paths/layers for an enforceable material-code binding.
- Binding order and hashes must be stable for identical inputs.
- AC-02 and SC-01.

<language_rules>
- `rules/global/evidence-and-claims.md`: Every binding inclusion/exclusion carries an inspectable reason and source hash.
- `rules/solid/single-responsibility.md`: Selection scoring stays in context resolution; binding compilation is a separate pure module.
- `rules/solid/open-closed.md`: Applicability uses descriptor data, not hard-coded stack branches.
- `rules/typescript/common/type-safety.md`: Reject absent/ambiguous inputs explicitly rather than coercing them into a valid binding.
</language_rules>

## Preconditions

- Phase 1 descriptors and pilot rules are available.

## Scope

**In scope:** new `orchestrator/rules/binding-compiler.mjs`; `scripts/context-core.mjs`; `app/cli/commands/resolve.mjs`; new `evals/rule-binding.test.mjs`.

**Out of scope:** prompt rendering, plan Markdown parsing, adapters, and evidence execution.

## Steps

1. Define `compileRuleBinding()` inputs/outputs against the schema and keep it filesystem-agnostic via explicit descriptor/scope inputs.
2. Match descriptors by declared stack, workflow, normalized repository-relative paths, layer/artifact tags, and active waiver scope.
3. Produce deterministic selected/excluded/unsupported records, source hashes, binding digest, and density diagnostics.
4. Change `resolveContext()` to expose a binding only when enforceable inputs exist; retain legacy `rules` output as informational compatibility data.
5. Make resolve JSON/human output distinguish selected paths from enforceable bindings.

## Verification

- **Unit tests:** deterministic ordering, normalization, inclusion/exclusion reasons, stale waiver rejection, and no broad fallback binding.
- **Contract tests:** output conforms to binding schema.
- Command: `node --test evals/rule-binding.test.mjs` (8/8 passing).
- Doctor & Sync: `npm run sync && node scripts/context.mjs doctor` (healthy).

## Rollback

Remove binding output/integration while retaining descriptor parser and legacy selection behavior.

## Definition of done

- [x] AC-02 passes for focused, ambiguous, wrong-stack, and repeat-run cases.
- [x] No stack-specific conditional is added to the generic compiler.
- [x] Legacy callers remain compatible but cannot mislabel selection as enforcement.
- [x] Scope and tests pass `/review`.
