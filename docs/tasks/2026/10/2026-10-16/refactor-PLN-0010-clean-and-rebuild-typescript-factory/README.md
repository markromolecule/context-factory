---
title: "Clean and Rebuild Context Factory for TypeScript Ecosystem"
type: task
status: planned
plan_contract_version: 3
plan_id: "PLN-0010"
created: "2026-10-16"
tags: [task, refactor, typescript, workflows, skills, cleanup]
target_branch: "feat/PLN-0009-codex-and-claude-workflow-discovery"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
discovery_brief: "../../../../../discovery/typescript-factory-rebuild/brief.md"
---

# Clean and Rebuild Context Factory for TypeScript Ecosystem Master Plan

## Outcome

Rebuild and streamline Context Factory to focus exclusively on the TypeScript ecosystem with zero language/framework selection overhead. Consolidate all 12 workflows into first-class skills under `skills/workflows/<slug>/SKILL.md` (eliminating `workflows/*.md` and the `skills/workflow-entries/` wrapper layer). Purge redundant model-specific root files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/*` adapters) in favor of `orchestrator/SHARED.md` and `README.md` as the sole model-neutral contracts. Align indexers, bridge generators, validators, manifest, and lockfile to 100% passing health.

## Pre-planning record

The released discovery brief is fresh and has no material unknowns (`docs/discovery/typescript-factory-rebuild/brief.md`). Grounding packets `G-KISS-001` and `G-YAGNI-002` support eliminating wrapper indirection and dead multi-stack abstractions, aligning with `ADR 0036` and superseding `ADR 0038`. The user confirmed first-class skill workflows (`skills/workflows/<slug>/SKILL.md`), purging root model adapter files, and hardcoding single-stack TypeScript without selection prompts or framework filtering.

### Actors and goals

| Actor | Goal |
| :--- | :--- |
| **TypeScript Developer** | Use Context Factory rules, skills, and workflows without encountering multi-stack prompts, `--stack` flags, or PHP/Flutter warnings. |
| **AI Coding Agent** | Discover and execute workflows natively from `skills/workflows/<slug>/SKILL.md` in IDEs via `.agents/skills/` without navigating dual wrapper indirection. |
| **System Maintainer** | Maintain a clean, minimal root directory where `orchestrator/SHARED.md` is the authoritative contract and `doctor` verifies zero dangling files. |

### Domain language

- **First-Class Workflow Skill:** A unified skill directory (`skills/workflows/<slug>/SKILL.md`) containing YAML frontmatter (`name`, `description`) and the complete authoritative lifecycle policy (phases, gates, stop conditions).
- **Model-Neutral Contract:** Orchestration and behavioral rules defined once in `orchestrator/SHARED.md` and `README.md`, eliminating duplicate per-model entrypoints.
- **Dedicated TypeScript Stack:** Context Factory's sole supported environment, eliminating multi-stack routing flags and framework-filtering logic.

### Language stack and applicable rules

- **Declared Stack:** `typescript` (Node.js ESM for CLI tooling and Markdown for rules/skills).
- **Precedence Invariant:** Applicable language rules strictly supersede contradictory procedural plan steps.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Unit |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **S-01** | Developer invokes a workflow via IDE skill menu or slash command | Workflow migrated to `skills/workflows/<slug>/SKILL.md` | Skill loads full lifecycle gates and stop conditions directly without redirects | Broken link or missing frontmatter fails validation | 01.01 |
| **S-02** | Developer inspects root directory `ls -la` | Root model-specific adapter files removed | Root contains only standard project files (`README.md`, `package.json`, `context-manifest.json`, `context-lock.json`) | Dangling symlink in `.agents/` fails bridge check | 02.01 |
| **S-03** | Engineer runs CLI commands (`conform`, `preflight`, `resolve`) without `--stack` | Multi-stack flags removed | System executes in TypeScript mode by default without prompt questions | Non-TypeScript stack request emits informative BLOCKED diagnostic | 03.01 |
| **S-04** | Maintainer executes full diagnostic suite `node scripts/context.mjs doctor` | Inventory, symlinks, and MOCs updated | Diagnostics report 100% PASS (0 lint failures, 0 dangling symlinks, 0 broken wikilinks) | Stale lockfile or missing skill triggers doctor repair | 04.01 |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **D-01** | How should workflows be structured under `skills/`? | First-class skill directories (`skills/workflows/<slug>/SKILL.md`). | Merges canonical lifecycle policy and skill discovery into one authoritative file per workflow, adhering to KISS. | Flat Markdown files (`skills/workflows/<name>.md`) which would require separate wrapper adapters. | `docs/discovery/typescript-factory-rebuild/record.md` |
| **D-02** | Which root files should be removed? | Purge `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/*` adapters. | `orchestrator/SHARED.md` and `README.md` serve as the unified model-neutral contracts. | Keeping editor dotfiles or model-specific wrappers. | `docs/discovery/typescript-factory-rebuild/record.md` |
| **D-03** | How should framework and stack selection be handled? | Dedicated TypeScript stack; remove `--stack` flags, Flutter checks, and framework-filtering logic. | Adheres to YAGNI and ADR 0036. Rules in `rules/typescript/` apply universally to TypeScript projects. | Retaining CLI selection prompts or multi-stack branching. | `docs/discovery/typescript-factory-rebuild/record.md` |

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Unit | Verification Command | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| AC-01 | S-01, D-01 | All 12 workflows exist as first-class skills under skills/workflows/ and old wrappers deleted | 01.01 | node scripts/context.mjs doctor | planned |
| AC-02 | S-02, D-02 | Root model files and orchestrator wrappers are deleted | 02.01 | git status --short | planned |
| AC-03 | S-03, D-03 | CLI commands and doctor remove --stack flags and flutter checks | 03.01 | npm test | planned |
| AC-04 | S-04, D-01..D-03 | Bridge generator, validator, indexer, manifest, lockfile, and MOCs updated; ADR 0039 recorded | 04.01 | node scripts/context.mjs doctor | planned |

## Scope

- **In scope:**
  - Migrating 12 workflows to `skills/workflows/<slug>/SKILL.md` and deleting `workflows/` and `skills/workflow-entries/`.
  - Deleting root model entry files and `orchestrator/*` model adapters.
  - Removing `--stack` flags, interactive language prompts, Flutter assertions, and framework filtering.
  - Updating bridge generator, validator, indexer, manifest, lockfile, and Obsidian MOCs.
  - Authoring ADR 0039.
- **Out of scope (non-goals):**
  - Modifying internal phase gates or lifecycle policy within workflows.
  - Modifying historical task logs under `docs/tasks/2026/`.
  - Adding new runtime dependencies.

## Unknowns and blockers

- None. All unknowns (U-01, U-02, U-03) were resolved with user confirmation during pre-planning grilling.

## Risk and dependency register

| Risk or dependency | Impact | Mitigation or owner |
| :--- | :--- | :--- |
| **Broken Symlinks in `.agents/skills/`** | High | Unit 04.01 updates `bridge-generator.mjs` and regenerates `.agents/` symlinks directly targeting `skills/workflows/*`. |
| **Dangling References in Manifest/Lock** | Medium | Unit 04.01 synchronizes `context-manifest.json` and runs `node scripts/context.mjs lock` before final release. |
| **Validator Assertion Failures** | Medium | Unit 04.01 updates `scripts/validate-context.mjs` to validate `skills/workflows/` rather than `skills/workflow-entries/`. |

## Task branch

| Field | Recorded decision |
| :--- | :--- |
| Target branch | `feat/PLN-0009-codex-and-claude-workflow-discovery` |
| Task branch | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` |
| Base commit | `a37f557a2fde8e30b6ae23a941d74d8e87a5677f` |

## Plan done-check

- [x] Acceptance criteria mapped to units and verification commands
- [x] Blockers resolved or none remain
- [x] Risks and dependencies assessed
- [x] Task branch and base commit aligned across all units

## Phases

- [ ] `phase-01-workflow-consolidation/phase.md` — Phase 1 — Consolidate Workflows into First-Class Skills
- [ ] `phase-02-root-adapter-removal/phase.md` — Phase 2 — Purge Model-Specific Root Entrypoints & Model Adapters
- [ ] `phase-03-typescript-environment/phase.md` — Phase 3 — Streamline TypeScript-Only Environment, CLI & Harness Tools
- [ ] `phase-04-tooling-and-verification/phase.md` — Phase 4 — Tooling Alignment, Bridge Generator, Validator, and Final Verification

## Finalization & Merge Ledger

| Stage | Branch or merge | Commit SHA | Conformance Report | Verification Command |
| :--- | :--- | :--- | :--- | :--- |
| Phase 01 Verification | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | pending | pending | `npm test` |
| Phase 02 Verification | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | pending | pending | `git status --short` |
| Phase 03 Verification | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | pending | pending | `npm test` |
| Phase 04 Verification | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` | pending | pending | `node scripts/context.mjs doctor` |
| Task Finalization | `refactor/PLN-0010-clean-and-rebuild-typescript-factory` to `feat/PLN-0009-codex-and-claude-workflow-discovery` | pending | pending | `node scripts/context.mjs doctor` |
