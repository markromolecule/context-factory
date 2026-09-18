---
name: untyped-arrays
description: Prohibit passing untyped associative array payloads across layers; mandate PHP 8.2+ readonly class DTOs, Value Objects, or Form Requests.
scope: All PHP classes, method signatures, controllers, actions, and DTOs in Laravel.
alwaysApply: true
---

# Untyped Arrays Anti-Pattern

Passing arbitrary, untyped associative arrays (`array $data` or `array $payload`) between architectural layers obscures data contracts, eliminates static analysis guarantees, disables IDE autocomplete, and causes runtime `Undefined array key` crashes.

## Boundaries

- **MUST NOT:** Accept or return generic, untyped associative arrays in service methods, invokable actions, repositories, or domain services.
- **MUST NOT:** Rely on implicit array keys (`$data['email']`, `$payload['amount']`) across layer boundaries.
- **MUST:** Define strongly typed Data Transfer Objects (DTOs) or PHP 8.2+ `readonly class` Value Objects with typed constructor properties.
- **MUST:** Extract validated inputs in controllers using Form Request typed accessors (`$request->string()`, `$request->integer()`, `$request->boolean()`, `$request->enum()`) or factory methods (`DataClass::fromRequest($request)`).

## Why It Fails

1. **Zero Type Safety & No Static Analysis:** Tools like PHPStan and Psalm cannot inspect internal keys of generic arrays unless complex, brittle PHPDoc `@param array{user_id: int, ...}` comments are maintained.
2. **Runtime Regressions:** Renaming a key in a controller or form request silently breaks downstream consumers without compile-time or static analysis warnings.
3. **No IDE Autocomplete:** Developers are forced to mentally track or grep array structures across calls.

## Concrete Remediations

### Bad: Opaque Associative Array

```php
// BAD: Untyped array with implicit keys; crashes at runtime on typos or missing keys
final class CheckoutService
{
    public function handle(array $payload): void
    {
        $userId = $payload['user_id'];       // Crashes with Undefined array key if omitted
        $amount = $payload['total_amount'];  // No guarantee $amount is int or float
        $code   = $payload['promo_code'];    // May be null or unset
    }
}
```

### Good: Immutable PHP 8.2+ Strongly-Typed DTO

```php
declare(strict_types=1);

namespace App\Modules\Orders\Data;

use App\Modules\Orders\Requests\StoreOrderRequest;

final readonly class CheckoutData
{
    public function __construct(
        public int $userId,
        public int $amountInCents,
        public ?string $promoCode = null,
    ) {}

    public static function fromRequest(StoreOrderRequest $request): self
    {
        return new self(
            userId: (int) $request->user()->id,
            amountInCents: (int) $request->validated('amount_cents'),
            promoCode: $request->validated('promo_code'),
        );
    }
}

// Consumer: Strongly typed, statically verifiable, explicit contract
final readonly class ProcessOrderCheckout
{
    public function __invoke(CheckoutData $data): Order
    {
        // Full IDE autocomplete and PHPStan level 8+ type guarantee
        return Order::create([
            'user_id' => $data->userId,
            'amount_cents' => $data->amountInCents,
            'promo_code' => $data->promoCode,
        ]);
    }
}
```

## SOLID Principles Alignment

- **[[rules/solid/liskov-substitution|Liskov Substitution Principle (LSP)]]:** Methods accepting generic `array $payload` lack verifiable preconditions. Subtypes or mock implementations cannot safely substitute behavior without risking unexpected array key mismatches. Strongly typed DTOs ensure all callers and implementers honor an identical, predictable contract.
- **[[rules/solid/interface-segregation|Interface Segregation Principle (ISP)]]:** Untyped arrays frequently carry unnecessary data across layers. Typed DTOs enforce lean, explicit boundaries containing only the attributes required by the specific action.

## Verification

- Run `vendor/bin/phpstan analyse --level=8` to confirm zero untyped `array` parameters or return types exist in Actions and Services.
- Check that all DTO classes are marked `final readonly class`.
- Verify that controller payloads are mapped via dedicated Form Requests or DTO factory methods.
