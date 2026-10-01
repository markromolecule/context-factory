---
name: architecture-conformance
description: Preserve declared system boundaries, dependency direction, approved patterns, and durable architectural decisions.
scope: Material code structure, public contracts, cross-module dependencies, infrastructure boundaries, and architecture documentation.
alwaysApply: true
---

# Architecture Conformance

## Authority Hierarchy

Evaluate in order:
1. Project instructions & declared architecture profile.
2. Accepted ADRs under `docs/decisions/`.
3. Established dependency directions & public contracts.
4. Applicable Context Factory rules.

*Never introduce new layers, abstractions, or libraries from personal preference.*

## Architecture Boundary Constraints

| Boundary | Constraint & Invariant |
| :--- | :--- |
| **SOLID Principles** | Enforce single-responsibility, open/closed extension, interface segregation, and dependency inversion (`rules/solid/`). |
| **Layer Isolation** | Preserve transport, application, domain, persistence, and presentation separation. |
| **Dependency Direction** | Point inward/per profile; circular dependencies are forbidden. |
| **Public Contracts** | Cross-module communication uses public contracts; bypass of internal implementations is prohibited. |
| **Single Policy** | Each business rule has one authoritative domain implementation. |
| **Trust Gate** | Auth and tenant ownership checks reside strictly at trusted backend boundaries. |
| **Pattern Parity** | Use existing patterns unless verified requirements prove them inadequate. |

## Material Architectural Changes

Trigger `architecture-change` workflow and record an ADR in `docs/decisions/` whenever modifying system boundaries, layer dependency direction, public contracts, persistence strategies, or deployment topology.
