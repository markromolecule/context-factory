---
title: "Task-Focused Host CLI and Opt-In Quality Gates"
type: decision
status: accepted
created: "2026-10-07"
tags: [adr, cli, ux, submodule, onboarding, conformance, ci]
---

# Task-Focused Host CLI and Opt-In Quality Gates

## Context

The user wants a simpler, accessible CLI for developers who add Context Factory as a Git submodule and then use it to connect their project, editors, and AI tools while maintaining code quality. The confirmed context is `docs/context/cli/submodule-first-developer-cli-ux.md`.

Verified source boundaries:

- `app/cli/bin/context-cli.mjs` renders a mascot and a long categorized command catalog. It dispatches `preflight` and `conform`, but the top-level help does not list them.
- `app/cli/commands/init.mjs` guides host setup and defaults to all IDE profiles when no profile is supplied in non-interactive mode. `app/cli/commands/status.mjs` reports factory inventory rather than host readiness.
- `app/cli/commands/hook.mjs` writes `.git/hooks/pre-commit` directly. The factory has its own GitHub Actions workflow, but the inspected host bridge generator does not create one.
- `orchestrator/conformance/conformance-orchestrator.mjs` defaults `diffHash` to a hash of changed path names. `app/cli/commands/conform.mjs` does not supply a content-bound diff hash. A report with that default hash cannot prove freshness after edits to the same paths.
- ADR 0026 establishes submodule-first onboarding. ADR 0028 requires mascot-oriented presentation and separately established `perf` and `types` skills. ADR 0029 makes repository conformance reports authoritative.

**Decision problem:** Make the first-run and daily CLI experience task-focused and safe, while preserving advanced commands, editor bridge contracts, and fail-closed code-quality evidence.

**Success condition:** A developer can run one documented setup entry point after adding the submodule, review proposed host changes, connect selected editor profiles, opt into local and CI gates separately, and see a concise host status with an exact next action. CI must never report code-quality success from `doctor` alone or from a stale conformance receipt.

## Options considered

1. **Presentation-only cleanup.** Shorten the default help and remove mascot output while leaving setup, status, hook, and conformance workflows as they are. This is cheap and reversible, and suits a narrow visual request. It does not resolve wrong-directory setup, implicit all-editor writes, host health ambiguity, or quality-gate discoverability.
2. **Task-focused facade over the existing command core.** Keep `init`, `bridge`, `doctor`, `preflight`, `conform`, and advanced commands as the underlying operations. Add concise host-aware help/status, progressive setup with reviewable changes, optional hook and GitHub Actions gates, and explicit next actions. This directly covers the requested journey while retaining current adapters and automation. It requires a status model, safe host-file integration, and a content-bound conformance receipt verifier.
3. **Stateful terminal application.** Replace the command flow with a full-screen guided UI and persisted workflow state. This can support complex interactive journeys and suits a product where the terminal is the main workspace. It adds terminal compatibility and accessibility work, duplicated state, and greater operational cost for a submodule CLI that also serves automation.

## Decision

Adopt **Option 2**. The CLI remains a native Node.js ESM command tool with no new runtime dependency. Its default display becomes compact and text-first, organized around setup, check, maintain, and advanced actions. Remove the mascot from CLI output and do not make decoration necessary to understand status. Full command help remains discoverable.

### Boundary and contract decisions

- **Dependency direction:** UX and host integration call the existing command/domain functions. Rule selection, conformance evaluation, and waiver policy stay in their current authoritative modules. A host summary must read those results without creating a parallel quality policy.
- **Setup:** `init` detects the host and submodule, previews the target files and commands, then performs selected writes. Detected editors may be preselected. If none are detected, interactive use asks for a profile and non-interactive use requires `--ide`; `--ide all` remains explicit. Existing scripts relying on implicit `all` need a documented migration.
- **Optional gates:** Offer local Git hook and GitHub Actions setup as separate opt-in choices. Preserve existing unrelated hooks and workflows; a conflict is reported with a safe recovery path rather than silently overwritten. Other CI systems receive copyable commands, not generated provider files in this first scope.
- **Strict CI:** The generated GitHub Actions gate checks factory/bridge health and requires a current authoritative `PASS` conformance report for the changed code. Missing, `FAIL`, `BLOCKED`, unavailable, or stale evidence blocks the gate. It must recompute a content- or revision-bound change identity in the CI checkout and compare it with the report and active binding. A path-list hash is insufficient. Host lint/test commands run only when explicitly configured and are never implied to have passed when absent.
- **Status and output:** Host setup, factory health, and code-conformance evidence are distinct states. Text output gives a reason and one exact next command. JSON structure and exit codes remain stable or receive an explicit versioned migration; `NO_COLOR`, narrow terminals, and non-TTY output carry the same meaning without artwork or color.

This decision **partially supersedes ADR 0028** only for its mascot engine, mascot display invariant, and default help presentation. ADR 0028's `perf` and `types` skill decisions, review handoffs, and zero-dependency constraint remain in force. ADRs 0026 and 0029 remain authoritative for submodule onboarding and conformance evidence.

## Consequences

- **Data and contracts:** `.context-bridge.json` and existing explicit command invocations remain supported. The conformance report/verification contract must evolve so a CI receipt binds to changed content or a verifiable revision; any schema change needs versioning and a migration path. Do not add persistent setup state unless derived host probes are insufficient.
- **Security and authorization:** Host writes are scoped to the detected/selected project and shown before application. Hook and workflow installation require explicit selection. Human evidence and waivers retain their existing authority rules; CI cannot manufacture or silently waive them.
- **Performance and operations:** Default help/status should use lightweight probes; comprehensive `doctor` and conformance checks run when requested or in the selected gate. GitHub Actions must initialize the submodule before invoking its CLI and must fail closed when a verifier or report is unavailable.
- **Migration:** Replace mascot/help output and document the new task hierarchy. Keep old command names and explicit flags; change the implicit all-editor behavior with a clear `--ide all` migration instruction. Introduce the receipt verifier before advertising the generated strict CI workflow as operational.
- **Rollback:** CLI presentation can revert independently of the command core. Optional host hook/workflow artifacts can be removed or disabled without modifying the submodule or rule catalog. A rollback must not bypass ADR 0029's existing conformance gates.

## Validation and review date

- Verify help and status in TTY, narrow, `NO_COLOR`, non-TTY, and JSON modes; confirm no mascot is rendered and each state has an actionable next step.
- Exercise fresh, repeated, conflicting, and non-interactive setup. Confirm preview accuracy, no unrelated file overwrite, explicit editor selection, and stable existing command behavior.
- Test GitHub Actions generation with submodule checkout plus missing, `FAIL`, `BLOCKED`, stale, and current `PASS` receipts. Change contents within the same path set and confirm the old receipt is rejected. Verify named human evidence and waiver policy are not bypassed.
- Run focused CLI/bridge/conformance evaluations, manifest/lock validation, and `node scripts/context.mjs doctor` against the final synchronized documentation and source diff. Do not treat documentation checks as implementation verification.
- Review this decision if supported CI providers expand, the conformance receipt identity changes, or terminal interaction needs exceed a command-based flow. Revisit by 2026-11-07 after an implementation review.
