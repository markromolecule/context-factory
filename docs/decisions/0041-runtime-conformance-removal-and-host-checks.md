---
title: Runtime Conformance Removal and Explicit Host Checks
type: decision
status: accepted
created: "2026-10-19"
tags: [adr, harness, typescript, cli, evidence]
supersedes: ["0029", "0035"]
---

# 0041 — Runtime Conformance Removal and Explicit Host Checks

## Context

ADRs 0029 and 0035 described a runtime `conform` command, TypeScript adapters, and a single conformance report as the evidence gate. Those components are no longer present in the current CLI, while active templates and generated CI still instruct hosts to run them. A missing command cannot be a blocking verifier. `preflight` currently selects rules and can label an unsupported scope as PASS; its result is not evidence that changed code follows those rules.

The user chose on 2026-10-19 to remove runtime conformance and use explicit host checks. The user also chose to keep and reconcile factory-local `.agents/` and `.claude/` entries. This decision supersedes the runtime command, adapter, fixture-mode, and report requirements of ADRs 0029 and 0035. It narrows only the `conform` clause in ADR 0039; ADR 0039's workflow and TypeScript catalog decisions remain in force.

## Decision

1. **Selection and verification are separate.** Rule resolution and `preflight` record applicable source hashes, scope, and directive identity. They do not verify code. A null binding, missing scope, or zero applicable directives cannot substantiate a material TypeScript PASS. JavaScript and JSX scope cannot receive a TypeScript verification label. The CLI must make unsupported coverage explicit as its preflight implementation is hardened.
2. **Use configured host checks.** Run the host's declared pnpm lint, typecheck, test, and build commands as separate checks when configured and applicable. Record each command, host root, affected scope, revision or diff identity, exit code, and result. A missing required check is blocked; an optional absent check is unconfigured, never PASS. A failed or unavailable configured check is not normalized to success.
3. **Preserve human evidence.** Evidence-blocking directives and lifecycle checkpoints still require their named human receipts. An agent cannot substitute a rule binding, doctor output, or a passing unrelated host check for that evidence.
4. **Keep status claims narrow.** Doctor attests catalog, lock, bridge, and evaluation health only. Status may call a host check current only when its host, scope, binding, and revision identity match the request. No active instruction or generated command may invoke runtime `conform` or require a conformance report.
5. **Keep the catalog layers distinct.** `orchestrator/SHARED.md` owns shared policy; rules state scoped obligations; skills provide independent procedures; workflows compose them and enforce checkpoints. Factory-local host entries remain discoverable and are reconciled without overwriting user-owned files.

## Consequences and migration

- Historical ADRs and task receipts remain readable as records of their original decisions and evidence. This ADR controls current behavior where they conflict.
- Update active lifecycle guidance and templates first, then remove dead CLI/CI commands, harden preflight, reconcile rule modes and host entries, and bind status to individual check receipts. The PLN-0013 units track those changes and their negative fixtures.
- Until the CLI and generated CI changes are complete, a written host-check policy is not proof that the commands execute. Each unit records its actual checks and unresolved gaps; no missing verifier becomes a green gate.

## Verification

`node --test evals/tests/cli/active-contract.test.mjs` checks active guidance and a dead-command fixture. Later CLI/CI and status units must execute configured commands in temporary hosts, prove missing and failing checks cannot pass, and compare report identity before a current PASS. `node scripts/validate-context.mjs` and `node scripts/context.mjs doctor` check catalog integrity but do not verify host code.
