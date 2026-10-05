---
title: "Orchestrator Precedence & Shared Contract"
type: unit
parent: "0002/phase-01"
unit: "01.01"
branch: "task/0002/phase-01/orchestrator-precedence"
worktree: ".worktrees/0002/phase-01/orchestrator-precedence"
status: verified
created: "2026-10-05"
tags: [task, unit, contract, orchestrator]
depends_on: []
parallelizable_with: ["01.02"]
---

# Unit 01.01: Orchestrator Precedence & Shared Contract

> Phase: 0002/phase-01 · Depends on: none · Parallelizable with: 01.02
> Worktree: .worktrees/0002/phase-01/orchestrator-precedence · Branch: task/0002/phase-01/orchestrator-precedence

## Objective

Update the authoritative shared orchestration contract (`orchestrator/SHARED.md`) to formally establish the authority hierarchy and conflict order: language and framework rules strictly supersede procedural plan implementation steps during code generation.

## Context packet

- Current state: `orchestrator/SHARED.md` defines conflict order as "Follow system/user instructions first, then repository instructions, this contract, applicable rules, and finally skill defaults." However, it does not explicitly define the relationship between procedural plan steps and language rules.
- Acceptance criteria: AC-01 (`orchestrator/SHARED.md` establishes that language rules strictly supersede conflicting procedural plan steps).
- Decision ledger: D-01, D-03 in ADR 0027.

<language_rules>
- `rules/global/architecture-conformance.md`: Preserve declared authority hierarchy (User > ADR > Contracts > Rules).
- `rules/global/evidence-and-claims.md`: Ensure all stated invariants cite authoritative ADR and contract sources.
</language_rules>

## Preconditions

- Dedicated git worktree provisioned at `.worktrees/0002/phase-01/orchestrator-precedence`.
- Clean branch cut from `task/0002/phase-01`.

## Scope

**In scope:** `orchestrator/SHARED.md`
**Out of scope:** Templates (`docs/templates/*`), Skills (`skills/*`), scripts.

## Steps

1. Inspect `orchestrator/SHARED.md` sections `## Working contract` and `## Conflict order`.
2. In `## Working contract`, add explicit directive: "Enforce active language rule binding across all task execution units. Code generation must adhere strictly to declared stack standards; procedural checklists must not supersede framework rules."
3. In `## Conflict order`, add explicit invariant: "If an implementation step in a plan and an applicable language rule (`<language_rules>`) conflict, the language rule strictly takes precedence."
4. Verify formatting and consistency across the document.

## Verification

- Test type: Contract & Architecture inspection.
- Case: Confirm that `orchestrator/SHARED.md` clearly states language rule precedence over plan steps.
- Command: `grep -n "takes precedence" orchestrator/SHARED.md` (PASS: line 51)
- Files modified: `orchestrator/SHARED.md`
- Pre-screening review: PASS (0 scope leaks, 0 SOLID violations)

## Rollback

Revert modifications to `orchestrator/SHARED.md` using `git checkout orchestrator/SHARED.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-01
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
