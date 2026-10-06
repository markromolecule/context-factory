---
ruleId: cf-rule-laravel-common-project-structure
name: project-structure
description: Enforce modular domain architecture, modern Laravel 11/12 lean bootstrapping, and component-first Blade frontend structure.
scope: Application layout, modular architecture, Blade frontend hierarchy, bootstrapping, and configuration in Laravel applications.
stack: laravel
appliesTo: ["app/**/*.php", "routes/**/*.php", "resources/**/*.blade.php"]
layers: ["architecture"]
alwaysApply: false
---

# Modular Laravel Project Structure & Frontend Architecture

## Boundaries

- [directive:laravel.common.project-structure][mode:evidence-blocking][verifier:human-evidence] Keep Laravel-specific modules, routes, and presentation structure within their designated boundaries.

- **Modular Domain Organization (Single Responsibility & Cohesion):** Organize scalable applications by **Native PSR-4 Modules** (`app/Modules/<Feature>/`) rather than a flat, disconnected MVC hierarchy. Adhere to [[rules/solid/single-responsibility|Single Responsibility (SRP)]] at the architectural boundary: group all domain-specific primitives (Models, Actions, Controllers, Requests, Resources, Policies, Events, and co-located Routes) within their parent module so each feature forms a cohesive, self-contained unit.
- **Co-located Routing & Canonical Route Names:** Each module owns its endpoints in `app/Modules/<Feature>/routes.php` (or `routes/api.php` and `routes/web.php`). Route names MUST follow clean canonical dot notation (`orders.index`, `orders.show`); NEVER prefix route names with internal directory artifacts (no `modules.orders.show`).
- **Centralized Database Migrations:** Database migrations remain centralized under `database/migrations/` using standard Laravel timestamp ordering (`YYYY_MM_DD_HHMMSS_create_..._table.php`). This strictly eliminates foreign-key ordering failures across dependent tables during `migrate:fresh`.
- **Shared vs Domain Isolation (Dependency Inversion & Open/Closed):** Cross-cutting infrastructure, global middleware, shared value objects, service providers, and base traits live in `app/Shared/`. Modules must not directly mutate internal private state of another module; communicate across modules via public Invokable Actions, interfaces, or Domain Events, adhering to [[rules/solid/dependency-inversion|Dependency Inversion (DIP)]] and [[rules/solid/open-closed|Open/Closed (OCP)]].
- **Component-First Blade Hierarchy:** Forbid legacy `@include` chains and `@extends`/`@section` inheritance for page layouts and UI controls. Use slot-based Blade layout components (`<x-layouts.app>`) and atomic component directories (`<x-ui.*>`, `<x-forms.*>`, `<x-layout.*>`).
- **No Presentation Logic Leakage:** Blade templates MUST NOT execute database queries (e.g. `User::all()`, `Order::count()`) or service locator calls (`app(...)`). All data must be prepared in the Controller/Action and passed into the view.
- **No Legacy Kernel Architecture:** In Laravel 11+, configure middleware, exceptions, and routing entirely in `bootstrap/app.php` and `routes/console.php`. Never reintroduce legacy `app/Http/Kernel.php` or `app/Console/Kernel.php`.
- **Zero `env()` in Application Code:** Never call `env()` outside `config/*.php`. All environment variables must be mapped to config files and accessed via `config('services.stripe.key')` to allow `php artisan config:cache`.

## Behavior

### 1. Modular Backend Architecture (`app/Modules/`)

Each domain module encapsulates its own end-to-end responsibilities, co-locating models, controllers, actions, and routes:

