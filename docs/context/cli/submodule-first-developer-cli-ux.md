---
title: "Submodule-First Developer CLI UX"
type: context
status: ready
created: "2026-10-07"
tags: [context, cli, ux, onboarding, submodule, code-quality]
feature: "submodule-first-developer-cli-ux"
---

# Submodule-First Developer CLI UX Context Specification

## 1. Overview & Objective

- **Problem Statement:** A developer who has added Context Factory as a submodule should be able to configure the host project, understand whether editor and AI instructions are connected, and find the next code-quality action without learning the factory's internal command inventory. The existing CLI has a mascot and categorized help, but its first-run and maintenance surfaces still expose many implementation details before showing a clear next action.
- **User Value:** Shorter onboarding, fewer wrong-directory commands, clearer recovery, and visible separation between editor guidance and executable quality evidence.
- **Success criteria (confirmed by the user on 2026-10-07):**
  1. From the host root or initialized submodule, one documented `init` entry point identifies the host and shows the proposed editor, hook, and CI changes before writing.
  2. Re-running setup does not duplicate generated files or replace an existing unrelated hook/workflow; each skipped or blocked item has a reason and a recovery action.
  3. The default CLI surface shows a concise host setup state and one exact next command; detailed help retains every existing command and flag.
  4. Host setup, factory health, and code-conformance evidence are reported separately. A code-quality `PASS` requires a current authoritative report; missing, blocked, or unavailable evidence remains visibly unresolved.
  5. Narrow terminal, `NO_COLOR`, non-TTY, and `--json` outputs remain readable and machine-readable; statuses and exit codes do not depend on decoration.

### Confirmed Product Direction

- The user prefers a task-focused CLI centered on setup, project health, maintenance, and code-quality actions.
- Remove the Octo-Agent mascot from the CLI experience. Favor compact, text-first output where the next action is more prominent than branding.
- During first-run setup, offer local Git hook and CI quality-gate configuration as explicit, optional choices. Show the proposed changes before applying them; declining either choice still permits editor/AI bridge setup.
- Generate a GitHub Actions workflow as the first optional CI integration. For other CI systems, display copyable commands and requirements rather than generating provider-specific files.
- The optional GitHub Actions gate is strict: it checks factory/bridge health and requires a current, authoritative `PASS` conformance report for the changed code. A missing, failed, blocked, or stale report blocks the gate. Project-specific lint/test commands run only when explicitly configured; their absence must not be portrayed as a pass.
- When no editor is detected, interactive `init` asks the developer to choose a profile; non-interactive setup requires an explicit `--ide`. `--ide all` remains available as an intentional choice.
- This reverses the mascot/display portion of accepted ADR 0028. Its separate `perf` and `types` skill decisions remain outside this UX change. ADR 0032 records the narrow supersession.

## 2. Requirements & User Stories

### User Stories / Scenarios

- *As a new host-project developer, I want one obvious entry point after adding the submodule, so that I can connect my editor and AI assistant without studying the full factory command list.*
- *As a maintainer, I want a concise view of host integration and quality-gate state, so that I can identify the next command to run.*
- *As a CI author, I want stable non-interactive output and exit codes, so that automation can depend on the CLI without parsing decoration.*
- *As a developer with existing editor files, I want a preview and a clear account of created, updated, skipped, or blocked files, so that setup is reviewable.*

### Scenario Coverage to Validate

| Scenario | Expected user-facing behavior |
| --- | --- |
| Fresh host with initialized submodule | Detect the host, propose editor bridge changes, offer separate hook and CI choices, show a final summary and next command. |
| Existing bridge and repeated `init` | Explain what is already configured and what, if anything, would change; avoid duplicate writes. |
| Existing local `pre-commit` hook | Show the conflict and preserve the hook unless a safe, explicit integration is selected. |
| Unsupported or absent CI provider | Avoid claiming CI enforcement; show copyable commands or a clearly marked unsupported state. |
| Current code change without a valid conformance receipt | GitHub Actions reports the missing or stale evidence and fails the quality gate; it does not substitute `doctor` output for code conformance. |
| Missing submodule after clone | Identify the missing checkout and give the exact `git submodule update --init --recursive` recovery command. |
| Conformance tool unavailable or human evidence missing | Show `BLOCKED` or an equivalent unresolved state, with the next action; never display a code-quality pass. |
| Non-interactive invocation with an unresolved setup choice | Fail with a specific missing option or return a preview; never silently select all editors or quality gates. |

### Functional Requirements

