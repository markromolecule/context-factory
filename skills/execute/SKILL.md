---
name: execute
description: Execute an existing task or implementation plan artifact strictly one phase at a time, verify the resulting code, record evidence, and stop at each phase boundary for developer inspection (/execute, /exec, [EXEC]).
---

# Execute an Implementation Plan Phase by Phase

This skill consumes an approved plan; it does not invent a replacement plan or execute multiple phases concurrently.

## Start & Identify Active Phase

1. Locate the user-specified plan or the relevant task directory under `docs/tasks/`.
2. Read the master plan (`README.md`) and inspect the phase breakdown files in dependency order (`phase-01-...md`, `phase-02-...md`, etc.).
3. Identify the **first incomplete phase**. Keep **strictly one phase active**.
4. Confirm prerequisites, target files, and current state before modifying code.
5. If the plan is missing or a decision would materially alter scope, report the blocker and stop.

## Execute Active Phase

1. Modify only the in-scope files for the active phase plus necessary tests, generated artifacts, and documentation.
2. Follow all applicable domain rules from `rules/` matching touched files (TypeScript type safety, runtime validation, ESR query optimization, vertical backend modules, UI guidelines, and strict SOLID principles under `rules/solid/`).
3. Run the narrowest useful verification checks after each task (unit tests, typecheck, lint).
4. For database and configuration changes:
   - Review migration SQL before applying.
   - Update `.env.example` without exposing secrets.
   - Regenerate types and typecheck all consumers.
5. Mark phase tasks `[x]` and update the phase artifact's frontmatter `status: completed` only after all tasks exist and verification checks pass.
6. Record command outputs, test counts, and files modified in the phase artifact's and master plan's Verification section.

## Strict Mandatory Phase Stop

> [!IMPORTANT]
> **Mandatory Developer Checkpoint:**
> - The agent **MUST STOP IMMEDIATELY** upon completing the active phase tasks and logging verification evidence.
> - The agent **MUST NOT** proceed to the next phase autonomously or run multiple phases in a single turn.
> - The agent must output a structured checkpoint summary and wait for the developer to manually inspect the changes before continuing.

### Checkpoint Output Format:
```markdown
### Phase Completed: Phase NN — [Phase Title]
- [x] Task N.1: [Summary of change]
- [x] Task N.2: [Summary of change]

**Verification Evidence:**
- Command: `[test command]` (PASS: X/X passed)
- Files modified: `[list of modified files]`

⏸️ **Phase NN complete. Stopped for developer review.**
Inspect the changes above. Reply or prompt `/execute Phase NN+1` to continue to the next phase.
```

## Completion

When the final phase of a task is complete, run the plan's overall verification checks, confirm every acceptance criterion in the master plan, update status to `completed`, and report the final outcome, verification evidence, and release readiness.
