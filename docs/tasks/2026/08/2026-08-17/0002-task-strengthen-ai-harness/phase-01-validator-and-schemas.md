---
title: "Phase 1: Output Schemas and Pure ESM Validator"
type: phase
parent: "docs/tasks/2026/08/2026-08-17/0002-task-strengthen-ai-harness/README.md"
phase: "1"
status: completed
created: "2026-08-17"
tags: [task, phase, schemas, validator]
---

# Phase 1: Output Schemas and Pure ESM Validator

## Objective

Establish canonical output schemas in `schemas/` and implement a dependency-free pure ESM JSON Schema validator in `orchestrator/validator.mjs` with exact path-level diagnostic reporting.

## Dependencies & Prerequisites

- Existing `schemas/knowledge.schema.json` and `schemas/project-profile.schema.json` as baseline JSON Schema format reference.

## Impacted Files & Components

- `schemas/run-result.schema.json` (NEW): Contract for runner execution results, structured tool invocations, and model outputs.
- `schemas/evaluation-report.schema.json` (NEW): Contract for test runner results, coverage summaries, and suite metrics.
- `schemas/claim-evidence.schema.json` (NEW): Contract for verified facts, citations, and evidence assertions.
- `orchestrator/validator.mjs` (NEW): Pure ESM schema validator enforcing types, required fields, enums, regex patterns, formats, nested objects, and arrays.

## Implementation Tasks

- [x] Task 1.1: Author `schemas/run-result.schema.json` defining valid runner outputs, execution metadata, token usage, and tool calls.
- [x] Task 1.2: Author `schemas/evaluation-report.schema.json` defining test suite outputs, individual assertion statuses, durations, and failure diffs.
- [x] Task 1.3: Author `schemas/claim-evidence.schema.json` defining claim verification items, evidence types, and citations.
- [x] Task 1.4: Implement `orchestrator/validator.mjs` with `validateSchema(data, schema)` and `assertValid(data, schema)` returning detailed error paths.

## Verification & Testing

- Automated self-test asserting `validateSchema` and `assertValid` across `run-result.schema.json`, `evaluation-report.schema.json`, and `claim-evidence.schema.json`. Verified valid payload acceptance and precise multi-error detection on invalid input.

## Risks & Rollback

- **Risk:** Incomplete JSON Schema keyword support.
- **Mitigation:** Focus validator on core drafting keywords used across Context Factory schemas (`type`, `properties`, `required`, `enum`, `items`, `pattern`, `additionalProperties`, `format`).
- **Rollback:** Remove new schema files and `orchestrator/validator.mjs`.