- [ ] Offer a short default help organized by developer intent: set up, check, maintain, and advanced commands. Keep the full command catalog discoverable through detailed help.
- [ ] Remove mascot output from the default CLI experience; use a compact text heading and clear labels.
- [ ] Make `init` report detected host, submodule, editors, package manager, proposed file changes, and one next action. Ask only for choices the CLI cannot safely infer.
- [ ] Preselect detected editor profiles when available. When none are detected, require explicit selection in the wizard or `--ide` in non-interactive mode; never silently expand to every editor.
- [ ] Distinguish host setup health from factory catalog health and from code-conformance evidence. Use explicit states such as ready, needs action, blocked, and unknown, each with a reason.
- [ ] Surface `preflight` and `conform` as part of the code-quality journey, preserving their binding/report semantics and fail-closed statuses.
- [ ] Preserve non-destructive bridge behavior, explicit command flags/exit codes, JSON output, and terminal fallbacks. The former implicit `all` editor default is intentionally replaced; document the migration to explicit `--ide all` for scripts that relied on it.
- [ ] Offer separate, explicit opt-in choices for a local Git hook and a CI quality gate during `init`; never infer consent from an editor choice or silently enable either gate.
- [ ] Preview the exact hook/CI target and commands before any write. Preserve existing host hooks and workflows unless a safe integration is demonstrated and selected.
- [ ] For the GitHub Actions option, show the workflow path, submodule checkout behavior, commands, and the checks each command actually covers. For other CI systems, provide a copyable equivalent without claiming an installed gate.
- [ ] Make the generated GitHub Actions gate verify a current `PASS` conformance receipt against the relevant change scope and rule binding. Missing, `FAIL`, `BLOCKED`, unavailable, or stale evidence must fail the gate; named human evidence and waiver authority remain governed by existing policy.
- [ ] Bind receipt freshness to the actual changed content or a verifiable Git revision/diff identity, not merely the list of changed paths. CI must recompute the identity in its checkout before accepting a report.
- [ ] Treat host lint/test commands as explicit host configuration, and label them unconfigured when absent.

### Edge Cases & Failure Modes

- Submodule directory missing or uninitialized after clone: show the exact recovery command; do not claim setup complete.
- Existing or read-only host files: preview and report per-file action; avoid silent overwrite or a false success summary.
- Existing `pre-commit` hook or CI workflow: report the conflict and offer a non-destructive path; do not replace an unrelated gate.
- Multiple editors or no editor detected: preselect detected profiles; with no detection, prompt interactively or require `--ide` in automation.
- Non-interactive or piped execution: require explicit input for unresolved choices; emit plain text or JSON with stable exit status.
- Unsupported language stack or unavailable verifier: report the missing capability, not a passing code-quality state.
- Dirty host/submodule checkout or detached submodule HEAD: distinguish safe inspection from update actions.

## 3. Technical & Architectural Context

- **Affected domains:** Node.js ESM CLI in `app/cli/`; host bridge files and `.context-bridge.json`; repository guidance and command documentation. No database or server schema change is currently indicated.
- **Language stack and candidate directives:** Native Node.js ESM, zero runtime dependencies per accepted ADR 0028. Applicable candidates include `cf.evidence.grounding` and `cf.evidence.integrity` (evidence-blocking), `cf.evidence.verification` (automated-blocking), `cf.global.1-3-1-define`, `cf.global.1-3-1-compare-options`, and `cf.global.1-3-1-recommend` (evidence-blocking). A scoped implementation binding must be compiled later; the informational `resolve` output is not an enforcement receipt.
- **Current CLI boundaries:** `app/cli/bin/context-cli.mjs` dispatches commands and renders top-level help; `app/cli/commands/init.mjs` detects submodule context and prompts for target, method, editors, and package manager; `app/cli/core/bridge-generator.mjs` owns generated host artifacts; `app/cli/commands/doctor.mjs` combines validation, lock, bridge, editor, and evaluation checks; `app/cli/commands/status.mjs` reads factory inventory and lock state; `app/cli/commands/preflight.mjs` and `conform.mjs` own binding and conformance behavior.
- **Current gate setup boundary:** `app/cli/commands/hook.mjs` installs a local `pre-commit` hook by writing `.git/hooks/pre-commit` directly. The factory has `.github/workflows/context-factory.yml`, but the inspected host bridge generator and CLI commands do not create a host CI workflow. The optional setup flow therefore needs new safe hook composition/skip behavior and a defined CI-provider policy.
- **CI provider and gate policy:** GitHub Actions is the first generated provider, by user decision. Other CI systems receive copyable setup commands. The generated gate must check factory/bridge health and verify an authoritative, current `PASS` conformance report tied to the changed scope and binding. `doctor` alone does not prove per-change conformance. Receipt verification is a proposed new CLI/CI capability, not existing behavior.
- **Current freshness gap:** `evaluateConformance()` defaults `diffHash` to a hash of sorted `changedScope` paths; `handleConformCommand()` supplies paths but no content-bound `diffHash`. `verifyReportFreshness()` compares provided hashes but does not establish how the current code diff is hashed. Strict CI therefore requires a new content/revision-bound receipt contract and a checkout-side verifier before the generated workflow can enforce the selected policy.
- **Contract and data impact to assess:** Existing command flags/exit codes and `.context-bridge.json` must remain compatible. A compact status model can be derived from current probes without introducing another source of rule policy. Any persisted setup preferences or new JSON schema require separate justification.
- **Security and authorization:** Setup may write host files and invoke Git; mutation must be visible and scoped to the selected host. Quality-gate status must rely on actual CLI receipts, not editor instruction files or agent claims. Human evidence and waivers retain their existing authority requirements.

