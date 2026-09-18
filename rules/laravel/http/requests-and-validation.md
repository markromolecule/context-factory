---
name: requests-and-validation
description: Enforce dedicated Form Requests, strict validated data extraction, custom validation rules, and input security.
scope: HTTP requests, Form Requests, validation rules, and request sanitization.
alwaysApply: true
---

# Requests and Validation

## Boundaries

- **Single Responsibility Principle (SRP):** Form Requests isolate HTTP request payload authorization and validation rules from transport handling and domain mutation. This adheres to [[rules/solid/single-responsibility|Single Responsibility (SRP)]] by preventing controller action bloat and safeguarding domain logic from untrusted input.
- Encapsulate all incoming HTTP validation logic inside dedicated Form Request classes (`app/Http/Requests/`); never place inline `$request->validate([...])` arrays inside controller methods for store/update endpoints.
- Extract request data strictly via `$request->validated()`; never pass `$request->all()` or untyped `$request->input()` directly into Eloquent models or application actions to eliminate mass-assignment vulnerabilities. See [[rules/laravel/common/anti-patterns|Laravel Anti-Patterns Guide]].
- Authorize the request in the Form Request's `authorize()` method using Policies (`return $this->user()->can('update', $this->route('post'));`) or return `true` if authorization is handled exclusively via route middleware.
- Never perform database mutations, session manipulation, or external API calls inside Form Request classes.

## Behavior

- **Form Request Conventions:**
  - Name requests descriptively matching their controller action: `StoreOrderRequest`, `UpdateUserProfileRequest`, `BulkDeleteItemsRequest`.
  - Define rules in `rules(): array` using array syntax instead of pipe-delimited strings to prevent subtle regex parsing bugs:

    ```php
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user())],
            'status' => ['required', Rule::enum(OrderStatus::class)],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
    ```

- **Type-Safe Accessors:**
  - Utilize Laravel's typed request methods for queries and filtering: `$request->boolean('is_active')`, `$request->date('start_date')`, `$request->enum('status', OrderStatus::class)`.
- **Custom Validation Rules (Open/Closed & Interface Segregation):**
  - When validation logic requires complex checks or external verification, generate an invokable rule implementing `\Illuminate\Contracts\Validation\ValidationRule` (`app/Rules/ValidTaxId.php`).
  - Adhere to [[rules/solid/open-closed|Open/Closed (OCP)]] and [[rules/solid/interface-segregation|Interface Segregation (ISP)]] by creating single-method, focused validation rules that extend validation behavior without altering core validator mechanics.
  - Keep custom validation rules pure and deterministic; avoid heavy database transactions inside validation passes.
- **Request Preparation & Sanitization:**
  - Normalize or sanitize inputs (e.g. trimming whitespace, stripping non-digit phone characters) in `prepareForValidation()` before rules execute.

## Verification

- Write feature tests testing Form Request validation: assert HTTP 422 with exact validation field errors when invalid data is provided.
- Write tests verifying that unvalidated request parameters are discarded by `$request->validated()`.
- Test that unauthorized requests trigger HTTP 403 Forbidden before reaching controller execution.
