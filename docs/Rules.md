---
title: Rules
type: moc
tags: [rules, engineering]
---

# Rules

## Global

- [[rules/global/1-3-1-rule|1-3-1 Decision Framework]]
- [[rules/global/architecture-conformance|Architecture Conformance]]
- [[rules/global/code-quality|Code Quality]]
- [[rules/global/evidence-and-claims|Evidence and Claims]]
- [[rules/global/git-commit|Git Commits]]
- [[rules/global/naming-conventions|Naming Conventions]]
- [[rules/global/security-guardrails|Security Guardrails]]

## SOLID Architecture

- [[rules/solid/dependency-inversion|Dependency Inversion Principle (DIP)]]
- [[rules/solid/interface-segregation|Interface Segregation Principle (ISP)]]
- [[rules/solid/liskov-substitution|Liskov Substitution Principle (LSP)]]
- [[rules/solid/open-closed|Open/Closed Principle (OCP)]]
- [[rules/solid/single-responsibility|Single Responsibility Principle (SRP)]]

## TypeScript

Load shared language rules and only the framework rules for the affected package. Package dependencies take precedence over framework words in a prompt. Next.js also loads React; SolidJS never loads React or Next.js rules merely because its files use TSX. `rules/solid/` describes SOLID design principles, not SolidJS.

Before editing, run from the host repository (replace the CLI path with your installed factory location):

```sh
node app/cli/bin/context-cli.mjs preflight "<task>" --stack typescript --scope "<file1>,<file2>" --strict --json
```

Read the returned rule paths and inspect the local package, lockfile, and tsconfig. A preflight PASS means a binding was compiled; it is not proof of code conformance. Run the package's real typecheck, lint, tests, and relevant build, then the required conformance gate. Do not treat missing tools or generic heuristic PASS results as verification.

For direct prompting: **“Follow Context Factory's TypeScript rules for the affected files and installed framework. Read the selected rules before coding; verify with the project's checks and report failures or unrun checks.”**

### Frameworks

- [[rules/typescript/frameworks/react|React: components, effects, and state]]
- [[rules/typescript/frameworks/nextjs|Next.js: router, server boundaries, and caching]]
- [[rules/typescript/frameworks/solidjs|SolidJS: reactivity and ownership]]

Each rule set adds only framework-specific constraints. Hook/library examples apply only when the corresponding library is installed; none authorize adding dependencies. When no framework is found in a host package, framework-specific rules are excluded. Unscoped discovery cannot inspect child workspace packages: provide affected files for reliable selection.

### Common

- [[rules/typescript/common/async-discipline|Async and Concurrency Discipline]]
- [[rules/typescript/common/error-handling|Error Handling and Result Types]]
- [[rules/typescript/common/module-and-imports|Module Resolution and Import Discipline]]
- [[rules/typescript/common/next-react-project-structure|React and Next.js Project Structure]]
- [[rules/typescript/common/runtime-validation|Runtime Validation and Boundaries]]
- [[rules/typescript/common/type-safety|Type Safety]]

### Backend

- [[rules/typescript/backend/controllers-and-routes|Controllers and Routes]]
- [[rules/typescript/backend/data-access-via-api|Data Access via API]]
- [[rules/typescript/backend/module-architecture|Backend Module Architecture]]
- [[rules/typescript/backend/service-layer|Service Layer]]

### Database

- [[rules/typescript/database/data-access-via-db|Data Access via Database]]
- [[rules/typescript/database/query-optimization-and-pagination|Query Optimization and Pagination]]
- [[rules/typescript/database/schema-db|Prisma and Kysely Schema]]
- [[rules/typescript/database/testing-data-access-layer|Testing Data Access]]

### Hooks

- [[rules/typescript/hooks/custom-hooks|Custom Hooks]]
- [[rules/typescript/hooks/mutation-hooks|Mutation Hooks]]
- [[rules/typescript/hooks/query-hooks|Query Hooks]]
- [[rules/typescript/hooks/zustand-store|Zustand Stores]]

### UI

- [[rules/typescript/ui/code-organization|Frontend Code Organization]]
- [[rules/typescript/ui/dialogs-and-overlays|Dialogs and Overlays]]
- [[rules/typescript/ui/forms-and-validation|Forms and Validation]]
- [[rules/typescript/ui/frontend|Frontend Styling and Craftsmanship]]
- [[rules/typescript/ui/interaction-feedback|Interaction Feedback]]

## Laravel

### Common

- [[rules/laravel/common/anti-patterns|Laravel Anti-Patterns & Bad Habits Guide]]
- [[rules/laravel/common/artisan-commands|Laravel Artisan Console Commands]]
- [[rules/laravel/common/naming-conventions|Laravel Naming Conventions]]
- [[rules/laravel/common/project-structure|Modular Laravel Project Structure & Frontend Architecture]]

### Anti-Patterns

- [[rules/laravel/anti-patterns/config-caching|Direct env() Calls Outside Config Anti-Pattern]]
- [[rules/laravel/anti-patterns/mass-assignment|Mass-Assignment Security Hole Anti-Pattern]]
- [[rules/laravel/anti-patterns/monolithic-controllers|Monolithic Controllers Anti-Pattern]]
- [[rules/laravel/anti-patterns/n-plus-one-queries|N+1 Database Queries Anti-Pattern]]
- [[rules/laravel/anti-patterns/untyped-arrays|Untyped Arrays Anti-Pattern]]

### Foundation

- [[rules/laravel/foundation/container-and-injection|Service Container and Dependency Injection]]
- [[rules/laravel/foundation/conventions|Laravel & Modern PHP Conventions]]
- [[rules/laravel/foundation/error-handling|Error and Exception Handling]]

### HTTP

- [[rules/laravel/http/middleware|HTTP Middleware]]
- [[rules/laravel/http/requests-and-validation|Requests and Validation]]
- [[rules/laravel/http/routing-and-controllers|Routing and Controllers]]

### Database

- [[rules/laravel/database/eloquent-and-models|Eloquent ORM and Models]]
- [[rules/laravel/database/migrations-and-seeders|Migrations, Seeders, and Model Factories]]
- [[rules/laravel/database/query-optimization|Database Query Optimization and Performance]]

### Application

- [[rules/laravel/application/async-and-events|Asynchronous Workloads, Events, Caching, and Resilient HTTP]]
- [[rules/laravel/application/business-logic-and-actions|Business Logic, Invokable Actions, and Anti-Overengineering]]
- [[rules/laravel/application/transactions|Database Transactions and Concurrency Safety]]

### Security

- [[rules/laravel/security/authorization|Authorization, Policies, Gates, and Multi-Tenant Isolation]]
- [[rules/laravel/security/defense-and-protection|Application Defense, Rate Limiting, Uploads, and Protection]]

### Presentation

- [[rules/laravel/presentation/blade-and-components|Blade Templates, Components, Layout Slots, and Assets]]
