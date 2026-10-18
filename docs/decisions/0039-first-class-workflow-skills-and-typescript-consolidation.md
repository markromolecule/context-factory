---
title: "First-Class Workflow Skills and Dedicated TypeScript Consolidation"
type: decision
status: accepted
created: "2026-10-16"
tags: [adr, typescript, workflows, skills, cleanup, model-neutral]
supersedes: "0038-host-native-workflow-entries"
---

# 0039 — First-Class Workflow Skills and Dedicated TypeScript Consolidation

## Context

Prior to this decision, Context Factory maintained a dual-layer architecture where multi-stage lifecycle workflows existed as Markdown files in the root directory (`workflows/*.md`), while IDE discovery required an extra adapter wrapper layer in `skills/workflow-entries/workflow-<slug>/SKILL.md` (ADR 0038). This separation created indirection, duplicate maintenance burden, and confusing folder boundaries.

Additionally, the repository root contained numerous model-specific adapter files (`AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`) and corresponding adapters in `orchestrator/`. These files repeated standard instructions rather than providing unique domain value.

Furthermore, following the decommissioning of the Laravel/PHP stack in ADR 0036, Context Factory retained remnants of multi-stack selection logic—including `--stack` and `--stacks` flags in CLI commands, interactive language prompts, and lingering `flutter` checks in `doctor.mjs` and schemas.

## Options Considered

1. **Retain dual wrapper architecture and root files:** Minimal disruption to historical links, but preserves folder clutter, wrapper indirection, and multi-stack abstractions that no longer reflect the project's focus.
2. **Move workflows to `skills/workflows/*.md` with wrappers:** Workflows are moved under `skills/`, but the separate wrapper layer (`skills/workflow-entries/`) remains, maintaining indirection.
3. **First-class workflow skills under `skills/workflows/<slug>/SKILL.md` and complete model-neutral root purge (Chosen):**
   - Workflows become first-class skills with standard YAML frontmatter (`name`, `description`) and authoritative lifecycle policies (phases, quality gates, stop conditions) directly in `skills/workflows/<slug>/SKILL.md`.
   - Obsolete `workflows/` and `skills/workflow-entries/` directories are completely removed.
   - Root model instruction files and `orchestrator/*` adapters are purged; `orchestrator/SHARED.md` and `README.md` serve as the sole model-neutral sources of truth.
   - Multi-stack flags and prompts are eliminated in favor of a dedicated, hardcoded TypeScript environment.

## Decision

Adopt **Option 3**:

1. **First-Class Workflow Skills:** Consolidate all 12 workflows into `skills/workflows/<slug>/SKILL.md`. Each file contains valid skill frontmatter and the full lifecycle orchestration policy.
2. **Symlink Collision Avoidance:** In `.agents/skills/` and `.claude/skills/`, workflow skills are symlinked as `workflow-<slug>` (pointing to `skills/workflows/<slug>`), while procedural skills are symlinked by their short name (e.g., `docs`, `execute`, `plan`). This avoids filesystem collisions (e.g., `skills/productivity/docs` vs `skills/workflows/docs`) while preserving native host discovery (`/workflow-<slug>`, `$workflow-<slug>`).
3. **Model-Neutral Root:** Remove `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `orchestrator/{AGENTS,CLAUDE,CODEX,GEMINI}.md`. `orchestrator/SHARED.md` and `README.md` are the single authoritative contracts.
4. **Dedicated TypeScript Stack:** Hardcode `typescript` as the sole native environment across `conform`, `preflight`, and `resolve`. Remove `flutter` and `laravel` from schemas and doctor diagnostics. Non-TypeScript requests fail closed with informative BLOCKED diagnostics.

## Consequences

- **Developer and Agent Experience:** Agents load workflow policies directly from first-class skills without following redirects or navigating intermediate wrappers.
- **Repository Cleanliness:** Root directory contains only essential project configuration, inventory manifests, and `README.md`.
- **Tooling and Integrity:** Bridge generator, diagnostic doctor, validator harness, and test suites are aligned with zero dangling symlinks and 100% passing evaluations.
- **Supersession:** This decision supersedes ADR 0038.
