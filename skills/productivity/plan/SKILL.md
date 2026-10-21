---
name: plan
description: Plan implementation work into atomic, self-contained task units without modifying production code. Trigger when asked to author an implementation plan, design proposal, task breakdown, migration roadmap, or task artifact intended for cross-session execution (/plan, [PLAN]).
---

# Create an Implementation Plan

## Access declaration

- **Reads:** released discovery brief, grounding evidence, repository code, tests, configuration, existing decisions, and applicable rules (`rules/global/1-3-1-rule.md`).
- **Writes:** the task branch and plan artifacts under `docs/tasks/`.
- **Exposes to:** `plan-review` through the master plan and self-contained unit artifacts.

Do not write or edit production code while this skill is active. Planning stops at artifact creation and handoff; execution belongs strictly to `/execute` unless the user explicitly expands the request to implement immediately.

## Why break plans into units

A phase tells you *what order* things happen in. A unit tells a fresh session *everything it needs* to safely do one piece of that work — without having read this planning conversation, the master plan, or any other unit. Splitting work this finely buys you three things: different units can go to different sessions in sequence, a unit that gets interrupted or loses context can be picked back up from its file alone, and a reviewer can judge one focused change against one focused test plan instead of an entire phase at once. It costs some duplication — each unit repeats the slice of context it needs instead of pointing back at the plan — but that duplication is exactly what makes cross-session execution reliable, so don't trim it to save space.

Size units by responsibility, not by line count. A unit should correspond to one coherent seam surfaced by the SOLID audit below — one responsibility, one contract, one boundary — not an arbitrary file count. If you can't describe what a unit does in one sentence, it's too big; if two units only ever make sense executed together, merge them.

### Lightweight path for small tasks

For small, low-complexity tasks (e.g. single-file bug fixes, isolated chores, or minor refactors), avoid excessive multi-phase ceremony. Use a collapsed **single-phase, single-unit** structure (`phase-01-<slug>/unit-01-<slug>.md` paired with a concise master plan). This satisfies task branch isolation, rule binding, and test verification without unnecessary structural overhead.

## Task branch

This is the only lifecycle skill that creates the task branch. Create the branch and task scaffold right after grounding and brief release, before drafting detailed plan content.

### Authoritative branch naming

The task branch name follows `<type>/PLN-NNNN-<slug>`:

