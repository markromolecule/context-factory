---
title: "Skill Lifecycle Handoffs and Task Git Policy"
type: context
status: ready
created: "2026-10-06"
tags: [context, skills, discovery, planning, execution, git]
feature: "skill-lifecycle-handoffs-and-git-policy"
---

# Skill Lifecycle Handoffs and Task Git Policy Context Specification

## 1. Overview & Objective

- **Problem:** `context`, `grill`, `grounding`, `plan`, `plan-review`, and `execute` have inconsistent handoffs and incomplete discovery/plan gates. The present plan and execution contracts allocate a phase branch and a unit worktree for every unit, even for serial work. Direct reads from context into plan and from plan into execute contradict the requested skill boundary.
- **Value:** A developer can tell what a task is from its branch, iterate on one task branch, use an extra checkout only when isolation is useful, and trust that accepted requirements and approved units have explicit, checkable handoffs.
- **Success:** The six skills and their supporting workflow, templates, scripts, evaluations, and decision records agree on the lifecycle below; documented gates reject incomplete or stale handoffs; one task branch is the default; the factory doctor and focused evaluations pass after implementation.

### Accepted lifecycle

`context` (sole writer of context spec) → `grounding` (labeled claims) and `grill` (sole writer of discovery record and released brief) → `plan` (sole writer of plan) → `plan-review` (sole plan reader and issuer of reviewed execution packets) → `execute` (packet reader and execution-ledger writer).

The boundary is a declared skill contract checked by automated lint. It is not a claim of filesystem or orchestrator-enforced isolation. A human may inspect every artifact. A skill may inspect its own drafts. Prior user discussion confirmed the packet handoff, one-branch default, single `grill` brief, separate grill record, and deferred orchestrator access control.

## 2. Requirements & User Stories

### Actors and goals

| Actor | Goal | Authority boundary |
|---|---|---|
| Developer or maintainer | Understand and approve scope, plan, and execution checkpoints | Confirms context understanding and approves the plan before execution; can inspect all artifacts |
| Discovery author (`context`) | Establish evidenced requirements and scenarios | Writes the context specification only |
| Knowledge reconciler (`grounding`) | Qualify source claims by authority and provenance | Reads context as needed; sends labeled claims to `grill`, not a competing brief |
| Discovery challenger (`grill`) | Challenge assumptions and release one stable input to planning | Reads context; writes its own record and brief, never the context spec |
| Planner (`plan`) | Produce a complete, reviewable dependency plan | Reads the released brief, not the context spec; writes plan artifacts |
| Plan reviewer (`plan-review`) | Catch structural and semantic gaps before execution | Sole downstream reader of the full plan; issues reviewed packets after required approval |
| Executor (`execute`) | Implement approved units with evidence and checkpoints | Reads packets, not context or plan artifacts; writes code and a separate ledger |
| Downstream helpers (`test`, `review`, `verify`, `docs`) | Test, inspect, and report on approved work | Consume review packets, the released brief, execution ledger, and fresh code evidence as appropriate; do not read full context or plan output |

### User stories and measurable requirements

