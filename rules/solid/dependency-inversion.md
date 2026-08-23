---
name: dependency-inversion
description: Enforce inward-pointing dependencies where high-level policy depends on abstractions rather than low-level concrete implementations.
scope: System architecture, backend service dependencies, repository interfaces, external integrations, and React dependency injection.
alwaysApply: false
---

# Dependency Inversion Principle (DIP)

High-level business policies and domain services **must not depend on low-level technical details (databases, file systems, HTTP clients, cloud SDKs)**. Both must depend on abstractions (interfaces or type contracts). Furthermore, abstractions must not depend on details; details must depend on abstractions.

## Mandatory Directives

- **MUST:** Define domain repository and adapter interfaces in the domain/service layer, and implement concrete adapters in the infrastructure layer (inverting the dependency).
- **MUST:** Inject dependencies explicitly via constructor parameters, factory function arguments, or React Context providers.
- **MUST:** Keep all direct third-party SDK calls (Stripe, SendGrid, AWS S3, Prisma, Kysely) isolated within infrastructure adapters behind domain interfaces.
- **MUST NOT:** Directly instantiate concrete database clients or third-party service classes inside domain services (`const db = new PrismaClient()`).
- **MUST NOT:** Import low-level infrastructure modules or database driver types into high-level business entities or domain rules.

## Backend & Hexagonal Architecture Patterns

### Bad: Direct Low-Level Instantiation & Coupling
```typescript
// ❌ Violates DIP: High-level CheckoutService directly imports and instantiates concrete Prisma and Stripe clients
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

export class CheckoutService {
  private prisma = new PrismaClient(); // Direct low-level coupling; impossible to unit test without live DB
  private stripe = new Stripe(process.env.STRIPE_KEY!);

  async processCheckout(orderId: string, paymentToken: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    const charge = await this.stripe.charges.create({ amount: order.amount, source: paymentToken, currency: "usd" });
    await this.prisma.order.update({ where: { id: orderId }, data: { status: "PAID", transactionId: charge.id } });
  }
}
```

### Good: Ports & Adapters (Dependency Inversion)
```typescript
// ✅ Domain Abstractions (Ports) owned by the business layer
export interface OrderRepositoryPort {
  findById(id: string): Promise<Order | null>;
  save(order: Order): Promise<void>;
}

export interface PaymentGatewayPort {
  charge(amount: Money, token: string): Promise<PaymentResult>;
}

// ✅ High-Level Domain Service depends ONLY on abstractions
export class CheckoutService {
  constructor(
    private readonly orderRepo: OrderRepositoryPort,
    private readonly paymentGateway: PaymentGatewayPort
  ) {}

  async processCheckout(orderId: string, paymentToken: string): Promise<Result<void, CheckoutError>> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) return Result.err(new OrderNotFoundError(orderId));

    const paymentResult = await this.paymentGateway.charge(order.total, paymentToken);
    if (!paymentResult.isSuccess) return Result.err(new PaymentFailedError(paymentResult.errorMessage));

    order.markAsPaid(paymentResult.transactionId);
    await this.orderRepo.save(order);
    return Result.ok(undefined);
  }
}

// ✅ Low-level infrastructure adapters implement the domain ports (Inverted Dependency)
export class PrismaOrderRepository implements OrderRepositoryPort {
  constructor(private readonly prisma: PrismaClient) {}
  async findById(id: string) { /* ... */ }
  async save(order: Order) { /* ... */ }
}
```

## Frontend & React Patterns

### Bad: Hardcoded Singleton API Imports
```tsx
// ❌ Violates DIP: Component is coupled to a global axios singleton; cannot be easily tested in isolation
import { apiClient } from "@/lib/api-client";

export function NotificationsList() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    apiClient.get("/notifications").then(res => setItems(res.data));
  }, []);
  return <ul>{items.map(i => <li key={i.id}>{i.message}</li>)}</ul>;
}
```

### Good: Inversion via Service Provider / Hook Abstraction
```tsx
// ✅ UI Component depends on an abstract hook/context contract
export interface NotificationService {
  fetchNotifications(): Promise<NotificationItem[]>;
}

export const NotificationServiceContext = createContext<NotificationService | null>(null);

export function useNotifications() {
  const service = useContext(NotificationServiceContext);
  if (!service) throw new Error("useNotifications must be used within NotificationServiceProvider");
  return useQuery({ queryKey: ["notifications"], queryFn: () => service.fetchNotifications() });
}

export function NotificationsList() {
  const { data: items = [], isLoading } = useNotifications();
  if (isLoading) return <div>Loading...</div>;
  return <ul>{items.map(i => <li key={i.id}>{i.message}</li>)}</ul>;
}
```

## Verification Checklist

1. Are domain services constructed with dependencies passed in via constructor parameters rather than `new ConcreteService()`?
2. Do high-level business policies import only domain interfaces/ports rather than direct Prisma/SQL/SDK instances?
3. Can any domain service be unit tested in isolation using lightweight in-memory fake repositories?
