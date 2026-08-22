---
title: "Language-Scoped Rules Architecture & TypeScript Folder Restructuring"
type: task
status: completed
created: "2026-08-22"
tags: [task, rules, typescript, architecture, refactor]
context: "docs/context/refactors/language-scoped-rules-restructure.md"
---

# Language-Scoped Rules Architecture & TypeScript Folder Restructuring

## Outcome

Restructure the `rules/` directory to establish a multi-language taxonomy where only universal `global/` rules and language scopes (`typescript/`, future `php/`) are exposed at the root level. Consolidate TypeScript domain rules (`backend`, `database`, `hooks`, `ui`) and core TS standards (`common`) under `rules/typescript/`, synchronizing all manifest entries, maps of content, entrypoint contracts, and evaluation suites with verified lock integrity.

## Pre-planning record

### Context Specification
- Ingested grilled context specification: [[docs/context/refactors/language-scoped-rules-restructure|docs/context/refactors/language-scoped-rules-restructure.md]] (`status: ready`).

### Actors and goals
- **AI Agent / IDE:** Needs a deterministic, modular rule directory structure to load language-specific rules cleanly when working on TypeScript projects without polluting root rules.
- **Factory Architect / Developer:** Wants clean preparation for multi-language rule sets (e.g. PHP / Laravel, Python) while keeping universal rules in `rules/global/`.

### Domain language
- **Language Scope:** Top-level directory directly under `rules/` representing a programming language or universal scope (`global/`, `typescript/`, `php/`).
- **Core Common Rules:** Foundational language standards (type safety, runtime validation, error handling, async, imports) placed in `rules/<language>/common/`.
- **Domain Rule Sets:** Subsystem-specific rules (backend, database, hooks, ui) scoped within their respective language directory (`rules/<language>/<domain>/`).

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Developer or agent inspects `rules/` directory | Factory repository checked out | Only `global/` and `typescript/` exist at `rules/` root | If old folders remain at root, cleanup step deletes empty dirs | Verified |
| SC-02 | Developer inspects `rules/typescript/` | Rule reorganization completed | Subfolders `common/`, `backend/`, `database/`, `hooks/`, `ui/` contain their respective markdown rules | All 30 rule files exist and retain integrity | Verified |
| SC-03 | Context runner resolves rules for a request | User asks for frontend styling | Harness resolves `rules/typescript/ui/frontend.md` correctly | Manifest & evals aligned | Verified |
| SC-04 | Context doctor performs health check | Reorganization & lock updated | `node scripts/context.mjs doctor` passes 100% with 30 rules and 0 broken links | If link breaks, doctor flags offending file | Verified |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| DEC-01 | Location of `ui/` rules | Relocate `rules/ui/` $\rightarrow$ `rules/typescript/ui/` | UI rules are Next.js / React / TypeScript specific; keeps `rules/` root strictly limited to language scopes | Keeping `rules/ui/` at root | `docs/context/refactors/language-scoped-rules-restructure.md` |
| DEC-02 | Name of core TS rules subfolder | Use `rules/typescript/common/` | Clean, conventional name for general language-level rules (`type-safety.md`, `runtime-validation.md`, etc.) | `rules/typescript/general/`, `rules/typescript/core/` | `docs/context/refactors/language-scoped-rules-restructure.md` |
| DEC-03 | Rule file content changes | Preserve rule contents & filenames identically | Rule text and filenames are well-tested; only physical paths and references change | Renaming rule files | Context spec non-goals |

### Unknowns and blockers
- None. Requirements grilled and resolved in context specification.

---

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | SC-01, DEC-01 | Only `global/` and `typescript/` exist at root of `rules/` | Directory structure migration | `ls -la rules/` | Verified |
| AC-02 | SC-02, DEC-02 | `rules/typescript/` contains `common/`, `backend/`, `database/`, `hooks/`, `ui/` with all 23 language rules intact | File relocations | Check directory contents | Verified |
| AC-03 | DEC-03 | All 7 global rules remain in `rules/global/` | Retain global files | Check `rules/global/` | Verified |
| AC-04 | SC-03, SC-04 | `context-manifest.json` inventory lists all 30 new rule paths | Manifest update | Manifest validation | Verified |
| AC-05 | SC-04 | `docs/Rules.md` updated with new wikilinks and grouped sections | Map of Content update | `node scripts/context.mjs validate` | Verified |
| AC-06 | SC-03 | Root and orchestrator entrypoint contracts updated with new paths | Contract updates | Grep verification across contracts | Verified |
| AC-07 | SC-03, SC-04 | Evaluation test fixtures (e.g. `evals/cases/frontend-styling.json`) updated | Evals update | Evaluation test run | Verified |
| AC-08 | SC-04 | `context-lock.json` regenerated and `node scripts/context.mjs doctor` passes 100% | Lock & Doctor execution | `node scripts/context.mjs doctor` | Verified |

---

## Scope

- Move existing rule files into `rules/typescript/common/`, `rules/typescript/backend/`, `rules/typescript/database/`, `rules/typescript/hooks/`, `rules/typescript/ui/`.
- Clean up old root directories in `rules/`.
- Update `context-manifest.json`.
- Update `docs/Rules.md`.
- Update `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules` and their counterparts in `orchestrator/`.
- Update `evals/cases/frontend-styling.json`.
- Regenerate lockfile and verify `node scripts/context.mjs doctor`.

## Non-goals

- Authoring PHP rules (future work).
- Modifying the text content or frontmatter of the rule files.

---

## Phases

- [x] [[docs/tasks/2026/08/2026-08-22/0002-task-language-scoped-rules-restructure/phase-01-relocate-rule-files|phase-01-relocate-rule-files.md]] — Phase 1: Relocate Rule Files & Organize TypeScript Subfolders
- [x] [[docs/tasks/2026/08/2026-08-22/0002-task-language-scoped-rules-restructure/phase-02-manifest-and-rules-map|phase-02-manifest-and-rules-map.md]] — Phase 2: Update Canonical Manifest and Obsidian Rules Map
- [x] [[docs/tasks/2026/08/2026-08-22/0002-task-language-scoped-rules-restructure/phase-03-contracts-and-evals|phase-03-contracts-and-evals.md]] — Phase 3: Synchronize Agent Entrypoints, Orchestrators, and Evaluation Cases
- [x] [[docs/tasks/2026/08/2026-08-22/0002-task-language-scoped-rules-restructure/phase-04-lockfile-and-doctor-verification|phase-04-lockfile-and-doctor-verification.md]] — Phase 4: Lockfile Regeneration and Comprehensive Doctor Diagnostics

---

## Verification

Executed `node scripts/context.mjs doctor` with zero errors:
- Context Factory 3.6.0 is valid: 30 rules, 10 skills, 10 workflows, 11 agent resources, 1 knowledge items, 9 evaluations, 171 Markdown files.
- Context lock is current (`sha256:b071223ad8ab22e97453b71e1d52ce58e7291a8f1ac8beaa56c241fd988cb0e3`).
- Evaluations: 12/12 passed.

## Result
Completed.
