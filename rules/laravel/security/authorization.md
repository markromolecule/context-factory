---
ruleId: cf-rule-laravel-security-authorization
name: authorization
description: Enforce Laravel Policies, Gates, multi-tenant isolation, and resource ownership verification.
scope: Authorization policies (app/Policies/), Gates, Form Requests, and controllers across Laravel.
stack: laravel
appliesTo: ["app/Policies/**/*.php", "app/Http/Requests/**/*.php", "app/**/Controllers/**/*.php"]
layers: ["security", "authorization"]
alwaysApply: false
---

# Authorization, Policies, Gates, and Multi-Tenant Isolation

- [directive:laravel.security.authorization][mode:automated-blocking][verifier:test] Require server-side authorization and negative-case coverage at policy, request, and controller boundaries.

## Boundaries

- **Never Rely on Client Data for Ownership:** Never determine authorization or data ownership using unverified client-supplied identifiers (e.g. `$request->input('user_id')` or `$request->input('tenant_id')`). Always derive ownership from the authenticated session (`$request->user()->id`).
- **Enforce Policies for Resource Actions (Single Responsibility):** Every model mutation, view, or deletion must be protected by a dedicated Laravel Policy (`app/Policies/<Model>Policy.php`) or Gate. Adhere to [[rules/solid/single-responsibility|Single Responsibility (SRP)]] by keeping authorization rules segregated from controllers and models. Policies have a single reason to change: modifications to authorization logic or model permissions. Never leave endpoints unguarded relying merely on authentication.
- **Form Request Authorization Integration:** When using Form Requests, invoke the relevant policy directly inside the Form Request's `authorize()` method:

  ```php
  public function authorize(): bool
  {
      return $this->user()->can('update', $this->route('project'));
  }
  ```

- **Prevent IDOR Vulnerabilities:** Strictly isolate queries by tenant or user ownership. In multi-tenant systems, enforce global query scopes or explicit tenant scoping on Eloquent queries to prevent Insecure Direct Object References (IDOR).
- **Prohibit In-Controller Ad-Hoc Role Checking:** Never write raw role or permission checks inline across controllers (e.g. `if ($user->role === 'admin')`); encapsulate all authorization logic inside Policies or Gates.

## Behavior

- **Policy Conventions & Auto-Discovery:**
  - Standardize method names in Policies to match RESTful actions: `viewAny`, `view`, `create`, `update`, `delete`, `restore`, `forceDelete`.
  - Type-hint the authenticated `User` model and target resource model:

    ```php
    namespace App\Policies;

    use App\Models\Project;
    use App\Models\User;
    use Illuminate\Auth\Access\Response;

    final class ProjectPolicy
    {
        public function view(User $user, Project $project): bool
        {
            return $user->organization_id === $project->organization_id;
        }

        public function update(User $user, Project $project): Response
        {
            return $user->id === $project->owner_id
                ? Response::allow()
                : Response::deny('You must be the project owner to update project settings.');
        }

        public function delete(User $user, Project $project): bool
        {
            return $user->id === $project->owner_id && $project->status !== ProjectStatus::Archived;
        }
    }
    ```

- **Controller Authorization Methods:**
  - Authorize actions inside controller methods using `$this->authorize('action', $model)` or `$request->user()->can('action', $model)`.
  - For route model binding where authorization is verified via middleware, use the `can:` route middleware:

    ```php
    Route::put('/projects/{project}', [ProjectController::class, 'update'])
        ->middleware('can:update,project');
    ```

- **Super-Admin Bypass Hygiene:**
  - If a system supports administrative overrides, implement the `before(User $user, string $ability): ?bool` hook in the Policy. Always return `null` when the user is not an admin, allowing execution to fall through to specific policy methods.

## Verification

- Write automated feature tests asserting `403 Forbidden` responses when an authenticated user attempts to access or modify resources owned by another user or tenant.
- Test that unauthenticated requests to protected endpoints return `401 Unauthorized` or redirect to the login route.
- Write unit tests for all Policy classes covering allow, deny, and administrative override paths.
