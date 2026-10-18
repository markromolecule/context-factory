---
id: factory.principles.kiss
title: Keep It Simple, Stupid (KISS)
type: concept
status: active
scope: [software-architecture, context-factory, clean-code, typescript]
owner: context-factory
authority: canonical
created: 2026-10-10
lastVerified: 2026-10-10
reviewAfter: 2027-04-10
appliesTo: [rules/typescript/common/pragmatic-design.md, skills/productivity/plan/SKILL.md]
supersedes: []
sources: [docs/Wiki.md, schemas/knowledge.schema.json, docs/discovery/pragmatic-design-principles-and-rule-alignment/brief.md]
tags: [kiss, principles, architecture, typescript, clean-code]
---

# Keep It Simple, Stupid (KISS)

**Keep It Simple, Stupid (KISS)** governs **how to implement** a required capability: choose the clearest, most direct, and readable design that satisfies the present requirement over clever, complex, or indirection-heavy constructs.

## Core Mental Model & Distinction

- **KISS addresses execution complexity and readability:** Once a requirement is confirmed needed, KISS dictates that the solution should minimize cognitive overhead, indirection layers, and synthetic abstractions.
- **Distinction from YAGNI:**
  - **YAGNI asks:** *"Is this capability necessary today?"* (Eliminates unnecessary features and speculative extension points).
  - **KISS asks:** *"Is this the simplest way to implement the capability that is necessary today?"* (Eliminates convoluted design, unnecessary layers, and meta-programming for present code).
- Simplicity does not mean incomplete or sloppy code; it means code that is straightforward to read, test, debug, and maintain.

## TypeScript Examples

### Non-Conforming (Over-Engineered Indirection)

```typescript
// Complex custom pipeline engine and dynamic rule visitor to validate 3 input fields
interface ValidationRule<T> {
  evaluate(context: T): boolean;
  errorCode: string;
}

class ValidationPipeline<T> {
  private rules: ValidationRule<T>[] = [];
  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }
  execute(target: T): string[] {
    return this.rules
      .filter((r) => !r.evaluate(target))
      .map((r) => r.errorCode);
  }
}

// Caller must construct pipeline, instantiate rule classes, and coordinate evaluation
export function validateSignupInput(input: SignupInput): string[] {
  const pipeline = new ValidationPipeline<SignupInput>();
  pipeline.addRule(new EmailFormatRule());
  pipeline.addRule(new PasswordLengthRule());
  pipeline.addRule(new RequiredNameRule());
  return pipeline.execute(input);
}
```

### Conforming (Direct, Clear Implementation)

```typescript
// Direct, declarative schema validation using standard TypeScript idioms
import { z } from "zod";

export const SignupInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

export type SignupInput = z.infer<typeof SignupInputSchema>;

export function validateSignupInput(input: unknown): SignupInput {
  return SignupInputSchema.parse(input);
}
```

## Invariants & Rules

1. **Direct over Indirect:** Prefer straight-line code, standard library features, or established idiomatic libraries over custom micro-frameworks.
2. **Clarity over Cleverness:** Avoid esoteric TypeScript type gymnastics, dynamic reflection, or excessive currying when a straightforward function or type signature conveys the intent clearly.
3. **Minimize Indirection Layers:** Do not split a cohesive operation across 5 pass-through classes or helper files when a single clear module communicates the logic completely.

## Documented Exceptions

- **Inherent Domain Complexity:** Intrinsic mathematical, cryptographic, or algorithmic problems (e.g., token parsing, encryption, AST transformations, complex state machines) where simpler representations would compromise correctness.
- **Performance-Critical Bottlenecks:** Low-level memory optimization or specialized caching mechanisms validated by benchmark evidence.
- **Strict Compliance & Security Isolation:** Hardened isolation barriers required by security standards that necessitate controlled multi-layer handoffs.

## Cross-References

- Rules Index: [[docs/Rules|Rules Index]]
- Planning: [[skills/productivity/plan/SKILL|Plan Skill]]
- Companion Concept: [[knowledge/principles/yagni|You Aren't Gonna Need It (YAGNI)]]