- `<type>`: one of `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `build`, `ci`, or `migration`.
- `PLN-NNNN`: the reserved 4-digit plan ID.
- `<slug>`: a 3–40 character lowercase alphanumeric ASCII string with single interior hyphens (`[a-z0-9]+(-[a-z0-9]+)*`), derived from the brief.

Never create phase or unit branches. Work on one task at a time in this checkout.

### Branch creation and resume gates

1. **Verify base is current:** Run `git fetch origin <target-base>` and verify the local base branch is fully synchronized with upstream (`git rev-parse HEAD` equals `git rev-parse origin/<target-base>`).
2. **Checkout state inspection:** Inspect `git symbolic-ref --quiet --short HEAD` and `git status --short`.
   - **New plan (on target base):** The target base checkout must be completely clean. If HEAD is detached or uncommitted changes exist, stop and report the exact state; do not stash, reset, discard, or silently switch branches.
   - **Resuming an in-progress plan (on task branch):** If already on the matching `<task-branch>`, uncommitted markdown changes inside `docs/tasks/` for the active task are permitted. If there are uncommitted modifications outside `docs/tasks/` (especially in production source files), stop and report the dirty state.
3. **Collision check:** If the task branch already exists locally or remotely, verify its recorded brief/plan identity and ancestry from the intended base. Continue on it only when it is the exact same task and already checked out; otherwise stop and report the collision.
4. **Scaffolding:**
   - Preview the naming candidate:

     ```bash
     node scripts/context.mjs task:new "<title>" --type <type> --dry-run --json
     ```

   - Create and switch:

     ```bash
     git switch -c <task-branch> <target-base>
     ```

   - Scaffold the directory structure and starter templates:

     ```bash
     node scripts/context.mjs task:new "<title>" --type <type> --base <target-base>
     ```

   The scaffold fails closed if its atomic plan ID differs from the preview. Record the target base, task branch, and base commit SHA in the master plan and every unit.

## Workflow

1. **Ingest brief:** Ingest and analyze the released `grill` brief end-to-end. Do not read the `context` specification directly; `grounding` validates its claims against current repository evidence and exposes them to `grill` only.
2. **Restate outcome:** Restate the requested outcome, boundaries, non-goals, and measurable success criteria.
3. **Verify brief freshness & product boundary:** Verify that `grounding` has checked consequential claims against the actual codebase, `grill` has resolved conflicts, and the released brief is fresh.
   - **Boundary rule:** Product goals, business rules, actor personas, user-facing scenarios, and scope boundaries belong strictly to `grill`. If any product or requirements question remains open, stop immediately and return to `grill`.
4. **Create task branch and scaffold:** Follow the **Task branch** section above: verify base currency, inspect checkout state, switch to `<task-branch>`, and run `node scripts/context.mjs task:new` to scaffold the plan directory under `docs/tasks/YYYY/MM/YYYY-MM-DD/<id>-<type>-<slug>/`.
5. **Inspect codebase:** Inspect relevant source files, existing tests, configuration, schemas, and conventions on the task branch.
6. **Separate facts from assumptions:** Separate verified code evidence, working assumptions, open technical choices, and out-of-scope work.
7. **Resolve technical design choices via 1-3-1:** For material unresolved *technical implementation* choices (architecture patterns, interface seams, data access approaches, library choices), apply the 1-3-1 decision framework (`rules/global/1-3-1-rule.md`):
   - **1 — Define** (`[directive:cf.global.1-3-1-define]`): state problem, evidence, constraints, and success condition in one compact section; separate verified facts from assumptions.
   - **3 — Compare** (`[directive:cf.global.1-3-1-compare-options]`): offer viable, materially different approaches (typically three; allow two only when a third alternative is genuinely non-viable, stating the concrete disqualification reason).
   - **1 — Recommend** (`[directive:cf.global.1-3-1-recommend]`): choose one approach and justify it against constraints, maintenance burden, reversibility, and complexity, providing concrete next steps and validation criteria.
   - **Approval and escalation:** Record recommended choices in the master plan's decision ledger (`docs/templates/Task.md`). Human user approval of these recommendations is **blocking** during `plan-review` before execution begins. For cross-cutting, durable, or high-blast-radius decisions, escalate to an ADR (`skills/productivity/adr/`).
8. **Analyze impact:** Identify affected files, public contracts, data models, consumer modules, and rollback risks.
9. **Audit architecture against SOLID:** Audit technical choices against SOLID principles (`knowledge/principles/`): enforce single-responsibility decomposition, open/closed extension strategies, substitutable contracts, lean client interfaces, and dependency inversion before finalizing unit boundaries. Note every boundary surfaced as a candidate for an architecture test.
10. **Map dependency graph & linearize execution:** Map the work as a directed acyclic dependency graph, not just a flat list of phases. Group sequential milestones into phases; within each phase, decompose into atomic units connected by explicit `depends_on` edges. Because checkout execution is serial, compute and document an explicit **linearized execution order** (topological sort) for the entire task.
11. **Assign and justify test types:** For each unit, assign test types based on what the unit actually changes, justifying each in one line (what would break undetected without it):
    - Function/module logic without new collaborators → **unit tests** for happy path, boundary, and brief-specified error cases.
    - Seams crossing component, process, or network/DB boundaries → **integration tests** with realistic collaborators.
    - Boundary or layering changes flagged in SOLID audit → **architecture tests** (automated via dependency-cruiser/linter, or an explicit checklist).
    - Public API, schema, event, or CLI changes → **contract tests** with affected consumer notes.
    - Schema or data state changes → **migration tests** covering both forward migration and rollback.
    - Auth, permissions, or untrusted input → negative and abuse-case tests.
    - Performance-critical hot paths, latency budgets, or DB query indexing → **performance tests** with concrete thresholds/benchmarks.
    - End-to-end user journeys or full CLI workflows → **e2e / acceptance tests**.
    - Pure refactor with no behavioral changes → require existing tests to pass; if existing coverage is absent or inadequate, write **characterization tests** first before altering code.
12. **Populate scaffolded task artifacts:** Populate the task directory created in step 4 (`docs/tasks/YYYY/MM/YYYY-MM-DD/<id>-<type>-<slug>/`):
    - **Master Plan (`README.md` / `<type>-<id>-<feature>.md`):** using `docs/templates/Task.md` — outcome, criteria, scope, 1-3-1 decision ledger, dependency graph, linearized unit index, target base, task branch, base commit, and `## Finalization & Merge Ledger`.
    - **Phase Overviews (`phase-XX/phase.md`):** using `docs/templates/Phase.md` — shared phase goal, common context, unit index with dependency edges, and phase-level rollback.
    - **Unit Artifacts (`phase-XX/unit-YY-<slug>.md`):** using `docs/templates/Unit.md`. Each unit must be self-contained: declare task branch and status block, strict scope fences (`**In scope:**`, `**Out of scope:**`), unit-scoped `<language_rules>`, implementation steps, justified verification, and a dedicated `## Preconditions / Expected state from dependencies` section.

