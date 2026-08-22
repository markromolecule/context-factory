---
title: "Language-Scoped Rules Architecture & TypeScript Folder Restructuring"
type: context
status: ready
created: "2026-08-22"
tags: [context, refactor, rules, typescript, architecture]
feature: "language-scoped-rules-restructure"
---

# Language-Scoped Rules Architecture & TypeScript Folder Restructuring Context Specification

## 1. Overview & Objective

- **Problem Statement:** Currently, domain-specific rule directories (`backend`, `database`, `hooks`, `typescript`, `ui`) sit at the root level of `rules/`, alongside `global/`. This flat top-level structure does not scale when adding language-specific rules for other technology stacks (e.g., PHP / Laravel / Symfony, Python, Go) and makes it difficult to isolate language boundaries.
- **Business / Architecture Value:** Establishes a clean, scalable multi-language taxonomy where only top-level language scopes (e.g., `typescript/`, future `php/`) and universal `global/` rules are visible at the root of `rules/`. Groups existing TypeScript core rules into a dedicated subfolder (`common/` or `general/`).
- **Success Criteria:**
  - Root `rules/` directory contains only `global/` and `typescript/` (and future language folders).
  - Domain rules (`backend/`, `database/`, `hooks/`, and `ui/`) and existing core TS rules (in `common/` or `general/`) are systematically organized under `rules/typescript/`.
  - `context-manifest.json`, `docs/Rules.md`, entrypoint contracts (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`), orchestrator mirrors, and evaluation datasets are synchronized with 0 broken links.
  - `node scripts/context.mjs lock` and `node scripts/context.mjs doctor` pass with 100% valid evaluations and schema checks.

---

## 2. Requirements & Discovery Ledger

### User Story
*As an AI architect / developer configuring the Context Factory, I want domain-specific rules categorized under language-specific directories (such as `rules/typescript/`) so that the factory can seamlessly support multi-language projects (e.g., TypeScript, PHP) without cluttering the root rules directory.*

### Functional Requirements
- [ ] Relocate `rules/backend/` into `rules/typescript/backend/`.
- [ ] Relocate `rules/database/` into `rules/typescript/database/`.
- [ ] Relocate `rules/hooks/` into `rules/typescript/hooks/`.
- [ ] Group existing root `rules/typescript/*.md` files (`type-safety.md`, `runtime-validation.md`, `error-handling.md`, `async-discipline.md`, `module-and-imports.md`) into a dedicated subfolder (e.g. `rules/typescript/common/` or `rules/typescript/general/`).
- [ ] Relocate `rules/ui/` into `rules/typescript/ui/` (or determine its target hierarchy).
- [ ] Update `context-manifest.json` inventory with exact new paths.
- [ ] Update Obsidian Map of Content [[docs/Rules|docs/Rules.md]] with new wikilinks and section structure.
- [ ] Update all root and orchestrator contract files (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`).
- [ ] Update evaluation test fixtures and datasets (e.g., `evals/cases/frontend-styling.json`).
- [ ] Regenerate `context-lock.json` and verify `node scripts/context.mjs doctor` passes cleanly.

### Edge Cases & Failure Modes
- **Orphaned Wikilinks:** If `docs/Rules.md` is not updated, `context.mjs doctor` will fail rule inventory validation.
- **Evaluation Dataset Path Mismatch:** If `evals/cases/` or `evals/datasets/` reference old rule paths (e.g. `rules/ui/frontend.md`), evaluation runs will fail.
- **Contract Desynchronization:** Root contracts and `orchestrator/` mirror files must stay strictly identical in rule mapping.

---

## 3. Technical & Architectural Context

- **Affected Directory Structure:**
  - `rules/`
    - `global/` (retained at root for universal, language-agnostic rules: 1-3-1, security, git commit, etc.)
    - `typescript/`
      - `<core_subfolder>/` (`async-discipline.md`, `error-handling.md`, `module-and-imports.md`, `runtime-validation.md`, `type-safety.md`)
      - `backend/` (`controllers-and-routes.md`, `data-access-via-api.md`, `module-architecture.md`, `service-layer.md`)
      - `database/` (`data-access-via-db.md`, `query-optimization-and-pagination.md`, `schema-db.md`, `testing-data-access-layer.md`)
      - `hooks/` (`custom-hooks.md`, `mutation-hooks.md`, `query-hooks.md`, `zustand-store.md`)
      - `ui/` (`code-organization.md`, `dialogs-and-overlays.md`, `forms-and-validation.md`, `frontend.md`, `interaction-feedback.md`, `next-react-project-structure.md`)
- **Impacted Manifest & Doc Files:**
  - `context-manifest.json`
  - `docs/Rules.md`
  - `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`
  - `orchestrator/AGENTS.md`, `orchestrator/CLAUDE.md`, `orchestrator/CODEX.md`, `orchestrator/GEMINI.md`, `orchestrator/.cursorrules`, `orchestrator/.windsurfrules`
  - `evals/cases/frontend-styling.json`

---

## 4. Scope & Boundaries

- **In Scope:**
  - Moving existing rule files into their target subfolders under `rules/typescript/`.
  - Updating all path references, manifests, doc links, and contracts.
  - Verifying lock file generation and doctor diagnostics.
- **Out of Scope / Non-Goals:**
  - Authoring new PHP rules at this stage (this is architecture preparation for PHP/future languages).
  - Changing the content/text within the individual rule markdown files (unless internal cross-references to rules require updating).

---

## 5. Grilling & Discovery Ledger (Questions & Decisions)

| # | Topic / Question | Status | Decision / Resolution |
|---|---|---|---|
| Q1 | **Target location of `ui` rules:** Should `rules/ui/` move to `rules/typescript/ui/` so that only `global/` and `typescript/` remain at root of `rules/`? | Resolved | Move `rules/ui/` -> `rules/typescript/ui/` so only `global/` and `typescript/` exist at root. |
| Q2 | **Naming of the core TypeScript subfolder:** What should the folder for existing TS rules (`type-safety.md`, `runtime-validation.md`, `error-handling.md`, `async-discipline.md`, `module-and-imports.md`) be named inside `rules/typescript/`? | Resolved | Use `rules/typescript/common/`. |

