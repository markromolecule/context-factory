---
ruleId: cf-rule-global-architecture-conformance
name: architecture-conformance
description: Preserve system boundaries, dependency direction, and decisions.
scope: Code structure, contracts, and module boundaries.
stack: global
appliesTo: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.php", "**/*.dart"]
layers: ["architecture", "domain", "services", "controllers", "components"]
alwaysApply: true
---

# Architecture Conformance

## Authority Hierarchy

1. Project instructions & profile.
2. Accepted ADRs under `docs/decisions/`.
3. Dependency directions & contracts.
4. Context Factory rules.

## Architecture Boundary Constraints

| Boundary | Constraint |
| :--- | :--- |
| **SOLID** | [directive:cf.arch.solid][mode:automated-blocking][verifier:linter] Enforce SRP, OCP, LSP, ISP, and DIP. |
| **Layer Isolation** | [directive:cf.arch.layers][mode:evidence-blocking][verifier:human-evidence] Preserve transport, domain, persistence, UI separation. |
| **Dependency Direction** | [directive:cf.arch.direction][mode:automated-blocking][verifier:linter] Point inward; circular dependencies forbidden. |
| **Public Contracts** | [directive:cf.arch.contracts][mode:evidence-blocking][verifier:human-evidence] Cross-module calls use public contracts; bypass prohibited. |
| **Single Policy** | [directive:cf.arch.policy][mode:evidence-blocking][verifier:human-evidence] Each business rule has one authoritative domain implementation. |
| **Trust Gate** | [directive:cf.arch.trust][mode:automated-blocking][verifier:test] Auth and tenant checks reside at backend boundaries. |
| **Pattern Parity** | [directive:cf.arch.patterns][mode:advisory][verifier:none] Use existing patterns unless requirements prove inadequate. |

## Material Architectural Changes

- [directive:cf.arch.adrs][mode:automated-blocking][verifier:test] Trigger `architecture-change` and record an ADR in `docs/decisions/` when altering boundaries or contracts.
