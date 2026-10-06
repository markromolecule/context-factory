---
ruleId: cf-rule-global-naming-conventions
name: naming-conventions
description: Apply predictable TypeScript, file, route, database, and test names while respecting framework conventions.
scope: All authored source, configuration, test, and documentation files.
stack: global
appliesTo: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.php", "**/*.dart"]
layers: ["domain", "services", "controllers", "components", "tests"]
alwaysApply: false
---

# Naming Conventions

Prefer names that describe domain intent over implementation mechanics.

| Element                        | Convention                               | Example                |
| ------------------------------ | ---------------------------------------- | ---------------------- |
| TypeScript files/folders       | kebab-case                               | `user-profile.ts`      |
| React components/classes/types | PascalCase                               | `UserProfile`          |
| Functions/variables            | camelCase                                | `getUserProfile`       |
| Constants                      | UPPER_SNAKE_CASE                         | `MAX_RETRY_COUNT`      |
| Hooks                          | `use` prefix with category suffix (`use-*-query.ts`, `use-*-mutation.ts`, `use-*-*.ts`) | `use-user-query.ts` (`useUserQuery`), `use-update-user-mutation.ts` (`useUpdateUserMutation`) |
| Tests                          | source name + `.test`                    | `user-service.test.ts` |
| REST paths                     | lowercase kebab-case nouns               | `/api/user-profiles`   |
| Database identifiers           | snake_case unless ORM convention differs | `created_at`           |

- [directive:cf.naming.framework-file-conventions][mode:automated-blocking][verifier:linter] Follow required framework filenames such as `page.tsx`, `layout.tsx`, and `route.ts`.
- [directive:cf.naming.singular-entities-plural-collections][mode:automated-blocking][verifier:linter] Use singular names for entity types and plural names only for collections.
- [directive:cf.naming.predicate-booleans][mode:automated-blocking][verifier:linter] Name booleans as predicates (`is`, `has`, `can`, `should`).
- [directive:cf.naming.domain-action-async-commands][mode:evidence-blocking][verifier:human-evidence] Name async commands with the domain action, not `handle` unless it is an event handler.
- [directive:cf.naming.no-single-letter-names][mode:automated-blocking][verifier:linter] Avoid one-letter names outside tight mathematical/index scopes.
- [directive:cf.naming.preserve-established-conventions][mode:advisory][verifier:none] Preserve a codebase's established convention when migration is outside task scope; document deliberate exceptions.
