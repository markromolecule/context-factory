---
title: "CLI UX Modernization, Mascot Graphics Engine, and Code Health Skills (perf, types)"
type: task
status: planned
created: "2026-10-05"
tags: [task, cli, ux, mascot, terminal, skills, perf, types, typescript]
target_branch: master
base_branch: "task/0003-cli-ux-and-code-health-skills"
---

# CLI UX Modernization, Mascot Graphics Engine, and Code Health Skills (`perf`, `types`)

## Outcome

Transform the Context Factory CLI into a modern, engaging, and intuitive terminal interface featuring the **Octo-Agent mascot** rendered via zero-dependency ANSI TrueColor half-blocks (`▀`/`▄`), structured command cards with category badges, and interactive quick-start guidance. Concurrently introduce two first-class engineering skills—**`perf`** (runtime profiling, ORM N+1 elimination, ESR indexing, async waterfalls) and **`types`** (static type hardening, eliminating `any` and loose casts, discriminated unions, `assertNever` exhaustiveness)—and wire them directly into post-review remediation gates to permanently eliminate LLM code slop.

## Pre-planning record

### Actors and goals

- **Developer / CLI User:** Wants an inviting, clear terminal interface with the Octo-Agent mascot, clean category hierarchy, and quick-start workflow prompts that make the CLI easy to understand and pleasant to use.
- **Code Reviewer / QA Agent:** Wants automated diff review gates (`/review`) to have dedicated, actionable procedural skills (`/types` and `/perf`) to dispatch when LLM code generation produces loose types or query bottlenecks.
- **Autonomous Agent / Executor:** Wants crisp, checkable rules and step-by-step procedures to profile hot paths, fix ORM N+1 queries, eliminate `any`, and model strict discriminated unions without breaking existing contracts.

### Domain language

- **Octo-Agent Mascot:** An orange octopus wearing a backwards dark cap emblazoned with a `>_` terminal prompt, serving as the official visual identity of Context Factory.
- **ANSI TrueColor Half-Blocks (`▀` / `▄`):** A terminal graphics technique splitting each character cell into two vertical pixels using 24-bit RGB foreground and background escape sequences, enabling universal image rendering without external dependencies.
- **Type Slop:** Code generation degradation where an LLM resorts to `any`, loose `as unknown as T` casts, untyped record dictionaries, or missing union exhaustiveness to bypass compiler errors.
- **ESR Rule:** Equality, Sort, Range composite indexing discipline mandated by `rules/typescript/database/query-optimization-and-pagination.md`.
- **ORM N+1 Query Loop:** The anti-pattern of executing $N$ queries inside an iteration loop rather than a single batched lookup or join.

### Language stack and applicable rules

