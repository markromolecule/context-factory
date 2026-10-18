---
name: adr
description: Analyze and record a durable architecture choice using repository evidence, existing decisions, explicit tradeoffs, migration impact, and verification criteria (/adr, [ADR]).
---

# Architecture Decision Record (ADR)

Analyze, evaluate, and record durable architectural decisions governing system boundaries, cross-module contracts, data models, third-party dependencies, and design invariants.

Do not write production code or execute the implementation while this skill is active. Stop before coding and hand off the accepted decision to `/plan` or the Architect/PM agent.

## When to Author an ADR vs When NOT to Author

### When to Author an ADR

- **System & Module Boundaries:** Introducing, splitting, merging, or reorganizing packages, services, or domain modules.
- **Dependency Direction & Contracts:** Introducing ports and adapters, changing dependency inversion strategies, or modifying public interface contracts.
- **Persistence & Data Modeling:** Adopting or migrating database engines, schema paradigms, indexing strategies, or data lifecycles.
- **Technology & Library Adoption:** Adding, replacing, or deprecating major frameworks, ORMs, libraries, or external protocols.
- **Cross-Cutting Concerns:** Establishing system-wide protocols for authentication, authorization, error handling, telemetry, logging, or caching.
- **Superseding Prior Decisions:** Explicitly deprecating or modifying a previously accepted architecture decision when constraints or requirements evolve.

### When NOT to Author an ADR

- **Routine Implementation Details:** Refactoring internal functions, local variable naming, CSS tweaks, or private helper reorganization within a single module.
- **Unresolved Business Requirements:** Debating product scope or user stories (use `grill` or `context` instead).
- **Transient Bug Fixes:** Standard bug patches that comply with existing architectural rules (use `/fix` or `workflow-defect-resolution`).
- **Undecided Speculation:** Capturing vague ideas without concrete repository evidence or constraints (use `grill` or a prototype spike first).

## Lifecycle States & Directory Placement

Store all architecture decisions under `docs/decisions/` using the sequential naming convention:
`docs/decisions/NNNN-<kebab-case-slug>.md` (e.g. `docs/decisions/0040-event-driven-telemetry-pipeline.md`).

### Lifecycle States

1. **`proposed`**: The ADR is drafted and undergoing review or trade-off evaluation. Not yet authorized or binding.
2. **`accepted`**: The decision is approved, actively governing implementation, and binding across all downstream tasks.
3. **`superseded`**: The decision was replaced by a subsequent ADR. MUST carry bidirectional links:
   - In superseded ADR: `> [!WARNING] Superseded by [[docs/decisions/0039-first-class-workflow-skills-and-typescript-consolidation|0039 — First-Class Workflow Skills]]`
   - In new ADR: `Supersedes [[docs/decisions/0007-simplify-styling-and-taste|0007 — Simplify Styling and Remove Taste Layer]]`
4. **`deprecated`**: The decision is obsolete, decommissioned, or retired without a direct successor.

## Procedure: The 1-3-1 Architecture Decision Workflow

### Step 1: Evidence-Backed Problem Framing (The "1" Problem)

1. **Inspect Active Context:** Review `docs/ARCHITECTURE.md`, `knowledge/principles/` (SOLID principles), existing ADRs in `docs/decisions/`, and current source code boundaries.
2. **State One Decision Problem:** Define the architectural problem clearly in one concise section using concrete repository evidence (source files, line references, benchmark results, or dependency analysis).
3. **Establish Explicit Constraints & Drivers:**
   - Business and technical drivers (e.g., latency budget, data consistency, team familiarity, zero-downtime requirement).
   - Hard constraints (e.g., zero external network calls in hot paths, TypeScript strict compliance, backwards-compatible public contracts).
   - Separate verified facts from assumptions.

### Step 2: Comparative Trade-Off Analysis (The "3" Viable Options)

1. **Formulate Three Materially Different Approaches:**
   - **Option 1 (Minimal / Incremental):** The leanest possible approach solving the immediate problem (e.g., localized domain colocation, pragmatic adapter).
   - **Option 2 (Standard / Modular):** The established architectural pattern (e.g., dedicated port/adapter boundary, clean service abstraction).
   - **Option 3 (Comprehensive / Decoupled):** The highly extensible or decoupled architecture (e.g., event-driven pub/sub, separate sub-package).
   - *Rule:* Options must be realistic, deployable candidates. Do not pad the list with obvious strawmen.
2. **Evaluate Options with an Explicit Trade-Off Matrix:**
   Compare the three options across five dimensions:
   - **SOLID & Architectural Cleanliness:** Single responsibility, dependency direction, contract stability.
   - **Complexity & Cognitive Overhead:** Lines of code, abstraction density, onboarding difficulty.
   - **Performance & Resource Impact:** CPU, latency, memory footprint, async waterfalls.
   - **Blast Radius & Migration Cost:** Affected files, breaking changes, consumer refactoring effort.
   - **Reversibility / Exit Cost:** Is this a two-way door (easy to revert) or a one-way door (high switching cost)?

### Step 3: Justified Recommendation & Decision (The "1" Recommendation)

1. **Select the Recommended Approach:** Recommend the smallest, most reversible approach that completely satisfies the problem drivers and hard constraints without speculative overengineering.
2. **Document Rejection Rationale:** Explicitly state the technical and operational reasons why the two alternative options were rejected.
3. **Define Architectural Invariants (`INV-XX`):**
   - Translate the accepted decision into numbered, testable invariants (e.g., `INV-01`, `INV-02`).
   - State exact boundaries, forbidden dependency directions, and required interface shapes.

### Step 4: Downstream Impact, Migration, and Rollback

1. **Identify Affected Seams:**
   - List touched files, new files, and affected public contracts.
   - Name affected consumer packages, modules, or client surfaces.
2. **Define Migration & Rollout Strategy:**
   - Detail whether the change requires phased rollout, feature flags, database backfills, or parallel running.
3. **Establish Rollback Triggers & Plan:**
   - Define exact failure conditions or metric degradations (e.g., latency spikes > 20%, migration data mismatch) that trigger immediate rollback.
   - Document the step-by-step procedure to back out the architectural change safely.

### Step 5: Persistence, Indexing & Verification

1. **Allocate the Next Sequential Number:** Check `docs/decisions/` to determine the highest existing 4-digit ID and increment it (e.g., `0040`).
2. **Author the ADR File:** Write the file using `docs/templates/Decision.md` formatting:
   - YAML frontmatter with `title`, `type: decision`, `status`, `created`, `tags`.
   - Title heading: `# NNNN — <Title>`
   - Sections: `## Context`, `## Options considered`, `## Decision`, `## Consequences`, `## Validation and review date`.
3. **Synchronize Decisions Ledger:** Append the new ADR with its wiki link to `docs/decisions/README.md`.
4. **Define Validation Criteria:** Specify automated tests, linting rules, or architecture checks that verify adherence to the new invariants.

## Completion & Handoff

An ADR session is complete when:

- The ADR is written to `docs/decisions/NNNN-<slug>.md` with all required sections populated.
- Exactly three viable alternatives were evaluated with a trade-off matrix.
- Concrete architectural invariants (`INV-XX`) and reversibility triggers are established.
- `docs/decisions/README.md` is updated with the new record.
- **No production code is modified.** Present the decision to the user or hand off to `/plan` for phased task scaffolding.
