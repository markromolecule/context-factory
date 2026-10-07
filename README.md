---
title: Context Factory
type: index
tags: [context-factory, index]
---

# Context Factory

This repository is the source of truth for agent behavior, engineering rules, reusable skills, development workflows, and project knowledge.

## Start here

1. Read [[docs/Home|Home]].
2. Follow [[orchestrator/SHARED|Shared Orchestration Contract]].
3. Select relevant rules through [[docs/Rules|Rules Map]].
4. Select lifecycle orchestration through [[docs/Workflows|Workflows Map]].
5. Invoke specialized procedures through [[docs/Skills|Skills Map]].
6. Inspect tool integrations through [[docs/Connectors|Connectors Map]] and [.mcp.json](.mcp.json).
7. Ground durable knowledge through [[docs/Wiki|LLM Wiki]].
8. Record durable decisions in [[docs/decisions/README|Architecture Decisions]] and work in [[docs/tasks/README|Tasks]] (triaged via [[docs/tasks/INBOX|Triage Inbox]]).
9. Integrate into host repositories using [[docs/guide/cross-workspace-integration|Cross-Workspace Integration Guide]] or `context-cli init`.

## Multi-Editor Bridging & Submodule Onboarding

Context Factory provides first-class, non-destructive bridging for modern AI coding editors:
- **VS Code:** Scaffolds `.github/copilot-instructions.md`, `.vscode/extensions.json`, and merges `.vscode/settings.json` non-destructively.
- **Antigravity:** Live `.agents/` symlinks (`skills/`, `rules/`, `workflows/`, `agents/`), `.agents/skills.json`, and `GEMINI.md`.
- **Cursor:** Provisions modern `.cursor/rules/context-factory.mdc` (`alwaysApply: true`) and root `.cursorrules`.
- **Trae:** Scaffolds `.trae/rules/project_rules.md` referencing orchestrator contracts and rules.

### Quick Start in Any Host Project:
```sh
# 1. Add as submodule
git submodule add <context-factory-url> .context-factory

# 2. Launch interactive setup wizard (scans existing IDEs & guides selection)
node .context-factory/app/cli/bin/context-cli.mjs init
```

## Task-Focused Host CLI & Opt-In Quality Gates

The Context Factory CLI is a text-first, zero-dependency Node.js ESM interface providing fast setup, diagnostics, and deterministic quality gates:

### Setup & Discovery
- `context-cli init`: Interactive or flag-driven host setup with `--preview` dry-runs and explicit editor selection.
- `context-cli status`: Reports three distinct dimensions — **Host Setup**, **Factory Health**, and **Code Conformance** — with an actionable next command.
- `context-cli --help`: Text-first accessible help hierarchy (no mascot decoration; full ANSI / `NO_COLOR` / non-TTY / JSON parity).

### Quality Gates & Verification
- **Local Pre-Commit Hook:** `context-cli hook install` installs a non-clobbering, exclusive pre-commit hook in `.git/hooks/pre-commit` supporting standard git repos, git submodules, and worktrees.
- **GitHub Actions Quality Gate:** `context-cli init --ci github` generates `.github/workflows/context-factory-gate.yml` with recursive submodule checkout, health check, conformance execution, report persistence, and receipt verification.
- **Content-Bound Conformance Verification:** `context-cli conform verify <reportPath>` verifies that a generated report has a `PASS` verdict, matches the active binding hash, and matches the content-bound SHA-256 byte digest of changed files, preventing stale receipts and uncommitted edits.

### Automation & Migration Note
- **Explicit Editor Selection:** In non-interactive environments where no existing editor configurations are detected, `init` requires an explicit `--ide <vscode|cursor|trae|antigravity|all>`. Silent fallback to all IDE profiles is eliminated to protect host repositories from unintended file generation. Existing automation scripts should pass `--ide all` explicitly.
- **Host Test & Lint Execution:** Generated CI workflows execute host tests (`--test-command`) and linting (`--lint-command`) only when explicitly configured; unconfigured checks are marked as unconfigured and never implied to have passed.

## Sync contract

Resolve a request, compile an immutable bundle, or check the factory:

```sh
node scripts/context.mjs resolve "implement an authenticated orders endpoint"
node scripts/context.mjs bundle "implement an authenticated orders endpoint"
node scripts/context.mjs doctor
```

`context-manifest.json` is the canonical inventory and `context-lock.json` pins its exact content. Update the manifest and affected maps, regenerate the lock, and pass validation plus behavioral evaluations whenever canonical context changes.

