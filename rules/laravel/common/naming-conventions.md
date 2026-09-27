---
name: naming-conventions
description: Enforce canonical Laravel naming conventions across models, tables, relationships, controllers, requests, resources, policies, events, jobs, routes, and artisan commands.
scope: All PHP classes, database migrations, routes, views, components, and configuration in Laravel applications.
alwaysApply: true
---

# Laravel Naming Conventions

## Boundaries

- **Strict Framework Idioms:** Never invent bespoke casing or arbitrary abbreviations that deviate from standard Laravel conventions.
- **Singular Models & Plural Tables:** Model classes MUST be singular `PascalCase` (`User`, `OrderItem`). Database tables MUST be plural `snake_case` (`users`, `order_items`).
- **Alphabetical Pivot Tables:** Many-to-many pivot tables MUST be singular `snake_case` in alphabetical order of the joined entities (`role_user`, `course_student`).
- **Singular vs Plural Relationships:**
  - Single-record relations (`belongsTo`, `hasOne`, `morphOne`, `hasOneThrough`) MUST use singular `camelCase` (`user()`, `profile()`).
  - Multi-record relations (`hasMany`, `belongsToMany`, `morphMany`, `hasManyThrough`) MUST use plural `camelCase` (`orders()`, `roles()`).
- **RESTful Casing:** Route URLs MUST be `kebab-case` (`/order-items`). Route names MUST use dot notation (`orders.index`, `orders.show`).
- **Single-Action Invokables (Single Responsibility):** Single-action controllers MUST be named with an action verb + noun + `Controller` (`DownloadInvoiceController`, `ExportUsersController`) and implement `__invoke()`, upholding [[rules/solid/single-responsibility|Single Responsibility (SRP)]] for non-resourceful endpoints.

## Behavior

### Canonical Naming Matrix

