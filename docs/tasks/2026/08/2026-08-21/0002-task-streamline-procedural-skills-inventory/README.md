---
title: "Streamline Procedural Skills Inventory & Eliminate Rule Duplications"
type: task
status: planned
created: "2026-08-21"
tags: [task, skills, rules, workflows, orchestration, taxonomy, ergonomics]
---

# Streamline Procedural Skills Inventory & Eliminate Rule Duplications

## Outcome

Streamline the Context Factory skills inventory by strictly enforcing the separation of concerns between **Rules** (declarative engineering constraints and standards in `rules/`) and **Skills** (tactical procedural workflows and interactive tools in `skills/`):
1. **Prune 8 Rule-Duplicate Skills:** Remove `playground`, `typescript`, `zod`, `database-query`, `component-craft`, `backend-module`, `api-contract`, and `test-suite`, which duplicate existing rules codified in `rules/database/`, `rules/ui/`, `rules/backend/`, and `rules/typescript/`.
2. **Standardize 8 Core Procedural Skills:** Retain and optimize the 8 true procedural skills:
   - `grill` (`/grill`, `[GRILL]`, `[DISCOVERY]`) — Requirements discovery and interrogation.
   - `plan` (`/plan`, `[PLAN]`, `[FEATURE]`) — Task breakdown and phased specification authoring.
   - `execution` (`/execution`, `/exec`, `[EXEC]`) — Phased implementation and tracking.
   - `adr` (`/adr`, `/arch`, `[ADR]`) — 1-3-1 architectural trade-off decisions.
   - `verify` (`/verify`, `/release`, `[RELEASE]`, `[QA]`) — Completion claim and evidence auditing.
   - `explore` (`/explore`, `[EXPLORE]`) — Repository and contract discovery.
   - `security` (`/sec`, `/security`, `[SEC]`) — Threat modeling and boundary review.
   - `grounding` (`/grounding`, `/wiki`, `[WIKI]`) — LLM Wiki retrieval and knowledge provenance (renamed from `knowledge-grounding`).
3. **Align Workflows and Subagents:** Ensure all workflows and subagents orchestrate the 8 procedural skills while relying entirely on `rules/` for all coding and architecture standards.
4. **Regenerate Lockfile & Verify:** Update manifest, router, evals, orchestrators, and vault docs; verify 100% passing tests with `node scripts/context.mjs doctor`.

---

## Pre-planning record

### Actors and goals

- **Developer / IDE User:** Wants a clean, focused slash command palette containing only actionable procedural commands without clutter from redundant rules.
- **AI Agent / Orchestrator:** Requires a clean distinction between rules (always/conditionally applied constraints) and skills (step-by-step procedural playbooks).
- **Context Factory Maintainer:** Ensures zero duplication between `skills/` and `rules/`, maintaining a single source of truth for architectural constraints.

### Domain language

- **Rule (`rules/**/*.md`):** An enforceable invariant, architectural boundary, or coding standard that governs code quality and behavior.
- **Skill (`skills/*/SKILL.md`):** An interactive or specialized step-by-step procedure/action that an agent executes when triggered by a slash command or workflow step.
- **Workflow (`workflows/*.md`):** A macro, multi-phase delivery lifecycle with discrete prerequisites, phase sequences, quality gates, and stop conditions.

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | User requests frontend styling in chat | User prompt mentions CSS styling or colors | Harness loads `rules/ui/frontend.md` directly; no redundant playground skill loaded | Prompt-based styling rules apply | Verified |
| SC-02 | User resolves TypeScript compilation error | User prompt mentions type errors or tsc | Harness loads `rules/typescript/type-safety.md` and error rules | TypeScript standards apply directly | Verified |
| SC-03 | User triggers `/grounding` or `/wiki` | User wants canonical wiki information | Triggers `skills/grounding/SKILL.md` | Legacy `/wiki` and `knowledge-grounding` aliases supported | Verified |
| SC-04 | User runs full verification suite | 8 skills and 30 rules present | `node evals/run-evals.mjs` passes 100% and doctor reports valid lockfile | Any broken link or schema mismatch halts build | Verified |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| DEC-01 | Which skills should be pruned? | Delete 8 skills (`playground`, `typescript`, `zod`, `database-query`, `component-craft`, `backend-module`, `api-contract`, `test-suite`) | These are declarative rules already codified in `rules/`, not distinct procedural agent playbooks | Keeping redundant skills alongside existing rules | `docs/decisions/0013-streamline-procedural-skills-inventory.md` |
| DEC-02 | How should knowledge grounding be named? | Rename `skills/knowledge-grounding` $\rightarrow$ `skills/grounding` | Consistent single-word action naming across all 8 skills (`grill`, `plan`, `execution`, `adr`, `verify`, `explore`, `security`, `grounding`) | Keeping multi-word compound name `knowledge-grounding` | `skills/grounding/SKILL.md` |
| DEC-03 | How do workflows consume coding standards? | Workflows reference only the 8 procedural skills and declare mandatory `rules/` for engineering constraints | Eliminates pseudo-skill dependencies in workflow definitions | Creating specialized skills for every workflow phase | `orchestrator/SHARED.md` |

