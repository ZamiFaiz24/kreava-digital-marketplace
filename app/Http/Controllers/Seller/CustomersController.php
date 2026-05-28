<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomersController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $baseQuery = OrderItem::query()
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('users', 'users.id', '=', 'orders.user_id')
            ->where('order_items.seller_id', $seller->id);

        $customers = (clone $baseQuery)
            ->selectRaw('users.id as user_id, users.name, users.email, MIN(orders.created_at) as first_order_at, MAX(orders.created_at) as last_order_at, COUNT(order_items.id) as orders_count, SUM(CASE WHEN orders.payment_status = "paid" THEN order_items.price ELSE 0 END) as total_spent')
            ->groupBy('users.id', 'users.name', 'users.email')
            ->orderByDesc('total_spent')
            ->paginate(12)
            ->through(function ($row) {
                return [
                    'user_id' => (int) $row->user_id,
                    'name' => $row->name,
                    'email' => $row->email,
                    'orders_count' => (int) $row->orders_count,
                    'total_spent' => (float) $row->total_spent,
                    'first_order_at' => $row->first_order_at,
                    'last_order_at' => $row->last_order_at,
                ];
            });

        $totalCustomers = (clone $baseQuery)
            ->distinct('orders.user_id')
            ->count('orders.user_id');

        $activeThisMonth = (clone $baseQuery)
            ->whereBetween('orders.created_at', [now()->startOfMonth(), now()])
            ->distinct('orders.user_id')
            ->count('orders.user_id');

        $repeatCustomers = DB::query()
            ->fromSub(
                (clone $baseQuery)
                    ->selectRaw('orders.user_id, COUNT(order_items.id) as order_count')
                    ->groupBy('orders.user_id'),
                'customer_orders'
            )
            ->where('order_count', '>', 1)
            ->count();

        return Inertia::render('seller/customers', [
            'customers' => $customers,
            'summary' => [
                'total_customers' => (int) $totalCustomers,
                'active_this_month' => (int) $activeThisMonth,
                'repeat_customers' => (int) $repeatCustomers,
            ],
        ]);
    }
}
