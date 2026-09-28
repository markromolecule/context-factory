---
name: execute
description: Execute an existing task or implementation plan artifact unit by unit, each in its own git worktree and branch, verify the resulting code, record evidence, and stop at batch and phase boundaries for developer inspection before anything merges. Use for /execute, /exec, [EXEC].
---

# Execute an Implementation Plan, Unit by Unit

This skill consumes an approved plan built by `plan` — a master `README.md`, per-phase `phase.md` overviews, and standalone `unit-*.md` files with a `depends_on` graph. It does not invent a replacement plan, and it never modifies the shared working tree directly: all work happens inside a worktree scoped to exactly one unit.

## Why worktrees per unit

Plan units are deliberately scoped to one seam each and marked with a dependency graph specifically so independent ones can run concurrently. If they all executed in the same working tree, uncommitted changes from one unit would sit alongside another's, "focused" would only last until a second unit started, and a session resuming a unit later couldn't tell which uncommitted files were even its own. A dedicated worktree and branch per unit fixes all three: a unit's changes stay physically isolated from every other unit in flight, a session resuming later just reads the worktree path already recorded in the unit's status block, and a conflict on merge — since units are supposed to touch disjoint files — is itself a signal that the plan drew a boundary wrong, not routine noise to absorb. It also means units in the same batch can be handed to separate sessions or agents to run at the same time, since each has its own directory and branch, or worked through one after another in this session — pick whichever the developer wants.

## Branch and worktree layout

Assume this layout unless the repo already has its own convention — flag it in the checkpoint output if you deviate:

