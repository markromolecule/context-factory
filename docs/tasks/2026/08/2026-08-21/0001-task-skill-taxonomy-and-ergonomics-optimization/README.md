---
title: "Skill Taxonomy & Slash Ergonomics Optimization"
type: task
status: completed
created: "2026-08-21"
tags: [task, skills, workflows, orchestration, slash-commands, ergonomics, taxonomy]
---

# Skill Taxonomy & Slash Ergonomics Optimization

## Outcome

Streamline and optimize the Context Factory skill taxonomy, slash commands, and developer tooling:
1. **Ergonomic Naming:** Convert verbose compound skill names (e.g. `skills/execution-plan`, `skills/implementation-plan`, `skills/typescript-diagnostics`) into crisp, single-word or short action names (`skills/execution`, `skills/plan`, `skills/typescript`, etc.) for seamless IDE slash-command completions (`/execution`, `/plan`, `/grill`, `/verify`, `/tsc`, `/adr`).
2. **New Developer Velocity Skills:** Scaffold 4 high-leverage engineering skills (`api-contract`, `database-query`, `component-craft`, `test-suite`) to maximize productivity when bridging `context-factory` into client codebases.
3. **Taxonomy Realignment:** Clarify and enforce the structural boundary between multi-stage gated **Workflows** and on-demand procedural **Skills**.
4. **Synchronized Integrity:** Update manifest, lockfile, harness scripts, root orchestrators (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`), agent prompts, and vault docs with 100% passing tests and doctor verification.

---

## Pre-planning record

### Actors and goals

- **Developer / IDE User:** Wants fast, intuitive slash commands (`/execution`, `/plan`, `/grill`, `/verify`) that autocomplete with minimum typing in IDEs (Antigravity IDE, Claude Code, Cursor, Windsurf).
- **AI Orchestrator & Subagents:** Needs clean categorization so on-demand skills are never misrouted as multi-stage project lifecycles.
- **Fullstack Engineer (Downstream):** Needs immediate access to specialized development procedures (API contracts, DB optimization, component crafting, test scaffolding) when `context-factory` is bridged to a target repo.

### Domain language

- **Workflow:** A macro, sequential delivery lifecycle with discrete entry prerequisites, phased steps, quality gates, and stop conditions (e.g. `new-project-delivery.md`, `feature-delivery.md`).
- **Skill:** An on-demand procedural capability or specialized tool invoked directly via a slash command or utilized during a workflow step (e.g. `skills/execution`, `skills/plan`, `skills/zod`).
- **Slash Trigger:** A prefix command (e.g. `/execution`, `/plan`, `/fix`) recognized by IDE auto-complete and harness regex routers.
- **4-Layer Test Suite:** Dedicated test files spanning Data (`*.data.test.ts`), Service (`*.service.test.ts`), Controller (`*.controller.test.ts`), and Route (`*.routes.test.ts`).

### Scenario coverage

| ID | Actor and situation | Preconditions | Expected outcome | Failure/recovery | Status |
|---|---|---|---|---|---|
| SC-01 | User types `/execution` in IDE chat | Task plan approved under `docs/tasks/` | `/execution` triggers `skills/execution/SKILL.md` directly | Legacy regex fallback continues to recognize `/exec` and `execution-plan` | Completed |
| SC-02 | User types `/plan` in IDE chat | Discovery record completed | `/plan` triggers `skills/plan/SKILL.md` to scaffold tasks | Fallback recognizes `/plan` and `implementation-plan` | Completed |
| SC-03 | User triggers `/grill` on ambiguous brief | Raw feature brief provided | `/grill` launches `skills/grill/SKILL.md` pre-planning discovery | Blocks premature coding | Completed |
| SC-04 | User bridges factory to build API endpoint | Needs OpenAPI/Scalar + Hono/Express route | Invokes `/api-contract` to design contract, schemas, and client SDK | Boundary validation ensures zero type leakage | Completed |
| SC-05 | User bridges factory to optimize SQL | Query bottleneck identified | Invokes `/database-query` for index tuning and cursor pagination | Analyzes query plan and provides Kysely/Prisma patterns | Completed |
| SC-06 | Harness CLI runs doctor audit | All skill renames and new skills added | `node scripts/context.mjs doctor` passes with 0 errors | Synchronizes manifest and lockfile | Completed |

### Decision ledger

| ID | Question | Decision | Evidence or rationale | Alternatives rejected | Artifact |
|---|---|---|---|---|---|
| DEC-01 | How should skill directories and frontmatter be named? | Crisp single-word or short-phrase names (`execution`, `plan`, `grill`, `verify`, `adr`, `tsc`, `zod`, `security`, `explore`) | Maximizes ergonomics in IDE slash palettes | Long compound names (`execution-plan`, `implementation-plan`) | `docs/decisions/0012-skill-taxonomy-and-slash-ergonomics-optimization.md` |
| DEC-02 | How to ensure backward compatibility for existing prompts? | Support both streamlined names and legacy aliases in `scripts/context-core.mjs` regex matchers | Prevents breaking automated evaluations and existing habits | Strict breaking rename with zero aliases | `scripts/context-core.mjs` |
| DEC-03 | What new skills should be added for downstream projects? | Add `api-contract`, `database-query`, `component-craft`, and `test-suite` | Fills critical gaps when context-factory is bridged to fullstack repos | Keeping only factory-internal skills | `skills/` |
| DEC-04 | How should Workflows and Skills interact? | Workflows orchestrate lifecycles; Skills provide the tactical procedures invoked within them | Preserves clean separation of concerns | Merging skills into workflows | `orchestrator/SHARED.md` |

### Unknowns and blockers

- *None.* All current workflows, skills, scripts, and evaluation cases have been mapped and verified.

---

## Acceptance criteria

| ID | Source goal/scenario/decision | Criterion | Implementation | Verification | Status |
|---|---|---|---|---|---|
| AC-01 | DEC-01 / SC-01 | `skills/execution-plan` renamed to `skills/execution` with updated frontmatter and references | Directory rename + frontmatter `name: execution` | `node scripts/context.mjs resolve "/execution task"` | Completed |
| AC-02 | DEC-01 / SC-02 | `skills/implementation-plan` renamed to `skills/plan` | Directory rename + frontmatter `name: plan` | `node scripts/context.mjs resolve "/plan new feature"` | Completed |
| AC-03 | DEC-01 / SC-03 | `skills/grill-with-docs` renamed to `skills/grill` | Directory rename + frontmatter `name: grill` | `node scripts/context.mjs resolve "/grill new idea"` | Completed |
| AC-04 | DEC-01 | Remaining skills renamed to short identifiers (`adr`, `verify`, `security`, `typescript`, `zod`, `explore`) | Directory renames + frontmatter updates | `node scripts/context.mjs doctor` | Completed |
| AC-05 | DEC-03 / SC-04-05 | 4 new developer skills created (`api-contract`, `database-query`, `component-craft`, `test-suite`) | Create `SKILL.md` under respective `skills/` subdirs | Manifest inclusion & doctor validation | Completed |
| AC-06 | DEC-02 | `scripts/context-core.mjs` updated with updated routing hints and regexes | Update `ROUTING_HINTS`, `ACTION_TERMS`, and skill selectors | Run test evals | Completed |
| AC-07 | DEC-04 | Root orchestrators, docs, vault maps, and ADR-0012 updated | Synchronize Markdown links and orchestrator dispatch tables | Wiki link verification | Completed |
| AC-08 | SC-06 | `context-manifest.json` and `context-lock.json` regenerated and green | Run `context.mjs lock` and `doctor` | Output exit code 0 | Completed |

---

## Scope

- Renaming existing 9 skills to concise identifiers (`execution`, `plan`, `grill`, `adr`, `verify`, `security`, `typescript`, `zod`, `explore`).
- Scaffolding 4 new high-value skills (`api-contract`, `database-query`, `component-craft`, `test-suite`).
- Updating `scripts/context-core.mjs` and `evals/cases/`.
- Updating all orchestrators, agents, and vault documentation.
- Generating ADR 0012.

## Non-goals

- Refactoring the core harness engine (`orchestrator/runner.mjs`).
- Modifying backend rules or database schemas under `rules/`.

## Constraints and decisions

- Maintain full backward compatibility for slash triggers and regex keywords.
- Zero broken wiki links across all markdown files.
- All evaluation cases in `evals/` must pass deterministically.

---

## Phases

- [x] `phase-01-skill-renaming-and-frontmatter.md` — Phase 1: Rename Existing Skills & Update Frontmatter
- [x] `phase-02-scaffold-developer-skills.md` — Phase 2: Scaffold 4 High-Leverage Developer Skills
- [x] `phase-03-orchestration-and-harness.md` — Phase 3: Update Context Core Router, Manifest & Evals
- [x] `phase-04-orchestrators-and-vault-docs.md` — Phase 4: Sync Orchestrators, Agents, Vault Docs & ADR-0012
- [x] `phase-05-verification-and-lock.md` — Phase 5: Regenerate Lockfile & Run Doctor Verification

---

## Verification

- `node scripts/context.mjs doctor` — Passed with 0 errors and valid lockfile (`097ba9eb8414199b76c195b0a5fcbfeba9c2d9835eb42aa7cfdfec6b12097d67`).
- `node evals/run-evals.mjs` — All 12/12 evaluation test suites passed in 47ms.

## Deviations

- *None.*

## Result

- All 16 skills, 9 workflows, orchestrators, adapters, subagent system prompts, and vault docs are synchronized and locked.

