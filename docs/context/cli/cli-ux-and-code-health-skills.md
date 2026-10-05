---
title: "CLI UX Modernization & Code Health Skills (perf, types)"
type: context
status: ready
created: "2026-10-05"
tags: [context, cli, ux, mascot, skills, perf, types, typescript, performance]
feature: "cli-ux-and-code-health-skills"
---

# CLI UX Modernization & Code Health Skills (`perf`, `types`) Context Specification

## 1. Overview & Objective

- **Problem Statement:**
  1. **CLI Appearance & UX:** The current Context Factory CLI (`app/cli/`) relies on a plain ASCII box banner and a dense monochromatic list of commands. It lacks visual personality, quick-start ergonomics, grouped command cards, and friendly branding comparable to modern developer CLIs (such as Claude Code / `claude` CLI). Users cannot visually identify the tool, and beginners face cognitive overhead understanding which command to run first.
  2. **Post-Review LLM Code Drift ("Slop Prevention"):** When LLMs generate or refactor code, secondary review passes frequently identify two common regression patterns: (a) *Type shortcuts* (using `any`, loose `as` assertions, omitted exhaustiveness checks, untyped API payloads) and (b) *Performance anti-patterns* (ORM N+1 loops, unbounded `Promise.all` waterfalls, missing database indexes under the ESR rule, and memory/bundle bloat). Currently, no dedicated procedural skills exist to systematically profile/optimize performance or aggressively harden static types when review gates flag these defects.

