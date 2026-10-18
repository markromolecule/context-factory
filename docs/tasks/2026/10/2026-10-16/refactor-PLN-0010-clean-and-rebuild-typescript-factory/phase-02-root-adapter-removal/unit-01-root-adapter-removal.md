---
title: "Phase 2 — Remove Root Model Adapters and Centralize Contract"
type: unit
parent: "phase-02-root-adapter-removal"
unit: "02.01"
task_branch: "refactor/PLN-0010-clean-and-rebuild-typescript-factory"
base_commit: "a37f557a2fde8e30b6ae23a941d74d8e87a5677f"
status: completed
created: "2026-10-16"
tags: [task, unit, cleanup, root, orchestrator]
depends_on: ["01.01"]
parallelizable_with: []
---

# Unit 02.01: Remove Root Model Adapters and Centralize Contract

> Phase: phase-02-root-adapter-removal · Depends on: 01.01 · Parallelizable with: none  
> Task branch: refactor/PLN-0010-clean-and-rebuild-typescript-factory · Base commit: a37f557a2fde8e30b6ae23a941d74d8e87a5677f

## Objective

Remove redundant model-specific instruction files from the project root and orchestrator directory, establishing `orchestrator/SHARED.md` and `README.md` as the authoritative model-neutral contracts.

## Context packet

- Root directory contained `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, while `orchestrator/` contained matching adapter wrappers.
- In accordance with Decision `D-02`, these files are removed to achieve a clean root architecture.
- Serves acceptance criterion `AC-02`.

<language_rules>
- [directive:cf.evidence.grounding][mode:evidence-blocking] rules/global/evidence-and-claims.md
- [directive:cf.evidence.verification][mode:automated-blocking] rules/global/evidence-and-claims.md
</language_rules>

> **Precedence Invariant:** If a step in this unit contradicts an applicable language rule, the language rule strictly takes precedence.

## Preconditions

- Unit 01.01 completed on `refactor/PLN-0010-clean-and-rebuild-typescript-factory`.
- Clean git status on task branch.

## Scope

**In scope:**
- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
- `GEMINI.md`
- `.cursorrules`
- `.windsurfrules`
- `.github/copilot-instructions.md`
- `orchestrator/AGENTS.md`
- `orchestrator/CLAUDE.md`
- `orchestrator/CODEX.md`
- `orchestrator/GEMINI.md`
- `orchestrator/SHARED.md`
- `docs/ARCHITECTURE.md`

**Out of scope:**
- Modifying CLI commands or doctor (reserved for Unit 03.01).
- Modifying bridge generator or validator (reserved for Unit 04.01).

## Steps

1. Delete root model files: `rm -f AGENTS.md CLAUDE.md CODEX.md GEMINI.md .cursorrules .windsurfrules .github/copilot-instructions.md`.
2. Delete orchestrator adapters: `rm -f orchestrator/AGENTS.md orchestrator/CLAUDE.md orchestrator/CODEX.md orchestrator/GEMINI.md`.
3. Inspect `orchestrator/SHARED.md` and verify all instructions point to model-neutral files and `README.md`.
4. Update `docs/ARCHITECTURE.md` entrypoints section to document `orchestrator/SHARED.md` and `README.md` as authoritative contracts.
5. Verify repository root contains no remaining model dotfiles or adapter markdown files.

## Verification

- **Integrity Inspection:**
  - Test type: Architecture / Cleanup verification.
  - Command: `node -e "import('node:fs').then(fs => { const deleted = ['AGENTS.md', 'CLAUDE.md', 'CODEX.md', 'GEMINI.md', '.cursorrules', '.windsurfrules', '.github/copilot-instructions.md', 'orchestrator/AGENTS.md', 'orchestrator/CLAUDE.md', 'orchestrator/CODEX.md', 'orchestrator/GEMINI.md']; for (const f of deleted) { if (fs.existsSync(f)) throw new Error('File still exists: ' + f); } console.log('All 11 target adapter files cleanly removed.'); })"`
- **Git Status:**
  - Command: `git status --short` confirms all 11 files staged or marked deleted.

## Rollback

Run `git checkout -- AGENTS.md CLAUDE.md CODEX.md GEMINI.md .cursorrules .windsurfrules .github/copilot-instructions.md orchestrator/ docs/ARCHITECTURE.md`.

## Definition of done

- [x] Maps to acceptance criteria: AC-02
- [x] Executed on the recorded task branch
- [x] Changes committed cleanly to the task branch
- [x] Zero scope leaks confirmed via `/review`
- [x] All listed verification passes
