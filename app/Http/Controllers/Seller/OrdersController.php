<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrdersController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $orderItems = OrderItem::query()
            ->with([
                'order:id,user_id,payment_status,payment_method,created_at',
                'order.user:id,name,email',
                'product:id,title',
            ])
            ->where('seller_id', $seller->id)
            ->latest()
            ->paginate(12)
            ->through(function (OrderItem $item) {
                $paymentStatus = $item->order?->payment_status ?? 'pending';

                $status = match ($paymentStatus) {
                    'paid' => 'completed',
                    'failed', 'expired' => 'failed',
                    default => 'pending',
                };

                return [
                    'id' => $item->id,
                    'order_code' => 'ORD-' . str_pad((string) $item->order_id, 4, '0', STR_PAD_LEFT),
                    'product_title' => $item->product?->title ?? 'Untitled Product',
                    'buyer_name' => $item->order?->user?->name ?? 'Customer',
                    'buyer_email' => $item->order?->user?->email ?? '-',
                    'amount' => (float) $item->price,
                    'payment_method' => $item->order?->payment_method ?? '-',
                    'payment_status' => $paymentStatus,
                    'status' => $status,
                    'created_at' => $item->order?->created_at?->toDateTimeString() ?? $item->created_at->toDateTimeString(),
                ];
            });

        return Inertia::render('seller/orders', [
            'orders' => $orderItems,
            'summary' => [
                'total_orders' => OrderItem::query()->where('seller_id', $seller->id)->count(),
                'completed_orders' => OrderItem::query()
                    ->where('seller_id', $seller->id)
                    ->whereHas('order', fn($query) => $query->where('payment_status', 'paid'))
                    ->count(),
                'pending_orders' => OrderItem::query()
                    ->where('seller_id', $seller->id)
                    ->whereHas('order', fn($query) => $query->where('payment_status', 'pending'))
                    ->count(),
            ],
        ]);
    }
}
