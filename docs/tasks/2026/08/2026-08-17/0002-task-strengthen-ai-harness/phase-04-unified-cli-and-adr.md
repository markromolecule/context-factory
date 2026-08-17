---
title: "Phase 4: Unified Harness CLI and ADR 0008"
type: phase
parent: "docs/tasks/2026/08/2026-08-17/0002-task-strengthen-ai-harness/README.md"
phase: "4"
status: completed
created: "2026-08-17"
tags: [task, phase, cli, adr, architecture]
---

# Phase 4: Unified Harness CLI and ADR 0008

## Objective

Build `scripts/harness-cli.mjs` providing the complete subcommand interface (`resolve`, `bundle`, `run`, `validate`, `eval`, `lock`, `doctor`), establish `scripts/context.mjs` as a backward-compatible forwarding entrypoint, and document architectural decisions in ADR 0008.

## Dependencies & Prerequisites

- Phase 1, 2, and 3 completed (`validator.mjs`, `runner.mjs`, `run-evals.mjs` available).
- `scripts/context-core.mjs` and `scripts/validate-context.mjs`.

## Impacted Files & Components

- `scripts/harness-cli.mjs` (NEW): Full-featured CLI entrypoint for Context Factory.
- `scripts/context.mjs` (MODIFY): Streamlined proxy routing calls directly to harness CLI commands.
- `docs/decisions/0008-pluggable-ai-execution-harness.md` (NEW): Architecture Decision Record documenting the runner, hook lifecycle, schema validator, and golden dataset hierarchy.
- `docs/decisions/README.md` (MODIFY): Register ADR 0008 in decisions index.

## Implementation Tasks

- [x] Task 4.1: Implement `scripts/harness-cli.mjs` with subcommands `resolve`, `bundle`, `run`, `validate`, `eval`, `lock`, and `doctor`.
- [x] Task 4.2: Update `scripts/context.mjs` to delegate seamlessly to `harness-cli.mjs` logic while preserving exact CLI arguments and flags.
- [x] Task 4.3: Author `docs/decisions/0008-pluggable-ai-execution-harness.md` using `docs/templates/Decision.md`.
- [x] Task 4.4: Update `docs/decisions/README.md` to link ADR 0008.

## Verification & Testing

- Verified `node scripts/harness-cli.mjs run "deliver new feature" --provider mock` execution returning structured results in 13ms.
- Verified legacy backward-compatible delegation via `node scripts/context.mjs resolve "deliver new feature"`.
- Verified ADR 0008 link in `docs/decisions/README.md`.

## Risks & Rollback

- **Risk:** Breaking existing scripts relying on `context.mjs`.
- **Mitigation:** Comprehensive smoke tests for all legacy invocation forms.
- **Rollback:** Restore original `scripts/context.mjs` and remove `scripts/harness-cli.mjs`.