- **Declared Stack:** `typescript` (Pure Node.js native ESM, zero external runtime dependencies).
- **Applicable Rules:**
  - `rules/global/architecture-conformance.md`: Ensure manifest and lockfile maintain 100% integrity.
  - `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
  - `rules/typescript/common/type-safety.md`: Strict type safety, ban `any`, exhaustiveness checking.
  - `rules/typescript/database/query-optimization-and-pagination.md`: ESR indexing, bounded limits, Kysely queries.
  - `rules/solid/single-responsibility.md`: Maintain single responsibility in formatting, rendering, and skill scopes.
- **Precedence Invariant:** Applicable language rules strictly supersede contradictory procedural plan steps.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Developer runs `context-cli` in modern terminal | TrueColor terminal (iTerm2, Terminal.app, VS Code) | Octo-Agent mascot renders in full ANSI color alongside categorized command cards | Fallback to compact text banner if `--no-color` or narrow (< 60 cols) | planned |
| SC-02 | Developer runs `context-cli --no-color` or pipes output | Non-TTY or `NO_COLOR=1` | Mascot graphic suppressed; clean plain text output with zero escape characters | Uncorrupted stdout | planned |
| SC-03 | Code review flags `any` and loose casts | Unit diff contains `as any` | Review Gate 4 dispatches to `/types`; agent hardens types using discriminated unions | Unit rejected until types pass | planned |
| SC-04 | Code review flags ORM N+1 or unindexed query | Unit diff contains query in loop | Review Gate 4 dispatches to `/perf`; agent rewrites into batched query adhering to ESR | Unit rejected until perf passes | planned |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | How should the mascot image be rendered? | Zero-dependency ANSI TrueColor half-block pixel art | Works across 100% of modern terminals (macOS Terminal, iTerm2, VS Code, Cursor) with zero npm packages | External image packages (violates zero-dep invariant); Protocol-only (fails in standard Terminal.app) | ADR 0028 |
| D-02 | Where do `perf` and `types` skills reside? | Under `skills/engineering/` | Aligns with ADR 0020 taxonomy for hands-on code manipulation tools | Flat directory; separate micro-category | ADR 0020, ADR 0028 |
| D-03 | How are `perf` and `types` connected to existing workflows? | Wired into `/review` Gates 3 & 4 and `/refactor` | Provides explicit remediation routing when post-review code slop is detected | Standalone unreferenced skills | ADR 0028 |

### Unknowns and blockers

None. Context specification is `status: ready` and ADR 0028 is `status: accepted`.

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | User Goal 1, SC-01, D-01 | Octo-Agent mascot renders in ANSI TrueColor half-blocks on standard CLI invocation | `app/cli/core/mascot.mjs` | `node app/cli/bin/context-cli.mjs` displays colored mascot | planned |
| AC-02 | User Goal 1, SC-02 | Mascot graphic degrades gracefully when `--no-color` is passed or terminal < 60 columns | `app/cli/core/mascot.mjs` | `node app/cli/bin/context-cli.mjs --no-color` outputs clean plain text | planned |
| AC-03 | User Goal 1, SC-01 | CLI help is organized into categorized cards with colored badges and quick-start recipes | `app/cli/core/formatter.mjs`, `app/cli/bin/context-cli.mjs` | `node app/cli/bin/context-cli.mjs --help` renders structured cards | planned |
| AC-04 | User Goal 2, SC-04, D-02 | `perf` skill created with profiling, N+1 elimination, ESR indexing, and async waterfall procedures | `skills/engineering/perf/SKILL.md` | Markdown lint passes, skill structure conforms to schema | planned |
| AC-05 | User Goal 2, SC-03, D-02 | `types` skill created with type hardening, `any` elimination, discriminated unions, and exhaustiveness checks | `skills/engineering/types/SKILL.md` | Markdown lint passes, skill structure conforms to schema | planned |
| AC-06 | User Goal 2, SC-03, SC-04, D-03 | Review Gates 3 & 4 wire remediation guidance directly to `/types` and `/perf` | `skills/engineering/review/SKILL.md` | Review skill references both skills under remediation gates | planned |
| AC-07 | User Goal 2, D-03 | Refactor skill references `perf` and `types` as specialized refactoring procedures | `skills/engineering/refactor/SKILL.md` | Refactor skill references both skills | planned |
| AC-08 | ADR 0020, ADR 0028 | Group READMEs and global README index both new skills with wiki links | `skills/engineering/README.md`, `skills/README.md` | All skills documented and linked | planned |
| AC-09 | Universal Health | Context Factory manifest and lockfile are updated, and full doctor evaluation suite passes 100% | `npm run sync`, `npm run doctor` | `doctor` returns HEALTHY exit code 0 | planned |

## Scope

**In scope:**
- Zero-dependency Octo-Agent ANSI TrueColor mascot module (`app/cli/core/mascot.mjs`).
- CLI visual card formatter and help redesign (`app/cli/core/formatter.mjs`, `app/cli/bin/context-cli.mjs`).
- Authoring `skills/engineering/perf/SKILL.md`.
- Authoring `skills/engineering/types/SKILL.md`.
- Cross-skill wiring in `skills/engineering/review/SKILL.md` and `skills/engineering/refactor/SKILL.md`.
- Index updates in `skills/engineering/README.md` and `skills/README.md`.
- Full repository synchronization via `npm run sync` and diagnostic validation via `npm run doctor`.

## Non-goals

- Adding external npm dependencies (`chalk`, `ink`, `boxen`, `image-to-ascii`) to `package.json`.
- Creating a full-screen interactive TUI with cursor trapping.
- Altering existing command execution logic in `commands/*.mjs`.

## Constraints and decisions

- **Zero Third-Party Dependencies:** Native Node.js ESM only.
- **Terminal Resilience:** Automatic fallback for non-TTY, CI, narrow columns, or `NO_COLOR`.
- **Branch Naming Discipline:** Phase integration branches named `task/0003/phase-XX-integration` to prevent git ref directory collisions.

## Worktree & Branch Topology

| Phase | Unit ID | Unit Title | Branch Name | Worktree Directory | Merge Target | Status |
|---|---|---|---|---|---|---|
| phase-01 | 01.01 | Zero-Dependency Octo-Agent Mascot Engine | `task/0003/phase-01/mascot-engine` | `.worktrees/0003/phase-01/mascot-engine` | `task/0003/phase-01-integration` | planned |
| phase-01 | 01.02 | CLI Card Formatter & Help Modernization | `task/0003/phase-01/cli-formatter-modernization` | `.worktrees/0003/phase-01/cli-formatter-modernization` | `task/0003/phase-01-integration` | planned |
| phase-02 | 02.01 | `perf` Performance Optimization Skill | `task/0003/phase-02/perf-skill` | `.worktrees/0003/phase-02/perf-skill` | `task/0003/phase-02-integration` | planned |
| phase-02 | 02.02 | `types` Static Type Hardening Skill | `task/0003/phase-02/types-skill` | `.worktrees/0003/phase-02/types-skill` | `task/0003/phase-02-integration` | planned |
| phase-03 | 03.01 | Review & Refactor Remediation Wiring | `task/0003/phase-03/remediation-wiring` | `.worktrees/0003/phase-03/remediation-wiring` | `task/0003/phase-03-integration` | planned |
| phase-03 | 03.02 | Skills Catalog Sync & Doctor Verification | `task/0003/phase-03/sync-and-doctor` | `.worktrees/0003/phase-03/sync-and-doctor` | `task/0003/phase-03-integration` | planned |

## Phases

- [ ] `phase-01-mascot-and-terminal-formatter/phase.md` — Phase 1: Mascot Graphic Engine & Terminal Formatter
- [ ] `phase-02-code-health-skills/phase.md` — Phase 2: Code Health Engineering Skills (`perf`, `types`)
- [ ] `phase-03-cross-skill-integration-and-release/phase.md` — Phase 3: Cross-Skill Integration, Sync, & Release

## Verification

Commands to run for verification:
- `node app/cli/bin/context-cli.mjs`
- `node app/cli/bin/context-cli.mjs --no-color`
- `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-05/0003-task-cli-ux-and-code-health-skills`
- `npm run sync`
- `npm run doctor`

## Deviations

None.

## Finalization & Merge Ledger

| Stage | Source Branch | Target Branch | Merge Commit SHA | Worktree Cleaned | Verification Command |
|---|---|---|---|---|---|
| Phase 01 Integration | `task/0003/phase-01-integration` | `task/0003-cli-ux-and-code-health-skills` | pending | [ ] | `node app/cli/bin/context-cli.mjs` |
| Phase 02 Integration | `task/0003/phase-02-integration` | `task/0003-cli-ux-and-code-health-skills` | pending | [ ] | `npm run doctor` |
| Phase 03 Integration | `task/0003/phase-03-integration` | `task/0003-cli-ux-and-code-health-skills` | pending | [ ] | `npm run doctor` |
| Task Base Finalization | `task/0003-cli-ux-and-code-health-skills` | `master` | pending | [ ] | `npm run doctor` |

## Result

Pending execution.