### Architecture comparison for the accepted UX direction

**Problem:** Expose a simple host-developer journey while retaining advanced factory commands and authoritative conformance gates.

| Approach | How it works | Advantage | Cost / failure mode |
| --- | --- | --- | --- |
| 1. Presentation-only cleanup | Shorten help and reformat existing output. | Smallest code and contract change. | Setup and health semantics stay fragmented. |
| 2. Task-oriented facade over existing commands | Keep existing commands as the stable engine; add concise default help, a host-aware summary, progressive setup, and next-action guidance. | Addresses the full journey while preserving current adapters and automation. | Needs a carefully defined status model and parity checks. |
| 3. Full guided terminal application | Replace command flow with an interactive menu or TUI and persistent workflow state. | Can guide complex multi-step tasks. | More operational complexity, terminal compatibility risk, and duplicated state. |

**Selected UX direction:** The user chose Approach 2, removal of the mascot, explicit optional hook/CI gate setup, GitHub Actions as the first generated CI integration, strict conformance receipt enforcement in that workflow, and explicit editor choice when detection finds none. The user confirmed the complete shared context on 2026-10-07.

## 4. UI/UX & Interaction Guidelines

- **Default display:** One-line text identity, a short statement of detected project state, then a compact list of immediate actions. Detailed catalog is one explicit help step away. Do not render the mascot.
- **Setup display:** Show `Detected`, `Will change`, `Needs choice`, and `Next` in that order. Summaries should name the affected host path and avoid listing unrelated editors. Present local hook and GitHub Actions choices separately, with their target files and commands. For other CI providers, show the copyable commands as guidance.
- **Health display:** Prioritize actionable failures. Show what was checked, what was not checked, and why. Keep verbose evidence available through an explicit detail mode and JSON.
- **Accessibility:** Do not rely on color, emoji, or alignment alone for meaning; respect `NO_COLOR`, non-TTY output, narrow widths, and readable wrapping. Avoid raw escape sequences in plain output.
- **Illustrative journey, not a settled command contract:** `init` for connection; a concise status/check command for host readiness; explicit `preflight` before code changes and `conform` after them. Each stage gives one exact next command.

## 5. Scope & Boundaries

- **In scope for discovery:** Submodule onboarding, host/editor/AI connection, CLI information hierarchy, status and recovery language, visibility of existing code-quality gates, optional safe local hook setup, and optional GitHub Actions integration.
- **Deferred provider support:** Generating CI configuration for providers beyond GitHub Actions. Their users receive copyable commands in the first version.
- **Out of scope for this discovery:** Production edits, a new rule engine, editor-specific enforcement claims, a full-screen TUI, and making tests or conformance pass by changing policy.
- **Existing decisions to respect or revisit deliberately:** ADR 0026 establishes submodule-first setup; ADR 0028 requires the mascot and categorized help, while also governing the separate `perf` and `types` skills; ADR 0029 makes repository CLI conformance reports authoritative. ADR 0032 partially supersedes ADR 0028's mascot/display requirements only.

## 6. References & External Context

- `README.md` (submodule quick start)
- `app/cli/README.md` (command reference)
- `docs/context/cli/submodule-editor-onboarding.md`
- `docs/context/cli/cli-ux-and-code-health-skills.md`
- `docs/decisions/0026-submodule-first-ide-onboarding-flow.md`
- `docs/decisions/0028-cli-ux-modernization-and-code-health-skills.md`
- `docs/decisions/0029-executable-rule-conformance-harness.md`
- `docs/decisions/0032-task-focused-host-cli-and-opt-in-quality-gates.md`