- **Business / User Value:**
  - **Delightful & Intuitive CLI:** Modernizes the terminal experience with an endearing Octo-Agent mascot (derived from the user's uploaded terminal octopus logo), rich ANSI TrueColor styling, structured command categories, and interactive quick-start guidance.
  - **Automated Anti-Slop Safeguards:** Provides dedicated `/perf` and `/types` skills that can be triggered directly by developers or routed automatically during `/review` diff audits to eliminate `any` and resolve runtime bottlenecks before code reaches merge gates.

- **Success Criteria:**
  - `context-cli` displays a high-polish splash banner featuring the Octo-Agent mascot in ANSI TrueColor / half-block art with clean fallback on non-TTY / `--no-color`.
  - CLI command help is visually categorized into clear cards with colored badges, tags, and concrete usage examples.
  - Two new first-class engineering skills (`skills/engineering/perf/` and `skills/engineering/types/`) are established, fully documented, and registered in `context-manifest.json` and group READMEs.
  - Cross-skill bridges are wired into `skills/engineering/review/SKILL.md`, `skills/engineering/refactor/SKILL.md`, and `skills/engineering/test/SKILL.md` so that `/review` automatically routes type slop to `/types` and runtime/query bottlenecks to `/perf`.
  - `npm run doctor` and `npm run sync` pass 100% HEALTHY.

---

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a developer running `context-cli`, I want to see an engaging, well-formatted terminal interface with an Octo-Agent mascot and organized command categories, so that I immediately understand available workflows and enjoy interacting with the tool.*
- *As a code reviewer or developer whose unit review flagged loose type assertions (`any`), I want to invoke `/types` to automatically replace `any` with discriminated unions, branded types, and exhaustive runtime type guards.*
- *As a developer optimizing a slow endpoint or investigating an ORM N+1 query loop, I want to invoke `/perf` to audit queries against the ESR indexing rule, eliminate async waterfalls, and establish benchmark verification.*
- *As an autonomous agent executing `/review`, I want Gate 3 (SOLID Audit) and Gate 4 (Language Rules Conformance) to explicitly recommend `/types` or `/perf` when slop patterns are detected during diff review.*

### Functional Requirements

- [ ] **CLI Mascot & Visual Engine:**
  - Implement zero-dependency ANSI TrueColor / half-block pixel art generator or pre-rendered mascot data representing the orange octopus with the backwards terminal cap (`>_`).
  - Implement terminal capability detection (TTY, color support, terminal width) with graceful degradation to compact text banner when `--no-color` is passed or terminal width is under 60 columns.
  - Add optional support for inline graphic protocols (iTerm2 OSC 1337 / Kitty) when supported by the active terminal, falling back to ANSI half-block art.
- [ ] **CLI Help & Hierarchy Redesign:**
  - Restructure `app/cli/bin/context-cli.mjs` help output with visual category headers (`📦 Project Bridging & Setup`, `🛠️ Core Maintenance`, `🤖 Agent Orchestration`, `⏱️ Session Checkpoints`).
  - Add a "Quick Start" highlight section showing top commands (`init`, `doctor`, `sync`, `task new`).
  - Upgrade `app/cli/core/formatter.mjs` with card layouts, styled badge helpers, and command example formatters.
- [ ] **`perf` Skill (`skills/engineering/perf/`):**
  - Author `skills/engineering/perf/SKILL.md` specifying profiling methodologies, ORM N+1 query elimination, ESR indexing rules, async waterfall prevention, and memory/bundle audits.
  - Establish clear handoff triggers from `/review` (Gate 4) and into `/test` (benchmark assertions) and `/verify`.
- [ ] **`types` Skill (`skills/engineering/types/`):**
  - Author `skills/engineering/types/SKILL.md` specifying strict type hardening: banning `any`, eliminating loose `unknown` casts, implementing discriminated unions, writing exhaustive `assertNever` checks, and creating branded nominal identifiers.
  - Target anti-slop post-review fixes directly, ensuring LLM output conforms to `rules/typescript/common/type-safety.md`.
- [ ] **Cross-Skill & Group Index Synchronization:**
  - Update `skills/engineering/README.md` and `skills/README.md` to index `perf` and `types`.
  - Update `skills/engineering/review/SKILL.md` to reference `/types` and `/perf` under Gate 3 and Gate 4 remediation guidance.
  - Update `skills/engineering/refactor/SKILL.md` to reference `/types` and `/perf`.
  - Synchronize manifest and lockfile via `npm run sync`.

### Edge Cases & Failure Modes

- **Narrow Terminals (< 60 columns):** If terminal columns are restricted or stdout is piped to a file, suppress the multi-line mascot graphic and display a streamlined single-line header.
- **NO_COLOR / Non-TTY Environments:** When `process.env.NO_COLOR` is set or stdout is not a TTY (e.g. CI logs), render clean monochrome text without ANSI escapes.
- **Missing or Corrupt Image Asset:** If protocol-based image rendering is used and the file cannot be loaded, seamlessly fall back to ANSI block art without throwing errors.
- **Multi-Stack Type Hardening:** While TypeScript is the primary static typing target, `types` must gracefully handle static types across Dart/Flutter and PHP 8.2+ (Laravel strict types, DTOs, generics via Psalm/PHPStan).

---

## 3. Technical & Architectural Context

- **Affected Layers:**
  - `app/cli/`: Formatter, banner rendering, CLI entrypoint, command help.
  - `skills/engineering/`: New skill directories `perf/` and `types/`, updated group README.
  - `skills/engineering/review/`: Gate 3 and Gate 4 remediation routing.
  - `skills/engineering/refactor/`: Refactoring discipline links.
- **Language Stack & Rules:**
  - Stack: Pure Node.js ESM (zero external dependencies).
  - Rules:
    - `rules/global/architecture-conformance.md` (keep manifest and lockfile synced).
    - `rules/global/evidence-and-claims.md` (test-backed verification).
    - `rules/typescript/common/type-safety.md` (type hardening standards).
    - `rules/typescript/database/query-optimization-and-pagination.md` (ESR and N+1 prevention).
- **Existing Files & Symbols to Inspect/Modify:**
  - `app/cli/bin/context-cli.mjs`: `showHelp()` and splash output.
  - `app/cli/core/formatter.mjs`: `banner()`, `box()`, `table()`, `colors`, `badges`.
  - `skills/engineering/README.md`: Engineering skills inventory.
  - `skills/README.md`: Global skills catalog.
  - `skills/engineering/review/SKILL.md`: Pre-screening review gates.
  - `skills/engineering/refactor/SKILL.md`: Code modularization procedures.
- **Data Model & Manifest Changes:**
  - Register new skills `perf` and `types` in `context-manifest.json` under `skills`.
  - Regenerate `context-lock.json` and Obsidian MOCs (`docs/skills.md`).

---

## 4. UI/UX & Interaction Guidelines

- **Mascot Design & Palette:**
  - Character: "Octo-Agent" (friendly orange octopus with big curious eyes, dark backwards cap emblazoned with `>_` terminal prompt).
  - Palette: Vibrant ANSI TrueColor orange (`#FF6B35` / `#FF7A00`), dark navy cap (`#1E293B`), white/cyan terminal glyphs (`#38BDF8`), and soft shadow highlights.
  - Dimensions: Compact 16x14 or 20x16 character cell half-block art (or 2-column layout with mascot on the left and quick-start summary on the right).
- **Layout & Visual Hierarchy:**
  - Top: Octo-Agent ASCII/ANSI art alongside title and tagline.
  - Middle: Categorized command cards with visual badge icons.
  - Bottom: Quick-start recipes and example commands.

---

## 5. Scope & Boundaries

- **In Scope:**
  - Mascot graphic rendering engine (ANSI half-block pixel art with TrueColor/256-color support and optional iTerm2 inline protocol).
  - Visual hierarchy redesign of `context-cli` help and status output.
  - Authoring `skills/engineering/perf/SKILL.md`.
  - Authoring `skills/engineering/types/SKILL.md`.
  - Cross-referencing `perf` and `types` in `review`, `refactor`, and `test` skills.
  - Updating skill indexes and running `npm run sync` and `npm run doctor`.
- **Out of Scope / Non-Goals:**
  - Adding heavy third-party CLI dependencies (e.g., `ink`, `blessed`, `chalk`, `cfonts`) — must remain 100% pure native Node.js ESM.
  - Creating a full-screen interactive TUI (Terminal User Interface with ncurses/raw mode) — focus is on high-polish command execution and CLI ergonomics.

---

## 6. References & External Context

- Mascot Reference Image: `media_1791164877566.png` (Orange octopus wearing terminal cap).
- Related ADRs:
  - [[docs/decisions/0010-data-layer-query-optimization-and-performance-architecture|ADR 0010: Query Optimization and Performance Architecture]]
  - [[docs/decisions/0020-categorical-skill-grouping-and-group-indexes|ADR 0020: Categorical Skill Grouping]]
  - [[docs/decisions/0027-language-rule-lifecycle-binding-and-verification|ADR 0027: Language Rule Lifecycle Binding]]
  - [[docs/decisions/0028-cli-ux-modernization-and-code-health-skills|ADR 0028: CLI UX Modernization & Code Health Skills]]
