---
title: "TypeScript Agent Harness Reliability and Context Efficiency"
type: context
status: ready
created: "2026-10-19"
tags: [context, harness, typescript, cli, resolver, workflows]
feature: "typescript-agent-harness-solidification"
---

# TypeScript Agent Harness Reliability and Context Efficiency Context Specification

## 1. Overview & Objective

The factory has a useful shared contract, TypeScript rule catalog, procedural skills, lifecycle workflows, and host CLI. The 2026-10-19 audit found that these layers disagree at consequential boundaries: generated CI invokes a deleted `conform` command, preflight can report PASS without rule coverage, resolver selections are too large for simple requests, and broader bridge tests fail despite a healthy catalog doctor.

**User value:** A short user request should lead to the smallest sufficient evidence-backed context, the right TypeScript or framework guidance, and an honest executable next action. Maintainers should be able to trust CLI and CI status without treating catalog health as code verification.

**Success criteria:**

1. No active command, generated workflow, status hint, skill, or shared contract requires runtime conformance after its removal decision; host checks are explicit and unconfigured checks are never PASS.
2. Material preflight fails closed when scope is absent, unsupported, or has zero applicable directives. JavaScript/JSX is never mislabeled as passing TypeScript checks; applicable global/security checks remain separately visible.
3. Direct questions select no lifecycle workflow and fit a measured context budget. Scoped TypeScript tasks select only the relevant global, language, layer, and installed-framework guidance; knowledge loads on demand.
4. Procedural skills have independent procedures, outputs, and completion checks; workflows coordinate them using the shared work-tier boundaries.
5. Factory-local `.agents/` and `.claude/` remain, their inventory and instructions agree with canonical sources, and independent host-profile tests check discoverability without claiming live host behavior from link existence alone.
6. The full declared test gates pass, with catalog health, unit tests, integration tests, host checks, and report freshness reported separately.

## 2. Requirements & User Stories

- As a developer asking a direct question, I want only pertinent source/context so the answer is fast and focused.
- As a TypeScript developer, I want rule selection based on touched files and installed framework evidence so unrelated backend, database, or UI guidance does not dominate.
- As a host maintainer, I want the generated CI and CLI help to execute real commands and distinguish absent checks from passing checks.
- As a reviewer, I want each material task's binding, tests, scope, and unresolved human evidence to be inspectable.

**Functional requirements:**

- FR-01: Reconcile the conformance-removal decision with the CLI dispatcher/index, status, generated CI, shared contract, workflow and skill text, active docs, and accepted ADR status. Preserve the separate rule-binding selection capability where useful; do not describe it as code conformance.
- FR-02: Require meaningful preflight scope and directive coverage for material code work; give `BLOCKED` or `UNSUPPORTED` with an actionable reason instead of false PASS.
- FR-03: Classify question, investigation, planning, implementation, and release intent before procedure routing; do not select skills from name-token matches alone.
- FR-04: Use affected file and package evidence for TypeScript/framework/layer selection, load relevant knowledge only, and expose reasons plus an enforceable context budget.
- FR-05: Review rule applicability and human-evidence burden without changing security gates by accident; keep common TypeScript guidance centralized.
- FR-06: Make skills independently useful, align workflow entry criteria with T0–T3, and preserve the plan/review/execute handoff boundaries.
- FR-07: Keep and reconcile factory-local host discovery, generated host bridges, manifests/maps/lock, pnpm guidance, and independent host checks.
- FR-08: Make `status` verify report identity against the current host, scope, binding, and code revision before presenting it as current; report `unconfigured` or `no_report` honestly.

**Boundary and failure scenarios:**

| ID | Situation | Required result |
| --- | --- | --- |
| S-01 | Direct question mentions plan, workflow, backend, or TypeScript | No delivery workflow or unrelated rule bundle; source answer remains possible. |
| S-02 | Scoped Next.js, React, Solid, or plain TS request | Installed package and touched path determine framework/layer; sibling packages do not leak rules. |
| S-03 | JS/JSX or missing file scope enters preflight | No TypeScript PASS; explicit unsupported or blocked outcome while global/security obligations remain visible. |
| S-04 | Host CI has no configured lint/test/typecheck/build commands | Reports unconfigured; factory health still runs, no fabricated code-verification PASS. |
| S-05 | Status finds stale, unrelated, malformed, or missing report | Rejects current PASS and gives a valid next action. |
| S-06 | Host skill link collides with an owner file, is broken, or setup is repeated | Preserve owner content; identify collision or repair only known generated entries. |
| S-07 | A new workflow/rule/skill is added | Catalog, host entries, maps, lock, selection, and tests detect and reconcile drift. |
| S-08 | Material human-evidence rule applies | Missing evidence remains unresolved; no catalog check or agent assertion claims verification. |

