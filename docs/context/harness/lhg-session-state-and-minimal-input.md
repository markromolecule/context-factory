---
title: "LHG Architecture: Minimal Input and Session State Primitives"
type: context
status: ready
created: "2026-10-01"
tags: [context, harness, loop, graph, session, context-window, token-optimization]
feature: "lhg-session-state-and-minimal-input"
---

# LHG Architecture: Minimal Input and Session State Primitives Context Specification

## 1. Overview & Objective

- **Problem Statement:**  
  1. **Context Window Saturation Degradation (>70% Context Load):** As AI sessions progress past 20+ turns with extensive bash outputs, file contents, and iterative diffs, LLM context windows reach 60%–70%+ capacity. At this threshold, models exhibit severe degradation: attention dilution ("lost in the middle"), hallucination of deprecated requirements, loss of negative constraints, slower response generation, and degraded code quality.
  2. **Lack of Clean Session Handoff Primitives:** There is currently no standardized, deterministic mechanism to save session state into a compact snapshot, wipe the context window, and resume execution in a fresh session with 0% historical conversational baggage.
  3. **High-Input / Verbose Overhead across Skills, Rules, and Workflows:** Many agent interactions currently demand verbose prompts or load excessive peripheral context, violating the core principle of **LHG (Loop - Harness - Graph)**: *minimal input to achieve maximal, deterministic output*.

- **Business & Developer Value:**  
  - Eliminates context exhaustion failures by enabling clean session resets at ~50–60% context usage.
  - Reduces token consumption and API costs by 60–80% via high-density rule/skill design and compact session handoff packets.
  - Improves reasoning precision, adherence to architectural guardrails, and developer ergonomics: single-word slash commands or minimal triggers produce fully formed, verified outcomes.

- **Success Criteria:**
  - Dedicated `session` skill (`skills/productivity/session/SKILL.md`) providing `/session save`, `/session resume`, `/session status`, and `/session clear`.
  - Deterministic session serializer/loader implemented in harness (`scripts/session-core.mjs` and `app/cli/commands/session.mjs`, accessible via `node scripts/context.mjs session:<save|resume|status|clear>`).
  - Session checkpoints persist compact state (<1.5k tokens) capturing: active task & unit pointer, git branch/worktree, staged/modified file diffs, working memory (facts, decisions, blockers), test status, and next immediate cold-start action.
  - Audit and density optimization across rules, skills, and workflows to guarantee minimal input triggers and high-density, fluff-free directives.
  - Context resolution harness (`scripts/context-core.mjs`) enforces strict minimal-token bundle budgets and stack fences.
  - `node scripts/context.mjs doctor` passes with all evaluations green, manifest synchronized, and lockfile updated.

### Decision Ledger

| ID | Status | Decision | Rationale / Authority |
| --- | --- | --- | --- |
| D-01 | decided | Adopt a dual-layer checkpoint architecture: machine-readable JSON in `.context/sessions/<id>.json` and human/LLM-readable `.tmp/SESSION_RESUME.md`. | Balances deterministic CLI machine validation with frictionless cold-start resumption in any AI IDE. |
| D-02 | decided | Implement high-density rule and skill refactoring coupled with strict token budget fencing in `scripts/context-core.mjs`. | Ensures minimal input prompts produce maximal output without loading redundant or conversational context fluff. |
| D-03 | decided | Introduce `skills/productivity/session/SKILL.md` with explicit slash commands `/session save`, `/session resume`, `/session status`, `/session clear`. | Provides ergonomic IDE interaction points matching Context Factory slash conventions. |
| D-04 | decided | Validate session persistence against a canonical JSON schema (`schemas/session-state.schema.json`). | Guarantees contract stability and backward compatibility across IDE versions and CLI adapters. |
| D-05 | decided | Embed session reset guidance in `orchestrator/SHARED.md` advising session checkpoints whenever active context reaches ~60%. | Establishes a standard operating threshold to prevent LLM attention dilution and hallucination. |

---

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a developer executing a multi-phase task, I want to type `/session save` before my context window saturates, so that my exact task state, memory, and next steps are serialized to a portable `.tmp/SESSION_RESUME.md` and `.context/sessions/<id>.json`.*
- *As an agent starting in a fresh IDE session, I want to type `/session resume` (or read `.tmp/SESSION_RESUME.md`), so that I instantly pick up the exact next task unit with 98% fresh context headroom and zero conversational baggage.*
- *As an engineer invoking skills and workflows, I want minimal, single-token or single-phrase inputs (e.g., `/test`, `/review`, `/plan`, `/exec`, `/session`) that leverage the Harness and Graph to produce maximal, high-quality output without repetitive prompt boilerplate.*

