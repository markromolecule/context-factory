---
title: "LHG Architecture: Minimal Input and Session State Checkpoint Primitives"
type: decision
status: accepted
created: "2026-10-01"
tags: [adr, lhg, session, harness, loop, graph, context-optimization, token-budget]
---

# 0025 — LHG Architecture: Minimal Input and Session State Checkpoint Primitives

## Context

In modern AI-assisted engineering workflows across IDEs (Antigravity, Cursor, Windsurf) and agent CLI runtimes, complex tasks often span 20 to 50+ conversation turns. In long-running sessions, three failure modes routinely emerge:

1. **Context Window Saturation Degradation (>70% Context Load):** When the active context window fills with lengthy command outputs, file contents, and iterative diffs, language models experience severe attention dilution ("lost in the middle"), hallucination of previously discarded requirements, and failure to observe negative constraints.
2. **Loss of Task Momentum Across Sessions:** When an engineer reaches the context saturation threshold, clearing or restarting the session traditionally results in total memory loss, requiring manual re-explanation of the task, active phase, modified files, and architectural decisions.
3. **High-Input Prompt Friction (Violating LHG Ergonomics):** The **LHG (Loop - Harness - Graph)** framework requires *minimal input to produce maximal, deterministic output*. Currently, many skills and workflows lack condensed triggers and high-density directives, requiring engineers to type redundant boilerplate prompts.

A unified, model-neutral primitive is required to save, inspect, clear, and resume task sessions with minimal overhead while pruning token input across all Context Factory skills, rules, and workflows.

## Options considered

### Option 1 (Recommended): Dual-Format Persistent Session Checkpoints + Deterministic CLI/Skill Primitives + High-Density Instruction Fencing

- **Architecture:**
  - Implement a session state serializer and loader (`scripts/session-core.mjs` and `app/cli/commands/session.mjs`, accessible via `node scripts/context.mjs session:<save|resume|status|clear>`).
  - Store session checkpoints in dual format:
    1. Machine-readable, schema-validated JSON (`.context/sessions/<session-id>.json`).
    2. Zero-friction cold-start markdown (`.tmp/SESSION_RESUME.md`) designed to be read immediately by any IDE or model adapter upon launching a fresh session.
  - Checkpoint content encapsulates:
    - Task & Unit pointer (`docs/tasks/.../Unit-X.md`, Phase number, Task ID).
    - Environment & Git state (active branch/worktree, modified/staged files, diff summary).
    - Working memory (verified facts, decisions made, obstacles encountered, active constraints).
    - Verification state (latest test command, green/red status).
    - Next immediate action (cold-start prompt instructions with minimal token payload).
  - Introduce `skills/productivity/session/SKILL.md` with ergonomic triggers (`/session save`, `/session resume`, `/session status`, `/session clear`).
  - Audit and prune verbose prose across `rules/`, `skills/`, and `workflows/`, enforcing concise, high-density constraint tables and tight trigger patterns.
- **Trade-offs:** Requires introducing one new CLI subcommand group and one productivity skill; preserves 100% dependency-free pure ESM architecture and full cross-IDE portability.

### Option 2: Proprietary IDE Extension / Chat Exporting

- Rely on vendor-specific conversation export features (e.g., Cursor conversation exports, VS Code workspace states) and manual re-prompting.
- **Trade-offs:** Heavily fragmented across IDE ecosystems (breaks model neutrality in `orchestrator/SHARED.md`); fails to extract programmatic git diffs or task unit pointers; leaves the developer responsible for manually summarizing context.

### Option 3: Continuous Background Shadow Daemon & Vector Rollups

- Run a background file/process watcher that continuously streams shell inputs, file edits, and agent transcripts into a local vector database or rolling summary daemon.
- **Trade-offs:** Adds heavy runtime complexity, resource contention, background race conditions, non-deterministic summarization errors, and external npm/native dependencies.

## Decision

Adopt **Option 1**.

1. **Implement Session State Primitives in CLI & Harness:**
   - Add `app/cli/commands/session.mjs` with subcommands `save`, `resume`, `status`, and `clear`.
   - Validate session schemas against `schemas/session-state.schema.json`.
   - Output dual format: machine-readable state in `.context/sessions/` and immediate cold-start instructions in `.tmp/SESSION_RESUME.md`.
2. **Introduce Session Productivity Skill:**
   - Author `skills/productivity/session/SKILL.md` with slash commands `/session`, `/session-save`, `/session-resume`, `/session-clear`.
   - Embed session checkpoint advice in `orchestrator/SHARED.md` recommending session resets whenever context window load exceeds ~60%.
3. **Optimize LHG (Loop - Harness - Graph) for Minimal Input:**
   - **Loop:** Standardize execution loops (Inner Loop: test-first -> verify; Session Loop: work -> save checkpoint -> fresh session; Outer Loop: phase gate -> deliver).
   - **Harness:** Provide strict token budgeting in `scripts/context-core.mjs` to prevent bundle bloat.
   - **Graph:** Map minimal triggers and slash commands directly to discrete DAG units and required rule subsets without loading irrelevant domains.
   - **Rules & Skills Density Audit:** Enforce high-density, fluff-free directives across all rules and skills.

## Consequences

- **Positive:**
  - Engineers and agents can gracefully reset saturated sessions (>60–70% capacity) and resume in a fresh chat with 98% context headroom and complete state fidelity.
  - Eliminates context degradation bugs, hallucination of stale code, and negative constraint violations.
  - Significant reduction in LLM inference token costs and latency.
  - Zero lock-in: works identically in Antigravity, Cursor, Windsurf, VS Code, or standalone terminal.
- **Trade-offs / Mitigations:**
  - Checkpoints require active developer or agent discipline to invoke `/session save` before wiping the session.
  - Ephemeral `.tmp/` and `.context/sessions/` directories must be added to `.gitignore`.

## Validation and review date

- Validate via automated CLI tests in `evals/session-checkpoint.test.mjs` and doctor verification.
- Review after 30 multi-turn task executions or by 2026-11-01.
