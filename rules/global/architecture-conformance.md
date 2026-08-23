---
name: architecture-conformance
description: Preserve declared system boundaries, dependency direction, approved patterns, and durable architectural decisions.
scope: Material code structure, public contracts, cross-module dependencies, infrastructure boundaries, and architecture documentation.
alwaysApply: true
---

# Architecture Conformance

## Source of architectural truth

Inspect, in order:

1. Project-specific instructions and architecture profile.
2. Accepted decisions under `docs/decisions/`.
3. Existing dependency direction and public contracts in source.
4. Applicable factory rules.

Do not introduce a new layer, abstraction, repository-wide pattern, library, or cross-boundary dependency solely from general preference.

## Boundary rules

- Enforce SOLID architectural boundaries (`rules/solid/`): high-level policies depend on abstractions rather than details (`rules/solid/dependency-inversion.md`), interfaces are segregated to client use cases (`rules/solid/interface-segregation.md`), and modules maintain a single reason to change (`rules/solid/single-responsibility.md`).
- Keep transport, application, domain, persistence, and presentation responsibilities in their declared boundaries.
- Dependencies point inward or in the direction declared by the project profile; reject circular dependencies.
- Cross-module access uses public contracts rather than internal implementation paths.
- Business policy has one authoritative implementation.
- Authorization and data-ownership checks remain at trusted server boundaries.
- Prefer an existing suitable pattern. Introduce a new pattern only when current patterns cannot satisfy a verified requirement.

## Architecture changes

Use the `architecture-change` workflow when a change alters dependency direction, ownership, a public contract, persistence strategy, deployment topology, or a pattern used by multiple modules.

Record an ADR that states the evidence, three viable approaches for a material unresolved choice, the selected approach, consequences, migration, and review trigger.

## Verification

- Compare changed imports and contracts with the project architecture profile.
- Run available dependency, type, contract, and integration checks.
- Trace public-contract changes to known consumers.
- Report exceptions with an owner, reason, containment, and removal condition.
