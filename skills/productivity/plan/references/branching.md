# Task branch and scaffold

Use this when creating or resuming a plan. `plan` creates one task branch in the current checkout. Do not create a worktree, phase branch, or unit branch. Preserve unrelated checkout changes.

## New plan

1. Identify the intended target base from the released brief or current workflow. `git fetch origin <base>`; compare `git rev-parse <base>` with `git rev-parse origin/<base>`. Stop if the fetch fails or the SHAs differ.
2. Check `git symbolic-ref --quiet --short HEAD` and `git status --short`. Start on the clean target base. Stop on detached HEAD or a dirty checkout. Check local and remote refs for a matching branch; a collision must be resolved, not overwritten.
3. Preview with `node scripts/context.mjs task:new "<title>" --type <type> --base <base> --dry-run --json`. Use its `baseBranch`, `taskDirectory`, and `planPath`. Valid branch types are `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`, `build`, `ci`, and `migration`. The branch format is `<type>/PLN-NNNN-<slug>`, with a 3–40 character lowercase ASCII slug using single interior hyphens. The scaffold derives the ID and slug; do not hand-allocate an ID.
4. In the current checkout, run `git switch -c <baseBranch> <base>`, then `node scripts/context.mjs task:new "<title>" --type <type> --base <base> --json`. The real command requires a clean checkout on the exact new task branch at the base commit. Compare its ID, branch, and paths with the preview. If they differ, stop and report the new branch and any generated artifacts; do not rename or delete the branch automatically.

The scaffold writes the master plan at `planPath`, a `.md` file beside `taskDirectory`. Keep that canonical path. Phase and unit files live under `taskDirectory/phase-XX-<slug>/`, with `phase.md` and `unit-YY-<slug>.md`. The scaffold fills task branch and base SHA, but leaves substantive plan fields and rule bindings for the planner. Replace starter phases and units as needed; the default scaffold shape is not the required plan shape.

## Resume

Resume only on the exact recorded task branch and matching plan identity and base SHA. Inspect the existing master and units before editing. Uncommitted changes confined to this task's plan artifacts may be continued; changes outside the task artifacts, a different branch, or a conflicting master stop the run. Do not call `task:new` again for a half-written plan. Revalidate after completing it.

`task:new` reserves an ID atomically when it runs. Preview is advisory; another planner can reserve that ID before the real command. A mismatch is a stop condition, not permission to switch to a second branch.
