<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrdersController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items.product', 'items.product.seller'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('customer/orders', [
            'orders' => $orders,
        ]);
    }
}
