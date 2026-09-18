---
title: "Laravel Rules and Language-Aware Factory Context"
type: context
status: ready
created: "2026-09-18"
tags: [context, rules, laravel, php, architecture]
feature: "laravel-language-aware-factory"
---

# Laravel Rules and Language-Aware Factory Context Specification

## 1. Overview & Objective

- **Problem statement:** Context Factory currently inventories 35 rules, all of its language-specific rules are TypeScript, and its rule map has explicit TypeScript-only group handling. The existing `rules/laravel/` tree contains 24 empty, untracked placeholder files, so Laravel guidance cannot currently be selected, validated, or maintained as canonical context.
- **Business / user value:** Give Laravel developers a small, navigable set of enforceable standards that fit Laravel conventions and keep the factory lifecycle useful across TypeScript and Laravel/PHP projects without duplicating lifecycle procedures or imposing TypeScript architecture on PHP.
- **Success criteria:** Laravel rules are organized by developer decision boundary rather than framework internals; shared rules, skills, workflows, adapters, agents, maps, resolver behavior, validation, evaluations, manifest, and lock agree on language-aware behavior; every rule avoids mandatory layers or abstractions without a demonstrated need.

## 2. Requirements & User Stories

### User Stories / Scenarios

- _As a Laravel developer, I want concise rules that tell me where Laravel conventions are sufficient and when an additional action, service, interface, or repository is justified, so that I can keep application code direct and testable._
- _As a Context Factory user working in TypeScript or Laravel, I want the same planning, execution, and verification lifecycle to select the correct language-scoped standards, so that process guidance does not leak framework-specific implementation details._
- _As a factory maintainer, I want one canonical inventory and generated rule map to represent language scopes consistently, so that adding a future language does not require a new hard-coded renderer branch._

### Functional Requirements

- [ ] Replace the existing empty Laravel placeholders with a maintainable rule taxonomy, retaining only rules with a clear coding-standard, architecture, security, persistence, presentation, or process boundary.
- [ ] Separate universal lifecycle procedure from technology-specific engineering constraints: skills and workflows remain language-neutral unless a framework-specific verification command or risk is essential.
- [ ] Make TypeScript-specific global wording and explicit rule references conditional or technology-neutral where their scope is actually cross-language.
- [ ] Make rule map generation and resolution handle language scopes from metadata or paths rather than a TypeScript-only fixed group list.
- [ ] Register all canonical Laravel rules; synchronize maps, thin adapters, agent guidance, manifest, lock, validation, and behavior evaluations.
- [ ] Preserve the user-owned, untracked Laravel placeholder tree until the approved implementation plan explicitly replaces it.

### Edge Cases & Failure Modes

- A Laravel request must not select TypeScript-only rules merely because they are `alwaysApply`; shared standards must state only cross-language constraints.
- A generic PHP project must not be represented as Laravel when Laravel conventions or facilities are absent; it is outside the initial supported language scope.
- Controllers must not become an alternate home for policy or persistence merely to avoid an unnecessary service layer.
- A repository/action/interface must not be required for a one-step Eloquent operation without a tested boundary, transaction, cross-model invariant, external integration, or reusable policy.
- Blade, Livewire, Inertia, API-only, queue, console, and scheduled workloads require only the relevant rule subsets.
- Renames or grouping changes must not create orphaned manifest paths, links, lock entries, or stale adapter references.

## 3. Technical & Architectural Context

- **Affected domains / layers:** `rules/`, global and SOLID rules, `skills/`, `workflows/`, `agents/`, `orchestrator/`, root IDE adapters, `scripts/context-core.mjs`, `app/cli/core/indexer.mjs`, `scripts/validate-context.mjs`, `context-manifest.json`, maps, evaluations, and `context-lock.json`.
- **Verified evidence:** `context-manifest.json` inventories TypeScript rules but no Laravel rules. `app/cli/core/indexer.mjs` has fixed TypeScript group branches. `scripts/context-core.mjs` scores inventoried rule metadata and already has generic host-rule discovery, but has no language-profile selection. The entrypoint adapters, specialist prompts, and several skills name TypeScript rule paths or TypeScript-only conventions. `rules/laravel/` has 24 zero-byte placeholders in domains including actions, auth, Blade, caching, console, database, events, HTTP client, middleware, request, and security. The existing bridge generator owns host `.context-bridge.json`; `project-profile.schema.json` exists but is not currently consumed by context resolution.
- **Existing architectural reference:** [[docs/context/refactors/language-scoped-rules-restructure|Language-Scoped Rules Architecture & TypeScript Folder Restructuring]] established language scopes under `rules/`; [[docs/decisions/0013-streamline-procedural-skills-inventory|ADR 0013]] separates declarative rules from procedural skills; [[docs/decisions/0018-synchronization-and-package-manager-modernization|ADR 0018]] requires canonical inventory, generated maps, and deterministic resolution.
- **Data model / schema changes:** No application data changes. A metadata extension is likely only if explicit language/scope selection cannot be derived safely from canonical paths.
- **Security and authorization:** Laravel rules must cover request validation, authorization policies/gates, output escaping, upload handling, rate limiting, and secure external HTTP usage without weakening the existing universal security guardrails.