## 7. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | `README.md`, Multi-Editor Bridging & Submodule Onboarding | verified | Quick start says add the submodule, then run `init`. | Post-submodule developer journey is the primary entry point. |
| E-02 | `app/cli/bin/context-cli.mjs`, `showHelp()` | verified | Top-level help displays a five-step quick start and a broad command catalog; `preflight` and `conform` are dispatched but absent from that catalog. | A shorter first screen and explicit quality journey are candidates. |
| E-03 | `app/cli/commands/init.mjs`, `handleInitCommand()` | verified | Interactive setup asks for target, method, editor selection, and package manager; non-interactive fallback selects all IDEs. | Defaults, preview, and explicit scope need discovery. |
| E-04 | `app/cli/commands/status.mjs`, `handleStatusCommand()` | verified | Status reports factory manifest counts, lock, and task count. | It does not currently answer host setup readiness. |
| E-05 | `app/cli/commands/doctor.mjs`, `handleDoctorCommand()` | verified | Doctor includes lint, lock, symlinks, editor config, and evaluations. | Host onboarding needs a concise result and proportional checks. |
| E-06 | `app/cli/core/bridge-generator.mjs`, generated bridge contract | verified | Bridge output references explicit `preflight` and `conform` commands. | Quality guidance exists in generated artifacts but should be discoverable from CLI. |
| E-07 | ADRs 0026, 0028, 0029 | verified | Submodule-first integration, terminal branding, and authoritative conformance are accepted. | New UX should preserve these contracts or explicitly revise them. |
| E-08 | `node scripts/context.mjs resolve "Improve context-cli UX..."` | verified informational output | Selected `feature-delivery` and applicable rule files; no enforceable binding compiled. | Discovery can proceed; execution needs a scoped binding later. |
| E-09 | User direction, 2026-10-07 | confirmed product decision | Remove the mascot and use a task-focused CLI. | Update the UX direction and prepare a narrowly scoped ADR supersession. |
| E-10 | User direction, 2026-10-07 | confirmed product decision | Offer quality gates as an explicit option during setup. | Model local hook and CI as separate opt-in setup steps. |
| E-11 | `app/cli/commands/hook.mjs`, `handleHookCommand()` | verified | Current install writes `.git/hooks/pre-commit` without an existing-hook check. | The opt-in flow must define non-destructive behavior before reusing it. |
| E-12 | `.github/workflows/context-factory.yml`; `app/cli/core/bridge-generator.mjs`; `app/cli/commands/` | verified within inspected source | A GitHub Actions workflow exists for the factory; no host CI workflow generator was found in the inspected bridge/command code. | CI offering needs a provider and generation policy; do not present it as existing functionality. |
| E-13 | User direction, 2026-10-07 | confirmed product decision | Choose GitHub Actions first, with copyable commands for other CI providers. | Bound generated CI scope and keep unsupported providers explicit. |
| E-14 | User direction, 2026-10-07 | confirmed product decision | Choose a strict CI gate requiring current conformance evidence. | Keep `doctor` health distinct from code-quality completion and define receipt validation in the future implementation plan. |
| E-15 | `orchestrator/conformance/conformance-orchestrator.mjs`, `evaluateConformance()` and `verifyReportFreshness()`; `app/cli/commands/conform.mjs`, `handleConformCommand()` | verified | The default `diffHash` hashes changed path names, and the CLI passes no content-bound hash. | Existing reports cannot alone prove freshness for edits to the same files; strict CI needs a new receipt identity and verifier. |
| E-16 | User direction, 2026-10-07 | confirmed product decision | When no editor is detected, require an explicit choice rather than defaulting to all editors. | Interactive setup prompts; automation supplies `--ide`. |
| E-17 | User confirmation, 2026-10-07 | confirmed shared understanding | The user confirmed the summarized task-focused CLI, optional gates, strict CI, and content-bound receipt requirement. | Context can be marked ready for the `grounding`/`grill` handoff. |

### Unknowns and Blockers

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | Should first-run setup only connect the host and selected editors, or also install/enable quality gates such as hooks or CI? | resolved decision | user | no | Offer local hook and CI setup as separate explicit options. |
| U-02 | Which editor profiles should be selected when none are detected? | resolved decision | user | no | Ask in interactive setup; require `--ide` in non-interactive setup; preserve explicit `--ide all`. |
| U-03 | What evidence defines a successful initial setup and ongoing code-quality state in the host? | resolved criteria | user | no | Success criteria and scenario table above confirmed on 2026-10-07. |
| U-04 | Whether to amend/supersede ADR 0028's default help presentation or keep its rich catalog under detailed help. | resolved decision | user | no | User selected task-focused default and mascot removal; ADR 0032 records the narrow supersession. |
| U-05 | Which CI providers should the optional setup choice configure? | resolved decision | user | no | Generate GitHub Actions first; give copyable commands for other providers. |
| U-06 | What must the optional CI gate verify before reporting a code-quality pass? | resolved decision | user | no | Check factory/bridge health and a current authoritative `PASS` conformance receipt for changed code; block missing, failed, blocked, unavailable, or stale evidence. |

### Discovery Handoff

- **Allowed recipients:** `grounding`, `grill`
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`
- **Ready for grill:** yes; no material product unknown remains.
- **Context content hash:** `sha256:bbe6a00dfab707084ecf8448ab723dc771892306bd4a6fc646adedc40e408087` (SHA-256 of this file excluding this hash line).
