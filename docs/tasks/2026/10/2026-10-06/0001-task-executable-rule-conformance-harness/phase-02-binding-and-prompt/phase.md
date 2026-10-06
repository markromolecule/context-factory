---
title: "Phase 2 — Artifact-Aware Binding and Prompt Compilation"
type: phase
parent: "0001-task-executable-rule-conformance-harness"
phase: "02"
phase_branch: "task/0001/phase-02-integration"
status: planned
created: "2026-10-06"
tags: [task, phase, resolver, prompt, plan-check]
---

# Phase 2 — Artifact-Aware Binding and Prompt Compilation

## Objective

Turn descriptors into deterministic scope-aware bindings, make invalid unit bindings fail before execution, and guarantee that provider dispatch receives the compiled directives.

## Dependencies & prerequisites

- Phase 1 merged and verified.

## Unit index

| Unit | Artifact | Branch | Worktree | Depends on | Parallelizable |
|---|---|---|---|---|---|
| 02.01 Binding Compiler and Resolver | `unit-01-binding-resolver.md` | `task/0001/phase-02/binding-resolver` | `.worktrees/0001/phase-02/binding-resolver` | 01.02 | 02.02 |
| 02.02 Fail-Closed Plan Check | `unit-02-fail-closed-plan-check.md` | `task/0001/phase-02/fail-closed-plan-check` | `.worktrees/0001/phase-02/fail-closed-plan-check` | 01.02 | 02.01 |
| 02.03 Prompt Compiler and Runner | `unit-03-prompt-compiler-runner.md` | `task/0001/phase-02/prompt-compiler-runner` | `.worktrees/0001/phase-02/prompt-compiler-runner` | 02.01 | none |

## Phase verification

- `node --test evals/rule-binding.test.mjs evals/plan-check.test.mjs evals/prompt-compiler.test.mjs`
- Capture a custom provider invocation and prove directive text/hash presence.

## Risks and rollback

- Compatibility mode may expose legacy selections, but material generation cannot claim an enforceable binding without declared scope.
- Revert runner compilation independently from descriptor/binding artifacts if provider payloads regress.
- Teardown all unit worktrees after integration.
