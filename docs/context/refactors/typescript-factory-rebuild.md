---
title: "Clean and Rebuild Context Factory for TypeScript-Only Ecosystem"
type: context
status: ready
created: "2026-10-16"
tags: [context, refactor, typescript, cleanup, workflows, skills, orchestrators]
feature: "typescript-factory-rebuild"
---

# Clean and Rebuild Context Factory for TypeScript-Only Ecosystem Context Specification

## 1. Overview & Objective

- **Problem Statement:** Context Factory has accumulated architectural complexity, legacy multi-stack machinery (such as lingering `flutter` unsupported-stack assertions and `--stack` selection flags), redundant workflow indirection (`workflows/*.md` duplicated by thin wrapper adapters in `skills/workflow-entries/`), and clutter from redundant model-specific adapter files on the root (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`). This creates maintenance drift, cognitive overhead, and index bloat.
- **Business / User Value:** Streamline Context Factory into a clean, modern, pure TypeScript repository where workflows live natively under `skills/workflows/`, multi-stack/framework selection mechanics are eliminated, and root clutter is purged, making agent context consumption fast, direct, and unambiguous.
- **Success Criteria:**
  - Removal of root model adapter files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/*` adapter files) in favor of `orchestrator/SHARED.md` and `README.md` as the sole model-neutral sources of truth.
  - Elimination of `skills/workflow-entries/` and root `workflows/`; relocation of workflows directly into first-class skill directories under `skills/workflows/<slug>/SKILL.md`.
  - Simplification of rule resolution, CLI options, and conformance to focus exclusively on the TypeScript ecosystem without language/framework selection overhead or legacy multi-stack checks.
  - Manifest (`context-manifest.json`), lockfile (`context-lock.json`), Obsidian MOCs (`docs/Skills.md`, `docs/Workflows.md`), indexer, doctor diagnostics, symlink bridge generator, and test suite fully aligned and passing (`PASS`).

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As an AI agent or engineer using Context Factory, I want workflows to reside directly under `skills/workflows/<slug>/SKILL.md` as unified first-class skills, so that discovery and execution are cohesive and don't require navigating a dual canonical-vs-entry split.*
- *As a developer, I want Context Factory to have a clean root directory free of duplicated model-specific adapter markdown files, so that the repository structure is minimal, uncluttered, and model-neutral.*
- *As a maintainer, I want the rules and CLI to focus strictly on TypeScript without selecting languages or frameworks, so that we don't carry dead abstractions, multi-stack branching, or lingering unsupported-stack warnings.*

### Functional Requirements

- [ ] **FR-01 (Root Adapter & Model Clutter Removal):**
  - Delete root model-specific entry files: `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`.
  - Delete `.github/copilot-instructions.md`.
  - Delete `orchestrator/AGENTS.md`, `orchestrator/CLAUDE.md`, `orchestrator/CODEX.md`, `orchestrator/GEMINI.md`.
  - Retain `orchestrator/SHARED.md` and `README.md` as the sole model-neutral sources of truth.
- [ ] **FR-02 (Workflow Consolidation into Skills):**
  - Delete `skills/workflow-entries/` (12 adapter folders).
  - Move/reformat root `workflows/*.md` (12 files) into first-class skill directories: `skills/workflows/<slug>/SKILL.md`.
  - Each `SKILL.md` contains valid YAML frontmatter (`name: workflow-<slug>` or `<slug>`, `description: ...`) and the full workflow lifecycle policy (phases, gates, stop conditions).
  - Delete the old root `workflows/` directory.
- [ ] **FR-03 (TypeScript-Only Stack Enforcement):**
  - Eliminate `--stack` and `--stacks` flags and interactive language prompts from CLI commands (`conform.mjs`, `preflight.mjs`, `resolve.mjs`, `init.mjs`).
  - Hardcode the active environment to `typescript`.
  - Remove all remaining references to `flutter` as an unsupported stack check in `app/cli/commands/doctor.mjs`, `schemas/rule-descriptor.schema.json`, and bridge tests.
  - Remove framework-filtering logic from rule descriptors and resolver: all rules under `rules/typescript/` (including frontend framework guidelines) are part of the unified TypeScript catalog and do not require separate selection.
