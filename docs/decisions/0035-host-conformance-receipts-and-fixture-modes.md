---
title: Host Conformance Receipts and Offline Fixture Modes
type: decision
status: accepted
created: "2026-10-09"
tags: [adr, conformance, typescript, receipts, fixtures]
---

# 0035 — Host Conformance Receipts and Offline Fixture Modes

## Context

ADR 0029 established executable rule conformance via pluggable stack adapters, and ADR 0032 established task-focused CLI quality gates. However, in environments lacking `tsc` or `eslint`, the TypeScript adapter previously fell back to internal heuristic static checks even when operating in a production host project. This created a false-assurance risk: code in a host repository could claim `PASS` for automated-blocking directives despite the host never actually having run its compiler or linter. Conversely, completely forbidding static fallback would prevent lightweight, standalone unit test suites and fixture harnesses from running in minimal or offline test environments.

## Options considered

1. **Uniform static fallback in all environments:** If `tsc` or `eslint` is absent, always fall back to AST/regex heuristics. This avoids blocking developers without full devDependencies installed, but masks missing host tooling and violates the fail-closed invariant of ADR 0029.
2. **Mandatory host toolchain everywhere:** Require `tsc` and `eslint` to be installed globally or locally for every single invocation. This ensures strictness but breaks lightweight CI matrix jobs, sandboxed environments, and standalone unit test suites that verify parser/adapter logic on synthetic snippets.
3. **Strict mode separation (Host Mode vs. Fixture Mode):** When executing in a real host repository, automated-blocking directives require real tools (`tsc`, `eslint`) and valid effective configurations (`tsconfig.json`); missing tools return `TOOL_UNAVAILABLE` leading to a `BLOCKED` gate (exit code 2) unless an authorized human waiver exists. Offline fixture evaluation and isolated unit tests opt into fast static AST checking by explicitly supplying `capabilities.fixtureMode = true`.

## Decision

Adopt **Option 3**, authorized by user resolution on 2026-10-09.

1. **Host Mode Enforcement:**
   - In standard execution (`capabilities.fixtureMode !== true`), automated-blocking TypeScript directives (`ts.type-safety.strict-compiler-settings`, `ts.async.no-floating-promises`) require host tooling.
   - If `tsc` or `tsconfig.json` is missing, return `TOOL_UNAVAILABLE` with diagnostic: `"Host tool tsc or tsconfig.json is missing in host environment."`.
   - If `eslint` is missing, return `TOOL_UNAVAILABLE` with diagnostic: `"Host tool eslint is missing in host environment."`.
   - The evidence gate evaluates `TOOL_UNAVAILABLE` as `isBlocked: true`, halting preflight/conformance gates with exit code 2 (`BLOCKED`) unless a governed human waiver is attached.

2. **Tamper-Evident Tool Execution Receipts:**
   - When tools execute, the adapter attaches a structured receipt to `evidence`:
     - `verifierType`: tool identifier (`"tsc"` or `"eslint"`).
     - `command`: JSON stringified array of argv tokens executed.
     - `exitCode`: process exit code integer.
     - `effectiveConfigDigest`: SHA-256 digest of compiler options parsed from `tsc --showConfig --project tsconfig.json`.
     - `outputFragment`: captured stdout/stderr fragment.

3. **Offline Fixture Mode (`capabilities.fixtureMode = true`):**
   - When running isolated test suites or evaluating paired test fixtures, the runner explicitly sets `fixtureMode: true`.
   - In this mode, static AST syntax checkers inspect code snippets for primitive type mismatches, unhandled floating promises, and boundary casts, returning deterministic `PASS` or `FAIL` without requiring global compiler installations.

## Consequences

- Real host projects cannot pass automated-blocking checks without real tools and real configurations. Bypassing tool installation requires an explicit, audited human waiver.
- Effective compiler configuration is verified from `--showConfig`, correctly resolving multi-tier `extends` chains rather than relying on naive root file parsing.
- Standalone test suites and evaluation datasets run quickly and deterministically in fixture mode without external subprocess dependencies.
- Rollback: Revert to previous static fallback behavior in `orchestrator/conformance/adapters/typescript.mjs` and remove ADR 0035.

## Validation and review date

Review on changes to TypeScript compiler CLI flags, ESLint flat config migrations, or stack adapter contracts. Validated by `evals/tests/conformance/typescript-adapter.test.mjs`, `evals/tests/conformance/typescript-fixtures.test.mjs`, and `evals/tests/conformance/conformance-cli.test.mjs`.
