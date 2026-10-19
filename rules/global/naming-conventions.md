---
ruleId: cf-rule-global-naming-conventions
name: naming-conventions
description: Apply predictable TypeScript, file, route, database, and test names while respecting framework conventions.
scope: Authored TypeScript/JavaScript source and test files.
stack: global
appliesTo: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs"]
layers: ["domain", "services", "controllers", "components", "tests"]
alwaysApply: false
---

# Naming Conventions

Prefer names that describe domain intent over implementation mechanics.

| Bad                          | Good                      |
| ---------------------------- | ------------------------- |
| `data`, `info`, `item`       | `invoice`, `shippingRate` |
| `UserManager`, `userHelper`  | `UserRegistrar`, `hashPassword` |
| `processData()`              | `reconcileLedger()`       |
| `flag`, `status2`            | `isArchived`, `PaymentStatus` |

## Precedence

1. Framework-mandated names (`page.tsx`, `route.ts`, `[userId]`, `*.d.ts`, tool config files)
2. Established conventions in the surrounding code (see directive below)
3. This rule

## Conventions

| Element                              | Convention                                   | Example                                  |
| ------------------------------------ | -------------------------------------------- | ---------------------------------------- |
| Files and folders                    | kebab-case                                   | `user-profile.tsx`, `user-service.ts`    |
| React components, classes            | PascalCase (file stays kebab-case)           | `UserProfile` in `user-profile.tsx`      |
| Types, interfaces, enums             | PascalCase, no `I`/`T`/`E` prefixes          | `UserProfile`, `PaymentStatus`           |
| Enum members                         | PascalCase                                   | `PaymentStatus.PartiallyRefunded`        |
| Functions, variables, params, props  | camelCase                                    | `getUserProfile`                         |
| Fixed module-level primitives/config | UPPER_SNAKE_CASE                             | `MAX_RETRY_COUNT`                        |
| Schemas, config objects, maps        | camelCase                                    | `userSchema`, `routeTable`               |
| Generics                             | `T`, or `T` + descriptor when several        | `TData`, `TError`                        |
| Acronyms                             | Treated as words                             | `userId`, `HttpClient`, `parseUrl`       |
| Hooks                                | Function `useXxx`; file `use-xxx.ts`         | `useUserQuery` in `use-user-query.ts`    |
| Event handlers                       | Props `onXxx`; local handlers `handleXxx`    | `onSubmit`, `handleSubmit`               |
| Tests                                | Source name + `.test`                        | `user-service.test.ts`                   |
| REST paths                           | Lowercase kebab-case plural nouns            | `/api/user-profiles`                     |
| Database tables / columns            | snake_case (plural tables); ORM mapping layer converts to camelCase | `user_profiles.created_at` |

## Directives

- [directive:cf.naming.framework-file-conventions][mode:automated-blocking][verifier:linter] Follow required framework filenames such as `page.tsx`, `layout.tsx`, and `route.ts`.
- [directive:cf.naming.file-kebab-case][mode:automated-blocking][verifier:linter] Use kebab-case for file and folder names unless a framework requires otherwise.
- [directive:cf.naming.predicate-booleans][mode:automated-blocking][verifier:linter] Name booleans as positive predicates (`is`, `has`, `can`, `should`); avoid negated names like `isNotValid`. Framework/HTML props (`disabled`, `enabled`) are exempt.
- [directive:cf.naming.no-type-prefixes][mode:automated-blocking][verifier:linter] Do not prefix interfaces/types with `I`, `T`, or `E`, and do not prefix private members with `_`.
- [directive:cf.naming.no-single-letter-names][mode:automated-blocking][verifier:linter] Avoid one-letter names except `i`/`j`/`k` and `x`/`y` in tight scopes, generic `T`, and `_` for unused values.
- [directive:cf.naming.singular-entities-plural-collections][mode:evidence-blocking][verifier:human-evidence] Use singular names for entity types and plural names only for collections.
- [directive:cf.naming.domain-action-async-commands][mode:evidence-blocking][verifier:human-evidence] Name async commands with the domain action (`approveInvoice`), not `handle`/`process`/`do`. Reserve `handle` for event handlers. Don't add an `Async` suffix.
- [directive:cf.naming.avoid-vague-names][mode:advisory][verifier:none] Avoid generic names (`data`, `info`, `util`, `helper`, `manager`) when a domain term exists.
- [directive:cf.naming.preserve-established-conventions][mode:advisory][verifier:none] Preserve a codebase's established convention when migration is outside task scope; document deliberate exceptions in the PR or a code comment.