```
app/
├── Modules/
│   ├── Orders/                          # Orders Domain Module
│   │   ├── Actions/                     # Invokable actions (ProcessOrderCheckout.php, CancelOrder.php)
│   │   ├── Controllers/                 # Module controllers (OrderController.php, DownloadInvoiceController.php)
│   │   ├── Enums/                       # Module backed enums (OrderStatus.php)
│   │   ├── Events/                      # State change events (OrderShipped.php)
│   │   ├── Listeners/                   # Handlers for domain events (SendShipmentNotification.php)
│   │   ├── Models/                      # Eloquent models (Order.php, OrderItem.php)
│   │   ├── Policies/                    # Authorization logic (OrderPolicy.php)
│   │   ├── Requests/                    # Form Requests (StoreOrderRequest.php, UpdateOrderRequest.php)
│   │   ├── Resources/                   # API Resources (OrderResource.php, OrderItemResource.php)
│   │   ├── Rules/                       # Custom validation rules (ValidPromoCode.php)
│   │   └── routes.php                   # Co-located module endpoints (web & api routes)
│   ├── Users/                           # Users & Authentication Module
│   │   ├── Actions/                     # RegisterUser.php, ResetPassword.php
│   │   ├── Controllers/                 # UserController.php, ProfileController.php
│   │   ├── Models/                      # User.php, UserProfile.php
│   │   ├── Policies/                    # UserPolicy.php
│   │   ├── Requests/                    # UpdateProfileRequest.php
│   │   └── routes.php                   # Co-located user/auth routes
│   └── Billing/                         # Billing & Payments Module
│       ├── Actions/                     # ChargeCustomer.php
│       ├── Controllers/                 # WebhookController.php
│       ├── Models/                      # Invoice.php, Subscription.php
│       ├── Services/                    # StripeGatewayService.php
│       └── routes.php                   # Co-located billing routes
└── Shared/                              # Cross-cutting foundational infrastructure
    ├── Enums/                           # Global enums (Environment.php, Currency.php)
    ├── Exceptions/                      # Base domain exceptions (DomainException.php)
    ├── Middleware/                      # Global pipeline guards (EnforceSecurityHeaders.php)
    ├── Providers/                       # ModuleServiceProvider.php (route & module discovery)
    └── Traits/                          # Shared model traits (HasUlids.php, Auditable.php)
database/
└── migrations/                          # Centralized migrations preserving deterministic timestamp order
```

### 2. Frontend & Blade Architecture (`resources/`)

Organize views into layout shells, reusable design-system components, and module-specific pages:

```
resources/
├── css/
│   ├── app.css                          # Main stylesheet with CSS variables & design tokens
│   └── components/                      # Component-specific styles or utilities
├── js/
│   ├── app.js                           # Vite entry point, Alpine.js / client libraries setup
│   └── components/                      # Interactive client widgets (modal.js, dropdown.js)
└── views/
    ├── layouts/                         # Slot-based layout shells
    │   ├── app.blade.php                # Authenticated application shell (<x-layouts.app>)
    │   ├── guest.blade.php              # Public / auth pages shell (<x-layouts.guest>)
    │   └── admin.blade.php              # Backoffice portal shell (<x-layouts.admin>)
    ├── components/                      # Reusable Atomic UI Design System
    │   ├── ui/                          # General UI widgets
    │   │   ├── button.blade.php         # <x-ui.button variant="primary">Submit</x-ui.button>
    │   │   ├── badge.blade.php          # <x-ui.badge color="success">Active</x-ui.badge>
    │   │   ├── card.blade.php           # <x-ui.card> ... </x-ui.card>
    │   │   ├── modal.blade.php          # <x-ui.modal id="confirm-delete"> ... </x-ui.modal>
    │   │   └── alert.blade.php          # <x-ui.alert type="warning">Notice</x-ui.alert>
    │   ├── forms/                       # Reusable form controls
    │   │   ├── input.blade.php          # <x-forms.input name="email" label="Email Address" />
    │   │   ├── select.blade.php         # <x-forms.select name="status" :options="$statuses" />
    │   │   ├── textarea.blade.php       # <x-forms.textarea name="notes" rows="4" />
    │   │   ├── checkbox.blade.php       # <x-forms.checkbox name="terms" />
    │   │   └── error.blade.php          # <x-forms.error field="email" />
    │   ├── layout/                      # Shell layout pieces
    │   │   ├── navbar.blade.php         # <x-layout.navbar />
    │   │   ├── sidebar.blade.php        # <x-layout.sidebar />
    │   │   ├── footer.blade.php         # <x-layout.footer />
    │   │   └── user-menu.blade.php      # <x-layout.user-menu />
    │   └── feedback/                    # Dynamic feedback elements
    │       ├── toast.blade.php          # <x-feedback.toast />
    │       ├── empty-state.blade.php    # <x-feedback.empty-state title="No orders found" />
    │       └── skeleton.blade.php       # <x-feedback.skeleton type="table" />
    ├── modules/                         # Module-specific page views (matches app/Modules/)
    │   ├── orders/
    │   │   ├── index.blade.php          # Route view: view('modules.orders.index')
    │   │   ├── show.blade.php           # Route view: view('modules.orders.show')
    │   │   ├── create.blade.php         # Route view: view('modules.orders.create')
    │   │   └── partials/                # Scoped sub-views (prefixed with underscore)
    │   │       ├── _order-summary.blade.php
    │   │       └── _status-timeline.blade.php
    │   ├── users/
    │   │   ├── profile.blade.php
    │   │   └── partials/
    │   │       └── _two-factor-form.blade.php
    │   └── billing/
    │       ├── invoices.blade.php
    │       └── partials/
    │           └── _payment-methods.blade.php
    └── emails/                          # Mailable HTML templates
        └── orders/
            └── order-confirmation.blade.php
```

