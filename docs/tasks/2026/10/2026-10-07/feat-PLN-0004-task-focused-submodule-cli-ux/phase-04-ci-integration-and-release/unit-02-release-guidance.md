---
title: "Docs and end-to-end release checks"
type: unit
parent: "phase-04-ci-integration-and-release"
unit: "04.02"
task_branch: "feat/PLN-0004-task-focused-submodule-cli-ux"
branch: "task/PLN-0004/p04-release-guidance"
checkout_mode: worktree
checkout_reason: "Unrelated dirty master checkout; separate unit checkout permits this disjoint slice to run safely."
checkout_path: ".worktrees/PLN-0004/task-base"
worktree: ".worktrees/PLN-0004/phase-04/release-guidance"
status: planned
created: "2026-10-07"
tags: [task, unit, cli]
depends_on: ["04.01", "01.02"]
parallelizable_with: []
---

# Unit 04.02: Docs and end-to-end release checks

> Phase: 04-ci-integration-and-release · Depends on: 04.01, 01.02 · Parallelizable with: none
> Task branch: `feat/PLN-0004-task-focused-submodule-cli-ux` · Unit branch: `task/PLN-0004/p04-release-guidance` · Worktree: `.worktrees/PLN-0004/phase-04/release-guidance`

## Objective

Document the new task journey and verify the integrated CLI, host setup, and strict gate before finalization.

## Context packet

- **Source outcome:** The released discovery brief requires compact post-submodule setup and an authoritative, current conformance gate. ADR 0026 governs submodule onboarding, ADR 0029 owns conformance policy, and ADR 0032 selects the task-focused facade with optional gates.
- **Verified current state:** `README.md` documents submodule quick start; `app/cli/README.md` documents commands; `docs/guide/cross-workspace-integration.md` describes host integration. Current context manifest/lock and doctor govern canonical factory synchronization.
- **Acceptance criteria:** AC-05, AC-10, final integrated AC-01–AC-09.
- **Binding decision:** Document explicit `--ide all` migration, gate opt-in, unsupported-provider commands, human-evidence BLOCKED state, and limits of doctor.
- **Execution boundary:** Native Node.js ESM, no new runtime dependency. Revalidate source paths and current Git state in the unit checkout; a planning rule hash is not a `preflight` receipt.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:447f4de3b448a314cd8891711e08dfe0ceabafbf889284ca2d5b3afa2993e431
</language_rules>

**Rule-satisfaction mapping:** Cite actual command output and maintain synchronized manifest/lock; make no unverified completion claim. Applicable language rules take precedence over contradictory procedural steps. No active waiver is assumed; evidence-blocking directives need real named human evidence at execution.

## Preconditions

- A fresh task-base checkout contains the approved brief/ADR/plan and no unrelated user edits; confirm this unit's `depends_on` commits are integrated.
- Create `task/PLN-0004/p04-release-guidance` at the correct task/phase base in `.worktrees/PLN-0004/phase-04/release-guidance` only when parallel execution is justified; serial execution may use the isolated task worktree under ADR 0031.
- Compile an execution-time `context-cli preflight` for the actual modified file scope before code changes. Stop on missing binding or incompatible stack.

## Scope

**In scope:**
- `README.md`
- `app/cli/README.md`
- `docs/guide/cross-workspace-integration.md`
- `docs/Workflows.md`
- `context-manifest.json`
- `context-lock.json`

**Out of scope:** Do not add product behavior, alter unrelated eval migrations, or claim checks that were not run.

## Steps

1. Update quick start and command reference to show one post-submodule init entry, compact status, preflight/conform, separate hook/CI opt-ins, and copyable non-GitHub commands.
2. Explain existing-hook/workflow conflicts, no-editor non-TTY failure, no-code not-applicable state, evidence-blocking recovery, and host lint/test configuration.
3. Audit new source/test inventory and only add required entries to the manifest/map; regenerate the lock from the current manifest without reverting pre-existing user edits.
4. Run each phase's focused suite and full evaluations, doctor, lock check, `git diff --check`, and final-diff conformance; record real report ID/diffHash/bindingHash and named human evidence when required.
5. Review every AC against fresh outputs and preserve the unrelated dirty checkout during final merge preparation.

## Verification

- **Test type and reason:** Contract/documentation review: verify examples against real CLI help and temp host output; full integration suites detect drift across source, generated workflow, manifest/lock, and bridge artifacts. No new test is added solely to mirror prose.
- **Named cases:** Quick start commands execute; generated workflow commands match docs; lock current; evaluations and doctor real outcomes recorded.
- **Focused command:** `node evals/run-evals.mjs && node scripts/context.mjs doctor && node app/cli/bin/context-cli.mjs lock --check --json`.
- **Conformance gate:** Run `node app/cli/bin/context-cli.mjs conform "Verify unit 04.02 release-guidance" --stack typescript --scope <actual-modified-files> --out .context-runs/PLN-0004/04.02/conformance-report.json --json` after the final unit diff. Supply named human evidence only if a real human provided it. Record actual report ID, verdict, diffHash, bindingHash, output path, and exit code; `FAIL` or `BLOCKED` stops the unit.
- **Review:** `git diff --check`, inspect `git status --short`, and compare the committed unit diff with this scope fence before phase integration.

## Rollback

Revert task-owned documentation/manifest/lock delta only after comparing with pre-existing user changes; retain source behavior until reviewed rollback decision.

## Definition of done

- [ ] AC-05, AC-10, final integrated AC-01–AC-09 has the named passing test evidence and no unreported skip.
- [ ] The changed files stay inside this unit's scope, with implementation/import boundaries reviewed.
- [ ] The checkout has a clean commit and a real current `PASS` conformance receipt; required human evidence is named, not generated by an agent.
- [ ] The phase integration branch receives this reviewed commit in dependency order; task-owned worktree cleanup occurs after integration.
