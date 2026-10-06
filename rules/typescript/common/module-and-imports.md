---
ruleId: cf-rule-ts-module-imports
name: module-and-imports
description: Standardize module boundary imports, enforce verbatim type imports, maintain path aliases, and prevent circular dependencies.
scope: TypeScript source files, import statements, module declarations, and build boundaries.
stack: typescript
appliesTo: ["**/*.ts", "**/*.tsx"]
layers: ["common", "services", "modules", "build"]
alwaysApply: true
---

# Module Resolution and Import Discipline

## Explicit type-only imports

- [directive:ts.module-imports.explicit-type-imports][mode:automated-blocking][verifier:typechecker] Use `import type` and `export type` when importing or re-exporting types, interfaces, or type definitions.
- [directive:ts.module-imports.verbatim-module-syntax][mode:automated-blocking][verifier:typechecker] Align with `verbatimModuleSyntax: true` in `tsconfig.json` to guarantee that type-only imports are completely erased during compilation without leaving side-effect imports in generated JavaScript.

## Path aliases and import boundaries

- [directive:ts.module-imports.standard-path-aliases][mode:automated-blocking][verifier:linter] Use standardized path aliases (e.g. `@/modules/*`, `@/shared/*`) instead of deep relative traversing paths (`../../../`).
- [directive:ts.module-imports.forbid-upward-relative-traversal][mode:automated-blocking][verifier:linter] Forbid upward relative traversal across module or package boundaries.
- [directive:ts.module-imports.public-api-exports-only][mode:evidence-blocking][verifier:human-evidence] Cross-module dependencies must consume explicit public API exports of other modules, never internal sub-paths.

## Circular dependency prevention

- [directive:ts.module-imports.prevent-circular-dependencies][mode:automated-blocking][verifier:linter] Avoid circular type and runtime dependencies between modules.
- [directive:ts.module-imports.extract-shared-foundations][mode:advisory][verifier:none] Extract shared types and pure utility functions into dedicated foundational modules (e.g. `@/shared/types`) when two domain entities reference each other.

## Barrel file discipline

- [directive:ts.module-imports.avoid-monolithic-barrel-files][mode:automated-blocking][verifier:linter] Avoid monolithic aggregate `index.ts` barrel files that re-export an entire repository or massive component hierarchies. Monolithic barrel files degrade IDE performance, slow down `tsc` type checking, and defeat bundler tree-shaking.
- [directive:ts.module-imports.focused-barrels-only][mode:advisory][verifier:none] Keep barrel files focused to public module boundaries only.
