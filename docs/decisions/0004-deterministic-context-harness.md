---
title: Deterministic Context Harness
type: decision
status: accepted
created: 2026-07-25
tags: [adr, context, llm, reliability]
---

# 0004 — Deterministic Context Harness

## Context

The factory has authoritative Markdown contracts and structural validation, but an agent still interprets selection, evidence, and completion largely through prose. Unsupported claims, excessive context loading, inconsistent pattern choices, and silent drift remain possible without executable controls.

## Options considered

1. Expand prompt contracts only. This is inexpensive but cannot independently prove selection or verification behavior.
2. Add a dependency-free deterministic compiler and evaluator around the current files. This preserves the repository model while making selection, provenance, synchronization, and regression behavior executable.
3. Build a hosted agent platform with a model gateway, database, vector retrieval, and telemetry service. This offers deeper runtime control but adds operational complexity before the factory has evidence that it needs it.

## Decision

Adopt option 2. Keep Markdown and `context-manifest.json` canonical, compile immutable task-specific bundles with file hashes, validate structured knowledge, and run behavioral cases in CI. The harness will not call an LLM; it supplies deterministic context and verification contracts to any model adapter.

## Consequences

- Context selection and factory health become explainable and testable.
- Consumers can pin a context version and lock digest.
- LLM Wiki retrieval begins with scope and lexical metadata instead of requiring embeddings.
- Behavioral quality still depends on representative evaluation cases and must be expanded from observed failures.
- A hosted platform remains a reversible future step if trace volume, shared retrieval, or access control requires it.

## Validation and review date

Review after thirty material harness runs or by 2027-01-25. Measure false context selections, unsupported completion claims caught, bundle size, evaluation regressions, and maintenance cost.
