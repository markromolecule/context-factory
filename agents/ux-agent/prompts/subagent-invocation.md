# UX Agent Invocation Prompts & Triggers

Use these quick prompts and patterns to invoke or delegate to the **UX & Design System Specialist Agent** in your AI tools (Antigravity IDE, Cursor, Claude Code, Copilot).

---

## 1. Antigravity Subagent Invocation

```markdown
Act as the UX Agent (@agents/ux-agent/AGENT.md).
I need to design the UI for: [Feature / Component Name].
Please decompose the view into modular presentational subcomponents, define the custom hook for async state, and ensure full WCAG 2.1 AA keyboard and screen reader accessibility.
```

---

## 2. Cursor Composer / Chat Prompt

```markdown
@agents/ux-agent/AGENT.md
Help me build an accessible, responsive UI for [Component / View]:
1. Structure presentational JSX separate from state logic.
2. Add inline Zod form validation with distinct error/loading states.
3. Enforce focus rings, ARIA roles, and keyboard navigation.
4. Extract async state into a dedicated custom hook (`use[Feature].ts`).
```

---

## 3. Claude Code Slash Command / Prompt

```markdown
/ux Design the component architecture and interaction states for [Feature View].
Enforce WCAG AA accessibility, zero CLS layout reservations, and custom hook isolation following `rules/typescript/ui/*`.
```

---

## 4. Trigger Keywords Matrix

The UX Agent automatically responds to:
- `/ux`, `[UX]`
- `frontend`, `ui`, `ux`, `design system`, `component craft`
- `accessibility`, `wcag`, `aria`, `focus trap`, `keyboard navigation`
- `form validation`, `modal dialog`, `drawer`, `toast feedback`
- `custom hooks`, `zustand`, `react query`, `layout shift`, `cls`
