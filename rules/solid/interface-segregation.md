---
name: interface-segregation
description: Keep interfaces, types, and component prop definitions fine-grained, cohesive, and client-specific.
scope: TypeScript interfaces, type definitions, service ports, component props, and API contracts.
alwaysApply: false
---

# Interface Segregation Principle (ISP)

Clients must **never be forced to depend on methods, properties, or type definitions they do not use**. Favor multiple small, focused, role-specific interfaces over large, bloated "header-dump" interfaces.

## Mandatory Directives

- **MUST:** Design interfaces from the perspective of the *consumer*, containing only the methods and properties required for that consumer's use case.
- **MUST:** Narrow React component props to the minimum necessary fields (or use TypeScript utility types like `Pick<T, K>`) rather than passing full domain models.
- **MUST:** Decompose fat backend service interfaces into fine-grained role interfaces (e.g. `UserFinder`, `UserModifier`, `PasswordResetter`).
- **MUST NOT:** Create monolithic "God Interfaces" (e.g., a single 25-method `IDataService`) that force implementors to write dummy or empty methods.
- **MUST NOT:** Pass complete database entities or bulky API response objects into leaf UI components that only need 1 or 2 fields.

## Backend & Domain Patterns

### Bad: Fat Monolithic Interface
```typescript
// ❌ Violates ISP: Forces every client and implementor to depend on unrelated authentication, billing, and profile methods
export interface UserService {
  getProfile(id: string): Promise<UserProfile>;
  updateProfile(id: string, data: UpdateProfileDTO): Promise<void>;
  processSubscriptionPayment(id: string, plan: Plan): Promise<Receipt>;
  cancelSubscription(id: string): Promise<void>;
  generatePasswordResetToken(email: string): Promise<string>;
  verifyTwoFactorCode(id: string, code: string): Promise<boolean>;
  exportUserDataGDPR(id: string): Promise<Buffer>;
}
```

### Good: Granular, Role-Specific Interfaces
```typescript
// ✅ Focused Role Interfaces
export interface UserProfileReader {
  getProfile(userId: string): Promise<UserProfile>;
}

export interface UserSubscriptionManager {
  processSubscription(userId: string, plan: Plan): Promise<Receipt>;
  cancelSubscription(userId: string): Promise<void>;
}

export interface UserAuthenticator {
  generatePasswordResetToken(email: string): Promise<string>;
  verifyTwoFactorCode(userId: string, code: string): Promise<boolean>;
}

// Consumer only depends on what it needs
export class ProfileController {
  constructor(private readonly profileReader: UserProfileReader) {}

  async handle(req: Request, res: Response) {
    const profile = await this.profileReader.getProfile(req.params.id);
    return res.json(profile);
  }
}
```

## Frontend & React Patterns

### Bad: Passing Entire Domain Entity to Leaf Component
```tsx
// ❌ Violates ISP: UserBadge only displays an image and name, but demands entire UserAccount (including billing & permissions)
export function UserBadge({ user }: { user: UserAccount }) {
  return (
    <div className="flex items-center gap-2">
      <img src={user.avatarUrl} alt={user.fullName} className="w-8 h-8 rounded-full" />
      <span>{user.fullName}</span>
    </div>
  );
}
```

### Good: Segregated, Minimal Props Contract
```tsx
// ✅ Segregated Props: Allows reuse across User, Guest, Author, or Commenter without mock overhead
export interface UserBadgeProps {
  avatarUrl?: string;
  fullName: string;
}

export function UserBadge({ avatarUrl, fullName }: UserBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      {avatarUrl ? (
        <img src={avatarUrl} alt={fullName} className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold">
          {fullName.charAt(0)}
        </div>
      )}
      <span className="text-sm font-medium">{fullName}</span>
    </div>
  );
}
```

## Verification Checklist

1. Does any class or mock implement empty dummy methods or throw errors because an interface contains unused methods?
2. Are React component props narrowed to the fields actually rendered rather than accepting full domain models?
3. Are large service interfaces partitioned into cohesive, client-specific role interfaces?
