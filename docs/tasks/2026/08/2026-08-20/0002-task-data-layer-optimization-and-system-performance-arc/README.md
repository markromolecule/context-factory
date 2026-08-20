---
title: "Data Layer Optimization and System Performance Architecture Rules"
type: task
status: completed
created: "2026-08-20"
tags: [task, discovery, rules, backend, performance, optimization, async, frontend]
---

# Data Layer Optimization and System Performance Architecture Rules

## Outcome

Establish definitive, end-to-end performance and optimization rules for the Context Factory system architecture covering:
1. Data access layer query optimization (Prisma vs. Kysely division of labor in complex queries, bulk operations, and index alignment).
2. High-performance querying mechanics (deterministic pagination, multi-dimensional filters, facets, limits, and sort indexing).
3. Async/await and promise execution patterns (concurrency pooling, stream processing, abort signal propagation, and transaction isolation).
4. Frontend data lifecycle and custom mutation hook patterns (TanStack Query mutations, optimistic updates with reliable rollback, selective invalidation, and custom hook composition).

## Pre-planning record

### Actors and goals
- **Backend Engineer:** Needs unambiguous guidelines on when to use Prisma vs. Kysely, how to structure complex queries without N+1 or high memory overhead, and how to write performant pagination and aggregation queries.
- **Frontend Engineer:** Needs precise standards for constructing custom hooks and TanStack mutation hooks with safe optimistic updates, error rollbacks, and narrow cache invalidation.
- **System Architect:** Needs enforceable invariants preventing database saturation, unindexed full-table scans, connection exhaustion, and unhandled promise rejections.
- **AI Agent / Context Engine:** Needs precise rule files in `rules/` with trigger conditions that automatically load when developing backend data layers or frontend custom/mutation hooks.

### Domain language
- Canonical glossary items:
  - **Cursor/Keyset Pagination:** Deterministic sequential data traversal using ordered tuples `(sort_col, id)` and index seek rather than `OFFSET`.
  - **ESR Rule:** Index composite ordering standard: Equality filters first, Sort keys second, Range filters third.
  - **Concurrency Pool Budget:** Hard limits on concurrent asynchronous I/O tasks to avoid database connection exhaustion.
  - **Optimistic Mutation Snapshot:** Immediate client cache patch paired with pre-mutation snapshot retention for safe rollback on network or server error.
  - **N+1 Elimination:** Structuring relational data fetching via explicit joins, CTEs, or batched IN-queries instead of iterative row loops.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | Backend querying 50k+ rows with filters & sort | Complex relation filtering required | Uses cursor/keyset query with covered composite index; rejects unindexed sort | Fallback to paginated batches with strict limit cap | Verified |
| SC-02 | Faceted search with counts across multiple dimensions | High-traffic search endpoint | Separate facet count query or CTE to avoid full table scans | Return bounded aggregations or cached facets | Verified |
| SC-03 | Concurrent async batch processing | 100 external API / DB calls | Concurrency pool limiter (`p-limit`, concurrency 10-25) with explicit AbortSignal | Graceful cancellation on client disconnect; no DB pool starvation | Verified |
| SC-04 | Frontend optimistic mutation | User edits an item in an active query cache | Immediate UI update, background mutation; rollback cache on failure | Revert to previous snapshot on error, trigger toast feedback | Verified |
| SC-05 | Custom hook state separation | Complex domain UI with async side effects | Isolate state/logic into custom hook, memoize outputs, avoid server cache syncing in local state | Clean JSX rendering, zero redundant re-renders or cache drift | Verified |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| DEC-01 | Rule file placement and modularity | Adopt Hybrid Architecture: new `query-optimization-and-pagination.md` (backend) & `custom-hooks.md` (frontend), plus targeted enhancements to `async-discipline.md`, `mutation-hooks.md`, and `data-access-via-db.md`. | Maximizes specificity in context resolver matching while keeping core discipline files focused. | Monolithic single rule file; cramming into existing files without new specialized topics. | `rules/backend/`, `rules/frontend/`, `rules/typescript/` |
| DEC-02 | Prisma vs. Kysely data layer boundary | Strict Division: Prisma exclusively owns schema definitions, DDL migrations, and type generation (`prisma-kysely`). Kysely is the sole runtime query builder for all data access queries (reads, writes, joins, aggregations, CTEs, dynamic filters). | Completely eliminates Prisma Client runtime overhead, object hydration latency, and accidental N+1 nested queries while providing explicit, index-aligned SQL. | Prisma for simple CRUD + Kysely for complex; Prisma-first with raw fallback. | `rules/backend/query-optimization-and-pagination.md`, `rules/backend/data-access-via-db.md` |
| DEC-03 | Pagination, filtering, facets, and limits standard | Strict Performance Standard: Cursor/keyset pagination as default for scale/feeds (`limit + 1` for `hasMore`); bounded offset only for shallow admin tables (max offset 10k, max limit 100); mandatory limit capping in DTOs; ESR composite indexing rule; decouple heavy facet/total counts from list queries. | Prevents full-table scans, memory exhaustion, and latency spikes at scale. | Uncapped offset pagination; inline subquery full counts. | `rules/backend/query-optimization-and-pagination.md` |
| DEC-04 | Async, promises, and concurrency control standard | High-Efficiency Async Standard: Waterfall elimination via `Promise.all`/`allSettled`; bounded concurrency pooling (`p-limit`, 10–25 concurrency) for batch I/O to protect DB connection pools; end-to-end `AbortSignal` propagation to DB queries; zero external I/O inside open DB transactions; contained background tasks with `void` and local catch. | Prevents connection pool exhaustion, transaction lock contention, dangling queries, and latency bottlenecks. | Unbounded `Promise.all`; long-lived transactions with external HTTP calls. | `rules/typescript/async-discipline.md` |
| DEC-05 | Frontend custom hooks & mutation hooks architecture | Strict Hook Layering & Deterministic Lifecycle: Isolate UI from logic; memoize return handlers; 3-stage optimistic mutation lifecycle (`onMutate` snapshot & patch, `onError` rollback & feedback, `onSettled` narrow invalidation); no server cache sync in local `useState`; no blind retries on non-idempotent mutations. | Guarantees zero UI glitching, safe error recovery, and clean component decoupling. | Invalidate-on-success only; ad-hoc component mutations. | `rules/frontend/custom-hooks.md`, `rules/frontend/mutation-hooks.md` |

