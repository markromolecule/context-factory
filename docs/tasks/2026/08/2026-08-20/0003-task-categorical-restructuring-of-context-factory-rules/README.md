---
title: "Categorical Restructuring of Context Factory Rules"
type: task
status: completed
created: "2026-08-20"
tags: [task, discovery, refactor, rules, architecture, taxonomy]
---

# Categorical Restructuring of Context Factory Rules

## Outcome

Restructure the 30 context factory rules in `rules/` from broad buckets (`global`, `backend`, `frontend`, `typescript`) into 6 highly specific, purpose-driven domain categories:
1. `rules/global/` (Governance & Core Standards — 7 rules)
2. `rules/database/` (Data Persistence, Schema, Queries, Indexing & Testing — 4 rules)
3. `rules/backend/` (API Modules, Routes, Controllers, Services & API Access — 4 rules)
4. `rules/typescript/` (Type Safety, Async Discipline, Validation, Errors & Modules — 5 rules)
5. `rules/hooks/` (Custom Hooks, Query Hooks, Mutation Hooks & Zustand Stores — 4 rules)
6. `rules/ui/` (Frontend Design, Components, Forms, Dialogs, Feedback & Structure — 6 rules)

## Pre-planning record

### Actors and goals
- **Developer / Agent:** Needs immediately recognizable, highly specific rule categories when authoring or reviewing code (e.g., distinguishing database query mechanics from HTTP routing, or state/hook lifecycles from UI design/styling).
- **Context Resolver Engine:** Needs accurate folder taxonomy to cleanly categorize and resolve rules without loading broad, irrelevant rule buckets.

### Domain language
- **Domain Category:** A cohesive subfolder under `rules/` grouping rules sharing a single technical responsibility.
- **Taxonomy:** The classification scheme organizing rules into 6 distinct domain boundaries (`global`, `database`, `backend`, `typescript`, `hooks`, `ui`).

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Developer writing database queries | Needs persistence & query rules | Resolves `rules/database/*` without pulling HTTP/routing rules | Clean isolation | Verified |
| SC-02 | Developer writing TanStack Query / React hooks | Needs client state & mutation rules | Resolves `rules/hooks/*` without pulling pure CSS/UI styling rules | Clean isolation | Verified |
| SC-03 | Context Doctor integrity verification | Rule folders reorganized | All 30 rules mapped in `context-manifest.json`, `docs/Rules.md`, `context-lock.json`, and agent contracts | `doctor` passes 100% | Verified |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| DEC-01 | Rule Category Taxonomy Selection | Adopt 6 Specialized Domain Categories: `rules/global/`, `rules/database/`, `rules/backend/`, `rules/typescript/`, `rules/hooks/`, `rules/ui/`. | Provides granular separation of concerns, clearer directives, and prevents broad context pollution. | Retaining coarse 4-bucket structure; 7-bucket micro-fragmentation. | `rules/` |
| DEC-02 | Folder Naming for Client Data & Hooks | Use `rules/hooks/` for client data hooks (`custom-hooks.md`, `query-hooks.md`, `mutation-hooks.md`, `zustand-store.md`) and `rules/ui/` for frontend presentation and layout. | Matches standard modern React/TanStack terminology and cleanly separates state lifecycle from visual UI. | `rules/state/`, `rules/client-state/`. | `rules/hooks/`, `rules/ui/` |

### Unknowns and blockers
- None (All architectural unknowns resolved during grill discovery).

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | Category Reorganization (DEC-01, DEC-02) | Rules relocated into `rules/global/`, `rules/database/`, `rules/backend/`, `rules/typescript/`, `rules/hooks/`, `rules/ui/`. Old `rules/frontend/` removed. | `rules/` filesystem | Directory inspection | Verified |
| AC-02 | Manifest & Lock Sync | `context-manifest.json` updated with all new rule paths; `context-lock.json` regenerated. | Manifest & Lock | `node scripts/harness-cli.mjs lock --check` | Verified |
| AC-03 | Vault Links & Docs | `docs/Rules.md` and all wiki links across markdown files updated to point to new rule paths. | `docs/` | `node scripts/harness-cli.mjs lint` | Verified |
| AC-04 | Contracts Sync | `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md` updated. | Root entrypoints | File inspection | Verified |
| AC-05 | Full Health & Evals | Pass all test suites, context resolution checks, and doctor validation. | Evaluation suite | `node scripts/harness-cli.mjs doctor` | Verified |

## Scope
- Relocating rule files into the 6 domain folders.
- Updating `context-manifest.json`, `docs/Rules.md`, `evals/`, and entrypoint contracts.
- Regenerating `context-lock.json` and verifying via `scripts/harness-cli.mjs doctor`.

## Non-goals
- Modifying the text content or rule logic inside individual rule files.

## Constraints and decisions
- Must conform to `orchestrator/SHARED.md` and pass `validate-context.mjs`.

## Phases

- [x] `phase-01-boundary-analysis.md` — Phase 1 — Boundary Analysis & Taxonomy Alignment
- [x] `phase-02-vertical-slice-refactoring.md` — Phase 2 — Rule File Relocation & Manifest Sync
- [x] `phase-03-integration-tests.md` — Phase 3 — Verification, Lock Generation, and Quality Gate

## Verification

```bash
# 1. Validate context manifest, schemas, frontmatter, and wiki links
node scripts/harness-cli.mjs lint
# Output: Context Factory 3.5.0 is valid: 30 rules, 12 skills, 8 workflows, 11 agent resources, 1 knowledge items, 9 evaluations, 134 Markdown files.

# 2. Check context lock integrity
node scripts/harness-cli.mjs lock --check
# Output: Context lock is current (sha256:3456edc534afa30eb255525dc64d1f572ba25c13cf1b06d4f687b0950a84c8da).

# 3. Execute full test & evaluation suite
node scripts/harness-cli.mjs eval
# Output: 12/12 evaluations passed in 47ms.

# 4. Check domain-specific context resolution isolation
node scripts/harness-cli.mjs resolve "optimize database query using kysely and cursor pagination"
node scripts/harness-cli.mjs resolve "custom hook and mutation hook with optimistic update"
node scripts/harness-cli.mjs resolve "frontend dialog and form validation styling"

# 5. Execute doctor health check
node scripts/harness-cli.mjs doctor
# Output: Context Factory is healthy.
```

## Deviations
- None.

## Result
Reorganized 30 rules into 6 distinct domain categories (`global`, `database`, `backend`, `typescript`, `hooks`, `ui`), updated all manifest and contract references, regenerated lock digest, and passed all quality gates.
