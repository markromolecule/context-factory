---
title: "Phase 3 — Connectors"
type: phase
parent: "0002-task-loop-engineering-integration"
phase: "03"
status: completed
created: "2026-08-29"
tags: [task, phase, connectors, mcp, github, devops]
---

# Phase 3 — Connectors

## Objective

Implement the connectors primitive: author `docs/Connectors.md` Map of Content, create root project `.mcp.json` with GitHub server configuration, establish ownership in `agents/devops-agent/AGENT.md`, and link both from `README.md` and `docs/Home.md`.

## Dependencies & Prerequisites

- Phase 1 & 2 completed.

## Impacted Files & Components

- `docs/Connectors.md` — Map of Content documenting available MCP connectors.
- `.mcp.json` — Project-scoped Model Context Protocol configuration.
- `agents/devops-agent/AGENT.md` — DevOps agent role definition.
- `README.md` — Repository entry point "Start here" list.
- `docs/Home.md` — Obsidian vault index.

## Implementation Tasks

- [x] Author `docs/Connectors.md` matching the style of `docs/Rules.md` / `docs/Skills.md`.
- [x] Create `.mcp.json` at repository root defining `@modelcontextprotocol/server-github` server with `${GITHUB_TOKEN}` env mapping.
- [x] Update `agents/devops-agent/AGENT.md` to declare ownership of MCP tool configurations.
- [x] Update `README.md` to link `docs/Connectors.md` and `.mcp.json` in the "Start here" list.
- [x] Update `docs/Home.md` to include `docs/Connectors.md` under Maps of Content.

## Verification & Testing

- Validate `.mcp.json` syntax and JSON validity.
- Verify `README.md` and `docs/Home.md` wikilinks.
- Verify all connector documentation links resolve without broken references.

## Risks & Rollback

- **Risk:** Committing hardcoded access tokens or credentials in `.mcp.json`.
- **Mitigation:** Strict environment variable interpolation (`${GITHUB_TOKEN}`) per `rules/global/security-guardrails.md`.
