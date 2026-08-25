---
name: single-responsibility
description: Ensure each module, class, service, and React component/hook has a single, cohesive reason to change.
scope: System architecture, backend modules, services, controllers, repositories, frontend components, and custom hooks.
alwaysApply: true
---

# Single Responsibility Principle (SRP)

Every module, class, service, function, and UI component must have **one, and only one, reason to change**. High cohesion and clear separation of concerns prevent unintended side effects across disparate business capabilities.

## Mandatory Directives

- **MUST:** Restrict every class, service, or module to a single business capability or actor boundary.
- **MUST:** Separate transport parsing (controllers), business validation (services), data persistence (repositories), and presentation (UI components) into distinct files.
- **MUST:** Extract asynchronous state management, caching, and data fetching out of React UI components into dedicated custom hooks (`use*`).
- **MUST NOT:** Execute direct database queries, ORM calls, or raw network requests inside UI components or transport controllers.
- **MUST NOT:** Combine unrelated business domain logic (e.g., authentication tokens and invoice generation) in a single service or "god object".
- **MUST NOT:** Create omnibus "helpers.ts" or "utils.ts" files containing mixed, unbounded responsibilities.

## Backend & Domain Patterns

### Bad: Mixed Responsibilities in Controller/Service
```typescript
// ❌ Violates SRP: Handles HTTP transport, password hashing, SQL query, and email dispatch in one class
export class UserController {
  async register(req: Request, res: Response) {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await db.query("INSERT INTO users (email, hash) VALUES ($1, $2) RETURNING *", [email, hash]);
    await sendgrid.send({ to: email, subject: "Welcome!", text: "Welcome to our app" });
    return res.status(201).json(user);
  }
}
```

### Good: Cohesive, Segregated Boundaries
```typescript
// ✅ Controller: Solely handles HTTP parsing and status mapping
export class UserController {
  constructor(private readonly registrationService: RegistrationService) {}

  async register(req: Request, res: Response): Promise<Response> {
    const dto = RegistrationSchema.parse(req.body);
    const result = await this.registrationService.execute(dto);
    return res.status(201).json(result);
  }
}

// ✅ Service: Solely handles registration business policy and orchestration
export class RegistrationService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly hasher: PasswordHasherPort,
    private readonly notifier: WelcomeNotifierPort
  ) {}

  async execute(dto: RegistrationDTO): Promise<UserSummary> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw new EmailAlreadyInUseError(dto.email);
    
    const passwordHash = await this.hasher.hash(dto.password);
    const user = await this.userRepo.create({ email: dto.email, passwordHash });
    await this.notifier.sendWelcome(user.email);
    return { id: user.id, email: user.email };
  }
}
```

## Frontend & React Patterns

### Bad: Monolithic React Component
```tsx
// ❌ Violates SRP: Combines data fetching, error state, business logic, form validation, and complex DOM tree
export function OrderDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders").then(res => res.json()).then(data => { setOrders(data); setLoading(false); });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.price * (1 - o.discountRate), 0);

  if (loading) return <div>Loading orders...</div>;
  return (
    <div>
      <h1>Total Revenue: ${totalRevenue.toFixed(2)}</h1>
      <table>{/* 150 lines of complex table rendering */}</table>
    </div>
  );
}
```

### Good: Custom Hook + Focused Presentational Components
```tsx
// ✅ Custom Hook: Isolates asynchronous fetching, state, and revenue calculation
export function useOrderDashboard() {
  const { data: orders = [], isLoading, error } = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });
  const totalRevenue = useMemo(() => calculateTotalRevenue(orders), [orders]);
  return { orders, totalRevenue, isLoading, error };
}

// ✅ Presentational Component: Isolates layout and composition
export function OrderDashboard() {
  const { orders, totalRevenue, isLoading, error } = useOrderDashboard();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="space-y-6">
      <RevenueSummaryCard amount={totalRevenue} />
      <OrdersTable items={orders} />
    </div>
  );
}
```

## Verification Checklist

1. Does each touched file have a single, clearly identifiable business reason to change?
2. Are HTTP, business logic, database queries, and UI rendering cleanly partitioned into separate layers?
3. If a file exceeds 200 lines or handles multiple concerns, has `skills/refactor` been applied to extract subcomponents or hooks?
