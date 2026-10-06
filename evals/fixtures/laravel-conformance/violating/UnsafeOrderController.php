<?php

declare(strict_types=1);

namespace App\Modules\Orders\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

final class UnsafeOrderController
{
    public function store(Request $request): array
    {
        return Order::all()->toArray();
    }
}
