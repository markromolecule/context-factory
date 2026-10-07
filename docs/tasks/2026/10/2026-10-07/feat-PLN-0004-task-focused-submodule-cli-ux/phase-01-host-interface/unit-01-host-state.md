---
title: "Host state and actionable status"
type: unit
parent: "phase-01-host-interface"
unit: "01.01"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
branch: "task/PLN-0004/p01-host-state"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; separate unit checkout permits this disjoint slice to run safely."
checkout_path: ".worktrees/PLN-0004/task-base"
worktree: ".worktrees/PLN-0004/phase-01/host-state"
status: planned
created: "2026-10-07"
tags: [task, unit, cli]
depends_on: []
parallelizable_with: ["01.02"]
---

# Unit 01.01: Host state and actionable status

> Phase: 01-host-interface · Depends on: none · Parallelizable with: 01.02
> Task branch: `feat/PLN-0004-task-focused-submodule-cli-ux` · Unit branch: `task/PLN-0004/p01-host-state` · Worktree: `.worktrees/PLN-0004/phase-01/host-state`

## Objective

Derive host setup, factory health, and code-conformance visibility as separate states with one actionable next command.

## Context packet

- **Source outcome:** The released discovery brief requires compact post-submodule setup and an authoritative, current conformance gate. ADR 0026 governs submodule onboarding, ADR 0029 owns conformance policy, and ADR 0032 selects the task-focused facade with optional gates.
- **Verified current state:** Current `status.mjs` loads manifest/lock/task counts; `doctor.mjs` runs broad validation and editor checks. `bridge-generator.mjs` exposes submodule/editor detection. Neither status nor doctor establishes a current code-conformance PASS.
- **Acceptance criteria:** AC-04, AC-06.
- **Binding decision:** Keep factory inventory available under detailed output; compute host state from current files and receipts without a second policy engine (ADR 0032).
- **Execution boundary:** Native Node.js ESM, no new runtime dependency. Revalidate source paths and current Git state in the unit checkout; a planning rule hash is not a `preflight` receipt.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.arch.policy][mode:evidence-blocking] rules/global/architecture-conformance.md sourceHash:sha256:55f41a2818d5f8b227d0186b9bc8914869542649c8f27785d602567cf0c78ef7
- [directive:cf.solid.srp-single-actor-boundary][mode:evidence-blocking] rules/solid/single-responsibility.md sourceHash:sha256:e55efdc0a22162771f1a48e1ad4133da68843da3ce9535cadbf111f20a9ba90f
</language_rules>

**Rule-satisfaction mapping:** Ground file probes in inspected sources; keep one policy owner in conformance; isolate host probes from presentation. Applicable language rules take precedence over contradictory procedural steps. No active waiver is assumed; evidence-blocking directives need real named human evidence at execution.

## Preconditions

- A fresh task-base checkout contains the approved brief/ADR/plan and no unrelated user edits; confirm this unit's `depends_on` commits are integrated.
- Create `task/PLN-0004/p01-host-state` at the correct task/phase base in `.worktrees/PLN-0004/phase-01/host-state` only when parallel execution is justified; serial execution may use the isolated task worktree under ADR 0031.
- Compile an execution-time `context-cli preflight` for the actual modified file scope before code changes. Stop on missing binding or incompatible stack.

## Scope

**In scope:**
- `app/cli/core/host-state.mjs` (new)
- `app/cli/commands/status.mjs`
- `evals/tests/cli/host-status.test.mjs` (new)

**Out of scope:** Do not change doctor evaluation policy, report verdict logic, or setup writes.

## Steps

1. Add a pure host-state probe module that accepts an explicit host/factory location and returns separate setup, factory-health, and code-evidence states plus reason/next command.
2. Handle host root, invocation inside initialized submodule, and missing submodule after clone; emit exact `git submodule update --init --recursive` recovery.
3. Make `status` show a short host summary by default and retain existing inventory detail through an explicit detail mode/JSON migration. Never call comprehensive doctor silently.
4. Represent unknown and unconfigured distinctly from PASS; do not infer conformance from editor artifacts.

## Verification

- **Test type and reason:** Contract + integration: exercise host-root/submodule/missing-checkout calls and JSON fields; this catches cwd errors and accidental collapse of health into conformance. Manual architecture review: host probe imports bridge readers, not rule-verdict policy.
- **Named cases:** Detected bridge; absent bridge; missing submodule; stale lock; no report; BLOCKED report; exact next command; JSON reason parity.
- **Focused command:** `node --test evals/tests/cli/host-status.test.mjs`.
- **Conformance gate:** Run `node app/cli/bin/context-cli.mjs conform "Verify unit 01.01 host-state" --stack typescript --scope <actual-modified-files> --out .context-runs/PLN-0004/01.01/conformance-report.json --json` after the final unit diff. Supply named human evidence only if a real human provided it. Record actual report ID, verdict, diffHash, bindingHash, output path, and exit code; `FAIL` or `BLOCKED` stops the unit.
- **Review:** `git diff --check`, inspect `git status --short`, and compare the committed unit diff with this scope fence before phase integration.

## Rollback

Remove new host-state module/wiring and restore prior status output; keep all host files untouched.

## Definition of done

- [ ] AC-04, AC-06 has the named passing test evidence and no unreported skip.
- [ ] The changed files stay inside this unit's scope, with implementation/import boundaries reviewed.
- [ ] The checkout has a clean commit and a real current `PASS` conformance receipt; required human evidence is named, not generated by an agent.
- [ ] The phase integration branch receives this reviewed commit in dependency order; task-owned worktree cleanup occurs after integration.
