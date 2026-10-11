---
title: "Codex and Claude Workflow Discovery Record"
type: discovery-record
status: ready
created: "2026-10-11"
sourceContext: docs/context/cli/codex-claude-workflow-discovery.md
sourceContextHash: sha256:4e88ad516c31f564c8039d0178ee0168fea1258e7a3690226158ba9b925f7f0b
---

# Codex and Claude Workflow Discovery Record

## Idea, actors, and release condition

Make the existing Context Factory workflows discoverable and usable in Codex and Claude Code, while retaining automatic selection for suitable ordinary requests. The user confirmed both outcomes and host-native invocation syntax on 2026-10-11. Release one plan-facing brief only after the ready source context, current source, canonical knowledge, accepted ADRs, host documentation, and scenario challenges agree.

The actors are a developer using Codex or Claude Code, a factory maintainer changing canonical workflows and bridge generation, and a host-project maintainer whose existing files must be preserved. A workflow entry selects guidance; it does not authorize a later execution, release, push, waiver, or external message. No application RBAC or stored user data is involved.

## Grounding claim packet: workflow adapter scope

The canonical Wiki has no note that defines Codex or Claude Code skill discovery, command menus, or host bridge paths. Those facts come from current repository source and the hosts' official documentation. The following is the smallest relevant Wiki guidance for the adapter design. Each source remains within its declared scope; no generic design principle is treated as a host behavior claim.

| Claim ID | Source and heading | Authority / lifecycle / last verified / hash | Selection reason | Status and claim |
| --- | --- | --- | --- | --- |
| G-WF-001 | `knowledge/principles/kiss.md` / Invariants & Rules | canonical / active / 2026-10-10 / `sha256:746558c85773c2a2f657a3e505a5b1ab2c7dd7d4c9435b07dc463b092ed17d2d` | Thin adapter and generator design; corroborated by `rules/typescript/common/pragmatic-design.md` | **verified:** favor direct, readable entry generation over a new workflow runtime or general plugin framework. |
| G-WF-002 | `knowledge/principles/yagni.md` / Invariants & Rules | canonical / active / 2026-10-10 / `sha256:463267ba919ce76a0d3e0b2578a376ea0f45d5d4318cce635482f7e7243608e7` | Current two-host scope; corroborated by `rules/typescript/common/pragmatic-design.md` | **verified:** do not add speculative adapters for other hosts or unused extension points. |
| G-WF-003 | `knowledge/README.md` / Canonical Knowledge Items | canonical index / active / 2026-07-25 / `sha256:b1b3d230ae77baf95246a11e331e0e2d8c444b7da662cb6dfb818303e785a6a6` | Inventory check for a host discovery contract | **unknown:** no applicable canonical Wiki note establishes Codex or Claude mechanics. Use source, accepted ADRs, and official host docs; do not infer host behavior from the Wiki. |

No active same-authority Wiki claims conflict. The selected notes are within their `reviewAfter` dates. No additional one-hop Wiki note changes workflow ownership or host discovery.

## Current evidence and decisions

