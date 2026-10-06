---
title: "Skill Lifecycle Handoffs and Task Git Policy"
type: decision
status: accepted
created: "2026-10-06"
tags: [adr, skills, discovery, planning, execution, git]
supersedes: ["0014", "0024"]
---

# Skill Lifecycle Handoffs and Task Git Policy

## Context

Discovery, planning, review, and execution currently pass full artifact paths directly between skills. `context` hands a context specification to `plan`; `execute` reads and changes task-plan artifacts; and the existing plan and execute contracts prescribe a worktree and branch for every unit. These patterns leave discovery facts and review approval too easy to bypass, and they make a serial task carry unnecessary Git topology.

The accepted constraints are: preserve human approval, test-first work, conformance receipts, and phase checkpoints; make the access boundary declared and linted rather than an orchestrator ACL; keep one task branch as the normal case; use a worktree when concurrent work, unrelated local changes, or long-running isolation warrants it; and retain historical plans without renaming them.

Success means every lifecycle handoff has one owner, a checkable artifact, clear invalidation behavior, and a reproducible execution checkout.

## Options considered

1. **Retain direct artifact reads and per-unit worktrees.** `plan` continues reading context specifications directly and `execute` continues reading plans, while each unit gets a separate branch and worktree. This preserves current implementation behavior and existing examples, but it keeps the requested boundary violations and adds checkout overhead to serial work. Choose this only when every task is expected to execute units concurrently.

2. **Document preferred handoffs without a lint or review packet.** Skills state their intended inputs and outputs in prose, and serial work uses one task branch. This reduces Git overhead, but the boundary can drift unnoticed and execution can begin with a stale or unapproved plan. Choose this only when maintainers accept manual enforcement.

3. **Use owned, freshness-checked handoffs with a conditional worktree.** `grill` releases one discovery brief, `plan-review` alone reads a full plan and issues reviewed packets after human approval, and `execute` consumes packets and writes a ledger. A lint checks declarations and positive forbidden reads. Each task records its branch and checkout decision; worktrees are required only for the documented isolation conditions. This adds small artifact and validation tooling, while providing traceability and keeping serial tasks simple.

## Decision

Adopt Option 3.

### Artifact ownership and exposure

| Owner | Writes | Permitted downstream readers | Handoff |
|---|---|---|---|
| `context` | Context specification | `grounding`, `grill` | Context path and readiness state |
| `grounding` | Provenance-labeled claims | `grill` | Claims, authority, and conflicts |
| `grill` | `docs/discovery/<feature>/record.md` and one released `brief.md` | `plan` | Brief with source hashes and unresolved items |
| `plan` | Plan artifacts | `plan-review` | Plan with acceptance, checkout, risk, and done-check data |
| `plan-review` | Reviewed execution packet | `execute` and approved downstream helpers | Packet with plan/brief hashes and approval reference |
| `execute` | Code changes and `docs/execution/PLN-NNNN/ledger.md` | Review and verification consumers | Commit, receipt, and checkpoint evidence |

The boundary is declared and automatically linted. It is workflow enforcement, not filesystem or orchestrator access control; maintainers retain full repository access.

### Discovery and planning gates

`context` collects scope, affected files, constraints, dependencies, conventions, and unresolved material facts. `grill` challenges assumptions, risks, edge cases, alternatives, and conflicts before it releases a single brief. `plan` maps each accepted goal and scenario to a unit, binary acceptance criterion, verification command, risk, rollback, dependency, and done-check. A material unknown or missing approval keeps the artifact from advancing.

### Git policy

New work uses `<type>/PLN-NNNN-<slug>`, where type is one of `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `build`, `ci`, or `migration`; the slug is lowercase ASCII alphanumeric with single interior hyphens and is 3–40 characters. A repo-wide atomic reservation allocates the monotonically increasing plan ID. The master plan filename mirrors the branch name with `/` replaced by `-`; legacy plans retain their existing paths.

Create one task branch by default. Select a task worktree only when concurrent tasks or agents need distinct checkouts, unrelated uncommitted changes make switching unsafe, or long-running work needs isolation. Concurrent agents always use separate worktrees; concurrent unit branches require explicit justification, disjoint scopes, and a merge order. Executors inspect Git state again before creating the checkout.

### Migration and compatibility

This decision supersedes the direct `context` to `plan` ingestion language in ADR 0014 and the mandatory per-unit branch/worktree topology in ADR 0024. It preserves ADR 0015's batch and phase developer checkpoints and keeps test-first and conformance gates. Historical plans remain readable through legacy discovery rules.

Until reviewed packets exist, PLN-0003 uses its recorded bootstrap: the approved context specification and full task directory are committed to the task branch before Unit 01.01. The bootstrap changes neither the primary checkout nor unrelated files.

## Consequences

- Discovery produces one authoritative planning brief and explicitly retains conflicts and blockers.
- A plan cannot advance without complete acceptance, verification, risk, and checkout information.
- Serial task work usually has one branch; worktrees remain available where isolation has a concrete reason.
- Skills and tooling must be updated together: declarations, templates, scaffolding, checks, maps, manifest, lock, and evaluations.
- A stale source invalidates its derived brief or packet, requiring release or review again.

## Validation and review date

- Validate with focused discovery, plan-check, access-lint, handoff, and execution-handoff evaluations; run `node evals/run-evals.mjs`, `node scripts/context.mjs doctor`, and `git diff --check` after synchronization.
- Review date: 2026-10-06.