- **R01 Discovery:** As a planner, I need a released brief that states scope, affected files/symbols, consumers, tests, configuration, dependencies, conventions, constraints, evidence, scenarios, decisions, and unresolved items, so I can plan from verified inputs. The context remains draft when a material unknown can change scope, behavior, safety, or acceptance.
- **R02 Grilling:** As a maintainer, I need assumptions challenged with alternatives, boundary/failure/abuse/concurrency/lifecycle cases where applicable, risk consequences, and explicit blockers before a brief is released. `grill` writes `docs/discovery/<feature>/record.md` and releases one `brief.md`; `context` remains sole writer of `docs/context/` specs.
- **R03 Planning:** As a reviewer, I need each goal and scenario mapped to measurable acceptance criteria, concrete units, verification, dependencies, risks, rollback, and a pass/fail done-check. A plan with a blocking decision stays draft.
- **R04 Git decision:** As a developer, I want one task branch by default. The plan records `target_branch`, `task_branch`, `checkout_mode`, reason, and path. Use a task worktree when parallel tasks/agents need distinct checkouts, unrelated uncommitted work prevents a safe switch, or long-running work must remain available. Concurrent agents require separate worktrees under `orchestrator/SHARED.md`. Unit branches/worktrees require explicit concurrent-unit justification, disjoint scopes, and merge order.
- **R05 Naming:** New branches use `<type>/PLN-NNNN-<slug>`; the master plan filename mirrors the branch with `/` replaced by `-`. Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `build`, `ci`, `migration`. The slug is lowercase ASCII alphanumeric with single interior hyphens, 3–40 characters. The four-digit ID is unique repo-wide, allocated monotonically by an atomic reservation shared across worktrees. Existing plans retain their paths and IDs.
- **R06 Access declarations:** Each lifecycle skill and related downstream helper declares what it reads, writes, and exposes. Lint adjacent to `plan:check` rejects prohibited positive source reads and invalid declarations without rejecting a negative instruction that merely names a forbidden path. `plan` is the only writer of plan output; `plan-review` is its sole downstream reader. `grounding` and `grill` are the only downstream readers of context output. Existing direct reads in `test`, `review`, and `docs` must move to the reviewed packet, released brief, or ledger as appropriate.
- **R07 Handoff freshness:** A tool computes a source hash when `grill` releases the brief and validates it before planning/review. `plan-review` issues a packet with plan/brief hashes after passing review and recorded human plan approval; `execute` validates packet approval and freshness before work. Changes to an upstream artifact invalidate the downstream handoff.
- **R08 Execution:** `execute` follows the reviewed checkout mode, records unit IDs in commits and its ledger, retains batch/phase checkpoints and verification receipts, and never force-removes a worktree as routine cleanup. Residual uncommitted or untracked files stop cleanup.
- **R09 Synchronization:** Skills, shared contract, thin adapters, workflows, templates, scaffold, task listing, checker, relevant tests, maps, manifest, lock, and a superseding ADR agree; current accepted ADRs remain historical rather than being silently rewritten.

### Scenario coverage

| ID | Situation | Expected result | Failure or recovery |
|---|---|---|---|
| S01 | One serial task in a clean checkout | One named task branch; phases/units commit there | Stop if checkout has unrelated changes before switching |
| S02 | Current checkout has unrelated uncommitted work | Plan selects a task worktree | Preserve the original checkout; never copy its dirty files implicitly |
| S03 | Two agents work concurrently | Separate worktrees, and separate branches when units truly run concurrently | Reviewer rejects overlapping parallel scopes or absent merge order |
| S04 | Context has an unanswered permission or contract question | Context stays draft; no brief is released | Owner and resolution trigger recorded; ask one question at a time |
| S05 | `grounding` and repository evidence disagree | Claim is marked conflicting; `grill` resolves or blocks | No silent promotion of a stale note into a decision |
| S06 | Brief, plan, or packet source changes after release | Freshness check fails before downstream action | Re-release brief or re-review plan and packet |
| S07 | Two worktrees request the same plan ID | One atomic reservation succeeds | Loser retries the next repo-wide ID; no duplicate branch/plan |
| S08 | Skill text says “do not read docs/tasks/” | Boundary lint accepts the prohibition | A positive instruction to read it from `execute` fails lint |
| S09 | Worktree contains untracked files at cleanup | Cleanup stops and reports the files | Do not use `git worktree remove --force` to erase them |
| S10 | An old plan uses `README.md` and unit worktrees | Existing plan remains identifiable and executable under its recorded contract | New naming and checkout defaults apply prospectively; compatibility behavior is documented |

## 3. Technical & Architectural Context

