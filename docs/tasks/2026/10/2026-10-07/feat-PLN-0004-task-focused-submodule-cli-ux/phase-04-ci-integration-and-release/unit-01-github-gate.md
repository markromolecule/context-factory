---
title: "Optional GitHub Actions gate"
type: unit
parent: "phase-04-ci-integration-and-release"
unit: "04.01"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
branch: "task/PLN-0004/p04-github-gate"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; separate unit checkout permits this disjoint slice to run safely."
checkout_path: ".worktrees/PLN-0004/task-base"
worktree: ".worktrees/PLN-0004/phase-04/github-gate"
status: planned
created: "2026-10-07"
tags: [task, unit, cli]
depends_on: ["02.02", "03.02"]
parallelizable_with: []
---

# Unit 04.01: Optional GitHub Actions gate

> Phase: 04-ci-integration-and-release · Depends on: 02.02, 03.02 · Parallelizable with: none
> Task branch: `feat/PLN-0004-task-focused-submodule-cli-ux` · Unit branch: `task/PLN-0004/p04-github-gate` · Worktree: `.worktrees/PLN-0004/phase-04/github-gate`

## Objective

Generate a safe opt-in host workflow that runs health and current conformance checks for changed code.

## Context packet

- **Source outcome:** The released discovery brief requires compact post-submodule setup and an authoritative, current conformance gate. ADR 0026 governs submodule onboarding, ADR 0029 owns conformance policy, and ADR 0032 selects the task-focused facade with optional gates.
- **Verified current state:** The factory's `.github/workflows/context-factory.yml` checks doctor only. No host CI generator exists in inspected `bridge-generator.mjs`; `init` will expose separate gate choices after 02.02.
- **Acceptance criteria:** AC-02, AC-04, AC-07, AC-08, AC-09, AC-10.
- **Binding decision:** GitHub Actions is first generated provider; others get copyable commands. CI runs conformance itself, persists and verifies report. Existing workflow conflicts are not overwritten.
- **Execution boundary:** Native Node.js ESM, no new runtime dependency. Revalidate source paths and current Git state in the unit checkout; a planning rule hash is not a `preflight` receipt.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.policy][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md sourceHash:sha256:07fa2d10c26bc1fd7efdf216561ed2c23a3b5f618ff78202b01cdde32f140711
</language_rules>

**Rule-satisfaction mapping:** Validate host flags/paths, call the authoritative verifier, and never duplicate conformance or waiver policy in the generator. Applicable language rules take precedence over contradictory procedural steps. No active waiver is assumed; evidence-blocking directives need real named human evidence at execution.

## Preconditions

- A fresh task-base checkout contains the approved brief/ADR/plan and no unrelated user edits; confirm this unit's `depends_on` commits are integrated.
- Create `task/PLN-0004/p04-github-gate` at the correct task/phase base in `.worktrees/PLN-0004/phase-04/github-gate` only when parallel execution is justified; serial execution may use the isolated task worktree under ADR 0031.
- Compile an execution-time `context-cli preflight` for the actual modified file scope before code changes. Stop on missing binding or incompatible stack.

## Scope

**In scope:**
- `app/cli/core/github-gate-generator.mjs` (new)
- `app/cli/commands/init.mjs`
- `evals/tests/cli/github-gate.test.mjs` (new)

**Out of scope:** Do not mutate factory's own CI, generate non-GitHub provider files, or auto-inject human evidence.

## Steps

1. Generate a host workflow only after an explicit CI opt-in and preview its exact path, checkout-with-submodules behavior, Node setup, health check, conform command, report path, and strict verify command.
2. Derive changed code scope from the event/base safely; require an explicit stack choice when detection is ambiguous or multiple stacks are affected, and fail closed on missing base or unsupported stack. No applicable code change reports not applicable while health still runs.
3. Protect an existing workflow via exclusive creation/recheck; repeat managed setup is idempotent, unrelated workflow is a conflict.
4. Use only explicit host lint/test configuration; label absent commands unconfigured. Keep human evidence/waivers absent by default and show how a maintainer supplies reviewable inputs.
5. For GitLab/other provider requests, print equivalent commands without claiming a generated or installed gate.

## Verification

- **Test type and reason:** Generator contract + integration: inspect emitted YAML/commands and run a simulated workflow script against temp checkout; missing submodule/base/report, stale content, BLOCKED evidence, conflict, and explicit host checks must fail or report correctly. This catches a doctor-only false pass.
- **Named cases:** GitHub opt-in writes exactly one workflow; opt-out none; existing workflow unchanged; submodule initialized; ambiguous or unsupported stack blocks; current PASS only succeeds.
- **Focused command:** `node --test evals/tests/cli/github-gate.test.mjs`.
- **Conformance gate:** Run `node app/cli/bin/context-cli.mjs conform "Verify unit 04.01 github-gate" --stack typescript --scope <actual-modified-files> --out .context-runs/PLN-0004/04.01/conformance-report.json --json` after the final unit diff. Supply named human evidence only if a real human provided it. Record actual report ID, verdict, diffHash, bindingHash, output path, and exit code; `FAIL` or `BLOCKED` stops the unit.
- **Review:** `git diff --check`, inspect `git status --short`, and compare the committed unit diff with this scope fence before phase integration.

## Rollback

Remove only a byte-identical generated workflow and CI opt-in wiring; preserve unrelated host workflows.

## Definition of done

- [ ] AC-02, AC-04, AC-07, AC-08, AC-09, AC-10 has the named passing test evidence and no unreported skip.
- [ ] The changed files stay inside this unit's scope, with implementation/import boundaries reviewed.
- [ ] The checkout has a clean commit and a real current `PASS` conformance receipt; required human evidence is named, not generated by an agent.
- [ ] The phase integration branch receives this reviewed commit in dependency order; task-owned worktree cleanup occurs after integration.
