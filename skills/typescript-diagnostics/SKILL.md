---
name: typescript-diagnostics
description: Diagnose, debug, and resolve TypeScript compiler errors, circular types, build failures, and tsconfig configuration issues.
---

# TypeScript Diagnostics

Use this skill when investigating TypeScript compilation errors, resolving deep type inference issues, auditing `tsconfig.json` configurations, or fixing circular type references.

## Diagnostic Procedure

1. **Reproduce & Isolate**:
   - Run the compiler in non-emitting typecheck mode: `npx tsc --noEmit` (or package equivalent).
   - Capture specific compiler error codes (e.g. `TS2322`, `TS2345`, `TS7006`) and isolate the exact failing file and line range.
2. **Inspect Type Hierarchy**:
   - Trace property mismatches, optionality (`T | undefined`), and nullability.
   - For generic functions, verify whether type parameters are being inferred or explicitly passed.
   - Check whether `satisfies` or excessive type assertions are masking an underlying type divergence.
3. **Analyze Circular & Recursive Types**:
   - When seeing `Type instantiation is excessively deep and possibly infinite (TS2589)`, inspect recursive type definitions, complex mapped types, or mutual imports across modules.
   - Break circular dependency chains by hoisting shared interfaces to a separate definition file.
4. **Audit `tsconfig.json` Settings**:
   - Verify compatibility of `target`, `module`, `moduleResolution` (e.g. `NodeNext` or `Bundler`), `verbatimModuleSyntax`, and path aliases.
5. **Verify Resolution**:
   - Re-run `npx tsc --noEmit` and confirm that all diagnostic errors are resolved without introducing type escapes like `any` or forced `@ts-ignore`.

## Output

Report:
- Primary root cause of the type error or compiler failure.
- Concrete code fix showing before/after type signatures.
- Clean `tsc --noEmit` verification evidence.
