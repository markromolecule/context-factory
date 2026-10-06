---
ruleId: cf-rule-laravel-application-business-logic-and-actions
name: business-logic-and-actions
description: Enforce Eloquent-first discipline, skinny controllers, and strict complexity thresholds for invokable actions.
scope: Domain logic, Action classes (app/Actions/), controllers, and application services across Laravel.
stack: laravel
appliesTo: ["app/**/Actions/**/*.php", "app/**/Actions/*.php"]
layers: ["services", "actions"]
alwaysApply: false
---

# Business Logic, Invokable Actions, and Anti-Overengineering

## Boundaries

- [directive:laravel.application.business-action][mode:evidence-blocking][verifier:human-evidence] Keep business policy and orchestration in focused application actions rather than controllers.

- **Single Responsibility Principle (SRP):** Adhere to [[rules/solid/single-responsibility|Single Responsibility (SRP)]] across the application layer. Controllers only handle HTTP transport, Form Request validation, and response transformation; Invokable Actions encapsulate a single cohesive domain transaction.
- **Interface Segregation Principle (ISP):** Strictly adhere to [[rules/solid/interface-segregation|Interface Segregation (ISP)]]. Prohibit 1:1 interfaces for action classes or application services where only a single concrete implementation exists. Introduce interfaces solely for external infrastructure boundaries with multiple swappable implementations.
- **No Fake Repositories:** Eloquent models are Active Records with an integrated query builder. Strictly prohibit creating repository interfaces or classes (`UserRepositoryInterface` -> `UserRepository`) that merely wrap Eloquent methods (`all()`, `find()`, `where()`).
- **Eloquent-First Discipline:** Standard single-model CRUD operations (create, read, update, delete) must reside directly in the Controller combined with Form Requests and Eloquent methods; never wrap simple CRUD in redundant Action or Service classes.
- **Action Extraction Thresholds:** Extract an Invokable Action (`app/Actions/...`) strictly and only when at least one of the following criteria is met:
  1. The business mutation affects multiple tables and requires a `DB::transaction()` boundary.
  2. The identical domain logic is reused across multiple entry points (e.g. Web Controller, API Controller, Artisan CLI command, and Queued Job).
  3. External third-party integrations (e.g. Stripe payment capture, Twilio SMS dispatch, AWS S3 file orchestration) are coordinated alongside database writes.

## Behavior

- **Invokable Action Structure:**
  - Structure each action as a single-responsibility invokable class with an `execute()` or `__invoke()` method.
  - Store action classes in `app/Modules/<Domain>/Actions/` (e.g. `app/Modules/Orders/Actions/ProcessOrderCheckout.php`).
  - Declare strict parameter types and explicit return types on the action entry point:

    ```php
    namespace App\Modules\Orders\Actions;

    use App\Modules\Orders\Models\Order;
    use App\Modules\Users\Models\User;
    use Illuminate\Support\Facades\DB;

    final readonly class ProcessOrderCheckout
    {
        public function __construct(
            private PaymentGateway $paymentGateway,
        ) {}

        public function __invoke(User $user, array $itemData): Order
        {
            return DB::transaction(function () use ($user, $itemData): Order {
                $order = Order::create([
                    'user_id' => $user->id,
                    'status' => OrderStatus::Pending,
                ]);

                $order->items()->createMany($itemData);
                $this->paymentGateway->charge($user, $order->total_cents);
                $order->update(['status' => OrderStatus::Paid]);

                return $order;
            }, attempts: 3);
        }
    }
    ```

- **Skinny Controller Delegation:**
  - Controllers handle HTTP routing, invoke Form Request validation, check policy authorization, delegate to the invokable action (or Eloquent directly for standard CRUD), and transform output into API Resources or Blade views. Avoid monolithic controllers; see [[rules/laravel/common/anti-patterns|Laravel Anti-Patterns Guide]]:

    ```php
    public function store(StoreOrderRequest $request, ProcessOrderCheckout $checkout): OrderResource
    {
        $order = $checkout($request->user(), $request->validated('items'));

        return new OrderResource($order);
    }
    ```

- **Domain Services vs Actions:**
  - Prefer focused Invokable Actions over monolithic Service classes containing dozen-method God objects (`OrderService`).
  - If a domain requires a service (e.g. complex pricing calculator), keep it stateless, immutable (`final readonly class`), and inject it via constructor.

## Verification

- Inspect codebase to ensure zero repository classes exist wrapping Eloquent models.
- Verify all Action classes meet at least one of the three extraction threshold criteria (transactions, multi-entry-point reuse, or external service orchestration).
- Ensure no single-implementation interfaces are registered in service providers for internal domain actions.
- Execute unit tests mocking external gateway dependencies and asserting correct state transitions and database records.