### Unknowns and blockers

- *None.* Grilling session resolved all taxonomy questions.

---

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | DEC-01 / SC-01-02 | 8 rule-duplicate skills removed from `skills/` | Delete 8 folders and clean manifest | `ls skills/` contains exactly 8 items | Verified |
| AC-02 | DEC-02 / SC-03 | `skills/knowledge-grounding` renamed to `skills/grounding` | Directory rename + frontmatter `name: grounding` | `node scripts/context.mjs resolve "/grounding fact"` | Verified |
| AC-03 | DEC-03 | Workflows updated to remove references to deleted skills | Update `workflows/*.md` backticks | Workflow eval tests pass | Verified |
| AC-04 | DEC-01-02 | `context-manifest.json` updated with exactly 8 skills | Update `skills` and `skillResources` arrays | `node scripts/context.mjs doctor` | Verified |
| AC-05 | DEC-01-03 | `scripts/context-core.mjs` updated | Clean `ROUTING_HINTS`, `ACTION_TERMS`, and term scoring | `node evals/run-evals.mjs` passes 100% | Verified |
| AC-06 | DEC-01-03 | Orchestrators, agents, and vault docs synchronized | Update `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `docs/Skills.md` | Wiki link check passes | Verified |
| AC-07 | DEC-01-03 | ADR-0013 created documenting rationale | Author `docs/decisions/0013-streamline-procedural-skills-inventory.md` | Doctor validates ADR | Verified |
| AC-08 | SC-04 | Manifest, lockfile, and doctor check pass with 0 errors | Run `context.mjs lock` and `doctor` | Output exit code 0 | Verified |

---

## Scope

- Removing 8 rule-duplicate skills from `skills/`.
- Renaming `skills/knowledge-grounding` to `skills/grounding`.
- Updating `context-manifest.json`, `scripts/context-core.mjs`, and `evals/`.
- Updating all root orchestrators, subagents, workflows, and vault documentation.
- Authoring ADR-0013.
- Regenerating `context-lock.json` and verifying with doctor.

## Non-goals

- Modifying or removing any files under `rules/` (rules are preserved as canonical standards).
- Modifying harness execution engine (`orchestrator/runner.mjs`).

## Constraints and decisions

- Retain legacy aliases in regex matchers for smooth transition.
- Zero broken wiki links.
- 100% evaluation test pass rate.

---

## Phases

- [x] `phase-01-prune-rule-duplicate-skills.md` — Phase 1: Prune 8 Rule-Duplicate Skills & Rename Grounding Skill
- [x] `phase-02-harness-manifest-and-evals.md` — Phase 2: Update Manifest, Context Router & Evals Suite
- [x] `phase-03-orchestrators-subagents-vault.md` — Phase 3: Synchronize Orchestrators, Subagents, Workflows & ADR-0013
- [x] `phase-04-verification-and-lock.md` — Phase 4: Regenerate Lockfile & Run Complete Doctor Audit

---

## Verification

- `node scripts/context.mjs doctor` — PASSED: 30 rules, 8 skills, 9 workflows, 11 agent resources, 1 knowledge item, 9 evaluations, 151 Markdown files. Context lock is current (`sha256:67ef86e10bfa1194985af64f7a73a2fdacd11ebbf92c8a8af448cb631f496a71`).
- `node evals/run-evals.mjs` — PASSED: 12/12 evaluation test suites passed in 50ms.

## Deviations

- *None.*

## Result

- Successfully streamlined the Context Factory skill taxonomy to 8 pure procedural playbooks, eliminated 8 rule duplications, updated all orchestrators and docs, authored ADR-0013, and verified 100% health under Context Factory 3.5.0.
