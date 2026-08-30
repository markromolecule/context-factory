---
title: "Group Skills into Engineering and Productivity"
type: task
status: completed
created: "2026-08-30"
tags: [task, skills, categorization, engineering, productivity, readme, validation]
---

# Group Skills into Engineering and Productivity

## Outcome

Reorganize the flat `skills/` directory into two intuitive categorical groups: `skills/engineering/` (coding, refactoring, verification, security, exploration) and `skills/productivity/` (grill discovery, context specifications, documentation reports, planning, ADRs, LLM Wiki grounding, triage inbox). Author dedicated `README.md` index files for each group and enforce automated group README synchronization in `scripts/validate-context.mjs`.

## Pre-planning record

### Actors and goals

- **Developer / Agent:** Browses skills via clear categorical groups (`engineering/` and `productivity/`), consulting group `README.md` files for quick trigger reference and procedures.
- **Context Factory Validator (`scripts/validate-context.mjs`):** Enforces that every skill group has a `README.md` and that every skill within that group is linked and documented.
- **Lifecycle Specialist Agents:** Continue invoking skills seamlessly via slash commands and harness resolution.

### Domain language

- **Engineering Skills Group (`skills/engineering/`):** Hands-on implementation, code inspection, modular refactoring, test verification, and security controls (`execute`, `explore`, `refactor`, `security`, `verify`).
- **Productivity Skills Group (`skills/productivity/`):** Pre-planning discovery, specification authoring, reporting, planning, architecture decisions, knowledge grounding, and triage (`adr`, `context`, `docs`, `grill`, `grounding`, `plan`, `triage`).
- **Group README Invariant:** Enforced rule that each group folder must maintain an up-to-date `README.md` listing all its constituent skills.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| S-01 | Skill added to group | Developer adds a new skill under `skills/engineering/` | Validator requires skill to be listed in `skills/engineering/README.md` | `validate-context.mjs` fails if link is missing | Planned |
| S-02 | Context resolution for grouped skills | User invokes slash command e.g. `/plan` or `/exec` | Harness resolves nested path `skills/productivity/plan/SKILL.md` or `skills/engineering/execute/SKILL.md` | Graceful fallback matching | Planned |
| S-03 | Doctor and evaluation suite | Run `node scripts/context.mjs doctor` | 100% PASS on lint, lockfile, symlinks, and evals | Diagnostic flags any broken link or mismatched path | Planned |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| D-01 | What taxonomy should govern skill grouping? | 2 top-level groups: `engineering` and `productivity`. | Clean, intuitive separation matching user request without over-fragmentation. | 4+ micro-folders or monolithic single folder. | `docs/decisions/0020-categorical-skill-grouping-and-group-indexes.md` |
| D-02 | How should group README synchronization be enforced? | Built-in invariant check in `scripts/validate-context.mjs`. | Guarantees index notes never drift from disk reality during CI/doctor runs. | Manual developer reminders without tooling checks. | `scripts/validate-context.mjs` |

### Unknowns and blockers

- *None.*

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | Phase 1 (File Structure) | Skills moved to `skills/engineering/` and `skills/productivity/`; `README.md` authored in `skills/`, `skills/engineering/`, and `skills/productivity/` | `skills/engineering/`, `skills/productivity/` | File existence checks | Verified |
| AC-02 | Phase 2 (Validation Engine) | `scripts/validate-context.mjs` enforces group `README.md` existence and skill link completeness | `scripts/validate-context.mjs` | `node scripts/validate-context.mjs` | Verified |
| AC-03 | Phase 2 (Harness Resolution) | `scripts/context-core.mjs` and `app/cli/core/indexer.mjs` resolve nested skills cleanly | `scripts/context-core.mjs`, `app/cli/core/indexer.mjs` | `node scripts/context.mjs resolve "/plan new feature"` | Verified |
| AC-04 | Phase 3 (Documentation & ADR) | `docs/decisions/0020-...`, `docs/Skills.md`, `docs/guide/skills.md` updated with group hierarchy | ADR & Docs | Obsidian wiki link validation | Verified |
| AC-05 | Phase 3 (Evals & Doctor) | All 21 evaluations updated and pass; `context-manifest.json` and `context-lock.json` updated; `doctor` passes 100% | `evals/`, manifest, lockfile | `node scripts/context.mjs doctor` | Verified |

## Scope

- **In Scope:**
  - Moving 12 skills and companion resources into `skills/engineering/` and `skills/productivity/`.
  - Authoring `skills/README.md`, `skills/engineering/README.md`, and `skills/productivity/README.md`.
  - Updating `scripts/validate-context.mjs` with group README validation.
  - Updating `scripts/context-core.mjs`, `app/cli/core/indexer.mjs`.
  - Updating `docs/Skills.md`, `docs/guide/skills.md`, and `docs/decisions/0020-...`.
  - Updating `evals/` test cases and datasets.
  - Updating `context-manifest.json` and `context-lock.json`.
- **Non-goals:**
  - Changing skill contents, prompts, or rules behavior.

## Constraints and decisions

- Frontmatter in `SKILL.md` files must remain strictly `name` and `description`.
- Zero external dependencies (pure Node.js ES modules).

## Phases

- [x] `phase-01-directory-structure-and-group-readmes.md` — Phase 1: Skill reorganization and group READMEs
- [x] `phase-02-validation-engine-and-harness-resolution.md` — Phase 2: Validator enforcement and harness resolution
- [x] `phase-03-evaluations-mocs-adr-and-locking.md` — Phase 3: ADR, documentation maps, evaluations, manifest and lockfile

## Verification

- `node scripts/validate-context.mjs` — PASS
- `node evals/run-evals.mjs` — 21/21 PASS
- `node scripts/context.mjs doctor` — 100% HEALTHY

## Deviations

*None.*

## Result

Successfully categorized all 12 procedural skills into `skills/engineering/` and `skills/productivity/`, authored dedicated group `README.md` index files, built automated group README synchronization enforcement into `scripts/validate-context.mjs`, updated MOCs, guides, ADR 0020, and all evaluations, with 100% test and diagnostic health.
