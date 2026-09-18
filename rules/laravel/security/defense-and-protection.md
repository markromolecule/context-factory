---
name: defense-and-protection
description: Standardize rate limiting, secure file upload defense, output escaping, and CSRF protection.
scope: Security defenses, file uploads, rate limiters, Blade escaping, and input sanitization across Laravel.
alwaysApply: true
---

# Application Defense, Rate Limiting, Uploads, and Protection

## Boundaries

- **Mandatory Rate Limiting:** Enforce strict rate limiting on all authentication, password reset, checkout, OTP verification, and public API endpoints using Laravel's `RateLimiter` and `throttle` middleware to prevent credential stuffing and brute-force attacks.
- **Secure File Upload Discipline:**
  - Never trust client-provided file extensions (`getClientOriginalExtension()`) or MIME types (`getClientMimeType()`).
  - Validate uploads using strict server-side MIME detection (`mimetypes:image/jpeg,image/png,application/pdf`) and size caps (`max:10240`).
  - Store uploaded files on a private filesystem disk (`Storage::disk('private')` or S3 private bucket) by default. Generate cryptographically secure random filenames via `$file->hashName()`; never retain user-supplied filenames directly on disk.
  - Deliver private files using temporary signed URLs (`Storage::temporaryUrl(...)`) or controller response streaming (`Storage::download(...)`) with authorization checks.
- **Strict Output Escaping:** Always use standard Blade double-curly escaping (`{{ $untrustedInput }}`) for rendering variables in views. Strictly prohibit unescaped `{!! $rawInput !!}` syntax unless the content has been rigorously sanitized with a trusted HTML purification library (e.g. HTMLPurifier).
- **CSRF Protection:** Keep Laravel's default `VerifyCsrfToken` middleware active on all state-altering web routes (`POST`, `PUT`, `PATCH`, `DELETE`). Never disable CSRF globally; exclude specific webhook routes only when protected by cryptographic signature verification (e.g. Stripe or GitHub webhook HMAC).
- **SQL Injection Defense:** Never concatenate unescaped input or user variables into `DB::raw()`, `whereRaw()`, or `orderByRaw()`. Always pass dynamic parameters via PDO positional bindings (`whereRaw('status = ? AND total > ?', [$status, $total])`).

## Behavior

- **Rate Limiter Configuration:**
  - Define custom rate limiters in `AppServiceProvider` or `bootstrap/app.php`:

    ```php
    use Illuminate\Cache\RateLimiting\Limit;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\RateLimiter;

    RateLimiter::for('api', function (Request $request): Limit {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    RateLimiter::for('login', function (Request $request): Limit {
        $key = Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());
        return Limit::perMinute(5)->by($key);
    });
    ```

- **Secure Upload Handling Pattern:**
  - Handle file uploads inside dedicated Form Requests and Controllers:

    ```php
    public function store(UploadAvatarRequest $request): JsonResponse
    {
        $file = $request->file('avatar');
        $path = $file->store('avatars', 'private');

        $request->user()->update([
            'avatar_path' => $path,
        ]);

        return response()->json(['message' => 'Avatar uploaded successfully']);
    }
    ```

## Verification

- Run automated tests sending repeated requests to throttled endpoints and assert that a `429 Too Many Requests` response is returned when the threshold is exceeded.
- Test that uploading executable files (e.g. `.php`, `.sh`, `.exe`, `.svg` with embedded scripts) is blocked by validation and rejects with `422 Unprocessable Entity`.
- Verify that POST requests without a valid CSRF token fail with `419 Page Expired`.
- Audit all instances of `DB::raw`, `whereRaw`, and `{!!` to verify zero injection vulnerabilities or unsanitized output.