### Unknowns and blockers
- None (All architectural unknowns resolved and verified).

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | Backend Query Optimization (DEC-02) | New rule `query-optimization-and-pagination.md` defines Kysely runtime standards, explicit column projection, zero N+1 queries, and index alignment. | `rules/backend/query-optimization-and-pagination.md` | `node scripts/harness-cli.mjs lint` | Verified |
| AC-02 | Pagination, Filters & Facets (DEC-03) | Enforce cursor/keyset pagination as default, bounded offset caps, DTO limit validation (`min(1).max(100)`), and ESR indexing. | `rules/backend/query-optimization-and-pagination.md` | `node scripts/harness-cli.mjs lint` | Verified |
| AC-03 | Async & Concurrency Discipline (DEC-04) | Enrich `async-discipline.md` with waterfall elimination, `p-limit` connection protection, AbortSignal propagation, and zero I/O inside transactions. | `rules/typescript/async-discipline.md` | `node scripts/harness-cli.mjs lint` | Verified |
| AC-04 | Custom Hooks Architecture (DEC-05) | New rule `custom-hooks.md` establishing single responsibility, referential stability, and server-state isolation. | `rules/frontend/custom-hooks.md` | `node scripts/harness-cli.mjs lint` | Verified |
| AC-05 | Mutation Hooks & Optimistic UI (DEC-05) | Enrich `mutation-hooks.md` with deterministic 3-stage optimistic lifecycle, rollback snapshots, and idempotency rules. | `rules/frontend/mutation-hooks.md` | `node scripts/harness-cli.mjs lint` | Verified |
| AC-06 | ADR Documentation | Document durable decision in `docs/decisions/0010-data-layer-query-optimization-and-performance-architecture.md`. | `docs/decisions/0010-data-layer-query-optimization-and-performance-architecture.md` | `node scripts/harness-cli.mjs lint` | Verified |
| AC-07 | Context Manifest & Lock Synchronization | Update `context-manifest.json` with new rules, regenerate `context-lock.json`, and pass all evals in `doctor`. | `context-manifest.json`, `context-lock.json` | `node scripts/harness-cli.mjs doctor` | Verified |

## Scope
- Created `rules/backend/query-optimization-and-pagination.md`.
- Created `rules/frontend/custom-hooks.md`.
- Enhanced `rules/typescript/async-discipline.md`.
- Enhanced `rules/frontend/mutation-hooks.md`.
- Enhanced `rules/backend/data-access-via-db.md`.
- Created ADR `docs/decisions/0010-data-layer-query-optimization-and-performance-architecture.md`.
- Updated `context-manifest.json` and synced `context-lock.json`.
- Ran full context factory validation suite (`harness-cli.mjs doctor`).

## Non-goals
- Modifying runtime application packages or business logic outside the context factory repository.
- Changing schema migration engines or replacing TypeScript tooling.

## Constraints and decisions
- Conforms to `orchestrator/SHARED.md` and passes `validate-context.mjs`.
- Governed by ADR 0010.

## Phases

- [x] `phase-01-discovery-and-scenarios.md` — Phase 1 — Discovery, Scenarios, and Boundary Analysis
- [x] `phase-02-architecture-and-contracts.md` — Phase 2 — Architecture, Contracts, and Rule Authoring
- [x] `phase-03-implementation-and-tests.md` — Phase 3 — Incremental Implementation and Tests
- [x] `phase-04-verification-and-release.md` — Phase 4 — Verification, Quality Gates, and Release

## Verification

```bash
# 1. Validate context manifest, schemas, frontmatter, and wiki links
node scripts/harness-cli.mjs lint
# Output: Context Factory 3.5.0 is valid: 30 rules, 12 skills, 8 workflows, 11 agent resources, 1 knowledge items, 9 evaluations, 130 Markdown files.

# 2. Check context lock integrity
node scripts/harness-cli.mjs lock --check
# Output: Context lock is current (sha256:d20ec23f1eb118abacdf7156d9d0969ae45decbf5a7467aa0cbadd951dda33d3).

# 3. Execute full test & evaluation suite
node scripts/harness-cli.mjs eval
# Output: 12/12 evaluations passed in 44ms.

# 4. Execute doctor health check
node scripts/harness-cli.mjs doctor
# Output: Context Factory is healthy.
```

## Deviations
- None. All tasks executed exactly according to the approved implementation plan.

## Result
All rules, ADRs, manifest entries, and contract adapters successfully implemented, verified, locked, and passing all quality gates.