| Architectural Layer | Convention | Pattern / Example | File Path & Artifact |
| :--- | :--- | :--- | :--- |
| **Eloquent Models** | Singular `PascalCase` | `User`, `OrderItem`, `PostComment` | `app/Modules/Orders/Models/OrderItem.php` |
| **Database Tables** | Plural `snake_case` | `users`, `order_items`, `post_comments` | Migration: `database/migrations/YYYY_MM_DD_create_order_items_table.php` |
| **Pivot Tables** | Singular `snake_case` (alphabetical) | `role_user`, `course_student`, `tag_video` | Migration: `database/migrations/YYYY_MM_DD_create_role_user_table.php` |
| **Primary Keys** | Lowercase identifier | `id` (or `ulid`, `uuid` if project-wide) | `$table->id();` or `$table->ulid('id');` |
| **Foreign Keys** | `<model_singular>_id` | `user_id`, `order_item_id`, `author_id` | `$table->foreignId('user_id')->constrained();` |
| **Polymorphic Keys** | `<morphable>_id` & `<morphable>_type` | `commentable_id`, `commentable_type` | `$table->morphs('commentable');` |
| **Timestamp Columns** | Lowercase `snake_case` | `created_at`, `updated_at`, `deleted_at`, `verified_at` | `$table->timestamps();`, `$table->softDeletes();` |
| **Boolean Columns** | Verb prefix (`is_*`, `has_*`, `should_*`) | `is_active`, `has_discount`, `is_published` | `$table->boolean('is_active')->default(true);` |
| **Relationship Methods** | Singular / Plural `camelCase` | Singular: `user()`, `shippingAddress()`<br>Plural: `items()`, `roles()` | Eloquent Model methods |
| **Resource Controllers** | Singular entity + `Controller` | `OrderController`, `UserProfileController` | `app/Modules/Orders/Controllers/OrderController.php` |
| **Invokable Controllers** | `<Verb><Noun>Controller` | `StoreOrderController`, `DownloadInvoiceController` | `app/Modules/Orders/Controllers/StoreOrderController.php` |
| **Invokable Actions** | Imperative action phrase | `ProcessOrderCheckout`, `RegisterUser` | `app/Modules/Orders/Actions/ProcessOrderCheckout.php` |
| **RESTful Controller Actions** | Standard 7 verbs only | `index`, `create`, `store`, `show`, `edit`, `update`, `destroy` | Public controller methods |
| **Form Requests** | `<Action><Model>Request` | `StoreOrderRequest`, `UpdateProfileRequest` | `app/Modules/Orders/Requests/StoreOrderRequest.php` |
| **API Resources** | `<Model>Resource` | `OrderResource`, `UserProfileResource` | `app/Modules/Orders/Resources/OrderResource.php` |
| **Resource Collections** | `<Model>Collection` | `OrderCollection` (or anonymous resource collections) | `app/Modules/Orders/Resources/OrderCollection.php` |
| **Authorization Policies** | `<Model>Policy` | `OrderPolicy`, `PostPolicy` | `app/Modules/Orders/Policies/OrderPolicy.php` |
| **Policy Methods** | Standard CRUD or ability verbs | `viewAny`, `view`, `create`, `update`, `delete`, `restore`, `forceDelete` | Policy method signatures |
| **Domain Events** | Past tense noun / state change | `OrderShipped`, `UserRegistered`, `InvoicePaymentFailed` | `app/Modules/Orders/Events/OrderShipped.php` |
| **Event Listeners** | Imperative action phrase | `SendShipmentNotification`, `AssignDefaultRole` | `app/Modules/Orders/Listeners/SendShipmentNotification.php` |
| **Queued Jobs** | Imperative action phrase | `ProcessPodcast`, `GenerateMonthlyInvoices`, `SendDigestEmail` | `app/Modules/Podcasts/Jobs/ProcessPodcast.php` |
| **Mailables** | Noun / Event + `Mail` | `InvoicePaidMail`, `WelcomeEmail` | `app/Modules/Billing/Mail/InvoicePaidMail.php` |
| **Notifications** | Event / Subject + `Notification` | `InvoicePaidNotification`, `PasswordResetNotification` | `app/Modules/Billing/Notifications/InvoicePaidNotification.php` |
| **Backed Enums** | Singular `PascalCase` with `PascalCase` cases | `enum OrderStatus: string { case Pending = 'pending'; }` | `app/Modules/Orders/Enums/OrderStatus.php` |
| **Artisan Command Class** | Imperative phrase + `Command` | `PruneExpiredOrdersCommand`, `SyncStripePlansCommand` | `app/Modules/Orders/Commands/PruneExpiredOrdersCommand.php` |
| **Artisan Signature** | `<domain>:<verb-noun>` (`kebab-case`) | `orders:prune-expired`, `stripe:sync-plans` | `protected $signature = 'orders:prune-expired';` |
| **Route URLs** | Plural `kebab-case` with `/api/v1` prefix | `/api/v1/orders`, `/api/v1/orders/{order}` | Co-located `app/Modules/Orders/routes.php` |
| **Route Names** | Dot notation `plural.action` | `orders.index`, `orders.store`, `orders.show` | Clean dot notation (never prefix with `modules.`) |
| **Blade Views** | `kebab-case.blade.php` (modular/nested with dots) | `resources/views/modules/orders/show.blade.php` | `view('modules.orders.show')` |
| **Blade Components** | `kebab-case` with dot/colon namespace | `<x-ui.button>`, `<x-forms.input>`, `<x-layouts.app>` | `resources/views/components/ui/button.blade.php` |
| **Configuration Files** | `kebab-case.php` | `config/services.php`, `config/payment-gateways.php` | Read via `config('payment-gateways.stripe.key')` |
| **Environment Variables** | `SCREAMING_SNAKE_CASE` with vendor prefix | `APP_NAME`, `STRIPE_SECRET_KEY`, `AWS_BUCKET` | `.env`, `.env.example` |

### Expressive Relationship Method Examples

```php
declare(strict_types=1);

namespace App\Modules\Orders\Models;

use App\Modules\Billing\Models\Invoice;
use App\Modules\Tags\Models\Tag;
use App\Modules\Users\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

final class Order extends Model
{
    // Singular: BelongsTo
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Singular: HasOne
    public function invoice(): HasOne
    {
        return $this->hasOne(Invoice::class);
    }

    // Plural: HasMany
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Plural: BelongsToMany (Pivot table: order_tag)
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
```

## Verification

- Audit model classes to verify singular `PascalCase` naming.
- Verify migrations use plural `snake_case` table names and alphabetically ordered pivot tables (`role_user`).
- Verify route definitions use `kebab-case` paths and dot notation names (`orders.index`).
- Run `vendor/bin/pint --test` to confirm PSR-12 and Pint casing compliance across all files.
