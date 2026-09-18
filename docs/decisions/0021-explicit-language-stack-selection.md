---
title: "Explicit Language Stack Selection for Context Rules"
type: decision
status: accepted
created: "2026-09-18"
tags: [adr, rules, language-scopes, laravel, php, resolution]
---

# 0021 — Explicit Language Stack Selection for Context Rules

## Context

Context Factory has a language-scoped rule layout, but its canonical inventory currently contains 35 rules whose technology-specific members are TypeScript only. `rules/laravel/` contains 24 empty placeholders and is not inventoried. The resolver scores canonical rule metadata and existing host-local rules, but it has no project-stack selector. The rules map generator has explicit TypeScript group branches, and shared skills, workflows, adapters, and specialist prompts contain TypeScript-specific examples or references.

Laravel users need standards that follow framework defaults and prevent unnecessary actions, services, repositories, interfaces, or custom infrastructure. The user authorized Laravel-only first support, explicit technology declaration, and extension of the existing host bridge configuration rather than a new profile file.

Success requires deterministic selection of Laravel rules for declared Laravel projects, continued support for TypeScript projects, no generic-PHP claim, and one shared procedural lifecycle across language scopes.

## Options considered

1. **Infer stack from requests and project files.** Inspect terms such as “Laravel”, `artisan`, or `composer.json` and automatically select a scope.
   - Advantage: no new configuration.
   - Cost: ambiguous mixed repositories and incomplete checkouts can select the wrong rule set; user intent is not durable or inspectable.
2. **Create a separate project-profile configuration.** Introduce a new profile file and schema specifically for stacks, architecture, and resolution.
   - Advantage: clean separation from bridge mechanics and room for extensive future policy.
   - Cost: adds a second required configuration surface even though an existing generated bridge configuration already represents the host-to-factory contract; its current project-profile schema is not consumed by resolution.
3. **Extend `.context-bridge.json` with explicit declared stacks — Selected.** Add a validated `stacks` array such as `["laravel"]` or `["typescript"]`; use it to filter language-scoped rules while retaining universal and SOLID rules. Preserve a temporary documented compatibility path for existing bridge files until they are migrated.
   - Advantage: smallest reversible change, clear user authority, one host-facing configuration surface, deterministic selection, and an incremental route to future stacks.
   - Cost: bridge generation, validation, resolution, migration diagnostics, and evaluations must be updated together.

## Decision

Adopt Option 3.

- The bridge configuration owns explicit project stack declarations as `stacks: ["laravel"]` for the initial Laravel profile.
- `rules/laravel/` is the only new language scope in this change; plain PHP is explicitly out of scope.
- Rule resolution loads universal and SOLID rules plus only the declared language scope. It must not use request wording or filesystem markers as authority to assign a stack.
- Skills and workflows remain procedural and stack-neutral. They may direct agents to use the declared language rules and appropriate project-native verification, but must not duplicate Laravel implementation standards.
- Laravel rules will be regrouped by decision boundary: `foundation`, `http`, `application`, `data`, `authorization`, `async`, `presentation`, and `security`. A group or layer is introduced only where a concrete Laravel boundary warrants it.
- Laravel guidance will prefer Laravel’s built-in conventions and direct Eloquent usage. An action, service, repository, interface, or transaction boundary requires a demonstrated invariant, multi-step orchestration, external boundary, reuse need, or testability constraint; it is not created as ceremony.

## Consequences

**Dependency direction and contracts:** The bridge configuration becomes the source of project stack intent. The resolver consumes its declared stack list; maps derive language sections from canonical rule paths or metadata rather than a fixed TypeScript list. Rules continue to guide architecture but do not impose a universal Laravel layering pattern.

**Data and security:** No product-data migration occurs. Configuration parsing requires schema validation, bounded known stack names, and clear handling of absent or invalid declarations. Laravel rules retain trusted-boundary requirements for validation, authorization, escaping, uploads, rate limits, and outbound HTTP.

**Performance and operations:** Resolution should read only the selected language scope plus universal rules. Bridge generation and doctor output must expose the declared stacks and warn on legacy or invalid metadata. No package or runtime dependency is authorized.

**Migration and rollback:** New bridges declare a stack. Existing bridge files retain documented compatibility behavior during an explicit migration window and receive a diagnostic rather than an unannounced behavior change. Removing the `stacks` field or reverting the resolver filter restores the previous selection algorithm; canonical Laravel rule files can be removed from the manifest in the same rollback.

## Validation and review date

- Add resolver cases for declared Laravel and TypeScript projects, and a legacy bridge case.
- Verify that Laravel selection excludes TypeScript-only rules and that TypeScript selection excludes Laravel-only rules while universal rules remain.
- Verify schema validation, generated rule-map sections, bridge output, manifest/lock integrity, and `node scripts/context.mjs doctor`.
- Review when a second non-TypeScript language scope is proposed, when generic PHP support is requested, or by 2027-03-18, whichever occurs first.