- **Task base branch:** `task/<id>-<type>-<feature>`, cut from the plan's target branch the first time this task is executed.
- **Phase integration branch:** `task/<id>/<phase-slug>`, cut from the task base branch when a phase's first unit starts.
- **Unit branch:** `task/<id>/<phase-slug>/<unit-slug>`, cut from the phase integration branch when that unit's worktree is created.
- **Worktrees:** `.worktrees/<id>/<phase-slug>/<unit-slug>/` at the repo root (add `.worktrees/` to `.gitignore` if it isn't already).

The moment a branch and worktree are created for a unit, record both in that unit artifact's status block — that's what lets any session, this one or a later one, find the work without re-deriving it.

## Start & Identify the Ready Batch

1. Locate the user-specified plan or the relevant task directory under `docs/tasks/`.
2. Read the master plan (`README.md`), then each phase's `phase.md` in dependency order, then the unit index and `depends_on` graph within the first incomplete phase.
3. Run `git worktree list` and check for worktrees already tied to this task — resume those units from their recorded state rather than recreating them.
4. Build the **ready batch**: every not-yet-merged unit in the active phase whose dependencies are already merged into the phase integration branch. Units with no edge between them belong in the same batch.
5. Confirm prerequisites, target files, and current state for each unit in the batch before modifying anything.
6. If the plan is missing, the dependency graph has a cycle, or a decision would materially alter scope, report the blocker and stop.

## Set Up Worktrees for the Ready Batch

For each unit in the ready batch:

1. Create the phase integration branch if this is the phase's first unit; then create the unit's branch and worktree from it — or reuse the existing one found in step 3 above.
2. Do all following work for that unit from inside its own worktree. Never touch the main working tree, or another unit's worktree, while this one is active.

## Execute Each Unit

Inside the unit's own worktree:

1. **Inspect Scope Boundaries:** Modify only the files in the unit's declared Scope (`**In scope:**`), plus necessary tests, generated artifacts, and documentation. If a change needs a file outside that scope, stop — that means the unit or the dependency graph was drawn wrong, not something to route around.
2. **Test-First Implementation (`/test`):** Invoke `skills/engineering/test/SKILL.md` (`/test`) to author failing tests first for the unit's declared verification types (unit, integration, architecture, contract, migration) before writing functional code. Execute the test command and verify it fails with an expected assertion or module error (Red).
3. **Minimal Functional Implementation (Green):** Implement the minimal code strictly within the unit's declared scope to make the tests pass. Follow all applicable domain rules from `rules/` matching touched files (TypeScript type safety, runtime validation, ESR query optimization, vertical backend modules, UI guidelines, and strict SOLID principles under `rules/solid/`).
4. **Independent Diff Review (`/review`):** Invoke `skills/engineering/review/SKILL.md` (`/review`) to conduct an independent pre-screening diff review:
   - *Scope Fence:* Compare `git diff --name-only` against `**In scope:**` to confirm zero unallocated files were modified.
   - *Test Completeness:* Confirm all verification test types exist, ran, and passed.
   - *SOLID Audit:* Confirm single-responsibility decomposition, open/closed extension, and dependency inversion on new code.
   - *Definition of Done:* Ensure all DoD criteria are substantiated by concrete evidence.
5. **Database & Configuration Changes:**
   - Review migration SQL before applying.
   - Update `.env.example` without exposing secrets.
   - Regenerate types and typecheck all consumers reachable from this worktree.
6. **Commit & Verification Logging:** Once pre-screening passes, commit on the unit's branch with a message referencing the task, phase, and unit ids. Mark the unit `[x]` and `status: verified` (not yet merged) in the unit artifact, and log command output, test counts, pre-screening status, and files modified into its Verification section.

Work through every unit in the batch this way before moving on — the checkpoint below reports the whole batch at once, not one unit at a time.

## Strict Mandatory Batch Stop

> [!IMPORTANT]
> **Mandatory Developer Checkpoint:**
>
> - The agent **MUST STOP IMMEDIATELY** once every unit in the ready batch is verified and committed on its own branch.
> - The agent **MUST NOT** merge a unit branch into the phase integration branch, start the next batch, or advance phases without developer approval.
> - The agent must output a structured checkpoint covering every unit in the batch and wait for the developer to inspect each worktree before continuing.

### Checkpoint Output Format

```markdown
### Batch Complete: Phase NN — [Phase Title]

#### Unit NN.01 — [Unit Title]
- Worktree: `.worktrees/<id>/phase-NN/<unit-slug>` · Branch: `task/<id>/phase-NN/<unit-slug>`
- Pre-Screening Review: PASS (0 scope leaks, 0 SOLID violations)
- [x] Step: [summary of change]

**Verification Evidence:**
- Command: `[test command]` (PASS: X/X passed)
- Files modified: `[list of modified files]`

#### Unit NN.02 — [Unit Title]
... (same shape, repeated per unit in the batch)

⏸️ **Batch complete. Stopped for developer review.**
Inspect each worktree, e.g. `cd .worktrees/<id>/phase-NN/<unit-slug> && git diff task/<id>/phase-NN`.
Reply or prompt `/execute continue` to merge the approved units into `task/<id>/phase-NN` and start the next ready batch.
```

## Resume: Merge, Clean Up, Advance

On `/execute continue` (or the next invocation):

1. Merge each approved unit branch into the phase integration branch, one at a time. If a merge conflicts, stop immediately and report which units collided — treat that as a plan defect (their scopes weren't actually disjoint after all), not something to resolve silently.
2. Once all of the batch's units are merged, run the narrowest checks that only make sense with units combined (build, typecheck, integration suite) — units that each pass alone can still interact once merged.
3. Remove the merged units' worktrees (`git worktree remove`) and update the phase's unit index.
4. Recompute the ready batch — units newly unblocked now that their dependencies are merged — and return to **Set Up Worktrees**. If the phase has no units left, move to Phase Completion.

## Phase Completion

When every unit in a phase is merged into its phase integration branch:

1. Run the phase's own verification checks, beyond what any single unit covered.
2. Merge the phase integration branch into the task base branch; remove the phase's worktrees.
3. Mark the phase artifact's frontmatter `status: completed`.
4. Stop with the same checkpoint discipline as the batch stop above — report phase-level verification evidence and wait for developer approval before starting the next phase.

## Completion

When the final phase of a task is complete, run the plan's overall verification checks, confirm every acceptance criterion in the master plan is satisfied by a merged unit and its recorded test, merge the task base branch through the repo's normal review process, update status to `completed`, and report the final outcome, verification evidence, and release readiness.
