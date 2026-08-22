---
title: "Execution Control, Code Review Optimization Workflow, and Modular Refactoring Skill"
type: context
status: ready
created: "2026-08-22"
tags: [context, execute, refactor, optimization, workflow, skills]
feature: "execution-control-and-modular-refactoring"
---

# Execution Control, Code Review Optimization Workflow, and Modular Refactoring Skill Context Specification

## 1. Overview & Objective

- **Problem Statement:** 
  1. The current execution skill (`execution`) allows multi-phase implementations to continue across phases without mandatory developer review pauses, leading to accumulated errors and reduced developer visibility. Furthermore, its naming (`execution`) is slightly mismatched with single-word verb slash commands (`/execute`).
  2. There is no dedicated post-implementation review and optimization workflow that audits generated code affected by an implementation plan for efficiency, cleanliness, dead code, and query/performance optimization.
  3. Lengthy, monolithic files handling multiple mixed concerns often emerge during rapid implementation without a dedicated, standardized `refactor` skill to guide modular decomposition into maintainable, cohesive files.
- **Business / User Value:**
  - **Granular Control & Safety:** Enforces strict manual verification gates between execution phases, preventing cascading errors and giving developers 100% oversight.
  - **High-Quality Code Guardrail:** Guarantees that code generated from implementation plans is audited, optimized, and free of bloat or performance bottlenecks before reaching production.
  - **Maintainability & Scalability:** Provides an autonomous and manual modularization toolkit (`refactor`) to prevent god-files and enforce clean vertical separation of concerns.
- **Success Criteria:**
  - `skills/execution` is renamed to `skills/execute` with slash command `/execute` (`/exec`, `[EXEC]`).
  - `execute` strictly stops at the completion of *each individual phase*, reporting full evidence and requesting developer inspection before proceeding to subsequent phases.
  - A new workflow `workflows/code-review-and-optimization.md` (or `code-optimization-and-review.md`) is introduced to systematically audit and optimize plan-affected files.
  - A new procedural skill `skills/refactor/SKILL.md` (`/refactor`, `[REFACTOR]`) is created to decompose oversized files into modular, synchronized units (usable autonomously by LLM judgment or manually).
  - All manifest inventories, orchestrator contracts, subagents, and doctor checks pass with 100% synchronization.

---

## 2. Requirements & User Stories

### User Stories / Scenarios
- **Scenario 1 (Phase-by-Phase Developer Checkpoint):**
  *As a developer executing a 4-phase implementation plan, I want the agent to stop immediately after completing Phase 1 and present verification evidence, so that I can inspect the diffs and verify behavior before authorizing Phase 2.*
- **Scenario 2 (Post-Implementation Optimization & Guardrail):**
  *As a tech lead reviewing a newly generated feature slice, I want to run a dedicated optimization workflow that inspects affected files, suggests performance improvements, and checks for dead code/unoptimized database queries, so that our codebase remains pristine and efficient.*
- **Scenario 3 (Autonomous & Manual Modular Refactoring):**
  *As an AI assistant implementing a complex component or service that exceeds 200+ lines or handles multiple mixed concerns, I want to invoke the `refactor` skill to extract custom hooks, helper utilities, and sub-components into cohesive files that stay in sync, without breaking external contracts.*

### Functional Requirements
- [ ] **FR-01: Rename `execution` to `execute`:**
  - Rename directory `skills/execution/` to `skills/execute/`.
  - Update YAML frontmatter `name: execute` and description to emphasize `/execute`, `/exec`, `[EXEC]`.
  - Update `context-manifest.json`, `orchestrator/SHARED.md`, entrypoint contracts, and subagents.
- [ ] **FR-02: Strict Mandatory Phase-Stop Gate:**
  - In `skills/execute/SKILL.md`, replace the clause permitting continuous multi-phase execution with an explicit **MUST STOP** mandate.
  - The agent MUST execute exactly one phase per invocation.
  - Upon completing the phase tasks, the agent MUST run verification commands, update the phase artifact checkbox/status, present the diff/evidence summary, and halt execution.
  - The agent MUST NOT start the next phase until the developer explicitly prompts to proceed.
- [ ] **FR-03: Code Review & Optimization Workflow (`workflows/code-review-and-optimization.md`):**
  - Create a new workflow triggered via `/optimize`, `/review-code`, `[OPTIMIZE]`, `[CODE_REVIEW]`, or after implementation plan phases.
  - Define clear stages:
    1. **Diff & Contract Pinning:** Identify all files touched by the implementation plan.
    2. **Code Quality & Optimization Audit:** Check ESR query indexing, TypeScript type narrowing, React render performance (unnecessary re-renders, hook dependency arrays), error boundaries, and security guardrails.
    3. **Modularity Check:** Identify files that are overly lengthy or violate single-responsibility principles.
    4. **Refactoring & Clean Output Proposal:** Offer structured 1-3-1 recommendations or invoke `skills/refactor` for modular breakdown.
    5. **Regression Verification:** Run test suites and build gates to ensure optimizations preserve identical behavior.
