---
title: "Codex and Claude Workflow Discovery"
type: context
status: ready
created: "2026-10-11"
tags: [context, workflows, codex, claude, cli]
feature: "codex-claude-workflow-discovery"
---

# Codex and Claude Workflow Discovery Context Specification

## 1. Overview & Objective

- **Problem:** Context Factory inventories and routes `workflows/*.md`, but those files are not native Codex or Claude skill entries. The workflow map calls internal text aliases “slash commands,” which suggests a native menu entry that is not installed. The present bridge creates `CODEX.md` and `CLAUDE.md` guidance but does not register workflow entries for those hosts.
- **User value:** A developer can find and invoke a workflow in either host and can describe ordinary work without manually attaching a workflow file.
- **Success criteria:** Every intended workflow has a unique, discoverable host-native entry; a selected entry loads the canonical workflow and preserves its gates; ordinary action requests select the appropriate workflow when evidence supports a match; direct questions do not force one; the generated host bridge and factory checkout agree; automated contract tests and manual Codex and Claude smoke checks report their distinct results.

## 2. Requirements & User Stories

### User Stories / Scenarios

- As a developer using Codex, I want to select a named workflow through `/skills` or `$name`, so that I can deliberately start its lifecycle.
- As a developer using Claude Code, I want to select a named workflow with `/name`, so that I can deliberately start its lifecycle.
- As a developer describing a task in ordinary language, I want the resolver to select a matching workflow when appropriate, so that I need not remember command names.
- As a maintainer, I want workflow instructions to have one canonical source, so that host entries cannot silently diverge.

### Functional Requirements

- [ ] Keep `workflows/*.md` and `context-manifest.json` as the authoritative workflow inventory and lifecycle text, consistent with ADR 0003.
- [ ] Expose thin, uniquely named workflow entry skills in Codex's project skill path and Claude Code's project skill path. Use the hosts' supported invocation syntax; do not promise a literal Codex `/workflow-name` command.
- [ ] Generate or link host entries from canonical workflow metadata, with paths that work in the factory checkout and bridged host repositories. Preserve unrelated host files and reject name collisions or broken targets.
- [ ] Make each entry direct the agent to load the canonical workflow, run `resolve` for the actual request, and honor the workflow's inputs, gates, stops, and task scope. The entry must not copy the full workflow body.
- [ ] Keep implicit selection in `scripts/context-core.mjs` action-sensitive. Add representative resolver cases for natural language, explicit entries, direct questions, and ambiguous prompts; distinguish selection from actual host behavior.
- [ ] Correct documentation that presents resolver aliases as native slash registrations. Explain Codex `/skills` or `$name`, Claude `/name`, and the separate internal resolver aliases.
- [ ] Synchronize inventory, maps, lock, validation, and bridge tests when implementation changes canonical files.

### Edge Cases & Failure Modes

| Situation | Expected behavior |
| --- | --- |
| A workflow entry name collides with an existing skill or host command | Setup reports the conflict and preserves the existing entry; no silent override. |
| A host project has custom `.agents/skills` or `.claude/skills` content | Setup preserves it and adds only conflict-free entries. |
| A linked factory or submodule is missing or moved | Entry cannot claim success; diagnostics identify the broken path and repair action. |
| A direct question mentions “workflow” without asking for a change | No delivery workflow is forced solely by that noun. |
| An action request is ambiguous among workflows | Resolver reports the selected reason or no confident match; the agent asks for the one material distinction before progressing. |
| The host displays a skill but the agent skips the canonical workflow | Smoke verification fails; menu visibility alone is insufficient. |
| A workflow has release or execution side effects | Invocation still obeys user authorization and workflow stop conditions. |

## 3. Technical & Architectural Context

- **Affected layers:** Node.js ESM resolver (`scripts/context-core.mjs`), CLI bridge generation and diagnostics (`app/cli/core/bridge-generator.mjs`), project skill directories, validation/evaluations, and documentation. No application frontend, database, or mobile layer.
- **Language stack and rules:** JavaScript ESM in a TypeScript-focused factory. Candidate directives for later implementation are `cf.evidence.grounding` and `cf.evidence.completion` (evidence-blocking), `cf.evidence.verification` and `cf.quality.tests-for-behavior-changes` (automated-blocking), and `cf.quality.minimal-complete-change` (evidence-blocking). A scoped preflight must determine the actual binding before code edits.
- **Current contracts:** `orchestrator/SHARED.md` defines workflow selection and gates. `docs/decisions/0003-first-class-development-workflows.md` keeps workflows separate from skills. `docs/Workflows.md` lists resolver aliases. The factory has `.agents/skills/` links but no root `.claude/skills/`; bridge generation currently creates `.agents/` links only for Antigravity/Gemini profiles.
- **Host capabilities:** Official OpenAI documentation says Codex discovers repository skills from `.agents/skills` and invokes them with `/skills` or `$name`; its custom prompts are deprecated and local to `~/.codex/prompts`. Official Claude Code documentation says project skills load from `.claude/skills` and are invoked with `/name`.
- **Contracts and consumers:** Canonical workflow files feed the resolver, manifest, maps, existing evaluations, host instructions, and future host entries. The host entries depend on canonical workflow files; canonical files do not depend on host entry formats.
- **Data/security/operations:** No database or API schema changes. Bridge generation must resolve and validate paths without overwriting user files. Workflow selection does not grant execution, release, or messaging authority. Generated entries need drift checks and recoverable regeneration.

