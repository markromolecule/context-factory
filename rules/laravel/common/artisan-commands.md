---
ruleId: cf-rule-laravel-common-artisan-commands
name: artisan-commands
description: Enforce command signature discipline, safe production confirmation, memory-safe streaming, progress feedback, and action delegation for Laravel Artisan console commands.
scope: All Artisan Console commands (app/Console/Commands/ or routes/console.php) and console scheduling in Laravel applications.
stack: laravel
appliesTo: ["app/Console/**/*.php", "routes/console.php"]
layers: ["commands"]
alwaysApply: false
---

# Laravel Artisan Console Commands

## Boundaries

- [directive:laravel.common.artisan-commands][mode:evidence-blocking][verifier:human-evidence] Keep operational command confirmation, authorization, and batch-safety reviewable at the command boundary.

- **No Unbounded Memory Allocation:** Never invoke `Model::all()` or unbounded `->get()` inside Artisan commands processing collections. Always stream or batch records using `chunkById()`, `lazyById()`, or `cursor()`.
- **Disable Query Logging on Batch Runs:** Always disable the query log (`DB::disableQueryLog()`) before running batch commands to prevent silent out-of-memory crashes caused by logged SQL strings.
- **Production Safety & Confirmation:** Any command that deletes, updates, or mutates data MUST verify the environment. Require explicit confirmation in production (`$this->confirmToProceed()` or `--force` option).
- **Skinny Commands (Single Responsibility & Dependency Inversion):** Adhere to [[rules/solid/single-responsibility|Single Responsibility (SRP)]] by keeping commands focused strictly on CLI interaction: argument parsing, input validation, terminal progress rendering, and exit codes. Inject domain Actions via method injection in `handle()` adhering to [[rules/solid/dependency-inversion|Dependency Inversion (DIP)]], rather than writing complex multi-table business mutations directly inside console classes.
- **Standard Exit Codes:** Always return standard Symfony/Laravel command exit status codes: `Command::SUCCESS` (0), `Command::FAILURE` (1), or `Command::INVALID` (2). Never return arbitrary integers or exit with untyped values.

## Behavior

### Command Structure & Production Confirmation

```php
declare(strict_types=1);

namespace App\Console\Commands;

use App\Actions\Orders\PruneExpiredOrdersAction;
use Illuminate\Console\Command;
use Illuminate\Console\ConfirmableTrait;
use Illuminate\Support\Facades\DB;

final class PruneExpiredOrdersCommand extends Command
{
    use ConfirmableTrait;

    protected $signature = 'orders:prune-expired
                            {--days=30 : Number of days of inactivity before pruning}
                            {--force : Force the operation to run without confirmation}';

    protected $description = 'Prune expired unpaid orders older than the specified threshold.';

    public function handle(PruneExpiredOrdersAction $action): int
    {
        // Require confirmation in production unless --force is provided
        if (! $this->confirmToProceed('Pruning expired orders will permanently remove records.')) {
            $this->warn('Operation cancelled.');
            return Command::FAILURE;
        }

        $days = (int) $this->option('days');
        if ($days < 1) {
            $this->error('The --days option must be greater than 0.');
            return Command::INVALID;
        }

        // Prevent memory exhaustion during batch iteration
        DB::disableQueryLog();

        $this->info("Scanning for orders expired past {$days} days...");

        $prunedCount = $action->execute(
            daysThreshold: $days,
            progressCallback: fn (int $processed) => $this->output->write('.')
        );

        $this->newLine();
        $this->info("Successfully pruned {$prunedCount} expired orders.");

        return Command::SUCCESS;
    }
}
```

### Memory-Safe Batch Processing with Progress Bar

When processing large database tables inside a command or action:

```php
// Good: Memory-safe chunkById with explicit progress bar
$query = Order::where('status', OrderStatus::Expired);
$total = $query->count();

$bar = $this->output->createProgressBar($total);
$bar->start();

$query->chunkById(500, function ($orders) use ($bar): void {
    foreach ($orders as $order) {
        // Process each record
        $order->delete();
        $bar->advance();
    }
});

$bar->finish();
$this->newLine();
```

### Scheduling Hygiene (`routes/console.php`)

In Laravel 11+, define scheduled tasks fluently in `routes/console.php` with overlap protection and background execution:

```php
use Illuminate\Support\Facades\Schedule;

Schedule::command('orders:prune-expired --days=60 --force')
    ->dailyAt('02:00')
    ->withoutOverlapping()
    ->runInBackground()
    ->onFailure(function (): void {
        logger()->critical('Scheduled command orders:prune-expired failed.');
    });
```

## Verification

- Verify all Artisan command signatures follow `<domain>:<verb-noun>` in `kebab-case`.
- Audit commands for `Command::SUCCESS`, `Command::FAILURE`, or `Command::INVALID` return types.
- Confirm any command mutating production data imports `ConfirmableTrait` and checks `$this->confirmToProceed()`.
- Ensure large dataset operations call `DB::disableQueryLog()` and utilize `chunkById()` or lazy cursor streaming.
- Run `php artisan test` (or Pest) to verify command unit and feature tests assert correct exit codes: `$this->artisan('orders:prune-expired')->assertSuccessful();`.