## 4. UI/UX & Interaction Guidelines

- No product UI. The developer-facing rule map should make the Laravel structure understandable at a glance and avoid deep or overlapping categories.

## 5. Scope & Boundaries

- **In scope:** Laravel application coding standards, Laravel architecture and process boundaries, language-aware wording and selection behavior, canonical factory synchronization, one durable architectural decision, and regression coverage.
- **Out of scope / non-goals:** Converting an existing Laravel application, prescribing a package, replacing Laravel defaults with custom infrastructure, creating a generic repository/service/action layer, adding a PHP static-analysis dependency, or adding separate Laravel skills/workflows that duplicate procedural skills.

## 6. Discovery Ledger

| ID  | Topic                                                                                                  | Status   | Evidence / decision                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Q1  | Does the first supported PHP scope include plain/framework-agnostic PHP, or only Laravel applications? | Resolved | Support Laravel applications only in this change. Do not create `rules/php/` or a generic-PHP fallback.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Q2  | How should the factory know that a target is Laravel?                                                  | Resolved | Use explicit project metadata. Do not infer a technology stack solely from request wording or filesystem markers.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Q3  | Which existing configuration surface owns declared technology stacks?                                  | Resolved | Extend the bridge generator's existing `.context-bridge.json` with a `stacks` array. Do not introduce a separate project-profile file.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| D1  | Are skills and workflows duplicated per language?                                                      | Resolved | No. Preserve ADR 0013's declarative-rule/procedural-skill boundary; make shared procedure wording technology-neutral and load language rules dynamically at the project boundary based on declared stack.                                                                                                                                                                                                                                                                                                                                                                                           |
| D2  | How should rules be grouped?                                                                           | Resolved | Group by 6-group operational lifecycle taxonomy (ADR 0022): `foundation` (modern PHP 8.2+ conventions, container/DI, error handling), `http` (routing, skinny controllers, Form Requests, middleware), `database` (Eloquent models, query optimization & N+1 prevention, migrations & seeders), `application` (pragmatic business logic, action thresholds, DB transactions, async queues/events/cache), `security` (policies & gates, rate limiting, secure uploads, sanitization), and `presentation` (Blade components, layouts, Vite). Prohibit fake repositories and premature interfaces. |

## 8. Readiness Audit

- **Actors and permission boundaries:** Laravel developers, Context Factory maintainers, and bridged-project configuration owners are identified. Laravel authorization, validation, output escaping, uploads, rate limiting, and external HTTP boundaries are in scope.
- **Primary and failure scenarios:** Laravel profile selection, non-Laravel exclusion, presentation variants, asynchronous workloads, and unnecessary-abstraction avoidance are defined above.
- **Measurable completion:** The implementation must demonstrate stack-specific rule resolution, the absence of TypeScript-only rules in a Laravel selection, canonical inventory integrity, and passing regression evaluations plus `context.mjs doctor`.
- **Confirmation:** The user approved Laravel-only support, explicit stack declaration, using `.context-bridge.json` as the configuration surface, and the 6-group anti-overengineering taxonomy on 2026-09-18.
- **Handoff:** Ready for `/plan`; do not edit Laravel rules, resolver, skills, or workflows until an implementation plan is approved.

## 7. References & External Context

- [[docs/Rules|Rules Map]]
- [[docs/decisions/README|Architecture Decisions]]
- [[docs/decisions/0021-explicit-language-stack-selection|Explicit Language Stack Selection]]
- [[docs/decisions/0022-pragmatic-laravel-rule-taxonomy-and-standards|Pragmatic Laravel Rule Taxonomy, Anti-Overengineering Architecture, and Dynamic Multi-Language Alignment]]
- [[workflows/context-maintenance|Context Maintenance Workflow]]
- [[docs/context/refactors/language-scoped-rules-restructure|Language-Scoped Rules Architecture]]
