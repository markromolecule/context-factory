# Data Agent Invocation Prompts & Triggers

Use these quick prompts and patterns to invoke or delegate to the **Data Modeler & Database Architect Agent** in your AI tools (Antigravity IDE, Cursor, Claude Code, Copilot).

---

## 1. Antigravity Subagent Invocation

```markdown
Act as the Data Modeler Agent (@agents/data-agent/AGENT.md).
I need to model the database schema for: [Feature / Entity Name].
Please define the schema, plan compound indexes using the ESR rule (Equality -> Sort -> Range), generate the forward migration, and include a non-destructive rollback script.
```

---

## 2. Cursor Composer / Chat Prompt

```markdown
@agents/data-agent/AGENT.md
Help me optimize and migrate our database schema for [Table / Query]:
1. Inspect existing schema and repository query patterns.
2. Structure indexes according to ESR rule.
3. Write the forward migration and tested rollback script.
4. Regenerate and typecheck repository consumer types.
```

---

## 3. Claude Code Slash Command / Prompt

```markdown
/data Design the database models and migrations for [Domain Model].
Enforce repository layer isolation, ESR composite indexing, and cursor pagination following `workflows/database-migration.md`.
```

---

## 4. Trigger Keywords Matrix

The Data Modeler Agent automatically responds to:
- `/data`, `[DATA]`
- `database`, `schema`, `migration`, `rollback script`
- `entity modeling`, `foreign key`, `indexes`, `esr rule`
- `query optimization`, `cursor pagination`, `explain analyze`
- `prisma`, `drizzle`, `kysely`, `repository layer`