| ID | Class | Source | Finding and consequence |
| --- | --- | --- | --- |
| R-01 | verified | `context-manifest.json`, `workflows/`, `docs/Workflows.md` | Twelve canonical workflow files are inventoried. The map describes text prefixes as slash commands; it does not install host menu entries. |
| R-02 | verified | `scripts/context-core.mjs` / `ACTION_TERMS`, `ROUTING_HINTS`, `resolveContext` | The resolver gates workflow selection on action terms or leading aliases. The descriptive original report selected none; `fix workflow recognition in Codex and Claude` selected `defect-resolution`. Selection exists but does not prove either host followed a workflow. |
| R-03 | verified | `app/cli/core/bridge-generator.mjs` / `generateBridge`, `detectInstalledIdes`, `auditBridgeSymlinks` | Codex and Claude profiles generate instruction files. `.agents/` links are currently created only for Antigravity/Gemini; no Claude project skill entries are generated. `detectInstalledIdes` currently treats any `.agents/` directory as Antigravity, so adding Codex entries must not misreport installed editor identity. |
| R-04 | verified | `.agents/skills/`, absence of `.claude/skills/`; `evals/tests/bridge/bridge-conformance.test.mjs` | The factory exposes 18 skills through Codex's project path, but no root Claude project skill directory. Bridge tests currently check instruction files and gates, not workflow entry discovery. |
| R-05 | accepted decision | ADR 0003 and ADR 0038 | Workflow files remain the lifecycle authority. Thin host entries point to them; the user chose this over routing only or converting full workflows into skills. |
| R-06 | verified external | [OpenAI skills](https://learn.chatgpt.com/docs/build-skills), [OpenAI custom prompts](https://learn.chatgpt.com/docs/custom-prompts), [Claude Code skills](https://code.claude.com/docs/en/skills), checked 2026-10-11 | Codex uses `.agents/skills` and `/skills` or `$name`; its local custom prompts are deprecated. Claude Code uses `.claude/skills` and `/name`. Both hosts may select skills implicitly from descriptions, but their UI behavior still needs live checking after implementation. |
| R-07 | verified | `scripts/handoff-contract.mjs`, `docs/discovery/README.md` | Handoff verification requires JSON `brief.md` with a `released` status and a hash of this record. The brief must also contain the full plan-facing summary so the machine gate does not become a content-free receipt. |
| R-08 | user decision | Responses on 2026-10-11 | The user selected both automatic routing and visible host entries, canonical workflows with thin entries, and host-native invocation instead of deprecated literal Codex custom prompts. This confirms the shared understanding in the ready context. |

## Decision tree and settled answers

| Branch | Answer | State |
| --- | --- | --- |
| Outcome and success | All 12 current workflows get discoverable entries in both hosts; suitable ordinary requests select a workflow; invoked entries load and follow canonical gates. | settled |
| Domain language | **Canonical workflow** means `workflows/*.md` lifecycle policy; **entry skill** means a short host-discoverable pointer; **resolver alias** means an internal text trigger, not a native menu registration. | settled |
| Actors and authority | Developers invoke or describe work; factory maintainers own workflows and generated entries; host maintainers own existing host files. An entry cannot grant later action authority. | settled |
| Boundaries | Keep canonical policy in workflow files and ADR 0003's separation. Host entries depend on workflow files. No duplicated phase text or second workflow engine. | settled by ADR 0038 |
| Host integrations | Codex project skills under `.agents/skills`; Claude Code project skills under `.claude/skills`; use each host's native picker and syntax. | settled by user and official docs |
| Automatic routing | Preserve action-sensitive resolver selection; test positive, direct-question, and ambiguous cases. Do not claim generic language always has a single correct workflow. | settled |
| Lifecycle states | Entry absent, present with valid canonical target, discoverable in host, invoked, and canonical gates followed are distinct states. Diagnostics and completion evidence must distinguish them. | settled |
| Data, privacy, and security | No database, API, credentials, or application permissions are introduced. Generated paths are bounded and existing host files are preserved. | settled |
| Failure and recovery | Collision, missing factory/submodule, broken link, stale entry, or unsupported host capability is reported with a recovery action; never silently overwrite or claim success. | settled |
| Concurrency and rollout | Regeneration checks the target at write time, preserves user-owned entries, and remains repeatable. Synchronize inventory/maps/lock and migrate docs that misstate native slash behavior. | settled requirement |
| Non-goals | No deprecated Codex prompts, no other host adapters, no consumer application changes, no automatic release or execution after selecting an entry. | settled |

## Question log and unknowns

| ID | Question | Why it mattered | Answer / authority | State |
| --- | --- | --- | --- | --- |
| Q-01 | Automatic routing, visible entries, or both? | Defines acceptance criteria and resolver scope. | Both, confirmed by user 2026-10-11. | resolved |
| Q-02 | Keep canonical workflow files and add thin entries? | Avoids policy duplication and determines dependency direction. | Yes, confirmed by user 2026-10-11; ADR 0038 accepted. | resolved |
| Q-03 | Is each host's native invocation acceptable? | Codex's literal custom slash prompts are deprecated and local-only. | Yes, confirmed by user 2026-10-11. | resolved |

There is no material unknown. Exact non-colliding entry names and bridge file organization remain reversible planning details. Live menu behavior and gate adherence are verification obligations after implementation, not facts already proved by this discovery.

## Scenario challenge and coverage

| Class | Scenario | Expected outcome and recovery | Basis | State |
| --- | --- | --- | --- | --- |
| Happy path | A developer selects a workflow entry in Codex, then in Claude Code, for a multi-stage request. | Each host loads the same canonical workflow and applies its inputs, gates, and stops. Separate host smoke evidence is recorded. | R-05/06; context §1–2 | covered requirement |
| Happy path | A developer writes an actionable request without an entry. | Resolver selects the best supported workflow with a reason; the agent loads it. | R-02; context §2 | covered requirement |
| Boundary | A user asks what workflows are without requesting a change. | No delivery lifecycle is forced solely by the noun. | R-02; context §2 | covered |
| Boundary | A request could fit two workflows, or an entry name collides with an existing skill. | Show the selection basis or ask for the material distinction; setup preserves the existing skill and reports the collision. | Context §2; R-06 | covered |
| Failure | A submodule is absent, moved, or linked entry target is broken. | Diagnostics fail the affected entry and name the exact repair action; no false readiness. | R-03; context §2 | covered requirement |
| Failure | An entry appears in the picker but omits the canonical workflow's stop condition. | Completion fails the live behavior check even if link and inventory checks pass. | ADR 0038; context §2 | covered requirement |
| Abuse | A release workflow entry is invoked without release authorization, or setup targets a user-owned file. | Workflow stops at the authority gate; setup refuses silent overwrite. | `orchestrator/SHARED.md`; ADR 0038 | covered |
| Concurrency | Two setup runs add an entry while a host maintainer creates a same-name entry. | Recheck the destination before write; preserve the maintainer's file and report the conflict. | Context §2; ADR 0038 | covered requirement |
| Lifecycle | A new workflow is added, an old workflow is removed, or a bridge is regenerated. | Inventory and host entries reconcile, removed generated entries are cleaned only with known ownership, and stale targets fail diagnostics. | R-01/03; ADR 0038 | covered requirement |
| Performance | Twelve entries increase the host skill inventory beyond its context budget. | Measure list size and verify all intended entries remain selectable; shorten descriptions or revise packaging without dropping canonical gates. | OpenAI skill docs; ADR 0038 | covered requirement |

## Conflict ledger, risks, and release audit

- **No active decision conflict:** ADR 0038 adds discovery adapters while preserving ADR 0003's canonical workflow layer. Repository source and host docs agree that ordinary workflow Markdown is not a host skill registration.
- **Documentation conflict to repair during implementation:** `docs/Workflows.md` calls resolver aliases slash commands; that label overstates native host installation. Its generator in `app/cli/core/indexer.mjs` owns the text and must be updated alongside the generated map.
- **Risk:** Codex may truncate a large initial skill list; host smoke and inventory-size evidence are required before declaring every entry discoverable.
- **Risk:** A new `.agents/` directory for Codex may be misclassified as Antigravity by current IDE detection. Preserve accurate host setup status.
- **Risk:** Factory `doctor`, resolver evaluations, and link audits do not prove Claude and Codex actually loaded and followed entries. Separate live checks remain required.
- **Release gate:** Source context is ready and unchanged at the recorded hash; user confirmation covers all material choices; claim statuses and limitations are explicit; happy, boundary, failure, abuse, concurrency, lifecycle, and performance scenarios have expected outcomes; no material unknown remains. Release one content-rich JSON brief for `plan` after hashing this record.
