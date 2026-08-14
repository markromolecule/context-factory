---
title: "{{title}}"
type: context
status: draft
created: "{{date}}"
tags: [context, feature]
feature: "{{feature_name}}"
---

# {{title}} Context Specification

## 1. Overview & Objective

- **Problem Statement:** What problem are we solving?
- **Business / User Value:** Why does this change matter?
- **Success Criteria:** What does a successful outcome look like?

## 2. Requirements & User Stories

### User Stories / Scenarios
- *As a [user role], I want to [perform action], so that [achieve benefit].*

### Functional Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Edge Cases & Failure Modes
- Edge case 1 and expected graceful failure or recovery.
- Edge case 2 and fallback behavior.

## 3. Technical & Architectural Context

- **Affected Domains / Layers:** Frontend (`web/`), Backend (`api/`), Database, Mobile (`mobile/`).
- **Existing Files & Reference Symbols:** List files, components, API endpoints, or database tables to inspect or modify.
- **Data Model & Schema Changes:** Mention new tables, schema migrations, or DTO contracts if applicable.
- **Security & Authorization:** Auth requirements, RBAC roles, data isolation, input sanitization.

## 4. UI/UX & Interaction Guidelines (if applicable)

- **Layout & Visual Design:** Design tokens, components to reuse, responsive behavior.
- **State Management & Feedback:** Loading skeletons, empty states, error banners, success toasts.

## 5. Scope & Boundaries

- **In Scope:** Concrete deliverables for this feature/enhancement.
- **Out of Scope / Non-Goals:** Explicitly excluded items, future phases, or speculative work.

## 6. References & External Context

- Figma links, PRDs, API specs, related ADRs ([[docs/decisions/README|Decisions]]), or related tasks ([[docs/tasks/README|Tasks]]).
