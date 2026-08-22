---
name: module-and-imports
description: Standardize module boundary imports, enforce verbatim type imports, maintain path aliases, and prevent circular dependencies.
scope: TypeScript source files, import statements, module declarations, and build boundaries.
alwaysApply: true
---

# Module Resolution and Import Discipline

## Explicit type-only imports

- Use `import type` and `export type` when importing or re-exporting types, interfaces, or type definitions.
- Align with `verbatimModuleSyntax: true` in `tsconfig.json` to guarantee that type-only imports are completely erased during compilation without leaving side-effect imports in generated JavaScript.

## Path aliases and import boundaries

- Use standardized path aliases (e.g. `@/modules/*`, `@/shared/*`) instead of deep relative traversing paths (`../../../`).
- Forbid upward relative traversal across module or package boundaries.
- Cross-module dependencies must consume explicit public API exports of other modules, never internal sub-paths.

## Circular dependency prevention

- Avoid circular type and runtime dependencies between modules.
- Extract shared types and pure utility functions into dedicated foundational modules (e.g. `@/shared/types`) when two domain entities reference each other.

## Barrel file discipline

- Avoid monolithic aggregate `index.ts` barrel files that re-export an entire repository or massive component hierarchies. Monolithic barrel files degrade IDE performance, slow down `tsc` type checking, and defeat bundler tree-shaking.
- Keep barrel files focused to public module boundaries only.
