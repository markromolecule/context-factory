# PM Agent Invocation Prompts & Triggers

Use these quick prompts and patterns to invoke or delegate to the **PM Agent** in your AI tools (Antigravity IDE, Cursor, Claude Code, Copilot).

---

## 1. Antigravity Subagent Invocation

```markdown
Act as the PM Agent (@agents/pm-agent/AGENT.md).
Based on the approved requirements for [Feature / Module]:
1. Create a structured implementation plan and phased breakdown under `docs/tasks/`.
2. Map each phase to concrete acceptance criteria and verification tests using `docs/templates/Task.md` and `Phase.md`.
3. Stop before coding and present the phase breakdown for review.
```

---

## 2. Cursor Composer / Chat Prompt

```markdown
@agents/pm-agent/AGENT.md
Please break down the development of [Feature / Fix] into ordered phases.
Generate the master task plan and individual phase files in `docs/tasks/YYYY/MM/YYYY-MM-DD/<feature>/`. Include file paths, checklist items, and validation commands for each phase.
```

---

## 3. Claude Code Slash Command / Prompt

```markdown
/agent pm-agent
Track the execution status of task `docs/tasks/[active-task-folder]/`.
Audit completed checkboxes against test evidence, identify any blockers, and prepare the next phase for execution.
```

---

## 4. Trigger Keywords Matrix

The PM Agent automatically responds to:
- `implementation plan`, `plan`, `task breakdown`, `phase breakdown`
- `project management`, `sprint planning`, `milestone`, `dependencies`
- `track progress`, `status report`, `blocker resolution`, `close task`
