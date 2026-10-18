---
title: "Agent Harness Configuration for .agents and .claude"
type: context
status: ready
created: "2026-10-18"
tags: [context, harness, config, agents, claude, codex, antigravity]
feature: "agent-harness-configuration"
---

# Agent Harness Configuration for .agents and .claude Context Specification

## 1. Overview & Objective

- **Problem Statement:** The repository's AI agent harness directories (`.agents/` and `.claude/`) contain outdated, unconfigured, or inconsistent files:
  1. `.agents/skills.json` has a JSON syntax error (missing comma) and incomplete path definitions.
  2. `.agents/config.toml` is currently empty (0 bytes), lacking harness execution, model selection, sandbox, and feature settings.
  3. `.agents/skills/` contains legacy flat symlinks where workflows are prefixed with `workflow-*` while procedural skills are flat, not reflecting the restructured `skills/` taxonomy (`engineering/`, `productivity/`, `workflows/`).
  4. `.agents/README.md` and `.agents/hooks.json` are empty.
  5. `.claude/CLAUDE.md` is empty (0 bytes), lacking authoritative instructions for Claude Code.
  6. `.claude/skills/` only contains the 6 `workflow-*` symlinks, completely lacking the 12 procedural skills (`execute`, `plan`, `test`, `context`, `grill`, etc.).
- **Business / User Value:** Establish a robust, high-performance, cross-IDE agent harness configuration for Google Antigravity, OpenAI Codex, Claude Code, and Gemini CLI. This ensures all skills, workflows, subagents, and governance rules are automatically discovered, cleanly structured, and operational without syntax errors or missing links.
- **Success Criteria:**
  - `.agents/skills.json` is valid JSON declaring `skills/engineering`, `skills/productivity`, and `skills/workflows`.
  - `.agents/config.toml` is fully configured with model defaults, sandbox permissions, feature flags, skill context budgets, and agent mappings.
  - `.agents/README.md` documents the harness architecture, loading priority, and configuration options.
  - `.agents/skills/` accurately exposes all 12 procedural skills and 6 core workflows cleanly in a hybrid structure (both categorical subdirectories and flat canonical symlinks).
  - `.claude/CLAUDE.md` provides clear, authoritative guidance referencing `orchestrator/SHARED.md`.
  - `.claude/skills/` exposes all 12 procedural skills and 6 workflows.
  - `node scripts/context.mjs doctor` reports 100% HEALTHY.

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As an engineer using Google Antigravity, I want the harness to automatically discover all skills across `engineering`, `productivity`, and `workflows` via `.agents/skills.json`, so that I have immediate access to `/context`, `/plan`, `/execute`, `/feature-delivery`, etc.*
- *As an engineer using Claude Code, I want `.claude/CLAUDE.md` to guide the agent and `.claude/skills/` to provide both procedural skills and workflows, so that slash commands and lifecycle steps work natively.*
- *As an engineer using OpenAI Codex CLI or OpenCode, I want `.agents/config.toml` to specify model defaults, permissions (`sandbox_mode = "workspace-write"`), context limits, and skill declarations, so that execution is deterministic and safe.*

### Functional Requirements

- [ ] **FR-01 (.agents/skills.json):** Fix JSON syntax error and ensure valid array of path entries for `skills/engineering`, `skills/productivity`, and `skills/workflows`.
- [ ] **FR-02 (.agents/config.toml):** Author a complete TOML configuration covering `model`, `model_provider`, `sandbox_mode`, `approval_policy`, `[features]`, `[skills]`, `[subagents]`, and `[hooks]`.
- [ ] **FR-03 (.agents/README.md & hooks.json):** Document the `.agents` structure, discovery mechanisms, and provide clean default lifecycle hooks.
- [ ] **FR-04 (.agents/skills alignment):** Implement hybrid dual-support in `.agents/skills/`:
  - Categorical subdirectories (`engineering/`, `productivity/`, `workflows/`) mirroring `skills/`.
  - Root-level flat symlinks for all 12 procedural skills (`execute`, `plan`, `test`, `context`, etc.).
  - Root-level flat symlinks for all 6 workflows using both canonical names (`feature-delivery`, `defect-resolution`, etc.) and backward-compatible aliases (`workflow-feature-delivery`, etc.).
- [ ] **FR-05 (.claude configuration):** Author `.claude/CLAUDE.md` referencing `orchestrator/SHARED.md`, and populate `.claude/skills/` with symlinks for all 12 procedural skills and 6 workflows (both canonical and `workflow-*` names).
- [ ] **FR-06 (Diagnostic Verification):** Ensure `node scripts/context.mjs doctor` and evaluations pass without findings.

### Edge Cases & Failure Modes

| Situation | Expected Behavior |
| --- | --- |
| Tool scanning 1-level deep in `.agents/skills/` | Direct symlinks exist so flat scanning discovers all skills. |
| Tool supporting hierarchical `skills.json` | Scans `skills/engineering`, `skills/productivity`, `skills/workflows` directly. |
| Invocation of workflow with or without `workflow-` prefix | Both `/feature-delivery` and `/workflow-feature-delivery` resolve cleanly. |
| Host repository vs. factory root | Bridge generator and local harness configurations remain compatible without collision. |

## 3. Technical & Architectural Context

- **Affected Layers:** Agent harness configuration (`.agents/`, `.claude/`).
- **Governance:** `orchestrator/SHARED.md` is the authoritative orchestration contract.
- **Reference Files:**
  - `.agents/skills.json`
  - `.agents/config.toml`
  - `.agents/README.md`
  - `.agents/hooks.json`
  - `.claude/CLAUDE.md`
  - `.claude/skills/`
  - `skills/engineering/` (5 skills)
  - `skills/productivity/` (7 skills)
  - `skills/workflows/` (6 workflows)
  - `agents/` (7 subagents: architect, ba, data, devops, pm, threat, ux)

## 4. Scope & Boundaries

- **In Scope:**
  - Configuring `.agents/` (`skills.json`, `config.toml`, `README.md`, `hooks.json`, `skills/`).
  - Configuring `.claude/` (`CLAUDE.md`, `skills/`, `commands/README.md`, `hooks/README.md`).
  - Verifying diagnostics with `scripts/context.mjs doctor`.
- **Out of Scope:**
  - Modifying canonical skill source markdown files under `skills/`.
  - Re-introducing deleted/pruned workflows.

## 5. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source Path / Reference | Verification State | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | `.agents/skills.json` | verified | Missing comma between line 8 and 9 causing parse failure | Must fix syntax to restore valid JSON |
| E-02 | `.agents/config.toml` | verified | 0 bytes (empty) | Needs full TOML configuration for agent harness |
| E-03 | `.claude/CLAUDE.md` | verified | 0 bytes (empty) | Needs authoritative Claude Code instruction set |
| E-04 | `.claude/skills/` | verified | Only has 6 `workflow-*` symlinks, missing 12 procedural skills | Add symlinks for all procedural skills |
| E-05 | `.agents/skills/` | verified | Has 18 symlinks (12 procedural + 6 `workflow-*`), but lacks categorical grouping | Implement hybrid dual-structure |

### Unknowns & Blockers

| ID | Question or Gap | Classification | Owner | Blocks Readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | How should `.agents/skills/` present the workflow and category taxonomy? | decision | User | no | Confirmed: Hybrid/Dual-Support with categorical subdirectories (engineering/, productivity/, workflows/) plus flat canonical and aliased symlinks. |

### Discovery Handoff

- **Allowed Recipients:** `grounding`, `grill`
- **Forbidden Direct Recipients:** `plan`, `plan-review`, `execute`
- **Ready for Grill:** yes