## 3. Technical & Architectural Context

- **Stack:** The factory CLI is Node.js ESM (`.mjs`) and maintains TypeScript/TSX rules for hosts. Do not apply TypeScript-only checks to JS/JSX; keep applicable global and security gates.
- **Canonical owners:** `orchestrator/SHARED.md`, `context-manifest.json`, `rules/`, `skills/engineering/`, `skills/productivity/`, `skills/workflows/`, and accepted ADRs.
- **Execution seams:** `scripts/context-core.mjs` resolver, `orchestrator/rules/binding-compiler.mjs`, `app/cli/commands/preflight.mjs`, CLI dispatcher/index, `app/cli/core/github-gate-generator.mjs`, `host-state.mjs`, bridge generator, doctor, validator, and evaluation tests.
- **Candidate global directives:** `cf.evidence.scope-fencing` (evidence-blocking), `cf.evidence.verification` (automated-blocking), `cf.quality.tests-for-behavior-changes` (automated-blocking), `cf.quality.reject-duplicate-policy` (evidence-blocking), and `cf.arch.contracts` (evidence-blocking). Bind exact current hashes per unit during planning; these global rules govern the Node ESM code without pretending it is TypeScript application code.
- **No database migration, application API, or user-data change.** Generated CLI/CI and host bridge formats are public contracts; compatibility and rollback matter.
- **Security:** Preserve user-owned host files and symlinks, reject untrusted configuration paths, and avoid false security or evidence PASS.

## 4. Interaction Guidelines

CLI output should be compact and text-first: state, reason, and one executable next action. JSON output should carry the same state distinctions. Keep instruction entry points short and link to the canonical contract instead of copying policy.

## 5. Scope & Boundaries

**In scope:** The audit's six improvement areas: contract/CLI truth, selector efficiency, rule applicability, skill/workflow clarity, host discovery consistency, status/report freshness, tests, maps, manifest, lock, and documentation.

**Out of scope:** Production application code, dependency installation, a new generic multi-stack adapter framework, live publishing/push/release, rewriting historical task records, and a new model/provider integration.

## 6. References & External Context

- Current checkout source and 2026-10-19 audit measurements; `docs/decisions/0033-branch-only-task-lifecycle.md`, `0039-first-class-workflow-skills-and-typescript-consolidation.md`, and `0040-pnpm-only-package-manager.md`.
- Prior PLN-0011 conformance removal brief remains relevant to runtime conformance, but its factory-local `.agents`/`.claude` removal decision is superseded for this effort by the user's 2026-10-19 instruction to keep and reconcile them.

## 7. Discovery Evidence & Handoff

| ID | Evidence | Finding and consequence |
| --- | --- | --- |
| E-01 | `node scripts/context.mjs doctor`; `node --test tests/**/*.test.mjs` | Catalog doctor 27/27 and core unit tests 36/36 pass; neither proves broader integration health. |
| E-02 | `node --test evals/tests/**/*.test.mjs` | 203/207 pass; bridge assertions refer to missing old workflow and absent root `.agents`. |
| E-03 | `context-cli conform ci-gate --json`; import `app/cli/index.mjs` | Unknown command; public CLI index imports missing module. |
| E-04 | `context-cli preflight` probes | No-scope TypeScript request returns PASS with null binding; JSX scope returns PASS with zero directives. |
| E-05 | `resolveContext` probes | Direct plan-workflow question selected 17 rules and 2 skills; estimated 31,775 tokens. |
| E-06 | Manifest and descriptor parser | 36 rules, 12 skills, 6 workflows; 355 directives: 124 automated, 154 human-evidence, 77 advisory. |
| E-07 | `.agents/skills.json`, `.agents/README.md`, `.claude/CLAUDE.md` | Workflow inventory and pnpm guidance drift. |

**Resolved decisions:** The user chose removal of runtime conformance and retention/reconciliation of factory-local `.agents` and `.claude` on 2026-10-19. No material product choice remains for planning. Numerical budget targets are planning-time performance criteria to validate, not claimed current behavior.

**Allowed recipients:** `grounding`, `grill`. **Forbidden direct recipients:** `plan`, `plan-review`, `execute`. **Ready for grill:** yes.
