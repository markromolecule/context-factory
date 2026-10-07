---
title: "Submodule-First Developer CLI UX Discovery Record"
type: discovery-record
status: ready
created: "2026-10-07"
sourceContext: docs/context/cli/submodule-first-developer-cli-ux.md
sourceContextHash: sha256:bbe6a00dfab707084ecf8448ab723dc771892306bd4a6fc646adedc40e408087
---

# Submodule-First Developer CLI UX Discovery Record

## Idea and release condition

Make the post-submodule CLI compact, task-focused, accessible, and useful for connecting a host project to selected editors and AI guidance. Setup may offer a local hook and GitHub Actions gate as separate opt-ins. A code-quality pass needs current, authoritative conformance evidence. Release one plan-facing brief only after scenario challenges are complete, material unknowns are resolved, and the user's confirmed shared understanding still covers the result. This record owns discovery; the ready source context and accepted ADR 0032 remain unchanged.

## Grounding claim packet: Context Factory CLI scope

Selection: `docs/Wiki.md` and the canonical `knowledge/README.md` index list five active SOLID concept notes. The Wiki has **no grounded answer** about host CLI onboarding, editor bridge setup, hook/workflow installation, or conformance receipt transport. No concept note was promoted into a CLI behavioral claim. Repository source and ADRs below are evidence for the grill, not Wiki claims.

| Claim ID | Source / heading | Authority / lifecycle / verified date / content hash | Selection reason | Status and content |
| --- | --- | --- | --- | --- |
| G-CLI-001 | `knowledge/README.md` / Canonical Knowledge Items | canonical index / active / 2026-07-25 / `sha256:76396078e7be74da4823e32e69a012c09306c1c1de4d1d91e33737fdc437bfac` | Scope and term inventory, checked against `docs/Wiki.md` and the `knowledge/` paths in `context-manifest.json` | **unknown:** no applicable CLI knowledge item exists; use verified source and accepted decisions for this feature. |

The index's `reviewAfter` is 2027-01-25, so it is within review date on 2026-10-07. The `knowledge/principles/solid-*` items are architectural concepts; their specific `appliesTo` does not establish CLI behavior. No same-authority active CLI Wiki claims conflict.

## Repository facts and decisions

| ID | Class | Evidence | Finding and consequence |
| --- | --- | --- | --- |
| R-01 | verified fact | `README.md`; ADR 0026 | The documented journey adds `.context-factory` as a submodule and runs `init`; setup also supports host-root execution. |
| R-02 | verified fact | `app/cli/commands/init.mjs` | Interactive setup prompts for target, method, IDE, and package manager. With no detected IDE it suggests All; non-interactive fallback sets `ide = "all"`. The confirmed change requires explicit selection when detection finds none. |
| R-03 | verified fact | `app/cli/commands/status.mjs`; `app/cli/commands/doctor.mjs`; source context evidence E-04/E-05 | Existing status is factory inventory, and doctor performs broader checks; neither alone proves current host-code conformance. |
| R-04 | verified fact | `app/cli/commands/hook.mjs`; source context evidence E-11 | Current hook install writes `.git/hooks/pre-commit`; safe composition/conflict handling is new work. |
| R-05 | verified fact | `app/cli/commands/conform.mjs`; `orchestrator/conformance/conformance-orchestrator.mjs`; `.gitignore` | `conform` writes a JSON report to an optional `--out` path or the factory's ignored `.context-runs/`. Its default diff hash covers sorted paths, not file contents. Persistence errors are currently swallowed. A fresh CI checkout cannot use the default local report as a trustworthy current receipt. |
| R-06 | accepted decision | ADRs 0029 and 0032; source context | Repository/CLI conformance remains authoritative. The new UX removes the mascot, preserves the command core, offers separate opt-in gates, and requires a content- or revision-bound `PASS` receipt for strict CI. |
| R-07 | confirmed user decision | Source context E-09–E-17 | GitHub Actions is the first generated provider; others get commands. Detected editors may be preselected, but no detection requires a choice. User confirmed the shared context on 2026-10-07. |
| R-08 | accepted lifecycle decision | ADR 0031; `skills/productivity/grill/SKILL.md` | `plan` may consume only this feature's released brief. Discovery remains separate from production implementation. |
| R-09 | verified fact | `orchestrator/conformance/evidence-gate.mjs`; TypeScript and Laravel adapters | Evidence-blocking directives require named human evidence or a valid human waiver. A CI run cannot manufacture that evidence; absent evidence produces `BLOCKED`. |
| R-10 | verified fact | `schemas/conformance-report.schema.json`; `.github/workflows/context-factory.yml` | The current report has binding/diff hashes and a verdict, but no explicit changed-scope field; the factory's own workflow runs doctor on pull requests and main pushes, without a host conformance gate. |
| R-11 | verified fact and format reconciliation | `docs/discovery/README.md`; `scripts/handoff-contract.mjs`; `scripts/plan-check.mjs` | The discovery docs require a substantive `brief.md`, while the current handoff verifier parses `brief.md` as JSON and checks its source fingerprint. Release the single brief as valid JSON containing the full required summary and handoff metadata. This satisfies the current machine gate while keeping the format inconsistency visible for future maintenance. |

## Decision tree and current answers

