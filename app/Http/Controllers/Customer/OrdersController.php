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
        $baseQuery = Order::where('user_id', Auth::id());

        $orders = $baseQuery
            ->with(['items.product', 'items.product.seller'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('customer/orders', [
            'orders' => $orders,
            'summary' => [
                'total_orders' => (clone $baseQuery)->count(),
                'paid_orders' => (clone $baseQuery)->where('payment_status', 'paid')->count(),
                'pending_orders' => (clone $baseQuery)->where('payment_status', 'pending')->count(),
                'total_spent' => (float) (clone $baseQuery)->where('payment_status', 'paid')->sum('total_price'),
            ],
        ]);
    }
}
