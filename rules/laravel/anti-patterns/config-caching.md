---
name: config-caching
description: Prevent runtime failures during config:cache by eliminating direct env() calls in application code.
scope: All PHP classes, controllers, services, models, actions, commands, and Blade templates outside config/.
alwaysApply: true
---

# Direct env() Calls Outside Config Anti-Pattern

Calling Laravel's `env()` helper function directly inside application code (controllers, actions, services, models, console commands, or views) works during local development when configuration is not cached. However, once `php artisan config:cache` is executed in staging or production, Laravel does not load `.env` files into PHP's environment at runtime; consequently, all `env()` invocations outside files in `config/` return `null`.

## Boundaries

- **MUST NOT:** Call `env()` directly inside any file outside the `config/` directory.
- **MUST:** Map all environment variables into dedicated configuration files (`config/*.php` or `config/services.php`).
- **MUST:** Retrieve configuration values in application code exclusively via `config('key.subkey')` or `config()->string('key.subkey')`.
- **MUST:** Always run `php artisan config:cache` in CI/CD pipeline tests to detect runtime `null` regressions early.

## Why It Fails

1. **Silent Production Outages:** Services work locally because `.env` is parsed on every request. In production where `config:cache` is mandatory for performance, API keys, credentials, and endpoints silently resolve to `null`, causing third-party SDK crashes (e.g. Stripe, AWS S3, Mailgun).
2. **Missing Fallbacks:** Direct `env('KEY', 'default')` calls duplicate default values across dozens of files, making configuration refactoring error-prone.
3. **Breaks Environment Immutability:** Bypasses Laravel's centralized configuration repository, making mocking or modifying settings in unit tests difficult.

## Concrete Remediations

### Bad: Calling `env()` in Application Code

```php
// BAD: Returns NULL in production when php artisan config:cache is active!
namespace App\Services;

final class PaymentService
{
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = env('STRIPE_SECRET_KEY'); // BUG: Resolves to NULL in production!
    }
}
```

### Good: Configuration Mapping via `config/`

Step 1: Map the environment variable inside a configuration file:

```php
// config/services.php
return [
    'stripe' => [
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
        'webhook' => env('STRIPE_WEBHOOK_SECRET'),
    ],
];
```

Step 2: Read configuration via the `config()` repository in application code:

```php
declare(strict_types=1);

namespace App\Modules\Billing\Services;

final readonly class StripePaymentGateway
{
    private string $secret;

    public function __construct()
    {
        // GOOD: Reads from cached config; works consistently in dev, test, and production
        $this->secret = config('services.stripe.secret');
    }
}
```

## SOLID Principles Alignment

- **[[rules/solid/dependency-inversion|Dependency Inversion Principle (DIP)]]:** Direct `env()` calls tightly couple high-level business services to the low-level server execution environment. Utilizing Laravel's `config()` repository inverts this dependency: application services depend on a centralized, mockable configuration abstraction rather than raw environment variables.

## Verification

- Run `grep -rn "env(" app/ routes/ resources/` to confirm zero `env()` invocations exist outside `config/`.
- Run `php artisan config:cache` in local or CI environments and execute test suites (`php artisan test`) to confirm tests pass with cached configuration.
- Verify all required keys have corresponding entries in `.env.example`.
