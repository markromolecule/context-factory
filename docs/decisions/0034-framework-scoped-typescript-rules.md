---
title: Framework-scoped TypeScript rules
type: decision
status: accepted
created: "2026-10-09"
tags: [adr, typescript, rules]
---

# Framework-scoped TypeScript rules

## Context

The user requested stronger TypeScript web rules with minimal repeated input, and authorized separate framework rules provided they keep complexity low. The current catalog mixed Next.js conventions into common TypeScript rules; a SolidJS component and a React component each bound 210 directives, including the same Next.js server-component constraint. Binding also dropped directive statements before prompt compilation.

## Options considered

1. One TypeScript document covering every framework. Simple inventory, but every task pays for unrelated instructions and conflicting rendering models.
2. Independent complete catalogs per framework. Clear activation, but duplicates language, security, and UI rules and creates maintenance drift.
3. Shared TypeScript rules plus compact framework additions. A small applicability field and package detection prevent crossover while keeping shared policy canonical.

## Decision

Use option 3, authorized by the user's 2026-10-09 reply. Add React, Next.js, and SolidJS files under `rules/typescript/frameworks/`. Detect framework dependencies in each affected file's nearest package.json; Next.js implies React. Never infer SolidJS from SOLID architecture. A host package without a recognized framework receives shared rules only. Request words are a fallback for discovery inside Context Factory, not an override of installed host dependencies.

Add optional `frameworks` applicability to rule descriptors and filter both informational selection and binding. Match framework and path on the same affected file to avoid mixed-workspace leakage. Preserve directive statements in bindings and validate that hooks do not strip them. Keep existing IDs when moving a rule; retain the common project-structure path for compatibility.

## Consequences

- Maintainers add framework-specific constraints once; models load shared policy plus relevant additions. Existing installed libraries remain authoritative; examples do not authorize adopting dependencies.
- New framework rules use evidence-blocking modes for semantic requirements, with advisory mode for performance preference. Dedicated framework verifiers are not claimed to exist.
- Bindings and hashes change when statements or applicability change. Regenerate bindings and receipts. The optional statement field allows old artifact schemas to remain readable, but old bindings should be recompiled before generation under these rules.
- No application data or runtime dependency changes. Discovery reads package metadata within the host. Invalid JSON and read failures other than missing files surface errors rather than guessing.
- Scoped monorepo paths receive UI rules. Unscoped discovery cannot infer child packages; callers should provide file scope. A package declaring multiple UI frameworks needs more specific source ownership in a future extension.
- Rollback must restore rules, descriptor schema/parser, binding compiler, selection, prompt handling, tests, maps, and lock together. Reissue affected receipts.

## Validation and review date

Review on framework support changes or material selection failures. Regression cases cover React, Next.js, SolidJS, misleading prompt words, mixed monorepo files, actual provider rule text, and stripped statements. Factory health and token estimates are distinct from application correctness; the context specification records remaining adapter enforcement gaps.
