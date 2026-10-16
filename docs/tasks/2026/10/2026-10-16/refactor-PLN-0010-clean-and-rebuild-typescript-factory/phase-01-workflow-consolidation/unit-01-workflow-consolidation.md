---
title: "Phase 1 — Migrate Workflows to First-Class Skills"
type: unit
parent: "phase-01-workflow-consolidation"
unit: "01.01"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
status: planned
created: "2026-10-16"
tags: [task, unit, workflows, skills]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: Migrate Workflows to First-Class Skills and Remove Wrapper Indirection

> Phase: phase-01-workflow-consolidation · Depends on: none · Parallelizable with: none  
> Task branch: refactor/PLN-0010-clean-and-rebuild-typescript-factory · Base commit: a37f557a2fde8e30b6ae23a941d74d8e87a5677f

## Objective

Consolidate all 12 canonical workflows into unified first-class skill directories under `skills/workflows/<slug>/SKILL.md` carrying YAML frontmatter (`name: <slug>`, `description: ...`) and the full lifecycle policy, and delete the obsolete root `workflows/` directory and `skills/workflow-entries/` wrapper layer.

## Context packet

- Prior structure maintained `workflows/<slug>.md` plus an artificial wrapper `skills/workflow-entries/workflow-<slug>/SKILL.md` pointing back to it.
- Grounding packet `G-KISS-001` and decision `D-01` mandate unifying each workflow into a single authoritative `SKILL.md` under `skills/workflows/<slug>/`.
- Serves acceptance criterion `AC-01`.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- `git symbolic-ref --quiet --short HEAD` exactly matches `refactor/PLN-0010-clean-and-rebuild-typescript-factory`.
- Clean working tree on the recorded task branch.

## Scope

**In scope:**
- `skills/workflows/` (12 new workflow skill directories with `SKILL.md`)
- `workflows/` (12 deleted files)
- `skills/workflow-entries/` (12 deleted directories)
- `docs/Workflows.md`
- `docs/Skills.md`

**Out of scope:**
- Modifying CLI parsing or bridge generation (reserved for Units 03.01 and 04.01).
- Modifying root entrypoints (reserved for Unit 02.01).

## Steps

1. Create directory `skills/workflows/`.
2. For each of the 12 workflows, author `skills/workflows/<slug>/SKILL.md` merging:
   - Frontmatter containing `name: <slug>` and `description: <concise summary>`
   - The full canonical workflow text (Phases, Quality Gates, Stop & Escalation Conditions, Artifacts & Completion).
3. Delete all files in `skills/workflow-entries/` and remove the directory.
4. Delete all files in `workflows/` and remove the directory.
5. Verify that each new file exists and is valid YAML + Markdown.

## Verification

- **Automated Tests:**
  - Test type: Contract / Integrity test (ensures 12 `SKILL.md` files exist with valid frontmatter and non-empty lifecycle policies).
  - Command: `node -e "import('node:fs/promises').then(async f => { const list = await f.readdir('skills/workflows'); if (list.length !== 12) throw new Error('Expected 12 workflows, got ' + list.length); console.log('12 workflows verified'); })"`
- **Git State Check:**
  - Command: `git status --short` confirms `workflows/` and `skills/workflow-entries/` are deleted and `skills/workflows/` is created.

## Rollback

Run `git checkout -- workflows/ skills/workflow-entries/` and `rm -rf skills/workflows/`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-01
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
