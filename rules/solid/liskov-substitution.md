---
name: liskov-substitution
description: Guarantee that subclasses, implementations, and test doubles are completely substitutable for their base types without breaking behavioral invariants.
scope: Interface implementations, class inheritance, repository fakes, mock adapters, and TypeScript type contracts.
alwaysApply: false
---

# Liskov Substitution Principle (LSP)

Subtypes and interface implementors must be **substitutable for their base types without altering program correctness or violating declared invariants**. If code consumes an interface `T`, it must operate correctly with any implementation `S` without knowing the concrete class or special-casing its behavior.

## Mandatory Directives

- **MUST:** Ensure all implementations of an interface honor identical precondition, postcondition, and invariant semantics.
- **MUST:** Guarantee that test doubles and in-memory fakes replicate the exact error responses, sorting, and edge-case behaviors of real infrastructure implementations.
- **MUST NOT:** Throw `NotSupportedError`, `UnimplementedError`, or return unhandled `null`/`undefined` for methods declared on an implemented interface.
- **MUST NOT:** Use type-sniffing (`instanceof`, constructor checking, or casting) in consumer code to alter control flow based on the concrete subtype.
- **MUST NOT:** Strengthen preconditions (e.g. requiring stricter arguments or hidden initialization steps) in a subtype that the base interface does not require.

## Backend & Domain Patterns

### Bad: Throwing `NotSupportedError` & Breaking Invariants
```typescript
// ❌ Violates LSP: ReadOnlyRepository claims to be a Repository, but throws at runtime on write
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export class ReadOnlyAuditLogRepository implements Repository<AuditLog> {
  async findById(id: string) { return db.auditLogs.findUnique({ where: { id } }); }
  
  async save(entity: AuditLog): Promise<void> {
    throw new Error("ReadOnlyAuditLogRepository does not support save()"); // ❌ Crashes callers expecting Repository<T>
  }
  
  async delete(id: string): Promise<void> {
    throw new Error("ReadOnlyAuditLogRepository does not support delete()"); // ❌ Crashes callers
  }
}
```

### Good: Proper Interface Hierarchy & True Substitutability
```typescript
// ✅ Properly segregated interfaces allow true substitutability
export interface ReadRepository<T> {
  findById(id: string): Promise<T | null>;
}

export interface WriteRepository<T> {
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

// Consumers needing only read access accept ReadRepository<T>
export class AuditLogViewer {
  constructor(private readonly repo: ReadRepository<AuditLog>) {}

  async view(id: string) {
    const log = await this.repo.findById(id);
    if (!log) throw new NotFoundError(`Audit log ${id} not found`);
    return log;
  }
}
```

## Test Doubles & Fakes Invariance

### Bad: Fake with Divergent Behavior
```typescript
// ❌ Violates LSP: Fake returns undefined instead of throwing EntityNotFoundError or returning Result.err()
export class FakeUserRepository implements UserRepository {
  private users = new Map<string, User>();

  async getById(id: string): Promise<User> {
    return this.users.get(id)!; // Returns undefined at runtime instead of handling absence consistently with Postgres repo
  }
}
```

### Good: Behaviorally Equivalent In-Memory Fake
```typescript
// ✅ Matches production repository error and return invariants 1:1
export class InMemoryUserRepository implements UserRepository {
  private users = new Map<string, User>();

  async getById(id: string): Promise<Result<User, UserNotFoundError>> {
    const user = this.users.get(id);
    if (!user) {
      return Result.err(new UserNotFoundError(id));
    }
    return Result.ok(user);
  }
}
```

## Verification Checklist

1. Do all implementations of an interface fully implement every declared method without throwing unsupported operation errors?
2. Are test fakes and in-memory mocks behaviorally equivalent to production implementations?
3. Is consumer code completely free of `if (repo instanceof PostgresRepo)` or similar type-sniffing workarounds?
