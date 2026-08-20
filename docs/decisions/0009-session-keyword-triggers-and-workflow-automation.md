---
title: Session Keyword Triggers and Automated Workflow Dispatch
type: decision
status: accepted
created: 2026-08-20
tags: [adr, triggers, workflows, automation, scaffolding, hooks]
---

# 0009 — Session Keyword Triggers and Automated Workflow Dispatch

## Context

Context Factory established deterministic context selection, bundling, and pluggable AI execution in [[docs/decisions/0004-deterministic-context-harness|ADR 0004]] and [[docs/decisions/0008-pluggable-ai-execution-harness|ADR 0008]]. However, during interactive AI coding sessions, triggering multi-stage workflows relied on natural language term scoring, which could occasionally be ambiguous or require verbose prompting. Developers needed a fast, deterministic shorthand (e.g. `/plan`, `/fix`, `/migrate`, `/sec`, `/grill`, `/verify`, `[HOTFIX]`, `[DISCOVERY]`) that instantly loads the exact workflow, domain rules, and subagent persona, alongside automated task scaffolding and quality verification hooks.

## Options considered

1. **Rely Exclusively on Natural Language Term Frequency Scoring:**
   - *Pros:* No special syntax required.
   - *Cons:* Prone to ambiguity when prompts contain mixed domain terms; lacks an explicit developer contract for triggering immediate phase behaviors.
2. **Deterministic Prefix Triggers, Slash Commands, CLI Task Scaffolding, and Quality Hooks:**
   - *Pros:* 100% deterministic resolution with zero ambiguity; instant developer ergonomics across all AI IDEs (Antigravity, Gemini, Claude, Cursor, Windsurf); automated date-partitioned task scaffolding (`task:new`); automated pre/post-execution quality gates.
   - *Cons:* Requires maintaining regex routing patterns and synchronizing entrypoint contracts.
3. **Proprietary IDE-Specific Extension Plugins:**
   - *Pros:* Deep UI integration in one specific IDE.
   - *Cons:* Breaks model neutrality and cross-IDE portability; cannot be evaluated in headless CI workflows.

## Decision

Adopt Option 2. Implement:
1. **High-Priority Prefix & Slash Command Routing in `scripts/context-core.mjs`:** Match leading slash commands (`/plan`, `/fix`, `/migrate`, `/sec`, `/arch`, `/grill`, `/verify`, `/upgrade`, `/release`, `/context`) and bracket tags (`[HOTFIX]`, `[DISCOVERY]`, `[BUG]`, `[FEATURE]`, `[MIGRATION]`) before fuzzy scoring.
2. **Automated Task Scaffolding in `scripts/task-workflow.mjs` & `scripts/harness-cli.mjs`:** Provide `node scripts/harness-cli.mjs task:new <title> [--type <feature|defect|refactor|migration>]` to auto-calculate date partitions (`docs/tasks/YYYY/MM/YYYY-MM-DD/000X-.../`) and interpolate canonical templates (`Task.md`, `Phase.md`).
3. **Synchronized Entrypoint Contracts:** Update [AGENTS.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/AGENTS.md), [GEMINI.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/GEMINI.md), [CLAUDE.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/CLAUDE.md), [CODEX.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/CODEX.md), and IDE configs to enforce prompt prefix dispatch.
4. **Pre/Post-Execution Quality Gate Protocol:** Enforce defect reproduction capture before code changes on `/fix`, and mandate typecheck, test runner, schema validation, and context doctor passes before reporting phase completion.

## Consequences

- Developers can trigger multi-stage workflows with concise prefixes (`/plan`, `/fix`, `/migrate`, `/sec`, `/verify`).
- Task artifact creation is automated, reducing boilerplate and preventing template drift.
- Model entrypoint contracts and adapters share a unified, synchronized trigger matrix.
- Backward compatibility is fully preserved for natural language queries.

## Validation and review date

Review after 50 automated workflow sessions or by 2027-02-20. Measure prefix routing accuracy, scaffolding adoption, and quality gate compliance.