## Plan requirements

Include:

- outcome and measurable acceptance criteria (`AC-NN`);
- traceability from user context, goals, scenarios, constraints, and decisions to acceptance criteria, down to the specific unit and test that verifies each one;
- current-state evidence with verified file paths;
- scope and non-goals at both plan and unit levels;
- decisions and assumptions, structuring material technical choices according to the 1-3-1 rule (`rules/global/1-3-1-rule.md`);
- a dependency graph distinguishing required ordering from logical independence, paired with an explicit linearized execution order;
- the task branch, verified target base, and 40-character base commit SHA recorded across the plan and every unit;
- finalization lifecycle from task branch to target branch;
- modular unit breakdowns with concrete files, functions, and checklists, each carrying its own standalone context packet;
- **Expected state from dependencies:** each unit must explicitly declare what interfaces, files, or state its predecessor units produced;
- **Dependency drift protocol:** if a unit alters contracts or decisions during execution, downstream dependent units are marked stale and must be reconciled before execution continues;
- **Unit language rules (`<language_rules>`):** carrying stable directive IDs, rule paths, explicit enforcement modes, and content hashes:
  - `automated-blocking`: deterministic machine checks (linters, typecheckers, test suites, `context-cli preflight`) that must pass to proceed;
  - `evidence-blocking`: requires verifiable recorded human or artifact inspection receipt;
  - `advisory`: non-blocking best-practice guidance;
- **Waivers:** any intentional deviation or bypass of an applicable rule must cite an active, authorized waiver ID (e.g. `[waiver:W-NNNN]`); un-waived contradictions fail validation;
- a test plan per unit, typed and justified by what the unit actually changes;
- migration, environment, security, observability, and rollback impact;
- risk and dependency register with resolved blockers;
- completed plan done-check.

Do not prescribe files that were not inspected unless clearly marked as new. Avoid vague tasks such as "handle errors" or vague verification such as "add tests"; name the boundary, expected behavior, and specific test seam.

## Completion

Before declaring the plan complete, execute both validation tiers:

### 1. Automated Verification

Run the deterministic harness validator:

```bash
node scripts/context.mjs plan:check docs/tasks/YYYY/MM/YYYY-MM-DD/<task-dir>
```

This automatically verifies:

- task branch, target base, and base commit consistency across master and all units;
- acceptance criteria table format (`AC-NN`), unit ID mapping (`XX.YY`), and concrete verification commands;
- discovery brief presence, validity, and freshness;
- presence of resolved blockers (`Unknowns and blockers`) and risk register;
- plan done-check completion markers (`- [x]`);
- unit `<language_rules>` block validity, rule file existence, stack alignment, directive hashes, and absence of un-waived contradictions;
- acyclic dependency graph topology (`checkPlanGraph`) and disjoint parallel unit scopes (`checkPlanScopes`).

### 2. Manual Verification

Manually verify that:

- no open product decision is disguised as an implementation step;
- every material technical design choice is resolved via the 1-3-1 rule (`rules/global/1-3-1-rule.md`) or an ADR, and ready for user approval during plan-review;
- every unit's context packet and dependency preconditions are genuinely sufficient for a cold-start session — if executing it would require reading the master plan or past chat history, fold the missing information directly into the unit;
- assigned test types match what code actually changes, including characterization tests where existing coverage is absent, and performance/e2e tests where critical seams warrant them;
- the linearized execution sequence accounts for all dependency relationships.

### Output

Return:

1. Created task folder path (`docs/tasks/...`).
2. Task branch name and verified base commit SHA.
3. Concise summary of phases and units.
4. **Linearized unit execution order** (e.g. `01.01 -> 01.02 -> 02.01 -> 02.02`).