- **Stack:** Markdown contracts/templates, Node.js ESM CLI and evaluation scripts, Git. No application database, mobile, API, or UI change is requested.
- **Current evidence:** `skills/productivity/context/SKILL.md` directly hands a spec to plan; `skills/productivity/grill/SKILL.md` starts a task artifact; `skills/productivity/plan/SKILL.md`, `skills/productivity/plan-review/SKILL.md`, and `skills/engineering/execute/SKILL.md` require unit worktrees. `scripts/task-workflow.mjs` allocates an ID per day and generates unit topology; `scripts/plan-check.mjs` audits units; `scripts/task-workflow.mjs` lists only `README.md` plans. `docs/templates/{Context,Task,Phase,Unit}.md`, `orchestrator/SHARED.md`, `workflows/feature-delivery.md`, `workflows/context-maintenance.md`, and accepted ADRs 0014/0015/0024 carry related contracts.
- **Likely touched files:** The six skill files above plus `skills/engineering/{test,review,verify}/SKILL.md` and `skills/productivity/docs/SKILL.md`, which currently consume unit plans, task records, or context specs; `docs/templates/{Context,Task,Phase,Unit}.md`; `scripts/task-workflow.mjs`, `scripts/plan-check.mjs`, `scripts/harness-cli.mjs` or small new handoff/lint modules; `evals/task-scaffold.test.mjs`, `evals/plan-check.test.mjs` and new focused evaluations; `orchestrator/SHARED.md`, thin adapter files with copied topology, `workflows/feature-delivery.md`, `workflows/docs.md`, `workflows/context-maintenance.md`, `docs/Skills.md`, relevant skills/workflow maps, `context-manifest.json`, `context-lock.json`, and a new `docs/decisions/` record. Add `docs/discovery/` and `docs/execution/` documentation only when implementing the new artifact contract.
- **Language rules:** `rules/global/evidence-and-claims.md` includes `cf.evidence.grounding` (`evidence-blocking`), `cf.evidence.integrity` (`evidence-blocking`), `cf.evidence.verification` (`automated-blocking`), and `cf.evidence.scope-fencing` (`evidence-blocking`). For proposed Node tooling, bind the applicable `rules/typescript/common/` directives at unit planning/preflight; `cf.arch.direction` (`automated-blocking`) and `cf.arch.adrs` (`automated-blocking`) apply when changing architecture boundaries. The rule catalog and binding hashes must be inspected at implementation time; this context records candidates, not an invented receipt.
- **Ownership and precedence:** User instructions and accepted decisions outrank the current skill defaults. The new ADR should supersede incompatible handoff/topology statements in ADRs 0014 and 0024 while preserving their original history. The shared contract's mandatory isolation for concurrent agents remains in force.
- **Data model:** New documentation metadata for artifact ownership, hashes, review status, plan ID, branch mode, and execution packet; no application schema migration.
- **Security/access:** Boundary lint is workflow conformance, not a filesystem security barrier. Hashes detect stale handoffs, not malicious tampering. Orchestrator-level per-skill ACLs are explicitly deferred.

## 4. UI/UX & Interaction Guidelines

- Branch and plan names must be readable at a glance. The plan shows the selected branch, checkout mode, reason, and path in one small table.
- A failed gate reports the source artifact, mismatched hash or forbidden access, and the step to regenerate/review. It never implies that execution is approved.
- Existing batch and phase checkpoint reports remain concise and include unit IDs, branch/worktree paths, verification results, and residual risks.

## 5. Scope & Boundaries

**In scope:** Discovery and planning gates; one-way declared skill exposure; single `grill` brief and separate discovery record; review-issued execution packet and separate ledger; prospective branch/worktree policy and naming; atomic plan-ID reservation; lint and freshness checks; safe cleanup; compatibility for historical plans; synchronized factory documentation and tests.

**Out of scope:** Production application changes; retroactive renaming or migration of old plans/branches; hard per-skill filesystem ACLs; remote GitHub integration or automatic publication; removal of existing human approval, test-first, conformance, or phase checkpoint gates.

**Assumptions resolved by prior user answers:** The packet is retained; `grill` owns the only brief; `grounding` contributes claims to `grill`; `context` alone writes its spec; one task branch is the default; static lint is sufficient for now. No material product decision remains open for planning.

## 6. References & External Context

- `docs/templates/Context.md`, `docs/templates/Task.md`, `docs/templates/Phase.md`, `docs/templates/Unit.md`
- `docs/decisions/0014-context-specification-skill-with-embedded-grilling.md`
- `docs/decisions/0015-execute-skill-strict-phase-stops-and-modular-refactoring.md`
- `docs/decisions/0024-unit-execution-review-and-testing-skills.md`
- `workflows/feature-delivery.md`, `workflows/context-maintenance.md`, `orchestrator/SHARED.md`
