---
name: async-and-events
description: Standardize queued jobs, domain event dispatching, cache stampede prevention, and resilient HTTP client calls.
scope: Queued jobs, event listeners, Cache operations, and external HTTP client interactions across Laravel.
alwaysApply: false
---

# Asynchronous Workloads, Events, Caching, and Resilient HTTP

## Boundaries

- **Offload Heavy Network I/O:** Always offload non-blocking operations—such as sending customer emails, webhook deliveries, third-party API syncs, image processing, and report exports—to queued jobs implementing `ShouldQueue`. Never perform slow or blocking network operations inside synchronous HTTP request-response cycles.
- **Queue Job Resilience:** Every queued job must configure explicit runtime resilience properties: `$tries`, `$backoff`, `$timeout`, and a `failed(\Throwable $exception)` callback. Unbounded retry loops without backoff exhaust queue workers and overwhelm downstream APIs.
- **Cache Stampede Prevention:** Never perform expensive database queries without protection against dog-piling / stampedes. Use `Cache::remember()` with sensible TTLs, or atomic locks (`Cache::lock()`) for high-concurrency recomputation.
- **Resilient HTTP Client:** All external HTTP interactions must use Laravel's built-in `Http` client (`Illuminate\Support\Facades\Http`) with explicit timeouts, connection timeouts, and automatic retry policies. Never use PHP's raw `curl_*` functions or `file_get_contents()`.

## Behavior

- **Queued Job Design:**
  - Pass model identifiers or lightweight scalars into job constructors, allowing `SerializesModels` to cleanly reload fresh database state when the job executes:

    ```php
    namespace App\Jobs;

    use App\Models\Order;
    use Illuminate\Bus\Queueable;
    use Illuminate\Contracts\Queue\ShouldQueue;
    use Illuminate\Foundation\Bus\Dispatchable;
    use Illuminate\Queue\InteractsWithQueue;
    use Illuminate\Queue\SerializesModels;
    use Throwable;

    final class GenerateOrderReceiptJob implements ShouldQueue
    {
        use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

        public int $tries = 3;
        public int $timeout = 60;
        public array $backoff = [10, 30, 60];

        public function __construct(
            public readonly Order $order,
        ) {}

        public function handle(ReceiptGenerator $generator): void
        {
            $generator->generateFor($this->order);
        }

        public function failed(?Throwable $exception): void
        {
            logger()->error('Order receipt generation failed', [
                'order_id' => $this->order->id,
                'error' => $exception?->getMessage(),
            ]);
        }
    }
    ```

- **Domain Events & Open/Closed Principle (OCP):**
  - Strictly adhere to the [[rules/solid/open-closed|Open/Closed Principle (OCP)]] by decoupling primary business mutations from downstream reactions using Events and Listeners. Extend system behavior (e.g. adding notifications, analytics, or CRM syncs) by attaching new Listeners rather than modifying core Action classes.
  - Implement `ShouldQueue` on event listeners (`class SendOrderConfirmationNotification implements ShouldQueue`) so event dispatching remains non-blocking and instantaneous for the end user.
- **Resilient HTTP Client Configuration:**
  - Enforce timeout boundaries and exponential backoff retry:

    ```php
    use Illuminate\Support\Facades\Http;

    $response = Http::timeout(5)
        ->connectTimeout(2)
        ->retry(3, 100, throw: false)
        ->withToken(config('services.external.token'))
        ->post('https://api.external.com/v1/sync', $payload);

    if ($response->failed()) {
        throw new ExternalServiceException("Service error: {$response->status()}");
    }
    ```

## Verification

- Test queued jobs using `Queue::fake()` to verify that jobs are pushed onto the expected queue with correct parameters.
- Test event dispatching using `Event::fake()` to confirm downstream listeners are triggered without executing synchronous side-effects.
- Mock external HTTP calls using `Http::fake()` to verify retry behavior, timeout handling, and failure path exceptions.
- Verify `Cache::remember()` returns cached results on repeated queries without querying the underlying database.
