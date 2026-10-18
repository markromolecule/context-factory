---
title: "pnpm-only package management"
type: decision
status: accepted
created: "2026-10-18"
tags: [adr, pnpm, cli, bridge, ci]
amends: "0018-synchronization-and-package-manager-modernization"
---

# 0040 — pnpm-only package management

## Context

Context Factory has no declared runtime or development dependencies. Its package scripts invoke the Node.js CLI directly, and its own CI previously invoked Node without a package manager. The bridge, however, detected multiple host package managers and emitted their commands. ADR 0018 authorized that host compatibility. The owner has now directed that Context Factory and generated host integrations require pnpm everywhere, with no active npm commands or package dependencies in the factory.

## Options considered

| Option | Contract and design | Complexity | Runtime cost | Migration impact | Reversibility |
| --- | --- | --- | --- | --- | --- |
| Keep host package manager detection | Stable host contract, but factory policy differs from generated integrations | Low | None | None | Easy |
| Require pnpm in factory and hosts (chosen) | One package manager contract; reject conflicting host state before writing | Low | None for the dependency-free factory | Existing non-pnpm hosts migrate explicitly | Easy through a later ADR and code revert |
| Automatically rewrite host manifests and lockfiles | One contract after automatic conversion | High; would own host dependency resolution | Install and network cost | Potentially broad, destructive host changes | Harder |

The first option does not meet the owner's pnpm-only requirement. The third would silently alter host dependency graphs and lockfiles, which are owned by each host project.

## Decision

- **INV-01:** `package.json` pins pnpm, and `pnpm-lock.yaml` is committed. The factory retains zero declared dependencies and uses Node.js as its runtime.
- **INV-02:** Active factory scripts, CI, MCP configuration, templates, and CLI guidance use pnpm commands.
- **INV-03:** Bridge and init accept pnpm only. They reject foreign lockfiles, a non-pnpm `packageManager`, dependency-bearing hosts without a pnpm lockfile, and legacy Context Factory host scripts before writing bridge artifacts.
- **INV-04:** Generated GitHub CI installs pnpm and uses a frozen host lockfile when present. Explicit host test and lint commands cannot invoke another package manager.

This amends the package manager portion of [[docs/decisions/0018-synchronization-and-package-manager-modernization|ADR 0018]]. Its synchronization and workflow decisions remain in force.

## Consequences

Existing hosts using another package manager must migrate their own manifest, lockfile, and `context:*` scripts before rerunning `context-cli init` or `bridge`. The factory does not perform that host migration. Historical task ledgers and earlier ADRs retain their original commands as records of past work. The optional GitHub MCP connector still downloads its server package on demand through `pnpm dlx`; it is not a factory dependency.

Rollback is a code and documentation revert after a new decision restores multi-manager host support. A failed pnpm health check, bridge contract test, or generated CI test blocks release.

## Validation and review date

Validate with `pnpm run test:unit`, `pnpm test`, `pnpm run lint`, `pnpm run doctor`, and `git diff --check`. Review this policy when the factory adds declared dependencies or host integration requirements change.
