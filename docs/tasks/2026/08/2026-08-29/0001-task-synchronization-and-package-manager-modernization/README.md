---
title: "Synchronization and Package Manager Modernization"
type: task
status: planned
created: "2026-08-29"
tags: [task, synchronization, pnpm, cli, moc, workflows]
---

# Synchronization and Package Manager Modernization

## Outcome

Modernize Context Factory's synchronization lifecycle and cross-workspace tooling to automate Obsidian Map of Content (MOC) maintenance, enforce typed workflow frontmatter contracts, enable local host rule merging during context resolution, support multi-package-manager detection (`pnpm`, `npm`, `yarn`, `bun`), and install zero-drift git pre-commit health hooks.

## Pre-planning record

### Actors and goals

- **Agentic Developer & Host Engineer:** wants `pnpm` and other package managers to be auto-detected and supported first-class across the CLI and bridged repositories without manual script adjustments.
- **Context Factory Maintainer:** wants adding new rules, skills, workflows, or ADRs to automatically update Obsidian MOCs (`docs/*.md`) during `sync` without manual Markdown table editing or validation breakages.
- **Autonomous AI Agents (Antigravity, Gemini, Claude, Cursor):** want deterministic, schema-validated workflow contracts that explicitly declare required rules, skills, and participating agent personas in frontmatter.

### Domain language

