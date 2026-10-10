---
title: "Backend, UI, and global TypeScript scope audit"
type: unit
parent: "phase-03-implementation-and-tests"
unit: "03.02"
task_branch: "feat/PLN-0008-typescript-pragmatic-design-rules"
base_commit: "298768ee210189f2f2221f3cf8f041bce2ad26bf"
status: planned
created: "2026-10-10"
tags: [task, unit, architecture]
depends_on: ["03.01"]
parallelizable_with: []
---

# Unit 03.02: Backend, UI, and Global TypeScript Scope Audit

> Task branch: `feat/PLN-0008-typescript-pragmatic-design-rules` · Base commit: `298768ee210189f2f2221f3cf8f041bce2ad26bf`

## Objective

Make applicable backend/UI guidance use the present-need default while proving that global wording does not change plain-JavaScript behavior.

## Context packet

- **Current evidence:** `rules/typescript/backend/service-layer.md` already permits controller-to-data for policy-free reads and requires a service/policy for sensitive reads. `rules/typescript/backend/module-architecture.md` makes operation-first folders the default and allows established-host layer folders. `rules/typescript/ui/code-organization.md` says promote shared code on real reuse and favors cohesive modules. `rules/global/code-quality.md` strictly requires SOLID; `rules/global/architecture-conformance.md` has an automated-blocking SOLID summary, but no one verifier proves every SOLID judgment. These two global files may bind plain JavaScript.
- **Accepted target:** No new pass-through service, strategy registry, interface, or file split for one implementation. Real authorization, tenant, data integrity, and policy boundaries remain strict. UI composition follows the actual framework and package dependencies, not React wording in a SolidJS host. A global directive is edited only if the TypeScript-specific interpretation can be scoped without changing JavaScript selection/meaning.
- **Acceptance:** AC-05. The combined Demeter/tell-don't-ask guidance must not ban DTO reads, validation, serialization, or pure transformations. Record each inspected conflict and whether it changed, stayed because its boundary is real, or was resolved by the common TypeScript rule.

<language_rules>
- [directive:cf.evidence.scope-fencing][mode:evidence-blocking] rules/global/evidence-and-claims.md sourceHash:sha256:ed699151d7d034cb2ce4b00fbf10236fd8bf2b7f701761d4f6f17bc7486d88af
- [directive:cf.arch.trust][mode:automated-blocking] rules/global/architecture-conformance.md sourceHash:sha256:ebd1818f58e6c3421d803fae8905b2077036fe7eec8e228cc6130066cd95af92
- [directive:ts.module.operation-first-layout][mode:evidence-blocking] rules/typescript/backend/module-architecture.md sourceHash:sha256:be6d6d93f4ab5f4a08ae226e64b0d3adcd7c20bcb0df34700bf765990569a079
</language_rules>

**Rule satisfaction:** Preserve operation and policy boundaries, use a positive simple-read and negative tenant-read case, and do not change a global rule for TypeScript alone unless JavaScript behavior remains unchanged. Conformance requires real tests plus named semantic evidence.

## Preconditions

- Verify exact task branch and Unit 03.01 commit/receipt. Use its latest catalog/lock state without redoing it.
- Inspect current global, backend, UI, framework selection, and adapter behavior. Do not infer framework from prompt wording.

## Scope

**In scope:** `rules/typescript/backend/service-layer.md`, `rules/typescript/backend/module-architecture.md`, `rules/typescript/ui/code-organization.md`, `rules/global/code-quality.md` and `rules/global/architecture-conformance.md` only if a TypeScript-scoped reconciliation can preserve JavaScript behavior, `evals/tests/rules/pragmatic-backend-ui-alignment.test.mjs` (new), `context-manifest.json`, `context-lock.json`.

**Out of scope:** Host application code, mandatory service for simple reads, weakening authorization/tenant rules, React-only guidance copied into shared TypeScript rules, and unrelated global JavaScript changes.

## Steps

1. Add failing architecture/contract cases for simple read without a service, tenant-sensitive read requiring a trusted policy/service, established layer-folder compatibility, cohesive UI code, and legitimate DTO mapping. Add a plain-JavaScript negative selection case before any global edit.
2. Audit each scoped directive and example against the new common rule. Edit only contradictions. If a global directive cannot be made TypeScript-specific without changing JavaScript meaning, leave it unchanged and record the scoped TypeScript interpretation in the common rule; request a plan amendment if an unresolved direct contradiction remains.
3. Verify package metadata selects React, Next.js, or SolidJS additions only for the nearest affected package. Preserve directive IDs/modes unless changed meaning or verifier evidence requires migration.
4. Synchronize affected inventory/lock, run focused tests, lint, doctor, preflight, and conformance with named semantic evidence. Record the conflict matrix and review before commit.

## Verification

- **Architecture/contract test:** `node --test evals/tests/rules/pragmatic-backend-ui-alignment.test.mjs evals/tests/rules/backend-module-architecture.test.mjs`. It catches policy bypass, forced pass-through services, or loss of ADR 0037 compatibility that text validation alone misses.
- **Binding negative/integration:** The focused suite uses `.ts`/`.tsx` and `.js` scopes and nearest-package framework metadata. It detects global-rule leakage or prompt-led framework misselection.
- **Catalog/conformance:** `npm run sync`, `npm run lock`, `npm run lint`, `node scripts/context.mjs doctor`, exact-scope preflight/conform, and independent receipt verification. A global edit triggers explicit JavaScript before/after binding comparison.

## Rollback

Revert only the changed backend/UI/global wording, focused test, manifest, and lock. Keep the shared TypeScript rule from Unit 02.01. No host or database migration applies.

## Definition of done

- [ ] AC-05 conflict matrix records changed, retained, and scoped-exception directives.
- [ ] Simple and tenant-sensitive reads, DTO exception, framework scope, and JavaScript negative cases pass.
- [ ] Exact branch/fence, tests, catalog, lint, doctor, review, and fresh verified PASS receipt are recorded before commit.
