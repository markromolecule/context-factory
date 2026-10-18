---
ruleId: cf-rule-ts-pragmatic-design
name: pragmatic-design
description: Enforce pragmatic TypeScript design: YAGNI, KISS, composition over inheritance, and unified Law of Demeter / tell-don't-ask with explicit DTO and boundary exceptions.
scope: TypeScript and TSX files across applications, modules, and components.
stack: typescript
appliesTo: ["**/*.ts", "**/*.tsx"]
layers: ["common", "services", "models", "controllers", "ui"]
alwaysApply: true
---

# Pragmatic Design Principles

## Present-need scope and minimal implementation

- [directive:ts.pragmatic.yagni-present-need][mode:evidence-blocking][verifier:human-evidence] Implement only what is required by active present requirements or accepted contracts. Ban speculative extension points, generic wrappers, pass-through services, and strategy hierarchies created for hypothetical future variants. Introduce an abstraction or strategy only when a second concrete implementation or documented requirement immediately warrants it.
- [directive:ts.pragmatic.kiss-minimal-implementation][mode:evidence-blocking][verifier:human-evidence] Choose the simplest, most direct, and readable implementation that satisfies the present requirement over clever, complex, or indirection-heavy constructs. Prefer straight-line code, standard library features, and idiomatic declarative schemas over custom pipelines, reflective meta-programming, or premature micro-frameworks.

## Composition and behavioral delegation

- [directive:ts.pragmatic.composition-over-inheritance][mode:evidence-blocking][verifier:human-evidence] Achieve polymorphic variation and code reuse by composing small, focused collaborator functions or objects rather than deep class inheritance hierarchies. Accept a direct single concrete implementation without an interface or strategy; introduce composed collaborators or injected strategy functions only when actual variation exists.
- [directive:ts.pragmatic.demeter-tell-dont-ask][mode:evidence-blocking][verifier:human-evidence] Tell the owner of domain state to perform operations rather than reaching through collaborator internals to decide on its behalf. Ban callers from navigating deep domain object graphs (a.b().c()) to execute business rules. Legitimate inspection of passive Data Transfer Objects (DTOs), payload validation with schemas, JSON serialization, and pure data transformations are explicitly permitted and do not violate this rule.

## Concrete TypeScript examples

### YAGNI: Single implementation vs. speculative abstraction

```typescript
// NON-CONFORMING: Speculative generic repository and strategy hierarchy for one entity
interface QueryOptions<T> {
  batchSize?: number;
  cacheTtlMs?: number;
}
interface Repository<T> {
  findById(id: string, options?: QueryOptions<T>): Promise<T | null>;
  findBatch(ids: string[]): Promise<T[]>;
}
export class SpeculativeUserRepository implements Repository<User> {
  async findById(id: string, options?: QueryOptions<User>): Promise<User | null> {
    return db.querySingle("SELECT * FROM users WHERE id = $1", [id]);
  }
  async findBatch(ids: string[]): Promise<User[]> {
    throw new Error("Not implemented yet");
  }
}

// CONFORMING: Direct, focused implementation satisfying the present requirement
export async function findUserById(db: SqlClient, id: string): Promise<User | null> {
  const row = await db.querySingle<UserRow>("SELECT id, email, name FROM users WHERE id = $1", [id]);
  return row ? toUser(row) : null;
}
```

### KISS: Straightforward validation vs. over-engineered indirection

```typescript
// NON-CONFORMING: Custom visitor pipeline engine to validate 3 input fields
interface Rule<T> {
  eval(ctx: T): boolean;
  code: string;
}
class Pipeline<T> {
  private rules: Rule<T>[] = [];
  add(rule: Rule<T>): this { this.rules.push(rule); return this; }
  run(target: T): string[] { return this.rules.filter((r) => !r.eval(target)).map((r) => r.code); }
}

// CONFORMING: Direct declarative schema validation
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

### Composition over inheritance: Focused collaborators vs. class hierarchy

```typescript
// NON-CONFORMING: Fragile multi-level inheritance hierarchy
abstract class BaseEntity { id = crypto.randomUUID(); }
abstract class AuditableEntity extends BaseEntity { abstract logAudit(action: string): void; }
abstract class NotifiableEntity extends AuditableEntity { abstract sendNotification(msg: string): Promise<void>; }
export class UserAccount extends NotifiableEntity {
  constructor(public email: string) { super(); }
  logAudit(action: string): void {}
  async sendNotification(msg: string): Promise<void> {}
}

// CONFORMING: Focused data structure with discrete composed collaborators
export interface UserAccount {
  readonly id: string;
  readonly email: string;
}
export interface AuditLogger {
  log(entityId: string, action: string): void;
}
export interface Notifier {
  notify(recipient: string, message: string): Promise<void>;
}
export async function updateUserEmail(
  user: UserAccount,
  newEmail: string,
  deps: { logger: AuditLogger; notifier?: Notifier }
): Promise<UserAccount> {
  const updated = { ...user, email: newEmail };
  deps.logger.log(user.id, `email_updated_to_${newEmail}`);
  if (deps.notifier) {
    await deps.notifier.notify(newEmail, "Your email address has been updated.");
  }
  return updated;
}
```

### Combined Law of Demeter & Tell, Don't Ask: Domain vs. DTO reads

```typescript
// NON-CONFORMING: Caller reaches through domain graph and decides for the owner
class OrderProcessor {
  processDiscount(order: Order, discountRate: number): void {
    if (order.getCustomer().getLoyaltyAccount().getTier() === "VIP") {
      const pts = order.getCustomer().getLoyaltyAccount().getPoints();
      order.getCustomer().getLoyaltyAccount().setPoints(pts + 100);
      order.getPaymentDetails().setDiscount(discountRate);
    }
  }
}

// CONFORMING (Domain): Tell the owner aggregate to execute the business action
class OrderProcessor {
  processDiscount(order: Order, discountRate: number): void {
    order.applyLoyaltyPromotion(discountRate);
  }
}

// CONFORMING (DTO / Serialization Exception): Legitimate inspection of passive DTOs
export interface CreateUserDto {
  profile: {
    contact: {
      email: string;
      phoneNumber?: string;
    };
  };
}
export function mapUserDtoToResponse(dto: CreateUserDto): { email: string } {
  return {
    email: dto.profile.contact.email.toLowerCase(),
  };
}
```

## Exceptions & Invariants

1. **Accepted Public Contracts & Boundaries:** Stable public APIs, multi-tenant scoping, authorization, and data integrity checks remain strictly binding.
2. **Passive DTOs & Mappers:** Inspecting nested properties in passive DTOs, API responses, schema parsers, and serialization mappers is fully permitted.
3. **Fluent Pipelines:** Method chaining on fluent builders, promises, RxJS observables, and array methods (`map().filter()`) does not violate Demeter.
