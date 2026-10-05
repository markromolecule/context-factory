---
title: "Skills Catalog Sync & Doctor Verification"
type: unit
parent: "0003/phase-03"
unit: "03.02"
branch: "task/0003/phase-03/sync-and-doctor"
worktree: ".worktrees/0003/phase-03/sync-and-doctor"
status: verified
created: "2026-10-05"
tags: [task, unit, skills, sync, doctor, release]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 03.02: Skills Catalog Sync & Doctor Verification

> Phase: 0003/phase-03 · Depends on: 03.01 · Parallelizable with: none
> Worktree: .worktrees/0003/phase-03/sync-and-doctor · Branch: task/0003/phase-03/sync-and-doctor

## Objective

Update `skills/engineering/README.md` and `skills/README.md` to document and wiki-link the new `perf` and `types` skills, run full repository synchronization via `npm run sync`, and verify Context Factory diagnostic health with `npm run doctor`.

## Context packet

- Acceptance criteria: AC-08, AC-09.
- Decision ledger: D-02 in ADR 0028; ADR 0020 (Categorical Skill Grouping and Group Index Invariants).
- Dependency outputs: `perf` and `types` skills authored and wired into `review`.

<language_rules>
- `rules/global/architecture-conformance.md`: Ensure lockfile and manifest remain synchronized with behavior.
- `rules/global/evidence-and-claims.md`: Never report completion without fresh, verified command outputs.
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 03.01 merged into `task/0003/phase-03-integration`.
- Dedicated git worktree and branch provisioned at declared path.

## Scope

**In scope:** `skills/engineering/README.md`, `skills/README.md`, `context-manifest.json`, `context-lock.json`, Obsidian MOCs (`docs/skills.md`).
**Out of scope:** Core skill implementation (covered in Phase 2).

## Steps

1. In `skills/engineering/README.md`:
   - Add `perf` and `types` to the member skills table with descriptions, primary triggers, and wiki-links per ADR 0020 invariants.
2. In `skills/README.md`:
   - Update total skill counts and categorical summaries to reflect the addition of `perf` and `types` (raising engineering skills to 9 and total skills to 18).
3. Run `npm run sync` to register `perf` and `types` in `context-manifest.json`, regenerate MOCs, and refresh `context-lock.json`.
4. Run `npm run doctor` to execute all diagnostic suites (manifest lint, lockfile integrity, symlinks, evaluations).
5. Run `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-05/0003-task-cli-ux-and-code-health-skills` to confirm valid plan structure.
6. Confirm 100% HEALTHY and zero errors.

## Verification Evidence

```bash
$ npm run sync
> context-factory@3.15.0 sync
> node app/cli/bin/context-cli.mjs sync

 SYNC  Context Factory Synchronized Successfully
  Manifest: context-manifest.json updated.
  MOCs:     6 Obsidian Maps of Content regenerated (Rules, Skills, Workflows, Agents, Decisions, Wiki).
  Lockfile: context-lock.json generated (sha256:203425fbcd3e8458e08c93a5159ef4117ae340ecc5e4919d75d52b7c0df5e950).

Category          Count
────────────────  ─────
Rules             59   
Skills            18   
Skill Resources   10   
Workflows         12   
Agents            23   
Knowledge Items   6    
Schemas           6    
Templates         7    
Decisions (ADRs)  28   
Evaluations       20   
Datasets          3    
Tools             17   

$ npm run doctor
> context-factory@3.15.0 doctor
> node app/cli/bin/context-cli.mjs doctor

╔════════════════════════════════════════════════════════════════╗
  CONTEXT FACTORY DOCTOR DIAGNOSTIC  v3.15.0
╚════════════════════════════════════════════════════════════════╝

Diagnostic Check           Result  Details                                       
─────────────────────────  ──────  ──────────────────────────────────────────────
Manifest & Syntax Lint      PASS   59 rules, 18 skills, 12 workflows verified    
Lockfile Integrity          PASS   Current (sha256:203425fbcd3e8...)             
.agents Symlink Integrity   PASS   24/24 symlink & agent configs verified healthy
Editor Artifact Integrity   PASS   1/1 editor configurations verified (native)   
Evaluation Suite            PASS   23/23 evaluations passed in 192ms             

   HEALTHY  Context Factory is completely synchronized, valid, and healthy.

$ node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-05/0003-task-cli-ux-and-code-health-skills
╔════════════════════════════════════════════════════════════════╗
  CONTEXT FACTORY PLAN CHECKER
╚════════════════════════════════════════════════════════════════╝

Task Directory: /Applications/XAMPP/xamppfiles/htdocs/context-factory/.worktrees/0003/phase-03/sync-and-doctor/docs/tasks/2026/10/2026-10-05/0003-task-cli-ux-and-code-health-skills
Units Found:    6

Topological Order: 01.01 -> 02.01 -> 02.02 -> 03.01 -> 01.02 -> 03.02
Parallel Scopes:   All concurrent units declare disjoint file scopes.
Language Rules:    All units declare populated <language_rules> blocks.

   PASS  Plan graph is acyclic and parallel scopes are disjoint.
```

Commit SHA: `a8d2989` on branch `task/0003/phase-03/sync-and-doctor`.

## Rollback

Revert index and synchronization changes via `git checkout`.

## Definition of done

- [x] Maps to acceptance criteria: AC-08, AC-09
- [x] Executed inside dedicated worktree without touching main workspace
- [x] Changes committed cleanly to unit branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes

