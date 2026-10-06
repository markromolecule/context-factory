---
ruleId: cf-rule-laravel-foundation-container-and-injection
name: container-and-injection
description: Govern dependency injection, service provider registration, and avoid service-locator anti-patterns in Laravel.
scope: Service providers, controllers, actions, commands, and dependency wiring across Laravel.
stack: laravel
appliesTo: ["app/**/*.php"]
layers: ["infrastructure", "services"]
alwaysApply: false
---

# Service Container and Dependency Injection

## Boundaries

- [directive:laravel.foundation.container-injection][mode:evidence-blocking][verifier:human-evidence] Keep framework container composition at infrastructure boundaries and dependencies explicit in application code.

- **Dependency Inversion Principle (DIP):** Strictly adhere to [[rules/solid/dependency-inversion|Dependency Inversion (DIP)]]. Inject dependencies via class constructors; never use `app()` or `resolve()` as a service locator inside controllers, actions, or models. High-level domain actions must not directly instantiate low-level external SDKs or infrastructure drivers.
- **Interface Segregation Principle (ISP):** Strictly adhere to [[rules/solid/interface-segregation|Interface Segregation (ISP)]]. Do not create 1:1 interfaces for internal services with only one concrete implementation. Introduce lean, role-specific interfaces strictly for swappable external infrastructure boundaries (e.g. payment gateways, SMS providers) requiring runtime or test substitution.
- Register bindings, singletons, and package bootstrapping in dedicated Service Providers (`app/Providers/`), keeping `AppServiceProvider` lean.
- Use Laravel Facades sparingly and only at transport boundaries (e.g. `Log::info`, `Route::get`); prefer injected dependencies in core business logic.

## Behavior

- **Constructor Injection:**
  - Leverage PHP 8 constructor property promotion to declare and inject typed services and dependencies.
  - Type-hint the concrete service directly when only one implementation exists (e.g. `public function __construct(private StripeClient $stripe) {}`).
- **Contextual Binding & Configuration:**
  - Use container contextual binding (`$this->app->when(...)->needs(...)->give(...)`) when injecting scalar configuration values or specific client instances, rather than calling `config()` inside class constructors.
- **Service Providers:**
  - Separate service registration (`register()` method — pure bindings without side-effects) from service booting (`boot()` method — event listeners, view composers, macro definitions).
  - Defer heavy service providers implementing `\Illuminate\Contracts\Support\DeferrableProvider` when bindings are only needed on specific requests.
- **Anti-Overengineering Rule:**
  - Avoid creating premature factory classes or builder classes where standard Laravel container resolution (`app()->make()`) or direct instantiation suffices.
  - Never wrap Laravel core components (e.g. Mailer, Cache, Queue) in custom proxy wrappers unless adding domain-specific policy.

## Verification

- Inspect classes for hidden calls to `app(...)`, `resolve(...)`, or static `App::make(...)`; verify all dependencies are injected via constructor.
- Confirm every custom interface registered in a Service Provider has at least two implementations or is an authorized external adapter boundary.
- Run `php artisan optimize:clear` and test container resolution to ensure zero circular dependencies or binding resolution errors.