### Functional Requirements

- [ ] **FR-01: Session State Schema & Persistence:** Define a canonical JSON schema (`schemas/session-state.schema.json`) and dual-format output: machine-readable `.context/sessions/<session-id>.json` and human/LLM-readable `.tmp/SESSION_RESUME.md`.
- [ ] **FR-02: Session CLI Commands:** Implement `node scripts/context.mjs session:save`, `session:resume`, `session:status`, and `session:clear` in `app/cli/commands/session.mjs` and `scripts/harness-cli.mjs`.
- [ ] **FR-03: Session Productivity Skill:** Author `skills/productivity/session/SKILL.md` with ergonomic slash command triggers (`/session`, `/session-save`, `/session-resume`, `[SESSION]`).
- [ ] **FR-04: Minimal Input Density Audit for Rules & Skills:** Screen all rules (`rules/`), skills (`skills/`), and workflows (`workflows/`) to eliminate conversational fluff, enforce high instruction density, and define tight trigger keywords.
- [ ] **FR-05: Harness Budget & Token Fencing:** Update `scripts/context-core.mjs` and `orchestrator/runner.mjs` to track resolved context size and warn when context payload exceeds recommended density thresholds.
- [ ] **FR-06: Task & Worktree Integration:** Ensure `session:save` seamlessly detects active git worktrees (`scripts/worktree.mjs`) and active task unit files (`docs/tasks/YYYY/MM/...`).

### Edge Cases & Failure Modes

- **Orphaned / Stale Session:** If the codebase changed significantly since the session was saved, `session:resume` validates git commit hash and flags file drift before applying state.
- **Multiple Concurrent Worktrees/Tasks:** Session files are keyed by branch or task ID to prevent cross-task overwrites.
- **Missing Task Pointer:** If session save is called outside an active task directory, fallback to recording repository working tree diff and free-form scratchpad notes.
- **Corrupt Checkpoint File:** Graceful fallback to `git status` + `docs/tasks/` inspection if a session `.json` file is malformed.

---

## 3. Technical & Architectural Context

- **Affected Layers:**
  - CLI: `app/cli/commands/session.mjs`, `scripts/harness-cli.mjs`, `scripts/context.mjs`.
  - Core Logic: `scripts/session-core.mjs` (session serialization, diff summarization, cold-start prompt generation).
  - Orchestrator: `orchestrator/SHARED.md` (contract update for session lifecycle and context budget fence).
  - Skills: `skills/productivity/session/SKILL.md`.
  - Schemas: `schemas/session-state.schema.json`.
  - Documentation: `docs/ARCHITECTURE.md`, `docs/Skills.md`, `docs/decisions/0025-*.md`.
- **Existing Files to Inspect / Integrate:**
  - `scripts/context-core.mjs`
  - `scripts/worktree.mjs`
  - `scripts/task-workflow.mjs`
  - `orchestrator/runner.mjs`
  - `context-manifest.json`

---

## 4. Scope & Boundaries

- **In Scope:**
  - Deterministic session serialization (`save`), deserialization (`resume`), status query (`status`), and cleanup (`clear`).
  - Dual storage: machine-readable JSON in `.context/sessions/` + portable zero-friction markdown in `.tmp/SESSION_RESUME.md`.
  - Integration with git worktrees and phased task unit files.
  - Minimal input density audit guidelines for rules, skills, and workflows.
  - Dedicated `session` skill and ADR 0025.
- **Out of Scope / Non-Goals:**
  - Direct interception of IDE proprietary memory APIs (keeps implementation portable across Antigravity, Cursor, Windsurf, VS Code, and CLI).
  - Automated continuous recording of every keystroke (session save is a discrete checkpoint triggered intentionally at logical task intervals or context limits).

---

## 5. References & External Context

- [[docs/decisions/0004-deterministic-context-harness|ADR 0004: Deterministic Context Harness]]
- [[docs/decisions/0008-pluggable-ai-execution-harness|ADR 0008: Pluggable AI Execution Harness]]
- [[docs/decisions/0011-progressive-contract-driven-loop-engineering|ADR 0011: Progressive Contract-Driven Loop Engineering]]
- [[docs/decisions/0019-loop-engineering-primitives|ADR 0019: Loop Engineering Primitives]]
- [[docs/decisions/0024-unit-execution-review-and-testing-skills|ADR 0024: Unit Lifecycle Primitives]]
- [[docs/decisions/0025-lhg-minimal-input-and-session-state-primitives|ADR 0025: LHG Architecture: Minimal Input and Session State Checkpoint Primitives]]
