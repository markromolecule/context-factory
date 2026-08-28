---
name: code-quality
description: Keep production TypeScript explicit, testable, reviewable, and free from accidental complexity.
scope: All authored TypeScript, JavaScript, tests, configuration, and generated starter code.
alwaysApply: true
---

# Code Quality

## Design

- Strictly adhere to the 5 SOLID principles (`rules/solid/`): Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion across backend services, repositories, and React UI components.
- Keep modules cohesive and dependencies directional; do not create circular imports.
- Prefer explicit inputs, return types at public boundaries, and dependency injection over hidden mutable globals.
- Avoid `any`, unchecked type assertions, swallowed errors, boolean parameter traps, and speculative abstractions.
- Keep framework objects at transport boundaries and model application logic with domain-oriented types.
- Delete dead code and keep comments focused on constraints or intent that code cannot express.

## Change Discipline

- Make the smallest complete change and preserve backward compatibility unless a breaking change is intentional and documented.
- Add or update tests for behavior changes, especially validation, error paths, authorization, and data mutations.
- Keep generated examples executable and representative of the rules they teach.
- Run formatting, linting, typechecking, tests, and builds that exist for the touched scope.

## Review

Reject changes that introduce:

- Unbounded work or implicit side effects.
- Duplicated business policy.
- Unstable public contracts.
- Code that can't be tested without starting unrelated infrastructure.
