---
ruleId: cf-rule-global-code-quality
name: code-quality
description: Keep production TypeScript explicit, testable, reviewable, and free from accidental complexity.
scope: All authored TypeScript, JavaScript, tests, configuration, and generated starter code.
stack: global
appliesTo: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.php", "**/*.dart"]
layers: ["domain", "services", "controllers", "components", "tests"]
alwaysApply: false
---

# Code Quality

## Design

- [directive:cf.quality.solid-compliance][mode:evidence-blocking][verifier:human-evidence] Strictly adhere to the 5 SOLID principles (`rules/solid/`): Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion across backend services, repositories, and React UI components.
- [directive:cf.quality.directional-dependencies][mode:automated-blocking][verifier:linter] Keep modules cohesive and dependencies directional; do not create circular imports.
- [directive:cf.quality.explicit-interfaces][mode:automated-blocking][verifier:typechecker] Prefer explicit inputs, return types at public boundaries, and dependency injection over hidden mutable globals.
- [directive:cf.quality.no-any-or-swallowed-errors][mode:automated-blocking][verifier:typechecker] Avoid `any`, unchecked type assertions, swallowed errors, boolean parameter traps, and speculative abstractions.
- [directive:cf.quality.domain-types-over-framework][mode:evidence-blocking][verifier:human-evidence] Keep framework objects at transport boundaries and model application logic with domain-oriented types.
- [directive:cf.quality.delete-dead-code][mode:automated-blocking][verifier:linter] Delete dead code and keep comments focused on constraints or intent that code cannot express.

## Change Discipline

- [directive:cf.quality.minimal-complete-change][mode:evidence-blocking][verifier:human-evidence] Make the smallest complete change and preserve backward compatibility unless a breaking change is intentional and documented.
- [directive:cf.quality.tests-for-behavior-changes][mode:automated-blocking][verifier:test] Add or update tests for behavior changes, especially validation, error paths, authorization, and data mutations.
- [directive:cf.quality.executable-examples][mode:advisory][verifier:none] Keep generated examples executable and representative of the rules they teach.
- [directive:cf.quality.run-existing-checks][mode:automated-blocking][verifier:test] Run formatting, linting, typechecking, tests, and builds that exist for the touched scope.

## Review

Reject changes that introduce:

- [directive:cf.quality.reject-unbounded-work][mode:evidence-blocking][verifier:human-evidence] Unbounded work or implicit side effects.
- [directive:cf.quality.reject-duplicate-policy][mode:evidence-blocking][verifier:human-evidence] Duplicated business policy.
- [directive:cf.quality.reject-unstable-contracts][mode:evidence-blocking][verifier:human-evidence] Unstable public contracts.
- [directive:cf.quality.reject-untestable-code][mode:evidence-blocking][verifier:human-evidence] Code that can't be tested without starting unrelated infrastructure.
