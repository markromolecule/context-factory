---
title: "ADR 0035 & Conformance Receipt / Fixture Contract Specifications"
type: unit
parent: "phase-01-discovery-and-scenarios"
unit: "01.01"
task_branch: "feat/PLN-0005-ts-conformance-receipts-fixtures"
base_commit: "1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422"
status: planned
created: "2026-10-09"
tags: [task, unit, adr, contracts]
depends_on: []
parallelizable_with: []
---

# Unit 01.01: ADR 0035 & Conformance Receipt / Fixture Contract Specifications

> Phase: phase-01-discovery-and-scenarios · Depends on: none · Parallelizable with: none
> Task branch: feat/PLN-0005-ts-conformance-receipts-fixtures · Base commit: 1ed301a6b0b33f6cb1b9645670ccfee7d1cbd422

## Objective

Author Architecture Decision Record 0035 codifying strict host `TOOL_UNAVAILABLE` gating versus dedicated offline fixture modes, and specify the paired positive/negative test fixture taxonomy.

## Context packet

- **Source Brief:** `docs/discovery/typescript-web-rule-quality/brief.md` (released by `grill` on 2026-10-09).
- **Core Requirement:** Real host project conformance requires real tools (`tsc`, `eslint`) and returns `TOOL_UNAVAILABLE` (`BLOCKED`, exit code 2) when tools or configs are missing. Static AST checks are reserved exclusively for dedicated offline fixture/unit test mode.
- **Evidence Structure:** Conformance reports must contain verifiable tool execution receipts including tool name, argv array, effective config digest, exit code, and stdout/stderr fragment.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Checked out on branch `feat/PLN-0005-ts-conformance-receipts-fixtures` at base commit `1ed301a`.
- `docs/discovery/typescript-web-rule-quality/brief.md` verified valid.

## Scope

**In scope:**
- `docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md`
- `docs/decisions/README.md`

**Out of scope:**
- Modifying `orchestrator/conformance/adapters/typescript.mjs` (handled in Phase 02).
- Creating test fixture files (handled in Phase 03).

## Steps

1. Draft `docs/decisions/0035-host-conformance-receipts-and-fixture-modes.md`:
   - Document Context: ADR 0029 and ADR 0032 established conformance reporting, but current adapter allowed heuristic fallback passes in host environments.
   - Record Options Considered: (1) Uniform static fallback, (2) Mandatory host toolchain across all runs, (3) Strict separation: host runs require real tools while offline fixture runs opt into static AST analysis.
   - Record Decision: Option 3 selected per Q-01 user resolution. Define receipt schema requirements (`tool`, `command`, `effectiveConfigDigest`, `exitCode`, `outputFragment`).
   - Define Consequences: Host runs fail closed if tools are missing; test suites use `capabilities.fixtureMode = true` for fast static verification.
2. Update `docs/decisions/README.md` to index ADR 0035.

## Verification

- **Automated Tests:**
  - Architecture test: Verify ADR 0035 follows decision schema and is linked in `docs/decisions/README.md`.
  - Command: `node scripts/context.mjs doctor`
- **Conformance Gate:**
  - Command: `node scripts/context.mjs plan:check docs/tasks/2026/10/2026-10-09/feat-PLN-0005-ts-conformance-receipts-fixtures`

## Rollback

Revert added ADR file and restore `docs/decisions/README.md` via `git checkout`.

## Definition of done

- [ ] Maps to acceptance criteria: AC-01
- [ ] Executed on the recorded task branch
- [ ] Changes committed cleanly to the task branch
- [ ] Zero scope leaks confirmed via `/review`
- [ ] All listed verification passes