- **Map of Content (MOC):** Top-level Obsidian navigation markdown files (`docs/Rules.md`, `docs/Skills.md`, `docs/Workflows.md`, `docs/Agents.md`, `docs/decisions/README.md`) containing tables of wikilink references.
- **Workflow Contract:** Frontmatter metadata in `workflows/*.md` defining `rules`, `skills`, `primaryAgent`, and `participatingAgents`.
- **Package Manager Detection:** Heuristic scanner inspecting host project root for lockfiles (`pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, `package-lock.json`).
- **Pre-Commit Health Hook:** A standalone shell hook installed into `.git/hooks/pre-commit` that validates lockfile integrity, linting, symlinks, and evals prior to commit.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S-01 | Developer runs `pnpm run sync` after adding a rule/skill | Modified rules or skills exist | `context-manifest.json`, `context-lock.json`, and `docs/*.md` MOCs updated automatically | If MOC write fails, report clear file path error | Verified |
| S-02 | Developer runs `context-cli resolve "<request>"` | Request matches a workflow | Frontmatter-declared `rules` and `skills` from workflow are included alongside agent declared context | Fallback to regex body scanning if workflow lacks frontmatter arrays | Verified |
| S-03 | Host project with `pnpm-lock.yaml` is bridged | `context-cli bridge --target <host>` | Injected `package.json` scripts use `pnpm run context:doctor` instead of hardcoded `npm` | Defaults to `npm` if no lockfile is found | Verified |
| S-04 | Developer commits code in git repository | Pre-commit hook installed | `context-cli doctor` runs automatically before commit and blocks stale lockfiles | Developer can run `pnpm run sync` to auto-heal | Verified |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | How should Obsidian MOCs be updated? | Automatically re-generate MOC tables in `indexer.mjs` during `syncFactoryInventory` | Eliminates tedious manual table editing and prevents validator errors | Manual documentation maintenance | ADR 0009 |
| D-02 | How should workflows declare rule & skill dependencies? | Explicit YAML frontmatter arrays (`rules`, `skills`, `primaryAgent`, `participatingAgents`) | Strict schema validation, fast parsing, zero regex ambiguity | Pure markdown text parsing | ADR 0009 |
| D-03 | How should package managers be supported in host projects? | Auto-detect lockfile in target directory + support `--pm <npm\|pnpm\|yarn\|bun>` CLI flag | Provides native developer ergonomics across all JS ecosystems without external deps | Hardcoding npm only | ADR 0009 |
| D-04 | How should pre-commit verification be handled? | Standalone zero-dependency POSIX hook script installed via `context-cli hook install` | Eliminates external npm dependencies (like husky or lint-staged) | Adding heavy npm dependencies | ADR 0009 |

### Unknowns and blockers

- None. Node.js built-ins provide full filesystem, process, and crypto capabilities.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | D-01, S-01 | `context-cli sync` automatically updates `docs/Rules.md`, `docs/Skills.md`, `docs/Workflows.md`, `docs/Agents.md`, and `docs/decisions/README.md` | `app/cli/core/indexer.mjs` | `pnpm run sync` + `pnpm run lint` pass | Verified |
| AC-02 | D-02, S-02 | All 11 workflows have valid YAML frontmatter specifying `rules`, `skills`, `primaryAgent`, and `participatingAgents` | `workflows/*.md`, `scripts/validate-context.mjs` | `pnpm run validate` passes | Verified |
| AC-03 | D-02, S-02 | `resolveContext()` parses workflow frontmatter arrays with backward-compatible regex fallback | `scripts/context-core.mjs` | `evals/cases/` test cases pass | Verified |
| AC-04 | D-03, S-03 | `context-cli bridge` and `init` auto-detect `pnpm`, `yarn`, `bun`, or `npm` and format `package.json` scripts accordingly | `app/cli/core/bridge-generator.mjs` | Dry-run bridge tests on pnpm/yarn fixtures | Verified |
| AC-05 | D-04, S-04 | `context-cli hook install` scaffolds `.git/hooks/pre-commit` to execute `context-cli doctor` | `app/cli/commands/hook.mjs` | Hook installation & execution test | Verified |
| AC-06 | D-01-D-04 | ADR 0018 authored and full evaluation suite passes (100% clean doctor) | `docs/decisions/0018-...` | `pnpm run doctor` exits 0 | Verified |

## Scope

- Obsidian MOC generator in `app/cli/core/indexer.mjs`.
- Workflow frontmatter standardization across all 11 workflows.
- Resolution engine enhancements in `scripts/context-core.mjs`.
- Package manager auto-detection and `--pm` flag in `app/cli/core/bridge-generator.mjs` and `app/cli/commands/init.mjs`.
- Git pre-commit hook installer command `context-cli hook install`.
- ADR 0018, evaluations, version bump to `3.11.0`.

## Non-goals

- Introducing external npm dependencies.
- Modifying host project production business logic.

## Constraints and decisions

- Zero external npm dependencies.
- 100% backward compatibility for existing host bridges and workflows.
- Strict SOLID conformance and subagent role segregation.

## Phases

- [x] `phase-01-discovery-and-scenarios.md` — Phase 1: MOC Auto-Sync & Indexer Automation
- [x] `phase-02-architecture-and-contracts.md` — Phase 2: Workflow Frontmatter Contracts & Resolution Upgrade
- [x] `phase-03-implementation-and-tests.md` — Phase 3: Package Manager Detection & Git Hook CLI
- [x] `phase-04-verification-and-release.md` — Phase 4: ADR 0018, Golden Evaluations, and Doctor Verification

## Verification

- `pnpm run sync`: Generated all 6 Obsidian MOC files, updated `context-manifest.json` with 35 rules, 10 skills, 11 workflows, 23 agents, 18 ADRs, 17 evals, and generated `context-lock.json` (`sha256:fbc32e75a6ebd91c...`).
- `pnpm run doctor`:
  - Manifest & Syntax Lint: PASS (35 rules, 10 skills, 11 workflows verified)
  - Lockfile Integrity: PASS (Current SHA-256)
  - .agents Symlink Integrity: PASS (6/6 healthy)
  - Evaluation Suite: PASS (20/20 passed in 65ms)
- `pnpm run eval`: 20/20 passed (66ms).

## Deviations

- None.

## Result

- All 4 phases executed and verified with 100% test pass rate. Context Factory is fully synchronized and upgraded to v3.11.0 with first-class pnpm support.



