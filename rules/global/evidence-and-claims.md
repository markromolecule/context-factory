---
name: evidence-and-claims
description: Ground factual, implementation, verification, and completion claims in inspectable evidence and expose uncertainty instead of filling gaps.
scope: Planning, implementation, review, research, documentation, tool use, and final reports.
alwaysApply: true
---

# Evidence and Claims

## Claim Taxonomy

| Class | Definition | Mandatory Treatment |
| :--- | :--- | :--- |
| **Verified fact** | Directly supported by inspected source, runtime output, or authoritative source | Name exact file path or source boundary |
| **Assumption** | Plausible working premise without direct proof | Label explicitly; specify blast radius if invalidated |
| **Decision** | Intentional selection among viable alternatives | Record rationale, trade-offs, and authority |
| **Unknown** | Information missing, conflicting, or unverified | Inspect, ask, or stop according to severity |
| **Result** | Claimed outcome of executed action | Attach fresh command output or test log |

## Grounding & Verification Constraints

| Directive | Constraint & Invariant |
| :--- | :--- |
| **Grounding** | Inspect source files before asserting symbols, conventions, or defects exist; never hallucinate paths, APIs, or commands. |
| **Integrity** | Surface contradictions and stale artifacts immediately; do not silently pick convenient sources. |
| **Verification** | Record exact command output and exit codes before claiming passing status. Do not imply unrun checks passed. |
| **Completion** | A task is complete only when required outcomes exist, required checks pass, and unresolved items are reported. |
| **Scope Fencing** | Mark proposed components as new; never present planned code as existing. |

## Stop Conditions

| Impact Level | Condition | Required Action |
| :--- | :--- | :--- |
| **Critical** | Missing facts affecting scope, auth, public API, data integrity, or irreversible ops | Stop immediately for verifiable evidence |
| **Moderate** | Local implementation ambiguity with reversible outcome | Document explicit assumption and proceed |
