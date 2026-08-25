# Architect Agent Invocation Prompts & Triggers

Use these quick prompts and patterns to invoke or delegate to the **Architect & ADR Specialist Agent** in your AI tools (Antigravity IDE, Cursor, Claude Code, Copilot).

---

## 1. Antigravity Subagent Invocation

```markdown
Act as the Architect Agent (@agents/architect-agent/AGENT.md).
I need to design the architecture for: [Module or Subsystem Name].
Please evaluate module boundaries, SOLID principles, and dependency direction. If a durable decision is required, author an Architectural Decision Record in `docs/decisions/` using `skills/adr/SKILL.md`.
```

---

## 2. Cursor Composer / Chat Prompt

```markdown
@agents/architect-agent/AGENT.md
Help me evaluate the architectural trade-offs for [Feature / Boundary Change].
1. Inspect current module dependencies and check for layer leaking.
2. Apply the 1-3-1 rule to compare 3 architectural options.
3. Formulate an ADR and define clear interface contracts.
4. Stop without modifying production application code.
```

---

## 3. Claude Code Slash Command / Prompt

```markdown
/architect Evaluate the architectural structure of [Domain / Service].
Review SOLID compliance, define vertical module contracts, and generate an ADR in `docs/decisions/` if structural boundaries are changing.
```

---

## 4. Trigger Keywords Matrix

The Architect Agent automatically responds to:
- `/architect`, `[ARCHITECT]`
- `architecture`, `system design`, `module boundary`, `dependency direction`
- `adr`, `architectural decision`, `trade-off analysis`, `1-3-1 rule`
- `solid`, `srp`, `ocp`, `lsp`, `isp`, `dip`, `clean architecture`