### Architecture Choice

Compare exactly three approaches:

1. **Keep resolver aliases and documentation only.** Lowest implementation cost, but does not satisfy discoverable entries in either host.
2. **Convert full workflow files into skills.** Native visibility, but duplicates or changes the responsibility of the accepted workflow layer and makes lifecycle gates harder to keep separate.
3. **Keep canonical workflows and add thin host-native entry skills.** Meets both requested outcomes with one lifecycle source, bounded adapter code, collision checks, and host-specific invocation syntax. **Selected by the user on 2026-10-11.**

The selected design is recorded in ADR 0038. Exact entry names and bridge file layout should be finalized during planning using a collision inventory and host smoke checks; the required naming rule is unique, predictable workflow names that do not shadow existing skills.

## 4. UI/UX & Interaction Guidelines

- Show concise, task-oriented workflow descriptions in each host picker. Name the lifecycle outcome and its main gate; do not imply that selecting a workflow authorizes every later phase.
- Documentation and CLI diagnostics must say whether an entry is discovered, its target resolves, and its workflow was actually followed. These are separate states.

## 5. Scope & Boundaries

- **In scope:** Codex and Claude Code project entry discovery, factory and generated host bridge parity, ordinary-language routing evidence, naming/collision handling, documentation, diagnostics, and verification.
- **Out of scope:** Replacing canonical workflow text with skills, deprecated Codex custom prompts, other host integrations, production code changes in consumer repositories, and automatic execution or release after selecting an entry.

## 6. References & External Context

- `orchestrator/SHARED.md`; `docs/Workflows.md`; `docs/decisions/0003-first-class-development-workflows.md`; `docs/decisions/0012-skill-taxonomy-and-slash-ergonomics-optimization.md`; `docs/decisions/0017-ide-bridging-and-symlink-synchronization-architecture.md`; `docs/decisions/0038-host-native-workflow-entries.md`.
- [Official OpenAI skill discovery and invocation](https://learn.chatgpt.com/docs/build-skills); [official OpenAI custom prompt deprecation](https://learn.chatgpt.com/docs/custom-prompts); [official Claude Code skill discovery and invocation](https://code.claude.com/docs/en/skills).
- User confirmation on 2026-10-11: both implicit selection and visible entries, canonical workflows with thin entries, and each host's native invocation form.

## 7. Discovery Evidence & Handoff

### Evidence Inventory

| ID | Source path / reference | Verification state | Finding | Consequence |
| --- | --- | --- | --- | --- |
| E-01 | `context-manifest.json`, `workflows/`, `docs/Workflows.md` | verified in checkout | Twelve workflows are inventoried; the map lists textual slash aliases. | Preserve canonical workflow layer and clarify alias meaning. |
| E-02 | `node scripts/context.mjs resolve "Codex and Claude do not recognize configured workflows; only skills appear as slash commands"` | verified in checkout | Returns no workflow because this description has no action trigger. | Do not call this a routing failure for an action request; test both descriptive and actionable requests. |
| E-03 | `node scripts/context.mjs resolve "fix workflow recognition in Codex and Claude" --json` | verified in checkout | Selects `defect-resolution`. | Implicit routing exists, but host pickup and execution still need separate verification. |
| E-04 | `app/cli/core/bridge-generator.mjs` | verified in checkout | Claude and Codex profiles generate instruction files; `.agents/` links are conditional on Antigravity/Gemini. | Add host-specific discovery paths through bridge changes. |
| E-05 | `.agents/skills/`, `.claude/skills/` | verified in checkout | Codex skill links exist; root Claude skill directory is absent. | Factory and host setup need separate checks. |
| E-06 | Official OpenAI and Anthropic documentation linked above | verified on 2026-10-11 | Both hosts discover skills; invocation syntax differs. | Use host-native entries and avoid deprecated Codex custom prompts. |

### Unknowns and Blockers

| ID | Question or gap | Classification | Owner | Blocks readiness? | Resolution |
| --- | --- | --- | --- | --- | --- |
| U-01 | Exact entry names and pre-existing host collisions | implementation detail | Planner/implementer | no | Inventory names and prove no shadowing before generation. |
| U-02 | Live Codex and Claude menu and behavior after implementation | verification pending | Implementer/user with host access | no for discovery; yes for completion | Run separate host smoke checks and record observed outputs. |

### Discovery Handoff

- **Allowed recipients:** `grounding`, `grill`
- **Forbidden direct recipients:** `plan`, `plan-review`, `execute`
- **Ready for grill:** yes
- **Context content hash:** compute when handing this specification to `grounding`.
