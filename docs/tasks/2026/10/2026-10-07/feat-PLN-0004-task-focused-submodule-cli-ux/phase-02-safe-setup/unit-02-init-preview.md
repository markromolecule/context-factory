---
title: "Explicit init choices and preview"
type: unit
parent: "phase-02-safe-setup"
unit: "02.02"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
branch: "task/PLN-0004/p02-init-preview"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; separate unit checkout permits this disjoint slice to run safely."
checkout_path: ".worktrees/PLN-0004/task-base"
worktree: ".worktrees/PLN-0004/phase-02/init-preview"
status: planned
created: "2026-10-07"
tags: [task, unit, cli]
depends_on: ["01.01", "02.01"]
parallelizable_with: []
---

# Unit 02.02: Explicit init choices and preview

> Phase: 02-safe-setup · Depends on: 01.01, 02.01 · Parallelizable with: none
> Task branch: `feat/PLN-0004-task-focused-submodule-cli-ux` · Unit branch: `task/PLN-0004/p02-init-preview` · Worktree: `.worktrees/PLN-0004/phase-02/init-preview`

## Objective

Make `init` a reviewable host setup flow with explicit editor choice and independent quality-gate opt-ins.

## Context packet

- **Source outcome:** The released discovery brief requires compact post-submodule setup and an authoritative, current conformance gate. ADR 0026 governs submodule onboarding, ADR 0029 owns conformance policy, and ADR 0032 selects the task-focused facade with optional gates.
- **Verified current state:** `init.mjs` prompts for target/method/editor/PM and falls back to `ide = "all"`; `bridge.mjs` also defaults IDEs to all; `generateBridge()` writes editor files, symlinks, bridge JSON, and package scripts.
- **Acceptance criteria:** AC-01, AC-02, AC-03.
- **Binding decision:** Detected editor profiles may be preselected. No detection requires an interactive choice or explicit `--ide` in automation. Hook and CI flags are separately opt-in; CI write comes in 04.01.
- **Execution boundary:** Native Node.js ESM, no new runtime dependency. Revalidate source paths and current Git state in the unit checkout; a planning rule hash is not a `preflight` receipt.

<language_rules>
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:ts.runtime-validation.zero-trust-boundaries][mode:automated-blocking] rules/typescript/common/runtime-validation.md sourceHash:sha256:07fa2d10c26bc1fd7efdf216561ed2c23a3b5f618ff78202b01cdde32f140711
- [directive:cf.solid.srp-single-actor-boundary][mode:evidence-blocking] rules/solid/single-responsibility.md sourceHash:sha256:e55efdc0a22162771f1a48e1ad4133da68843da3ce9535cadbf111f20a9ba90f
</language_rules>

**Rule-satisfaction mapping:** Validate flags/host paths, keep preview model separate from mutation, and verify actual files before success. Applicable language rules take precedence over contradictory procedural steps. No active waiver is assumed; evidence-blocking directives need real named human evidence at execution.

## Preconditions

- A fresh task-base checkout contains the approved brief/ADR/plan and no unrelated user edits; confirm this unit's `depends_on` commits are integrated.
- Create `task/PLN-0004/p02-init-preview` at the correct task/phase base in `.worktrees/PLN-0004/phase-02/init-preview` only when parallel execution is justified; serial execution may use the isolated task worktree under ADR 0031.
- Compile an execution-time `context-cli preflight` for the actual modified file scope before code changes. Stop on missing binding or incompatible stack.

## Scope

**In scope:**
- `app/cli/commands/init.mjs`
- `app/cli/commands/bridge.mjs`
- `app/cli/core/bridge-generator.mjs`
- `evals/tests/cli/init-preview.test.mjs` (new)

**Out of scope:** Do not generate a CI workflow yet, broaden editor defaults, or overwrite unrelated host files.

## Steps

1. Build a per-target action preview (create/update/unchanged/conflict) from host detection and bridge generation before writes; show detected host/submodule/editor/PM, exact paths, and next action.
2. Remove implicit all-editor fallback from `init` and the path used by non-interactive setup; retain explicit `--ide all` and existing explicit bridge flags with migration guidance.
3. Ask only unresolved interactive choices. In non-TTY mode, reject missing `--ide` when no editor is detected; do not infer hook or CI consent.
4. Connect the safe hook only when explicitly selected; recheck target files at apply time and report partial or blocked actions without claiming setup success.
5. Preserve existing JSON/exit consumers or document an explicit versioned migration.

## Verification

- **Test type and reason:** Integration + CLI contract: temp hosts from root/submodule, no editor/non-TTY, explicit all, repeat setup, existing editor files, opt-out, read-only target, and two-process race; this catches unintended writes and misleading previews.
- **Named cases:** Fresh setup preview matches applied files; repeated setup has no duplicate writes; hook decline writes nothing; no editor never selects all implicitly.
- **Focused command:** `node --test evals/tests/cli/init-preview.test.mjs`.
- **Conformance gate:** Run `node app/cli/bin/context-cli.mjs conform "Verify unit 02.02 init-preview" --stack typescript --scope <actual-modified-files> --out .context-runs/PLN-0004/02.02/conformance-report.json --json` after the final unit diff. Supply named human evidence only if a real human provided it. Record actual report ID, verdict, diffHash, bindingHash, output path, and exit code; `FAIL` or `BLOCKED` stops the unit.
- **Review:** `git diff --check`, inspect `git status --short`, and compare the committed unit diff with this scope fence before phase integration.

## Rollback

Revert init/bridge behavior while preserving any host files the user already accepted; remove only task-owned generated files after inspection.

## Definition of done

- [ ] AC-01, AC-02, AC-03 has the named passing test evidence and no unreported skip.
- [ ] The changed files stay inside this unit's scope, with implementation/import boundaries reviewed.
- [ ] The checkout has a clean commit and a real current `PASS` conformance receipt; required human evidence is named, not generated by an agent.
- [ ] The phase integration branch receives this reviewed commit in dependency order; task-owned worktree cleanup occurs after integration.
