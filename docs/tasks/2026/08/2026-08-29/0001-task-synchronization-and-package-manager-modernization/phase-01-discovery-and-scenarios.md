---
title: "Phase 1 — MOC Auto-Sync & Indexer Automation"
type: phase
parent: "0001-task-synchronization-and-package-manager-modernization"
phase: "01"
status: completed
created: "2026-08-29"
tags: [task, phase, moc, indexer, sync]
---

# Phase 1 — MOC Auto-Sync & Indexer Automation

## Objective

Automate the generation and synchronization of Obsidian Map of Content (MOC) markdown files (`docs/Rules.md`, `docs/Skills.md`, `docs/Workflows.md`, `docs/Agents.md`, and `docs/decisions/README.md`) directly within `syncFactoryInventory` (`app/cli/core/indexer.mjs`), ensuring that whenever manifest files are added, modified, or re-indexed, all documentation tables and wikilinks are 100% synchronized and valid without requiring manual editing.

## Dependencies & Prerequisites

- Existing `context-manifest.json` and `scripts/context-core.mjs` inventory functions.
- Obsidian wikilink conventions in `docs/*.md`.

## Impacted Files & Components

- [app/cli/core/indexer.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/app/cli/core/indexer.mjs) — Add MOC generation logic for rules, skills, workflows, agents, and decisions.
- [app/cli/commands/sync.mjs](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/app/cli/commands/sync.mjs) — Update CLI output to report synchronized MOC documentation count.
- [docs/Rules.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/Rules.md) — Managed MOC for all active rules.
- [docs/Skills.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/Skills.md) — Managed MOC for all active skills.
- [docs/Workflows.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/Workflows.md) — Managed MOC for all active workflows.
- [docs/Agents.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/Agents.md) — Managed MOC for all active subagent personas.
- [docs/decisions/README.md](file:///Applications/XAMPP/xamppfiles/htdocs/context-factory/docs/decisions/README.md) — Managed MOC for all Architecture Decision Records.

## Implementation Tasks

- [x] Task 1.1 — Implement MOC generators (`generateRulesMoc`, `generateSkillsMoc`, `generateWorkflowsMoc`, `generateAgentsMoc`, `generateDecisionsMoc`, `generateWikiMoc`) in `app/cli/core/indexer.mjs` that parse frontmatter and format canonical tables with wikilinks.
- [x] Task 1.2 — Integrate MOC updates into `syncFactoryInventory({ writeLock = true, updateMocs = true })`.
- [x] Task 1.3 — Update `app/cli/commands/sync.mjs` to report MOC synchronization status and row stats.
- [x] Task 1.4 — Run `pnpm run sync`, `pnpm run lint`, and `pnpm run doctor` to verify complete synchronization.

## Verification & Testing

- `pnpm run sync`: Successfully regenerated 6 Obsidian Maps of Content (`docs/Rules.md`, `docs/Skills.md`, `docs/Workflows.md`, `docs/Agents.md`, `docs/decisions/README.md`, `docs/Wiki.md`), updated `context-manifest.json`, and generated `context-lock.json` (`sha256:9aa8a12093445...`).
- `pnpm run doctor`:
  - Manifest & Syntax Lint: PASS (35 rules, 10 skills, 11 workflows verified)
  - Lockfile Integrity: PASS
  - .agents Symlink Integrity: PASS (6/6 healthy)
  - Evaluation Suite: PASS (19/19 passed in 57ms)

## Risks & Rollback

- **Risk:** Overwriting custom markdown commentary in MOC headers.
- **Mitigation:** Preserve standard Obsidian introductory headers and wrap tables in clearly defined markdown sections.
- **Rollback:** Restore previous manual MOCs from git revision if needed.