### 3. Layout Shell Implementation (`resources/views/layouts/app.blade.php`)

```blade
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-gray-50">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ $title ?? config('app.name', 'Laravel') }}</title>

    <!-- Vite Assets -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="h-full antialiased font-sans text-gray-900">
    <div class="min-h-full flex flex-col">
        <x-layout.navbar />

        @if (isset($header))
            <header class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    {{ $header }}
                </div>
            </header>
        @endif

        <main class="flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <x-feedback.toast />
            {{ $slot }}
        </main>

        <x-layout.footer />
    </div>

    {{ $scripts ?? '' }}
</body>
</html>
```

### 4. Page View Implementation (`resources/views/modules/orders/show.blade.php`)

```blade
<x-layouts.app :title="'Order #' . $order->id">
    <x-slot:header>
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold tracking-tight text-gray-900">
                Order #{{ $order->id }}
            </h1>
            <x-ui.badge :color="$order->status->color()">
                {{ $order->status->label() }}
            </x-ui.badge>
        </div>
    </x-slot:header>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
            <x-ui.card title="Purchased Items">
                @include('modules.orders.partials._order-summary', ['items' => $order->items])
            </x-ui.card>
        </div>

        <div class="space-y-6">
            <x-ui.card title="Customer Details">
                <p class="text-sm font-medium text-gray-900">{{ $order->user->name }}</p>
                <p class="text-sm text-gray-500">{{ $order->user->email }}</p>
            </x-ui.card>
        </div>
    </div>
</x-layouts.app>
```

### 5. Lean Laravel 11/12 Bootstrapping (`bootstrap/app.php`)

```php
declare(strict_types=1);

use App\Shared\Exceptions\DomainException;
use App\Shared\Middleware\EnforceSecurityHeaders;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            EnforceSecurityHeaders::class,
        ]);
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (DomainException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'code' => $e->getCode(),
                ], 422);
            }
        });
    })->create();
```

### 6. Lean Module Route Auto-Discovery (`app/Shared/Providers/ModuleServiceProvider.php`)

Co-located module routes are discovered and registered dynamically via a lightweight Service Provider registered in `bootstrap/providers.php`:

```php
declare(strict_types=1);

namespace App\Shared\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

final class ModuleServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->registerModuleRoutes();
    }

    private function registerModuleRoutes(): void
    {
        $modulesDir = app_path('Modules');
        if (!is_dir($modulesDir)) {
            return;
        }

        foreach (scandir($modulesDir) as $module) {
            if ($module === '.' || $module === '..') {
                continue;
            }

            $routeFile = "{$modulesDir}/{$module}/routes.php";
            if (file_exists($routeFile)) {
                Route::middleware('api')
                    ->prefix('api/v1')
                    ->group($routeFile);
            }
        }
    }
}
```

## Verification

- Inspect `app/Modules/` to confirm classes (Models, Controllers, Actions, Requests, Resources, Policies) and co-located `routes.php` are encapsulated by domain module rather than flat global folders.
- Confirm route names follow clean dot notation (`orders.index`, `orders.show`); verify zero occurrences of `modules.` route name prefixes.
- Run `php artisan route:list` to verify all co-located module routes load cleanly without prefix or middleware collisions.
- Confirm database migrations remain centralized in `database/migrations/` and pass `php artisan migrate:fresh --seed` without foreign key constraint ordering failures.
- Verify `resources/views/` adheres to the 3-tier structure: `layouts/`, design-system `components/`, and per-module `modules/<domain>/`.
- Confirm Blade files never execute direct Eloquent queries (`Model::find()`) or service locator calls (`app(...)`).
- Verify `grep -rn "env(" app/ routes/` produces zero results outside `config/`.
- Run `npm run build` to confirm Vite compiles CSS/JS assets cleanly without broken paths.
