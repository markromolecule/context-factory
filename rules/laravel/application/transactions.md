---
name: transactions
description: Enforce atomic database transaction boundaries, deadlock handling, and side-effect isolation.
scope: Database transactions, state mutations, concurrency locking, and external side-effects in Laravel.
alwaysApply: false
---

# Database Transactions and Concurrency Safety

## Boundaries

- **Atomic State Mutations (Single Responsibility):** Encapsulate multi-table writes, state transitions, or dependent balance changes within a dedicated Invokable Action executing a `DB::transaction()` boundary. Adhere to [[rules/solid/single-responsibility|Single Responsibility (SRP)]] by separating atomic database consistency guarantees from transport controllers, jobs, and console commands.
- **Isolate External Side-Effects:** Never execute blocking network I/O, external HTTP calls (payment gateways, third-party APIs), or synchronous email deliveries inside a database transaction closure. If an external call hangs or fails, the database connection locks and holds open uncommitted rows, leading to connection starvation and deadlocks.
- **Commit Callbacks for Events:** Dispatch external side-effects and queue jobs strictly after transaction success using `DB::afterCommit(...)` callbacks or model events configured with `$afterCommit = true`.
- **Automatic Deadlock Retry:** Always configure the `$attempts` parameter on `DB::transaction(fn () => ..., attempts: 3)` to ensure transient deadlocks in concurrent workloads are automatically retried safely.
- **Fail Fast on Errors:** Never catch and swallow exceptions inside a transaction closure unless deliberately re-throwing; allow unhandled exceptions to bubble so Laravel automatically rolls back the active transaction.

## Behavior

- **Transaction Closure Pattern:**
  - Prefer the closure-based `DB::transaction()` syntax over manual `DB::beginTransaction()` / `DB::commit()` / `DB::rollBack()` to prevent unclosed transaction leaks when unexpected exceptions occur:

    ```php
    use App\Models\Invoice;
    use App\Models\Payment;
    use Illuminate\Support\Facades\DB;

    final readonly class RecordInvoicePayment
    {
        public function __invoke(Invoice $invoice, int $amountCents, string $transactionRef): Payment
        {
            return DB::transaction(function () use ($invoice, $amountCents, $transactionRef): Payment {
                $payment = Payment::create([
                    'invoice_id' => $invoice->id,
                    'amount_cents' => $amountCents,
                    'reference' => $transactionRef,
                ]);

                $invoice->increment('paid_cents', $amountCents);

                if ($invoice->paid_cents >= $invoice->total_cents) {
                    $invoice->update(['status' => InvoiceStatus::Paid]);
                }

                // Dispatch side-effect strictly after transaction commits
                DB::afterCommit(function () use ($invoice, $payment): void {
                    event(new InvoicePaymentRecorded($invoice, $payment));
                });

                return $payment;
            }, attempts: 3);
        }
    }
    ```

- **Pessimistic Locking for Race Conditions:**
  - Use pessimistic locking (`lockForUpdate()`) inside transactions when reading data that must be mutated based on its current value (e.g. seat reservations, wallet balances, voucher redemption limits):

    ```php
    $wallet = Wallet::where('user_id', $user->id)
        ->lockForUpdate()
        ->firstOrFail();

    if ($wallet->balance_cents < $amount) {
        throw new InsufficientFundsException();
    }

    $wallet->decrement('balance_cents', $amount);
    ```

## Verification

- Write automated tests with simulated failures inside transaction closures to confirm all database writes roll back completely.
- Verify through code reviews that no external HTTP requests (`Http::get()`, `Http::post()`) or mail sends (`Mail::send()`) occur within `DB::transaction()` closures.
- Write concurrency tests simulating parallel updates to verify that pessimistic locks (`lockForUpdate()`) prevent double-spend or negative balances.