- [ ] **FR-04 (Harness, Bridge & Indexer Alignment):**
  - Update `scripts/validate-context.mjs`:
    - Remove expectations for root `AGENTS.md` and `GEMINI.md` in `.agents/`.
    - Update `validateWorkflowEntries` or replace it to validate `skills/workflows/<slug>/SKILL.md`.
    - Update Obsidian MOC generators (`app/cli/core/indexer.mjs` and `docs/Workflows.md`, `docs/Skills.md`).
  - Update `app/cli/core/bridge-generator.mjs`:
    - Update symlink generation to symlink `skills/workflows/*` into `.agents/skills/`.
    - Remove generation of root `AGENTS.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`.
- [ ] **FR-05 (Inventory, Lock & Doctor Health):**
  - Update `context-manifest.json` (`orchestrators`, `skills`, `workflows` fields).
  - Regenerate `context-lock.json`.
  - Ensure `node scripts/context.mjs doctor` and `npm test` execute with 100% `PASS`.

### Edge Cases & Failure Modes

- **Editor Discovery Continuity:** Modern AI IDEs (Antigravity, Cursor, Trae) rely on `.agents/`. `.agents/` will continue to expose `rules/` and `skills/` (which now includes `skills/workflows/`). `orchestrator/SHARED.md` will be linked or referenced cleanly without requiring individual per-model root files.
- **Workflow Naming & Triggers:** In `skills/workflows/<slug>/SKILL.md`, names must remain distinct and match existing command triggers (e.g. `feature-delivery` or `workflow-feature-delivery`), ensuring slash commands and automatic resolution work seamlessly.
- **Dangling Manifest & Lock Entries:** All deleted files must be cleanly deregistered from `context-manifest.json` and `context-lock.json` so `doctor` never encounters dangling paths.

## 3. Technical & Architectural Context

- **Affected Domains / Layers:** Root directory, `skills/`, `workflows/`, `rules/`, `orchestrator/`, `app/cli/`, `scripts/`, `docs/`.
- **Language Stack & Rules:** Single unified stack: `typescript`. Rules enforced: `cf.arch.separation-of-concerns`, `cf.code.single-responsibility`.
- **Existing Files to Delete:**
  - `AGENTS.md`
  - `CLAUDE.md`
  - `CODEX.md`
  - `GEMINI.md`
  - `.cursorrules`
  - `.windsurfrules`
  - `.github/copilot-instructions.md`
  - `orchestrator/AGENTS.md`
  - `orchestrator/CLAUDE.md`
  - `orchestrator/CODEX.md`
  - `orchestrator/GEMINI.md`
  - `skills/workflow-entries/**` (12 folders)
  - `workflows/**` (12 files moved/transformed into `skills/workflows/**`)
- **New Files to Create:**
  - `skills/workflows/architecture-change/SKILL.md`
  - `skills/workflows/code-review-and-optimization/SKILL.md`
  - `skills/workflows/commit-push-release/SKILL.md`
  - `skills/workflows/context-maintenance/SKILL.md`
  - `skills/workflows/database-migration/SKILL.md`
  - `skills/workflows/defect-resolution/SKILL.md`
  - `skills/workflows/dependency-upgrade/SKILL.md`
  - `skills/workflows/docs/SKILL.md`
  - `skills/workflows/feature-delivery/SKILL.md`
  - `skills/workflows/new-project-delivery/SKILL.md`
  - `skills/workflows/release-readiness/SKILL.md`
  - `skills/workflows/security-sensitive-change/SKILL.md`
