---
name: naming-conventions
description: Apply predictable TypeScript, file, route, database, and test names while respecting framework conventions.
scope: All authored source, configuration, test, and documentation files.
alwaysApply: true
---

# Naming Conventions

Prefer names that describe domain intent over implementation mechanics.

| Element                        | Convention                               | Example                |
| ------------------------------ | ---------------------------------------- | ---------------------- |
| TypeScript files/folders       | kebab-case                               | `user-profile.ts`      |
| React components/classes/types | PascalCase                               | `UserProfile`          |
| Functions/variables            | camelCase                                | `getUserProfile`       |
| Constants                      | UPPER_SNAKE_CASE                         | `MAX_RETRY_COUNT`      |
| Hooks                          | `use` prefix; file `use-*.ts`            | `useCurrentUser`       |
| Tests                          | source name + `.test`                    | `user-service.test.ts` |
| REST paths                     | lowercase kebab-case nouns               | `/api/user-profiles`   |
| Database identifiers           | snake_case unless ORM convention differs | `created_at`           |

- Follow required framework filenames such as `page.tsx`, `layout.tsx`, and `route.ts`.
- Use singular names for entity types and plural names only for collections.
- Name booleans as predicates (`is`, `has`, `can`, `should`).
- Name async commands with the domain action, not `handle` unless it is an event handler.
- Avoid one-letter names outside tight mathematical/index scopes.
- Preserve a codebase's established convention when migration is outside task scope; document deliberate exceptions.
