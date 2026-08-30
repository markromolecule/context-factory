---
title: "Categorical Skill Grouping and Group Index Invariants"
type: decision
status: accepted
created: "2026-08-30"
tags: [adr, skills, categorization, engineering, productivity, groups, validation, doctor]
---

# 0020 — Categorical Skill Grouping and Group Index Invariants

## Context

As the Context Factory skills catalog grew from 6 to 12 procedural skills, keeping all skills in a flat `skills/` folder impaired human browseability and obscured the functional distinction between hands-on engineering/coding tools (such as `execute`, `refactor`, `verify`, `explore`, and `security`) and pre-planning/discovery/documentation tools (such as `grill`, `context`, `docs`, `plan`, `adr`, `grounding`, and `triage`).

Furthermore, as skills are added, refactored, or deprecated, there was no automated mechanism requiring subdirectories to maintain up-to-date documentation index notes.

## Options considered

1. **Option 1 (Flat Directory with Naming Prefixes):** Maintain a flat `skills/` directory using naming prefixes (e.g. `skills/eng-execute/`, `skills/prod-grill/`).  
   *Rejected:* Clutters root `skills/` folder, compromises slash command ergonomics, and fails to provide dedicated group overview documentation.
2. **Option 2 (Granular Multi-folder Hierarchy):** Divide skills into 4+ narrow micro-directories (`skills/discovery/`, `skills/planning/`, `skills/coding/`, `skills/testing/`, `skills/governance/`).  
   *Rejected:* Overly fragmented; deep hierarchy causes excessive nesting for small numbers of skills per directory.
3. **Option 3 (Two Categorical Groups with Enforced Group README Invariants - Selected):**
   - Establish two primary categories: `skills/engineering/` (5 skills) and `skills/productivity/` (7 skills).
   - Author a dedicated `README.md` in `skills/`, `skills/engineering/`, and `skills/productivity/`.
   - Update `scripts/validate-context.mjs` to automatically verify group `README.md` presence and assert that every member skill is linked in its group README.
   - Support nested skill resolution transparently in `scripts/context-core.mjs` and `app/cli/core/indexer.mjs`.

## Decision

Adopt **Option 3**. The Context Factory skills are organized into `skills/engineering/` and `skills/productivity/`:

| Group | Path | Member Skills | Purpose |
| :--- | :--- | :--- | :--- |
| **Engineering & Coding** | `skills/engineering/` | `execute`, `explore`, `refactor`, `security`, `verify` | Hands-on code manipulation, architecture inspection, refactoring, test verification, security checks |
| **Productivity & Discovery** | `skills/productivity/` | `adr`, `context`, `docs`, `grill`, `grounding`, `plan`, `triage` | Requirements grilling, context specification, documentation reports, planning, decision logging, wiki grounding, triage |

### Architectural Invariants

- **INV-01 (Group README Presence):** Every direct subdirectory under `skills/` must contain a `README.md`.
- **INV-02 (Member Skill Linking):** Every skill (`skills/<group>/<skill>/SKILL.md`) must be documented and wiki-linked to its `SKILL.md` note in its group `README.md`.
- **INV-03 (Automated Validation):** `scripts/validate-context.mjs` and `node scripts/context.mjs doctor` enforce INV-01 and INV-02 on every validation run.
- **INV-04 (Harness Resolution Transparency):** Slash commands and agent/workflow skill declarations resolve to the appropriate nested path automatically without requiring changes to agent skill names.

## Consequences

- Improved browseability and logical organization of the skills directory.
- Guaranteed synchronization between disk contents and group documentation index notes.
- Seamless compatibility with all slash command shortcuts and lifecycle workflows.