- **Existing Files to Modify:**
  - `context-manifest.json`
  - `orchestrator/SHARED.md`
  - `scripts/context-core.mjs`
  - `scripts/validate-context.mjs`
  - `app/cli/core/indexer.mjs`
  - `app/cli/core/bridge-generator.mjs`
  - `app/cli/commands/doctor.mjs`
  - `app/cli/commands/conform.mjs`
  - `app/cli/commands/resolve.mjs`
  - `app/cli/commands/preflight.mjs`
  - `app/cli/commands/init.mjs`
  - `docs/Skills.md`
  - `docs/Workflows.md`
  - `evals/tests/bridge/bridge-conformance.test.mjs`

## 4. UI/UX & Interaction Guidelines (if applicable)

- Clean, intuitive CLI commands and repository directory tree.
- No multi-stack prompts asking the user to pick languages or frameworks.
- Transparent workflow discovery via IDE skill menus and `/skills`.

## 5. Scope & Boundaries

- **In Scope:**
  - Purging model-specific root entrypoint and orchestrator adapter files.
  - Relocating all workflows into `skills/workflows/<slug>/SKILL.md` and removing `skills/workflow-entries/` and root `workflows/`.
  - Removing language and framework selection logic, `--stack` flags, and lingering Flutter assertions.
  - Synchronizing manifest, lockfile, indexer, bridge generator, validator, and tests.
- **Out of Scope / Non-Goals:**
  - Rewriting the procedural instructions or phase gates within the workflows (content is preserved, only container/wrapper structure is unified).
  - Modifying historical task logs under `docs/tasks/`.
  - Introducing any new non-TypeScript language stacks.

## 6. References & External Context

- [ADR 0038](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0038-host-native-workflow-entries.md): Host-Native Entries for Canonical Workflows
- [ADR 0036](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0036-decommission-laravel-php-stack-focus-typescript.md): Decommission Laravel / PHP Stack and Dedicate Context Factory to TypeScript Ecosystem
- [ADR 0017](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/0017-ide-bridging-and-symlink-synchronization-architecture.md): IDE Bridging and Symlink Synchronization Architecture
- [orchestrator/SHARED.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/orchestrator/SHARED.md): Shared Orchestration Contract

## 7. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | `skills/workflow-entries/` | verified | 12 wrapper skill folders exist merely as adapters pointing to root `workflows/*.md` | Redundant wrapper layer; can be merged into `skills/workflows/<slug>/SKILL.md` |
| E-02 | Root directory | verified | `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules` clutter the root | Purge all model-specific root files; `orchestrator/SHARED.md` and `README.md` are the sole sources of truth |
| E-03 | `app/cli/commands/doctor.mjs` | verified | Diagnostic still asserts `flutter` unsupported stack | Lingering multi-stack check to eliminate |
| E-04 | `rules/typescript/frameworks/` | verified | Separate rules for Next.js, SolidJS, React with framework detection | Unified TypeScript catalog; remove framework selection logic |

### Unknowns and Blockers

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | How should workflows under `skills/workflows/` be formatted? | decision | User | no | Confirmed: First-class skill directories (`skills/workflows/<slug>/SKILL.md`). Merges the canonical workflow and entry into one single authoritative file per workflow with YAML frontmatter, eliminating the dual split. |
| U-02 | Which exact root files should be removed, and where should agent instructions live? | decision | User | no | Confirmed: Remove all model-specific root files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/*` adapter files). `orchestrator/SHARED.md` and `README.md` become the sole model-neutral sources of truth. |
| U-03 | Exactly what does eliminating selecting languages/frameworks encompass regarding `rules/typescript/frameworks/`? | decision | User | no | Confirmed: Unified TypeScript catalog: Treat TypeScript as the sole, hardcoded environment without `--stack` flags or selection prompts. Framework guidelines remain standard TypeScript references, but framework-filtering logic and multi-stack checks are completely removed. |

### Discovery Handoff

- **Allowed recipients:** `grounding`, `grill`
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`
- **Ready for grill:** yes
- **Context content hash:** verified
