---
name: plan-review
description: Audit an implementation plan in a fresh session before execution to verify acyclic dependencies, disjoint parallel file scopes, cold-start executability, and acceptance criteria test mapping (/plan-review, [PLAN_REVIEW]).
---

# Plan Review: Pre-Execution Implementation Plan Audit

Audit an existing implementation plan artifact under `docs/tasks/` in a fresh session *before any code execution begins*.

## Purpose & Why Plan Review Exists

When an agent plans and immediately begins execution, it grades its own homework. Structural plan defects — cyclic unit dependencies, overlapping file scopes between parallel units, missing acceptance criterion test coverage, and incomplete context packets — only surface halfway through execution or at worktree merge time, causing merge collisions, rework, and hallucinated fixes.

The `plan-review` skill establishes an independent, pre-execution quality gate that evaluates a task plan cold-start.

## Workflow

Follow this systematic 4-gate review procedure:

### Gate 1: Deterministic DAG & Scope Validation

Execute the deterministic plan checker script against the target task directory:

```bash
node scripts/context.mjs plan:check <task-dir>
```

Verify:

- **Acyclic Dependency Graph:** Topological sort succeeds with zero cycles in `depends_on` relationships.
- **Disjoint Parallel Scopes:** All units that share a phase and are marked as parallelizable (or have no directed dependency between them) have completely disjoint declared `**In scope:**` file boundaries.
- **Preflight & Rule Binding Check:** `node scripts/context.mjs plan:check <task-dir>` validates that rule bindings compile deterministically and `<language_rules>` blocks contain valid directive IDs, modes, and hashes.
- **Artifact Existence:** Every phase directory contains a valid `phase.md` and atomic `unit-*.md` files.

If Gate 1 fails, **HALT** with status `CHANGES REQUIRED`. Report the offending cycles and file collisions. Do not proceed to subjective checks until the graph and scopes are mathematically valid.

### Gate 2: Acceptance Criteria Traceability Audit

Inspect the master plan artifact (`README.md`):

1. **Completeness:** Ensure every requirement from the underlying context specification or ADR maps to a distinct Acceptance Criterion (`AC-XX`).
2. **Traceability:** Check the Acceptance Criteria table in the master plan. Every single AC must specify:
   - Specific Unit ID(s) delivering the capability.
   - Specific automated test or verification command verifying the criterion.
   - Measurable, binary pass/fail condition.
3. **No Orphan Criteria:** Confirm there are no acceptance criteria left unassigned or deferred to "future work" without explicit ADR justification.

### Gate 3: Cold-Start Executability & Context Packet Inspection

Inspect every individual unit file (`phase-*/unit-*.md`):

1. **Context Packet Sufficiency:** The unit must copy in relevant types, schemas, and current-state evidence rather than relying on session memory or naked links like "see master plan". A fresh agent session must be able to execute the unit cold.
2. **Worktree & Branch Allocation:** Verify that the unit explicitly declares its dedicated `branch` and `worktree` path in frontmatter and status block. Confirm that no two units share the same worktree directory and that the hierarchy matches `task/<id>/<phase-slug>/<unit-slug>`.
3. **Strict Scope Fence:**
   - `**In scope:**` lists exact file paths and functions.
   - `**Out of scope:**` explicitly fences adjacent systems and avoids scope creep.
4. **Actionable Steps:** Step-by-step instructions are concrete and testable, not vague directives like "handle errors properly" or "write clean code".
5. **Explicit Rollback:** Reversible rollback strategy documented for every unit.
6. **Language Rule Binding & Precedence:** The unit's Context Packet must contain a non-empty `<language_rules>` block positioned immediately before `## Steps`. Ensure the rules match the touched file scope with stable directive IDs (e.g. `[directive:id][mode:mode] path`), modes, and content hashes (never a generic blank block or bloated catalog dump). Confirm that no planned step contradicts those language rules. If an active human waiver is cited, verify it has a valid human authority (`authorizedBy`), active date bounds, and exact matching scope (no wildcards or self-approval).

### Gate 4: Test Justification & Type Audit

Audit the `## Verification` section of each unit:

1. **No Naked Test Declarations:** Reject generic statements like "add tests" or "verify manually".
2. **Typed Verification:** Every unit must declare its specific test type(s) justified by what actually changes:
   - Logic isolated in function/module → **unit tests**.
   - Cross-boundary communication (HTTP/DB/Process) → **integration tests**.
   - SOLID boundaries or dependency direction → **architecture tests**.
   - Public API, schema, or CLI surface change → **contract tests**.
   - Data schema or state alterations → **migration tests** (forward and rollback).
3. **Concrete Test Cases:** Each unit must specify at least two explicit test scenarios (e.g. happy path + error/boundary condition).

---

## Plan Audit Report Format

Produce a structured report at the conclusion of the review:

```markdown
# Plan Review Report: [Task Title]

- **Task Directory:** `docs/tasks/...`
- **Result:** [APPROVED / CHANGES REQUIRED]
- **Deterministic Check:** [PASS / FAIL] (Exit code: 0)

## Audit Summary

| Gate | Check | Status | Details |
| :--- | :--- | :--- | :--- |
| Gate 1 | Deterministic DAG & Scopes | PASS / FAIL | Cycle count: 0, Overlaps: 0 |
| Gate 2 | AC Traceability | PASS / FAIL | N/N criteria mapped to tests |
| Gate 3 | Cold-Start Context Packets | PASS / FAIL | All units self-contained |
| Gate 4 | Test Justification | PASS / FAIL | Typed and justified |

## Findings & Recommendations

### Blocking Issues (if any)
1. ...

### Suggested Refinements (non-blocking)
1. ...

## Verdict & Next Action
- If **APPROVED**: Ready for `/execute`.
- If **CHANGES REQUIRED**: Developer/planner must resolve blocking findings before execution begins.
```
