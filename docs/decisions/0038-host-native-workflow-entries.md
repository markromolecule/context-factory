---
title: "Host-Native Entries for Canonical Workflows"
type: decision
status: accepted
created: "2026-10-11"
tags: [adr, workflows, skills, codex, claude, bridge]
---

# 0038 — Host-Native Entries for Canonical Workflows

## Context

ADR 0003 established `workflows/*.md` as the authoritative multi-stage lifecycle layer, distinct from specialized skills. `orchestrator/SHARED.md` requires a matching workflow for multi-stage work. The resolver selects workflows from action-bearing requests, but repository workflow Markdown is not itself registered in Codex or Claude Code's skill menu. `docs/Workflows.md` labels internal aliases as slash commands, while the current bridge gives Codex and Claude instruction files without corresponding workflow entries. In the factory checkout, `.agents/skills/` exposes skills and `.claude/skills/` is absent.

The user confirmed two outcomes on 2026-10-11: appropriate automatic routing from ordinary requests and visible workflow entries in both hosts. The user also accepted the hosts' native forms: Codex `/skills` or `$name`, and Claude Code `/name`. Official OpenAI documentation deprecates custom prompts and limits them to the local Codex home, so they are unsuitable as shared project entries.

## Options considered

1. **Keep resolver aliases and add explanatory documentation.** Smallest change and adequate for users who know the text triggers. It cannot meet the visible-entry requirement or detect host discovery failures.
2. **Convert workflows into full skills.** Uses the hosts' native discovery and could make every workflow visible. It changes the accepted separation of lifecycle coordination and specialized procedure, and creates pressure to maintain duplicate workflow bodies or move gates into skills.
3. **Keep canonical workflows and expose thin host-native entry skills.** A small entry for each workflow names the canonical file, asks the agent to load it and resolve the actual request, and carries no independent lifecycle policy. The bridge installs entries in each host's project discovery location and checks for collisions and broken targets. This meets both requested outcomes while preserving one authoritative workflow contract.

## Decision

Adopt **option 3**, authorized by the user's 2026-10-11 selection. `workflows/*.md` remains authoritative for phases, gates, stop conditions, and completion evidence. Host entry skills are discovery adapters. They must use unique, predictable names, link back to the canonical workflow, and never imply that selecting an entry grants authority for later execution or release. `scripts/context-core.mjs` remains the automatic selector for ordinary requests; resolver tests must cover confident matches, direct questions, and ambiguous wording.

Codex entries use repository skills discoverable under `.agents/skills/` and its `/skills` or `$name` invocation. Claude Code entries use project skills discoverable under `.claude/skills/` and `/name` invocation. Do not build new Codex custom prompts for this feature. Update the host bridge and diagnostics so the factory and bridged repositories expose equivalent entries without replacing user-owned files. Exact names and file layout are implementation details subject to collision checks.

## Consequences

- **Dependency direction and contracts:** Entry skills depend on canonical workflow files and the resolver. Workflow files do not import or duplicate host-specific entry text. The workflow inventory and bridge output need deterministic consistency checks.
- **Consumers and migration:** Existing resolver callers, maps, evaluations, and skill users keep their current contracts. New host entries are additive. Existing host files must be preserved, with conflicts reported for manual resolution. Deprecated or mistaken documentation about native slash aliases must be corrected.
- **Data, security, and performance:** No database or API contract changes. Path resolution must avoid broken or unintended targets. Workflow activation does not bypass authorization or gates. Thin entries limit extra prompt content; total skill-list size should be measured because hosts may truncate large inventories.
- **Operations and rollback:** Bridge setup and doctor-style diagnostics should distinguish discovery files, valid targets, resolver selection, and actual host behavior. Rollback removes generated entries only when ownership is known; canonical workflows and existing skills remain usable.

## Validation and review trigger

Before claiming delivery, verify a generated entry for every intended workflow, zero name collisions, valid targets in factory and a representative bridged host, relevant resolver and bridge tests, synchronized manifest/maps/lock, and separate manual Codex and Claude checks that invoke an entry and observe the canonical gates. A passing factory `doctor` is only a health check, not proof of host behavior. Review this decision after the first ten cross-host workflow uses, after a host changes skill discovery or invocation, or if adapter drift appears.

Sources: [OpenAI skill documentation](https://learn.chatgpt.com/docs/build-skills), [OpenAI custom prompt deprecation](https://learn.chatgpt.com/docs/custom-prompts), [Claude Code skill documentation](https://code.claude.com/docs/en/skills), `docs/decisions/0003-first-class-development-workflows.md`, `app/cli/core/bridge-generator.mjs`, `scripts/context-core.mjs`.
