---
name: monolithic-controllers
description: Prevent monolithic controller bloat by keeping controllers skinny and delegating domain workflows to Invokable Actions and Queued Jobs.
scope: Controllers, HTTP routing, actions, and jobs in Laravel.
alwaysApply: true
---

# Monolithic Controllers Anti-Pattern

Monolithic controllers (also known as "Fat Controllers" or "God Controllers") occur when controller methods accumulate dozens or hundreds of lines of code handling transport routing, raw input validation, multi-table database transactions, third-party API SDK calls, file storage operations, and notification/mail dispatching all in a single method or class.

## Boundaries

- **MUST NOT:** Exceed 25 lines of code per controller action method.
- **MUST NOT:** Write inline validation rules (`$request->validate([...])`) in controller store/update methods; use Form Requests.
- **MUST NOT:** Execute database transactions (`DB::transaction(...)`) or raw SQL queries inside controllers.
- **MUST NOT:** Directly instantiate third-party SDK clients (`new StripeClient(...)`) or execute blocking external network I/O inside controllers.
- **MUST:** Keep controllers focused strictly on HTTP transport: receiving the request, delegating to authorization/Form Requests, executing a single Invokable Action or direct Eloquent call, and returning an HTTP response.
- **MUST:** Delegate multi-step business transactions to dedicated Invokable Action classes (`app/Modules/<Domain>/Actions/`).
- **MUST:** Dispatch slow operations (emails, webhooks, PDF generation) to Queued Jobs.

## Why It Fails

1. **Untestable Code:** Controller actions with inline transactions, SDK instantiations, and mail sends cannot be unit tested without spinning up the entire HTTP kernel, mock HTTP requests, and complex session state.
2. **Zero Code Reusability:** Business logic trapped inside a controller cannot be reused by Artisan console commands, queue workers, or webhook handlers without duplicating code or fabricating synthetic HTTP requests.
3. **High Cognitive Load & Merge Conflicts:** Large, multi-thousand line controllers create frequent Git merge conflicts when multiple developers work on adjacent features.

## Concrete Remediations

### Bad: Monolithic God Controller

```php
// BAD: 50+ line controller method doing validation, DB transactions, Stripe charges, and email sends
public function store(Request $request)
{
    $request->validate([
        'amount' => 'required|integer|min:100',
        'items' => 'required|array|min:1',
    ]);

    $order = DB::transaction(function () use ($request) {
        $order = Order::create([
            'user_id' => $request->user()->id,
            'total_cents' => $request->input('amount'),
        ]);

        foreach ($request->input('items') as $item) {
            $order->items()->create($item);
        }

        return $order;
    });

    $stripe = new \Stripe\StripeClient(env('STRIPE_SECRET'));
    $stripe->charges->create([
        'amount' => $order->total_cents,
        'currency' => 'usd',
        'source' => $request->input('stripe_token'),
    ]);

    Mail::to($request->user())->send(new OrderReceipt($order));

    return view('orders.show', compact('order'));
}
```

### Good: Skinny Controller Delegating to Invokable Action

```php
declare(strict_types=1);

namespace App\Modules\Orders\Controllers;

use App\Modules\Orders\Actions\ProcessOrderCheckout;
use App\Modules\Orders\Data\CheckoutData;
use App\Modules\Orders\Requests\StoreOrderRequest;
use Illuminate\Http\RedirectResponse;

final class StoreOrderController
{
    public function __invoke(
        StoreOrderRequest $request,
        ProcessOrderCheckout $checkout
    ): RedirectResponse {
        // Skinny: 8 lines, transport-focused, completely testable
        $order = $checkout(
            user: $request->user(),
            data: CheckoutData::fromRequest($request)
        );

        return redirect()
            ->route('orders.show', $order)
            ->with('success', 'Order placed successfully.');
    }
}
```

## SOLID Principles Alignment

- **[[rules/solid/single-responsibility|Single Responsibility Principle (SRP)]]:** Monolithic controllers violate SRP by having multiple distinct reasons to change (HTTP status mappings, database schema modifications, payment gateway API version changes, and notification templates). Delegating to Form Requests, Invokable Actions, and Queued Jobs restores single, cohesive responsibilities.
- **[[rules/solid/dependency-inversion|Dependency Inversion Principle (DIP)]]:** Method and constructor injection of Invokable Actions and gateway interfaces decouples the controller from low-level implementation details and concrete SDK instantiations.

## Verification

- Inspect controller classes to verify no action method exceeds 25 lines of code.
- Check that zero `DB::transaction()` closures or `Mail::to()->send()` calls exist in `app/Modules/*/Controllers/`.
- Ensure non-resourceful endpoints use single-action Invokable Controllers (`__invoke`) named `<Verb><Noun>Controller`.
