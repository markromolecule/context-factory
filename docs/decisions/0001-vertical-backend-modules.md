---
title: Vertical Backend Modules
type: decision
tags: [adr, backend, architecture]
---

# 0001 — Vertical Backend Modules

## Status

Accepted.

## Context

Backend capabilities need predictable ownership as the application grows. A global layer-only structure makes one feature span distant directories, while putting all logic in route handlers couples business policy and persistence to HTTP.

## Decision

Organize backend code first by business capability under `src/modules/<feature>/`, then by DTO, controller, service, and data responsibility inside that module. Dependencies flow from route to controller to service to data. Operation files use action-first names and mandatory layer suffixes; plural feature names indicate true multi-record operations.

Generated Hono and Express starters include a mounted `sample` module that demonstrates the pattern with strict DTO validation and safe public errors.

## Consequences

- Feature changes and tests remain locally discoverable.
- Business logic stays independent of HTTP frameworks and persistence mechanics.
- Some small capabilities have more files, so layers should be added only when the responsibility exists.
- Cross-module behavior requires explicit contracts or an application-level orchestrator rather than importing module internals.

## Alternatives considered

Global controller, service, and repository directories were rejected because feature ownership becomes scattered. Route-handler-centric modules were rejected because business rules become coupled to transport. A fully domain-driven aggregate architecture remains available when domain complexity justifies it, but is too heavy as the default starter.
