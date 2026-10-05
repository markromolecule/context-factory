---
title: "CLI UX Modernization, Mascot Graphics Engine, and Code Health Skills (perf, types)"
type: decision
status: accepted
created: "2026-10-05"
tags: [adr, cli, ux, mascot, terminal, performance, types, typescript, slop-prevention]
---

# 0028 — CLI UX Modernization, Mascot Graphics Engine, and Code Health Skills (`perf`, `types`)

## Context

Context Factory serves as the central orchestration engine and source of truth across repositories and multi-editor environments (Antigravity, VS Code, Cursor, Trae). Two distinct developer experience challenges have converged:

1. **Terminal Ergonomics & Visual Identity:** The current Context Factory CLI (`app/cli/bin/context-cli.mjs`) presents a dense, monochromatic command list inside a basic ASCII box. While functional, it lacks visual personality, category hierarchy, and quick-start guidance compared to state-of-the-art developer tools like Claude Code (`claude` CLI). The user specifically requested a friendly, visually recognizable mascot in the terminal (referencing the Octo-Agent: an orange octopus wearing a backwards `>_` terminal cap).
2. **Post-Review LLM Code Slop Remediation:** In automated and agentic coding workflows, secondary code reviews (`/review`) frequently identify two repetitive failure modes:
   - **Type Degeneration ("Type Slop"):** LLMs frequently emit `any`, loose `as unknown as T` assertions, missing union exhaustiveness checks, or untyped API contracts when implementing complex logic.
   - **Performance Bottlenecks:** LLMs frequently generate hidden ORM N+1 loops, unbounded `Promise.all` waterfalls, missing database indexes (violating the ESR rule), or memory/bundle bloat.

Currently, developers and review gates have no dedicated, structured procedural skills to dispatch when these specific regressions are detected.

## Options considered

1. **Option 1: Heavy Third-Party CLI Frameworks & External Image Parsers:**
   - Adopt npm libraries (`ink`, `react`, `chalk`, `terminal-image`, `boxen`) to construct an interactive terminal UI and render PNG images.
   - *Trade-off:* Violates the strict repository architectural invariant of zero third-party runtime dependencies (`dependencies: {}` in `package.json`), introduces supply-chain risks, bloats git submodules, and risks engine incompatibility in constrained environments.
2. **Option 2: Text-Only Cosmetic Refactor without Mascot or Dedicated Skills:**
   - Reorder the existing text help output and advise developers to use generic `refactor` and rule notes when encountering typing or performance issues.
   - *Trade-off:* Does not satisfy the user's requirement for a visual mascot like `claude-cli`; leaves code review gates without actionable, domain-specific remediation skills to prevent code slop.
3. **Option 3: Native Zero-Dependency ANSI TrueColor Mascot Engine, Categorized CLI Cards, and First-Class `perf`/`types` Engineering Skills (Selected):**
   - **Mascot Graphics Engine:** Build a zero-dependency ANSI TrueColor / Unicode half-block (`▀`/`▄`) graphics renderer that displays the Octo-Agent mascot in full vibrant color across any modern terminal (Terminal.app, iTerm2, VS Code, Cursor, Ghostty, WezTerm), with optional iTerm2 inline PNG protocol detection and automatic suppression on `--no-color` or narrow terminals (< 60 cols).
   - **CLI UX Redesign:** Reorganize CLI help into structured cards with colored category badges, quick-start recipes, and copy-pasteable examples in `app/cli/core/formatter.mjs`.
   - **First-Class Engineering Skills:** Establish `skills/engineering/perf/SKILL.md` (profiling, N+1 elimination, ESR indexing, async waterfalls) and `skills/engineering/types/SKILL.md` (banning `any`, discriminated unions, branded types, type-level tests) in accordance with ADR 0020.
   - **Cross-Skill Wiring:** Wire `/perf` and `/types` into `skills/engineering/review/SKILL.md` (Gates 3 & 4) as automated remediation targets for post-review code slop.

## Decision

Adopt **Option 3**.

### Architectural Invariants

- **INV-01 (Zero External Dependencies):** The mascot graphics engine and CLI formatting utilities must use native Node.js ESM without adding any external npm packages.
- **INV-02 (Universal Terminal Resilience):** The CLI mascot must render reliably via ANSI TrueColor half-blocks (`▀`/`▄`) or 256-color fallback. It must automatically degrade to a compact, non-graphic banner when stdout is not a TTY, `--no-color` is set, or terminal width is under 60 columns.
- **INV-03 (Categorical Skill Taxonomy):** The `perf` and `types` skills must reside under `skills/engineering/`, be indexed in `skills/engineering/README.md` and `skills/README.md`, and pass `npm run doctor` validation per ADR 0020.
- **INV-04 (Review Gate Remediation Integration):** When Gate 3 (SOLID Audit) or Gate 4 (Language Rules Conformance) in `skills/engineering/review/SKILL.md` detects type sloppiness or performance anti-patterns, the review report must explicitly direct the agent to `/types` or `/perf` before marking the unit verified.

## Consequences

- **Developer Experience:** The CLI gains an engaging visual identity with the Octo-Agent mascot, clear category hierarchy, and intuitive quick-start commands without compromising speed or zero-dependency purity.
- **Code Quality & Slop Prevention:** Review gates gain dedicated procedural tools to harden static types and eliminate performance bottlenecks before code is accepted.
- **Compatibility:** Guaranteed operation across all IDEs and CI environments with zero installation friction.

## Validation and review date

- **Validation Criteria:**
  - `context-cli` displays the Octo-Agent mascot and clean categorized help cards on standard execution.
  - Passing `--no-color` or redirecting stdout (`context-cli > output.txt`) produces clean, uncorrupted plain text.
  - `skills/engineering/perf/SKILL.md` and `skills/engineering/types/SKILL.md` pass markdown lint and doctor checks.
  - `npm run sync` and `npm run doctor` report 100% HEALTHY.
- **Review Date:** 2026-11-05 (one month post-release).
