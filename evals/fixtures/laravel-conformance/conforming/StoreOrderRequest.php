<?php

declare(strict_types=1);

namespace App\Modules\Orders\Requests;

use Illuminate\Foundation\Http\FormRequest;

final class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Order::class) ?? false;
    }

    public function rules(): array
    {
        return ['customer_id' => ['required', 'integer']];
    }
}