- [ ] **FR-04: Modular Refactoring Skill (`skills/refactor/SKILL.md`):**
  - Create a new skill under `skills/refactor/SKILL.md` with resource `skills/refactor/agents/openai.yaml`.
  - Define procedure for:
    1. Identifying extraction boundaries (splitting monolithic UI components into presentation + logic hook + sub-components; splitting backend god-services into domain handlers + query helpers).
    2. Creating cohesive, well-named new files.
    3. Updating barrel exports and import paths across all consumers.
    4. Preserving public API contracts and type signatures.
    5. Running automated tests to prove behavioral invariance.
  - Enable both autonomous execution (LLM proactive judgment when files exceed complexity thresholds) and manual invocation (`/refactor <path>`).

### Edge Cases & Failure Modes
- **Edge Case 1 (Single-Phase Plans):** For tasks with only one phase, `execute` completes the phase, halts, and reports final task completion without prompting for nonexistent subsequent phases.
- **Edge Case 2 (Failing Phase Verification):** If a phase's tests fail during `execute`, the agent MUST NOT advance or pretend the phase succeeded; it must report the failure, keep the checkbox unchecked, and await user instructions.
- **Edge Case 3 (Over-Refactoring / Premature Abstraction):** The `refactor` skill must avoid speculative micro-abstractions (e.g. creating 10 single-line utility files). It must only modularize when there are clear distinct responsibilities or when file length impairs readability/maintainability.
- **Edge Case 4 (Breaking Consumer Imports):** During modular refactoring, if a symbol is moved to a new file, the original module MUST maintain a re-export or all consumers MUST be updated and typechecked simultaneously.

---

## 3. Technical & Architectural Context

- **Affected Layers & Systems:**
  - Context Factory Skills: `skills/execute/` (renamed from `skills/execution/`), `skills/refactor/` (new).
  - Context Factory Workflows: `workflows/code-review-and-optimization.md` (new), `workflows/feature-delivery.md` (updated).
  - Harness & Scripts: `scripts/context-core.mjs` (regexes for `execute` and `refactor`), `context-manifest.json`, `context-lock.json`.
  - Subagents: `agents/pm-agent/AGENT.md` (skills: `[plan, execute, adr, verify, refactor]`), `agents/ba-agent/AGENT.md`.
  - Orchestrator Contracts: `orchestrator/SHARED.md`, `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `CODEX.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`.
  - Architecture Decision Records: `docs/decisions/0015-execute-skill-strict-phase-stops-and-modular-refactoring.md`.
- **Existing Conventions & Rules to Adhere:**
  - `rules/global/evidence-and-claims.md`: All claims require reproducible verification.
  - `rules/backend/module-architecture.md` & `rules/ui/code-organization.md`: Guide the `refactor` modularization structure.
  - `rules/global/1-3-1-rule.md`: Used by the optimization workflow when proposing structural changes.

---

## 4. UI/UX & Interaction Guidelines

- **Phase Stop Prompting Format:**
  When `execute` completes a phase, it must output a structured checkpoint:
  ```markdown
  ### Phase Completed: Phase 01 — [Phase Title]
  - [x] Task 1.1: [Outcome]
  - [x] Task 1.2: [Outcome]
  
  **Verification Evidence:**
  - Command: `npm test path/to/test.ts` (PASS: 12/12)
  - Files modified: `[list of files]`
  
  ⏸️ **Phase 01 complete. Stopped for developer review.**
  Inspect the changes above. When ready, reply or prompt `/execute Phase 02` to continue.
  ```
- **Refactoring Suggestion Format:**
  When the LLM identifies modularity issues during review/execution:
  > *"💡 Modularity Suggestion: `UserService.ts` is 380 lines and handles both authentication token generation and email dispatch. Would you like me to run `/refactor` to split this into `UserAuthService.ts` and `UserEmailNotifier.ts`?"*

---

## 5. Scope & Boundaries

- **In Scope:**
  - Renaming `execution` skill to `execute` and updating all references across the repo.
  - Adding mandatory strict phase-stop enforcement in `skills/execute/SKILL.md`.
  - Creating `workflows/code-review-and-optimization.md`.
  - Creating `skills/refactor/SKILL.md` and its OpenAI agent interface YAML.
  - Updating all orchestrator contracts, dispatch tables, subagents, manifest, and lockfile.
  - Creating ADR 0015 documenting the architectural changes.
- **Out of Scope / Non-Goals:**
  - Changing the underlying 4-layer database/backend/ui rules structure.
  - Auto-executing destructive file removals without confirmation during refactoring.
  - Modifying external application runtime code (changes apply strictly to the Context Factory harness and playbooks).

---

## 6. References & External Context

- [[docs/templates/Context|Context Specification Template]]
- [[docs/templates/Phase|Phase Execution Template]]
- [[docs/decisions/0013-streamline-procedural-skills-inventory|ADR 0013 — Streamline Procedural Skills Inventory]]
- [[docs/decisions/0014-context-specification-skill-with-embedded-grilling|ADR 0014 — Context Specification Authoring Skill]]
- [[docs/Skills|Skills Master Map]]
- [[docs/Workflows|Workflows Master Map]]
