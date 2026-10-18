---
id: factory.principles.yagni
title: You Aren't Gonna Need It (YAGNI)
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
sources: [docs/WIKI.md, schemas/knowledge.schema.json, docs/discovery/pragmatic-design-principles-and-rule-alignment/brief.md]
tags: [yagni, principles, architecture, typescript, clean-code]
---

# You Aren't Gonna Need It (YAGNI)

**You Aren't Gonna Need It (YAGNI)** governs **whether to build** capability: never introduce code, structure, abstractions, hooks, strategy registries, or configuration parameters to handle hypothetical future requirements.

## Core Mental Model & Distinction

- **YAGNI addresses scope and anticipation:** It determines *what* to implement. If a feature, variation, or extension hook is not required by an active, present requirement or an accepted contract, it must not be added.
- **Distinction from KISS:**
  - **YAGNI asks:** *"Do we need this capability or extension point at all?"* (Answer: not unless a current requirement calls for it).
  - **KISS asks:** *"How should we implement the capability we actually need?"* (Answer: in the simplest, most direct, and readable manner).
- A hypothetical future variant (e.g., *"we might support payment provider X or database Y next quarter"*) does **not** justify creating a generic strategy, plugin interface, pass-through service, or separate directory today.

## TypeScript Examples

### Non-Conforming (Speculative Abstraction)

```typescript
// Speculative generic repository and strategy hierarchy created for a single User entity
interface QueryOptions<T> {
  includeSoftDeleted?: boolean;
  batchSize?: number;
  cacheTtlMs?: number;
}

interface Repository<T> {
  findById(id: string, options?: QueryOptions<T>): Promise<T | null>;
  findBatch(ids: string[], options?: QueryOptions<T>): Promise<T[]>;
}

// Premature caching layer, batching hooks, and abstract registry for one known SQL query
export class SpeculativeUserRepository implements Repository<User> {
  async findById(id: string, options?: QueryOptions<User>): Promise<User | null> {
    // 50 lines of caching, batch queuing, and options parsing that no caller uses
    return db.querySingle("SELECT * FROM users WHERE id = $1", [id]);
  }
  async findBatch(ids: string[]): Promise<User[]> {
    throw new Error("Not implemented yet");
  }
}
```

### Conforming (Present-Need Implementation)

```typescript
// Direct, focused implementation satisfying the actual present requirement
export async function findUserById(db: SqlClient, id: string): Promise<User | null> {
  const row = await db.querySingle<UserRow>("SELECT id, email, name FROM users WHERE id = $1", [id]);
  return row ? toUser(row) : null;
}
```

## Invariants & Rules

1. **Triggered by Present Need Only:** Introduce an abstraction, interface, or strategy only when a second real implementation exists or an accepted contract immediately requires it.
2. **No Speculative Extension Points:** Do not expose unused function parameters, generic type parameters, configuration flags, or event hooks for hypothetical callers.
3. **Delete Dead Code over Retaining "Just-in-case":** If a requirement is removed or deferred, remove the supporting scaffolding rather than preserving speculative paths.

## Documented Exceptions

- **Accepted Public Contracts:** Stable public API schemas, SDK boundaries, or exported library types with committed backward-compatibility guarantees.
- **Mandatory Trust & Boundary Enforcement:** Multi-tenant scoping, authentication, authorization checks, and audit logging required by security policy, even if trivial in local tests.
- **Regulatory or Data Integrity Invariants:** Explicit transactional constraints and data integrity checks mandated by the domain specification.

## Cross-References

- Rules Index: [[docs/RULES|Rules Index]]
- Planning: [[skills/productivity/plan/SKILL|Plan Skill]]
- Companion Concept: [[knowledge/principles/kiss|Keep It Simple, Stupid (KISS)]]
