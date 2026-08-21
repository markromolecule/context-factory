# BA Agent Invocation Prompts & Triggers

Use these quick prompts and patterns to invoke or delegate to the **BA Agent** in your AI tools (Antigravity IDE, Cursor, Claude Code, Copilot).

---

## 1. Antigravity Subagent Invocation

```markdown
Act as the BA Agent (@agents/ba-agent/AGENT.md).
I want to build a feature: [Feature Name or Summary].
Please grill me on the requirements, edge cases, user roles, and data boundaries one question at a time using `skills/grill/SKILL.md`. Formulate the final scenario matrix and acceptance criteria before stopping.
```

---

## 2. Cursor Composer / Chat Prompt

```markdown
@agents/ba-agent/AGENT.md
Help me define the requirements for [Feature / Module].
1. Ask one clarifying question at a time to discover permissions, workflows, and edge cases.
2. Produce a Scenario Coverage Table and Acceptance Criteria.
3. Stop without writing any implementation code.
```

---

## 3. Claude Code Slash Command / Prompt

```markdown
/agent ba-agent
Analyze the user request: "[User Feature Request]".
Perform requirement discovery, check canonical definitions in `knowledge/`, and build the Pre-planning Record and Acceptance Criteria in `docs/templates/Task.md` format.
```

---

## 4. Trigger Keywords Matrix

The BA Agent automatically responds to:
- `requirements`, `user story`, `acceptance criteria`, `business logic`
- `clarify requirements`, `grill me`, `discovery interview`, `pre-planning`
- `domain terms`, `glossary`, `edge cases`, `failure scenarios`
