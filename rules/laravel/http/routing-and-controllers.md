---
ruleId: cf-rule-laravel-http-routing-and-controllers
name: routing-and-controllers
description: Keep Laravel HTTP endpoints and controllers skinny, RESTful, and transport-focused; enforce Route Model Binding and API Resources.
scope: Routes (web.php, api.php), controllers, and API resource transformers.
stack: laravel
appliesTo: ["app/Http/Controllers/**/*.php", "app/Modules/**/Controllers/**/*.php", "routes/**/*.php"]
layers: ["controllers", "routing"]
alwaysApply: false
---

# Routing and Controllers

## Boundaries

- [directive:laravel.http.controllers-thin][mode:evidence-blocking][verifier:human-evidence] Keep controller orchestration thin and delegate business policy to application actions.

- **Single Responsibility Principle (SRP):** Controllers must have one, and only one, reason to change: adapting HTTP transport requests and shaping HTTP responses. Controllers must never handle database transaction orchestration, business validation rules, or external service calls directly; delegate these to Form Requests, Invokable Actions, and Queued Jobs. Reference: [[rules/solid/single-responsibility|Single Responsibility (SRP)]].
- Keep controllers strictly focused on HTTP transport: receiving the request, delegating to authorization, invoking domain actions or direct Eloquent mutations, and returning an HTTP response.
- Keep controller methods under 25 lines; never place raw SQL queries, heavy data transformations, or complex multi-step orchestration inside controller methods.
- Never return raw Eloquent models or collections directly in API responses; always transform models using Laravel API Resources (`JsonResource`) to prevent leaking internal database columns, hidden attributes, or unformatted dates.
- Use Route Model Binding (`public function show(User $user)`) to eliminate redundant `Model::findOrFail($id)` queries.

## Behavior

- **Dependency Inversion Principle (DIP) via Injection:**
  - Adhere to [[rules/solid/dependency-inversion|Dependency Inversion (DIP)]] by injecting required Actions, Domain Services, or infrastructure interfaces into controller constructors or action methods (`public function store(StoreOrderRequest $request, ProcessOrderAction $action)`).
  - Controllers must never instantiate low-level services or external SDKs with `new` or resolve them dynamically via the `app()` service locator.
- **RESTful Resource Controllers & Co-located Routes:**
  - Structure controllers around the 7 standard RESTful resource methods (`index`, `create`, `store`, `show`, `edit`, `update`, `destroy`) or create single-action invokable controllers (`<Verb><Noun>Controller`, e.g. `StoreOrderController`, `DownloadInvoiceController`) with `__invoke()` for non-resourceful endpoints.
  - Co-locate route declarations within their domain module in `app/Modules/<Feature>/routes.php` (or `routes/api.php` and `routes/web.php`), registered dynamically via `App\Shared\Providers\ModuleServiceProvider` with uniform prefixes (`/api/v1/...`) and middleware.
  - Name all routes using standard dot notation (`users.index`, `orders.store`) without internal directory artifact prefixes (never `modules.orders.store`) to facilitate clean URL generation and refactoring.
- **Pragmatic CRUD Handling:**
  - For standard CRUD operations touching a single model, keep the logic directly inside the controller using a Form Request and Eloquent:

    ```php
    public function store(StorePostRequest $request): JsonResponse
    {
        $post = Post::create($request->validated());
        return (new PostResource($post))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
    ```

  - Do NOT create custom Action or Service classes for simple single-line Eloquent operations; embrace Laravel's concise elegance where complexity does not justify abstraction.
- **API Resources (`JsonResource`):**
  - Define explicit transformation arrays in `toArray(Request $request)`.
  - Use `whenLoaded('relation')` when including relationships in resources to prevent triggering accidental N+1 lazy loading.
  - Return appropriate HTTP status codes (200 OK, 201 Created, 204 No Content).

## Verification

- Run `php artisan route:list` to verify zero conflicting route paths and correct middleware assignments.
- Test controller endpoints for expected HTTP status codes, correct JSON schema output, and 404 response on non-existent route model bindings.
- Confirm zero raw Eloquent models or array casts are returned directly from controller methods.
