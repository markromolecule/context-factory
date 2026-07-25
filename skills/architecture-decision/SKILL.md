---
name: architecture-decision
description: Analyze and record a durable architecture choice using repository evidence, existing decisions, explicit tradeoffs, migration impact, and verification criteria.
---

# Architecture Decision

## Procedure

1. Inspect project instructions, architecture profiles, accepted ADRs, current source boundaries, and known consumers.
2. State one decision problem with verified evidence, constraints, success criteria, and explicit assumptions.
3. Compare exactly three materially viable approaches using the 1-3-1 rule.
4. Recommend the smallest approach that satisfies current constraints and preserves reversibility.
5. Identify dependency direction, contract, data, security, performance, operations, migration, and rollback impact.
6. Record the accepted choice under `docs/decisions/` only when the authorized decision is durable.

## Completion

An architecture decision is complete when its authority is clear, rejected alternatives are explained fairly, affected boundaries and consumers are named, and validation plus a review trigger are defined.

Do not create an ADR for a routine implementation detail or use an ADR to disguise an unresolved product decision.
