---
ruleId: cf-rule-laravel-presentation-blade-and-components
name: blade-and-components
description: Enforce component-first Blade architecture, layout slots, attribute passing, and Vite asset pipeline integration.
scope: Blade templates (resources/views/), Blade components, layout slots, and frontend assets in Laravel.
stack: laravel
appliesTo: ["resources/views/**/*.blade.php", "resources/js/**/*.js"]
layers: ["presentation"]
alwaysApply: false
---

# Blade Templates, Components, Layout Slots, and Assets

- [directive:laravel.presentation.blade-components][mode:advisory][verifier:none] Keep Blade composition, layout slots, and assets within presentation boundaries.

## Boundaries

- **Component-First Architecture (Open/Closed Principle):** Adopt component-first Blade composition (`<x-component />`) over legacy `@include` and `@extends`/`@section` inheritance. Blade components adhere to [[rules/solid/open-closed|Open/Closed (OCP)]]: base components are closed for internal modification but open for extension through typed `@props`, attribute merging (`$attributes->merge(...)`), and named slots. Reusable UI elements, alerts, form controls, modals, and page layouts must be organized as Blade components in `resources/views/components/`.
- **Pure Presentation Discipline (Single Responsibility):** Strictly enforce [[rules/solid/single-responsibility|Single Responsibility (SRP)]] on views. Blade templates must remain strictly focused on display and layout. Never execute database queries (e.g. `User::all()`), perform complex business calculations, or trigger side-effects inside Blade templates. Prepare all data in the Controller, Form Request, or dedicated View Component class.
- **Layout Slots:** Use slot-based layout components (`<x-app-layout> <x-slot:title>Dashboard</x-slot:title> ... </x-app-layout>`) to structure page scaffolding. This eliminates fragile string-based `@yield` sections.
- **Vite Asset Pipeline:** Load all frontend CSS, JavaScript, and fonts exclusively through Laravel Vite (`@vite(['resources/css/app.css', 'resources/js/app.js'])`). Never hardcode direct script tags to public assets or uncompiled bundles.

## Behavior

- **Blade Component Structure:**
  - Define components with typed `@props` and merged HTML attributes:

    ```blade
    {{-- resources/views/components/button.blade.php --}}
    @props([
        'variant' => 'primary',
        'type' => 'button',
    ])

    @php
    $classes = match($variant) {
        'primary' => 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm',
        'secondary' => 'bg-white hover:bg-gray-50 text-gray-900 ring-1 ring-inset ring-gray-300',
        'danger' => 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    };
    @endphp

    <button type="{{ $type }}" {{ $attributes->merge(['class' => "rounded-md px-3.5 py-2.5 text-sm font-semibold transition focus-visible:outline {$classes}"]) }}>
        {{ $slot }}
    </button>
    ```

- **Class-Based Components for Complex UI:**
  - When a component requires dependency injection, data fetching from configuration, or complex view data transformation, extract a class-based component in `app/View/Components/`:

    ```php
    namespace App\View\Components;

    use Closure;
    use Illuminate\Contracts\View\View;
    use Illuminate\View\Component;

    final class NavigationMenu extends Component
    {
        public function __construct(
            public readonly string $activeItem,
        ) {}

        public function render(): View|Closure|string
        {
            return view('components.navigation-menu', [
                'menuItems' => config('navigation.main'),
            ]);
        }
    }
    ```

- **Error and Session Flash Feedback:**
  - Standardize validation error display and flash messages via reusable components (`<x-input-error :messages="$errors->get('email')" />` and `<x-flash-banner />`).

## Verification

- Test component rendering using Laravel's `$this->blade('<x-button variant="danger">Delete</x-button>')` view test helper.
- Verify that Blade templates contain zero static database queries (`Model::find()`) or service locator calls (`app(...)`).
- Run `npm run build` to ensure the Vite asset bundle compiles with zero missing module or CSS syntax errors.
