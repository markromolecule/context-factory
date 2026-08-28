---
title: "Context Factory Synchronization and Package Manager Modernization"
type: decision
status: accepted
created: "2026-08-29"
tags: [adr, cli, pnpm, sync, moc, workflows, git-hook, resolution]
---

# Context Factory Synchronization and Package Manager Modernization

## Context

As Context Factory scaled to 35 rules, 10 skills, 11 workflows, 23 agents, and multiple bridged host repositories:
1. **Obsidian MOC Drift:** Maps of Content (`docs/Rules.md`, `docs/Skills.md`, `docs/Workflows.md`, `docs/Agents.md`, `docs/decisions/README.md`, and `docs/Wiki.md`) were maintained manually, leading to broken wikilinks, outdated rule descriptions, and validator failures whenever files were renamed or added.
2. **Workflow Dependency Ambiguity:** Workflows only referenced rules and skills through prose backticks, requiring fragile regex body parsing during context resolution and making static validation difficult.
3. **Package Manager Ergonomics:** Modern repositories frequently use `pnpm`, `yarn`, or `bun` instead of `npm`. Bridging tools previously hardcoded `npm run context:doctor`, forcing developers using `pnpm` to manually adjust `package.json` scripts.
4. **Pre-Commit Verification:** Developers committing changes without running `context-cli sync` could accidentally commit stale `context-lock.json` files, causing CI failures.

## Options Considered

1. **Option 1 (Manual Maintenance & External Tooling):** Continue manually maintaining MOC tables, rely on regex for workflow dependency resolution, and introduce external npm packages (e.g. husky, lint-staged) for git hooks.  
   *Rejected:* Violates the zero-external-dependency standard, causes continuous documentation drift, and creates fragile regex dependencies.
2. **Option 2 (Pure Dynamic Discovery Without Frontmatter Contracts):** Rely solely on LLM fuzzy matching for workflow rules and skills without structured frontmatter.  
   *Rejected:* Non-deterministic, slow, and impossible to validate with deterministic static linters.
3. **Option 3 (Automated MOC Synchronization, Typed Workflow Frontmatter Contracts, Lockfile PM Detection, and Zero-Dependency Git Hook - Selected):**
   - **MOC Auto-Sync:** Integrate automatic generation of all 6 Obsidian MOC files into `syncFactoryInventory()` (`app/cli/core/indexer.mjs`), executed prior to computing the SHA-256 lockfile digest.
   - **Typed Workflow Frontmatter Contracts:** Standardize all 11 workflows with explicit YAML frontmatter arrays (`rules`, `skills`, `primaryAgent`, `participatingAgents`), validated strictly by `scripts/validate-context.mjs`.
   - **Hybrid Resolution Engine:** Upgrade `resolveContext()` in `scripts/context-core.mjs` to consume typed workflow frontmatter arrays with fallback regex scanning, plus automatic discovery and scoring of host-local `./rules/*.md`.
   - **Package Manager Auto-Detection:** Implement `detectPackageManager()` probing for `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, and `package-lock.json`, injecting native package manager commands (`pnpm run context:doctor`, etc.).
   - **Zero-Dependency Pre-Commit Hook:** Provide `context-cli hook install` (`app/cli/commands/hook.mjs`) to install a lightweight POSIX pre-commit hook that verifies doctor health before commits.

## Decision

Adopt **Option 3**. The synchronization and resolution architecture of Context Factory is modernized with zero external npm dependencies:

| Component | Implementation | Purpose |
| :--- | :--- | :--- |
| **Obsidian MOC Generation** | `generateRulesMoc`, `generateSkillsMoc`, etc. in `app/cli/core/indexer.mjs` | Guarantees 100% valid wikilinks and auto-updated tables across all documentation |
| **Workflow Frontmatter** | `rules`, `skills`, `primaryAgent`, `participatingAgents` in all 11 `workflows/*.md` | Explicit, validated contracts for deterministic agent and context routing |
| **Resolution Engine** | Frontmatter array extraction + host rule discovery in `scripts/context-core.mjs` | Resolves required rules and skills deterministically across factory and host scopes |
| **Package Manager Detection** | `detectPackageManager()` & `--pm` flag in `bridge-generator.mjs` / `init.mjs` | Seamless out-of-the-box support for `pnpm`, `yarn`, `bun`, and `npm` in host projects |
| **Pre-Commit Hook CLI** | `context-cli hook install` in `app/cli/commands/hook.mjs` | Enforces zero-drift manifest and lockfile integrity before git commits |

### Key Architectural Decisions (Ledger):
- **D-01 (MOC Auto-Sync):** `context-cli sync` automatically updates all 6 MOC files before lockfile generation, ensuring documentation and lock integrity are always aligned.
- **D-02 (Workflow Schema):** Workflows define explicit dependency arrays in YAML frontmatter, verified by `validate-context.mjs` against canonical manifest entries.
- **D-03 (Host Rule Discovery):** Bridged projects can define local `./rules/*.md` which are scored and included during `resolveContext()` without polluting factory inventory.
- **D-04 (Zero-Dependency Hook):** Git pre-commit enforcement is achieved via a pure POSIX script without adding heavy npm dependencies.

## Consequences

- **Positive:** Developers and agents running `pnpm run sync` or `npm run sync` automatically update all MOC files, manifests, and lockfiles with zero manual documentation upkeep.
- **Positive:** Workflows provide deterministic, validate-able context dependencies that are automatically included during prompt resolution.
- **Positive:** First-class `pnpm`, `yarn`, `bun`, and `npm` support in `context-cli bridge` and `init`.
- **Positive:** Pre-commit hook prevents broken manifests or out-of-sync lockfiles from reaching remote repositories.
- **Neutral:** Host projects can use either `pnpm`, `npm`, `yarn`, or `bun` transparently.
