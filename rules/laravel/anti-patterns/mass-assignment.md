---
ruleId: cf-rule-laravel-anti-patterns-mass-assignment
name: mass-assignment
description: Prevent mass-assignment vulnerabilities by banning raw request->all() and mandating Form Request validated data.
scope: Eloquent model persistence, controllers, actions, and Form Requests.
stack: laravel
appliesTo: ["app/**/*.php"]
layers: ["security", "controllers", "services"]
alwaysApply: false
---

# Mass-Assignment Security Hole Anti-Pattern

- [directive:laravel.anti-patterns.mass-assignment][mode:automated-blocking][verifier:test] Require validated request data at Eloquent persistence boundaries.

Mass assignment occurs when client-provided HTTP payload data (`$request->all()` or raw `$request->input()`) is passed directly into Eloquent persistence methods (`Model::create()`, `Model::update()`, or `Model::fill()`). Without strict input gatekeeping, malicious clients can inject arbitrary database fields (e.g. `is_admin`, `role`, `account_balance`, `tenant_id`) leading to privilege escalation or unauthorized data modification.

## Boundaries

- **MUST NOT:** Pass `$request->all()` or unvalidated `$request->input()` directly into `Model::create()`, `Model::update()`, or `Model::fill()`.
- **MUST NOT:** Rely on empty `$guarded = []` across models without explicit validation gates in Form Requests.
- **MUST:** Validate all incoming HTTP payloads via dedicated Form Request classes.
- **MUST:** Extract data for persistence strictly via `$request->validated()` or explicit typed getters (`$request->string(...)`).
- **MUST:** Define `$fillable` explicitly on all Eloquent models defining permitted write attributes.

## Why It Fails

1. **Privilege Escalation:** If a user profile update endpoint passes `$request->all()` to `$user->update(...)`, an attacker can send `{"is_admin": true, "role": "super-admin"}` to grant themselves administrator privileges.
2. **Silent Unintended Overwrites:** Unintended fields (e.g. `email_verified_at`, `subscription_tier`, `created_at`) can be manipulated if inadvertently included in the request payload.
3. **Broken Guardrails:** Leaving `$guarded = []` removes model-level defensive barriers, making application security entirely dependent on every developer remembering to whitelist keys in controllers.

## Concrete Remediations

### Bad: Raw `$request->all()` Mass Assignment

```php
// DANGEROUS: If a malicious user sends {"is_admin": true}, they become admin!
public function store(Request $request): User
{
    return User::create($request->all());
}

public function update(Request $request, User $user): User
{
    $user->update($request->all()); // Critical vulnerability!
    return $user;
}
```

### Good: Dedicated Form Request with `$request->validated()`

```php
declare(strict_types=1);

namespace App\Modules\Users\Requests;

use App\Modules\Users\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

final class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'password' => ['required', 'string', 'min:8'],
            // Notice: is_admin, role, and balance are deliberately omitted!
        ];
    }
}

// Controller: Only validated keys are persisted
namespace App\Modules\Users\Controllers;

use App\Modules\Users\Models\User;
use App\Modules\Users\Requests\StoreUserRequest;
use App\Modules\Users\Resources\UserResource;

final class UserController
{
    public function store(StoreUserRequest $request): UserResource
    {
        // SECURE: $request->validated() returns ONLY keys explicitly defined in rules()
        $user = User::create($request->validated());

        return new UserResource($user);
    }
}
```

## SOLID Principles Alignment

- **[[rules/solid/single-responsibility|Single Responsibility Principle (SRP)]]:** Form Requests isolate incoming request authorization and data validation into dedicated gatekeeper classes. Models remain focused purely on entity persistence, preventing presentation parameters from polluting database operations.

## Verification

- Search the codebase for `::create($request->all())` or `->update($request->all())`; verify zero occurrences exist.
- Write automated tests submitting unauthorized attributes (e.g. `{"is_admin": true}`) to verify they are silently dropped by `$request->validated()`.
- Confirm all Eloquent models define explicit `$fillable` arrays.
