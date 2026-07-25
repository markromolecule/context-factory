---
name: evidence-and-claims
description: Ground factual, implementation, verification, and completion claims in inspectable evidence and expose uncertainty instead of filling gaps.
scope: Planning, implementation, review, research, documentation, tool use, and final reports.
alwaysApply: true
---

# Evidence and Claims

## Claim classes

Classify consequential statements before using them to make a decision:

| Class         | Meaning                                                                                     | Required treatment                         |
| ------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Verified fact | Directly supported by inspected source, runtime output, or an authoritative external source | Name the source boundary                   |
| Assumption    | Plausible but not verified                                                                  | Label it and state how it affects the work |
| Decision      | A deliberate choice among viable options                                                    | Record rationale and authority             |
| Unknown       | Evidence is missing or conflicting                                                          | Inspect, ask, or stop according to impact  |
| Result        | A claimed outcome of performed work                                                         | Attach fresh verification evidence         |

Do not convert an assumption, documentation statement, search result, or prior run into a verified fact without checking the authoritative current source.

## Grounding requirements

- Inspect a file before claiming that it contains a symbol, behavior, convention, or defect.
- Do not invent files, functions, APIs, commands, test results, citations, users, or system state.
- Cite repository evidence with paths and external claims with authoritative sources when citations are requested or material.
- Treat generated files, caches, documentation, and tests as supporting evidence unless the repository declares them authoritative.
- Surface contradictions and stale evidence; do not silently choose the convenient source.
- Mark proposed files and interfaces as new. Do not present them as existing.

## Implementation and completion

- Map every acceptance criterion to an implementation boundary and verification result.
- Record the exact check and its outcome before claiming that it passed.
- Do not imply unrun checks passed. State skipped, unavailable, or failing checks plainly.
- Treat a zero exit status as evidence only for the behavior the command actually checks.
- A task is complete only when required outcomes exist, required checks pass, and unresolved items are reported.

## Stop conditions

Stop for evidence when a missing fact could change scope, authorization, public compatibility, data integrity, security, or an irreversible action. For lower-impact gaps, proceed only with an explicit, reversible assumption.
