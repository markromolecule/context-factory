---
name: open-closed
description: Design software entities to be open for extension without requiring modification of existing, tested source code.
scope: System architecture, polymorphic handlers, strategy registries, plugin mechanisms, and React component composition.
alwaysApply: true
---

# Open/Closed Principle (OCP)

Software entities (classes, modules, functions, components) must be **open for extension, but closed for modification**. Adding a new feature, provider, payment method, or UI variant must not require rewriting or adding brittle conditional branches to existing, battle-tested code.

## Mandatory Directives

- **MUST:** Use polymorphism, strategy patterns, or registry lookups instead of sprawling `switch (type)` or `if-else` cascades when handling variable business variants.
- **MUST:** Leverage React component composition (`children`, slot props, compound components) to extend container layouts rather than adding excessive boolean variant props.
- **MUST:** Define stable interfaces for extension points (e.g. `NotificationProvider`, `PaymentGateway`, `ExportStrategy`).
- **MUST NOT:** Modify core domain workflows to accommodate a new external provider or payment channel; register a new strategy implementor instead.
- **MUST NOT:** Add cascading conditional checks (`if (type === 'NEW_TYPE')`) scattered across multiple application layers when a single polymorphic interface suffices.

## Backend & Domain Patterns

### Bad: Hardcoded Type-Switching Ladder
```typescript
// ❌ Violates OCP: Adding a new discount type requires modifying existing calculate() logic
export class PricingCalculator {
  calculate(order: Order, discountType: "HOLIDAY" | "VIP" | "STAFF"): number {
    let discount = 0;
    if (discountType === "HOLIDAY") {
      discount = order.total * 0.15;
    } else if (discountType === "VIP") {
      discount = order.total * 0.25;
    } else if (discountType === "STAFF") {
      discount = order.total * 0.40;
    }
    return order.total - discount;
  }
}
```

### Good: Strategy Pattern / Registry Extension
```typescript
// ✅ Contract: Open interface for discount extension
export interface DiscountStrategy {
  readonly code: string;
  calculateDiscount(order: Order): number;
}

export class HolidayDiscount implements DiscountStrategy {
  readonly code = "HOLIDAY";
  calculateDiscount(order: Order): number { return order.total * 0.15; }
}

export class VIPDiscount implements DiscountStrategy {
  readonly code = "VIP";
  calculateDiscount(order: Order): number { return order.total * 0.25; }
}

// ✅ Calculator: Closed for modification; extends via registry
export class PricingCalculator {
  private strategies = new Map<string, DiscountStrategy>();

  registerStrategy(strategy: DiscountStrategy): void {
    this.strategies.set(strategy.code, strategy);
  }

  calculate(order: Order, discountCode?: string): number {
    if (!discountCode) return order.total;
    const strategy = this.strategies.get(discountCode);
    if (!strategy) throw new UnsupportedDiscountError(discountCode);
    return order.total - strategy.calculateDiscount(order);
  }
}
```

## Frontend & React Patterns

### Bad: Prop Explosion Anti-Pattern
```tsx
// ❌ Violates OCP: Adding new layout configurations requires modifying Card internals with new flags
export function Card({ title, content, isHeaderRed, showFooterActions, hasCustomSidebar, isCompact }: CardProps) {
  return (
    <div className={`card ${isCompact ? "p-2" : "p-6"}`}>
      <div className={`header ${isHeaderRed ? "bg-red-500" : "bg-blue-500"}`}>{title}</div>
      <div className="body">{content}</div>
      {showFooterActions && <div className="footer"><button>Submit</button></div>}
      {hasCustomSidebar && <aside>Sidebar</aside>}
    </div>
  );
}
```

### Good: Component Composition via Slots and Compound Components
```tsx
// ✅ Closed for modification; infinitely extensible via standard React composition
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border bg-card p-6 shadow-sm ${className}`}>{children}</div>;
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b pb-3 mb-4 font-semibold">{children}</div>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className="border-t pt-3 mt-4 flex justify-end gap-2">{children}</div>;
};
```

## Verification Checklist

1. Can a new feature variant (e.g. payment gateway, discount rule, export format) be added without modifying existing calculation engines?
2. Are UI components extensible via children and slot props rather than ballooning boolean props?
3. Are polymorphic strategies or registries used where runtime behavior varies by type?
