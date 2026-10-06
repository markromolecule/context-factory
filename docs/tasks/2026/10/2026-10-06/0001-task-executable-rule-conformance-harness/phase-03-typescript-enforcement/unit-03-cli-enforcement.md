---
title: "Authoritative Preflight and Conformance CLI"
type: unit
parent: "phase-03-typescript-enforcement"
unit: "03.03"
branch: "task/0001/phase-03/cli-enforcement"
worktree: ".worktrees/0001/phase-03/cli-enforcement"
status: verified
created: "2026-10-06"
tags: [task, unit, cli, enforcement]
depends_on: ["03.02"]
parallelizable_with: []
---

# Unit 03.03: Authoritative Preflight and Conformance CLI

## Objective

Expose repository commands that compile bindings, execute conformance, persist reports, and return fail-closed exit statuses shared by humans, CI, and editors.

## Context packet

- Repository/CLI gates are authoritative; presentation must not redefine policy.
- Existing command dispatch is in `app/cli/bin/context-cli.mjs`; legacy commands route through `scripts/harness-cli.mjs`.
- Reports need deterministic paths/JSON output and must omit secrets/full prompts.
- AC-08.

<language_rules>
- `rules/global/evidence-and-claims.md`: CLI PASS requires persisted report evidence and prints report/binding identifiers.
- `rules/global/security-guardrails.md`: Never log credentials, full prompts, or unrelated source; validate output paths.
- `rules/solid/single-responsibility.md`: Command handlers coordinate core services; policy remains in conformance modules.
- `rules/typescript/common/error-handling.md`: Exit codes and messages distinguish invalid input, failed rules, unavailable tools, and internal errors.
</language_rules>

## Preconditions

- TypeScript adapter and evidence gate are merged.

## Scope

**In scope:** new `app/cli/commands/preflight.mjs` and `conform.mjs`; `app/cli/bin/context-cli.mjs`; `scripts/harness-cli.mjs`; `app/cli/commands/run.mjs`; `app/cli/core/options.mjs`; new `evals/conformance-cli.test.mjs`.

**Out of scope:** skill/workflow docs, bridge generation, doctor, and catalog migration.

## Steps

1. Add `preflight` for descriptor/binding/waiver validation and `conform` for adapter/report execution.
2. Require material `run` operations to pass preflight and attach binding/report receipts.
3. Define stable exit codes and `--json` output for invalid contract, blocking failure, unavailable required tool, and success.
4. Persist immutable artifacts under the existing run-artifact boundary without exposing secrets.
5. Add CLI tests covering success, every blocking state, malformed paths, stale hashes, and report replay.

## Verification

- **CLI integration tests:** process-level exit/status/JSON behavior.
- **Contract tests:** persisted binding/report validate against schemas and hashes.
- Command: `node --test evals/conformance-cli.test.mjs`.

## Rollback

Remove new commands and restore `run` compatibility mode; preserve already-written reports for audit.

## Definition of done

- [x] AC-08 CLI portion passes.
- [x] Human and JSON outputs derive from one result object.
- [x] Failed blocking results return non-zero.
- [x] Unit passes `/review` and leaves no generated artifacts tracked.