| Branch | Answer or issue | State |
| --- | --- | --- |
| Outcome and actors | New host developer, maintainer, and CI author need clear setup, health, and quality actions; measurable criteria are source context §1. | settled |
| Domain language | Host project, factory submodule, editor bridge, rule binding, conformance report, and optional gate retain their context/ADR meanings. No new canonical term has emerged. | settled |
| Scope and boundaries | Keep existing command core and zero-dependency Node ESM; no TUI, new policy engine, unsupported provider generator, or editor-only enforcement claim. | settled |
| Setup workflow and authority | Preview scoped host writes; opt in to hook and CI separately; preserve unrelated existing files; do not infer consent. | settled |
| States and recovery | Report host setup, factory health, and conformance separately; explain ready/needs action/blocked/unknown with an exact next action. | settled |
| External contracts and data | Keep explicit flags and bridge manifest compatible; version any changed report or JSON/exit contract. Host owns generated files; factory owns rule/binding policy. | settled |
| CI receipt acquisition | Generated GitHub Actions runs conformance on the checked-out change scope, persists the new report, then independently verifies the `PASS` verdict, active binding, and content/revision identity. | settled by user |
| Security and permissions | Existing hook/workflow conflicts block silent overwrite. Only human maintainer evidence/waivers can satisfy applicable authority rules. | settled |
| Observability and failure | Plain/JSON output must distinguish absent check, tool unavailability, `FAIL`, `BLOCKED`, and stale evidence. Persistence failure cannot masquerade as success in a strict gate. | settled |
| Rollout and non-goals | Keep advanced commands and provide migration for implicit `--ide all`; only GitHub Actions file generation is in first scope. | settled |
| Brief handoff format | Use one content-rich JSON `brief.md` with the record fingerprint, because the current plan handoff validator requires JSON. | settled from R-11 |

## Question log and unknowns

| ID | Question | Why it matters | Recommendation and trade-off | Owner / state |
| --- | --- | --- | --- | --- |
| Q-01 | Where should the strict GitHub Actions gate get its conformance report? | The current default report is ignored and local to the factory; CI must know whether to generate or receive the report before freshness and missing-evidence behavior can be specified. | **Selected by user, 2026-10-07:** Run conformance in the CI checkout for the computed change scope, persist a report there, then verify its `PASS`, active binding, and content/revision identity. This avoids committing generated receipts but requires CI to have every required tool and named human evidence; absent prerequisites block. | user / resolved |

No material unknown remains. The exact command names, report schema version, Git diff algorithm, and host workflow path can be selected during planning if they preserve the accepted behavior and test cases. Assumption A-01: if no applicable code files changed, the generated gate reports conformance as not applicable while still running its selected health checks; it must not label an unrun conformance check `PASS`. This follows the confirmed "for changed code" scope and is a reversible presentation detail. The `brief.md` JSON format is an internal handoff compatibility choice, not a new product requirement.

## Scenario challenge and coverage

| Class | Concrete scenario | Expected outcome | Evidence / decision | State |
| --- | --- | --- | --- | --- |
| Happy path | New host has an initialized submodule and one detected editor; developer chooses CI but declines hook. | Preview only selected editor/CI paths, write after confirmation, show host state and next action. | Context §1–2; ADR 0032 | covered |
| Boundary | No editor detected in a non-TTY pipeline. | Require `--ide`; never write all editor artifacts or opt into gates implicitly. | Context §2; R-02 | covered |
| Boundary | Host has GitLab or another CI provider. | Give copyable commands; report no installed GitHub gate. | Context §2; ADR 0032 | covered |
| Failure | Host clone lacks initialized submodule. | Report incomplete setup and exact `git submodule update --init --recursive` recovery. | Context §2 | covered |
| Failure | Existing unrelated `pre-commit` hook or workflow occupies target. | Preserve it; report conflict and safe recovery without a false setup success. | Context §2; R-04 | covered |
| Abuse | Agent supplies self-authorized waiver or claims a `doctor` pass proves conformance. | Reject the waiver and withhold code-quality `PASS`. | ADR 0029; ADR 0032 | covered |
| Abuse | CI is given a generic string that implies a human review no human performed. | Do not generate or infer named human evidence; remain `BLOCKED` until real evidence or an authorized waiver is supplied. | R-09; ADR 0029 | covered |
| Concurrency | Two setup processes preview the same absent target, then race to write. | Recheck before mutation; only one safe result, no clobber. | Non-destructive invariant; implementation test needed | covered requirement |
| Lifecycle | Re-run `init` after bridge exists and later update submodule/rules. | Idempotent setup summary; later conformance tied to active binding and current changed content. | Context §1–2; ADR 0032 | covered |
| CI freshness | A source file changes without changing the path list. | Old path-only report is rejected; only content/revision-bound current `PASS` qualifies. | R-05; ADR 0032 | covered |
| CI acquisition | CI starts with no local report artifact. | CI creates the report from the checked-out change scope, fails if it cannot persist it, and verifies the created artifact; it never treats a missing artifact as `PASS`. | Q-01; R-05 | covered |
| CI human evidence | A selected evidence-blocking directive needs a maintainer judgment that CI cannot infer. | CI remains `BLOCKED` until explicit, named human evidence or a governed waiver is supplied through a reviewable input; automation must not invent the evidence. | R-09; ADR 0029 | covered |

## Coverage audit and release state

Outcome, actors, boundaries, core journeys, exceptional journeys, lifecycle, authority, data ownership, privacy/security, failure language, rollout, and non-goals are recorded above or in the ready source context. Scenario challenges cover happy, boundary, failure, abuse, concurrency, and lifecycle cases. Q-01 is resolved by the user's explicit answer, consistent with the earlier confirmation of the shared source context. No active Wiki conflict or material unknown remains. The single brief may be released once its record hash is captured.
