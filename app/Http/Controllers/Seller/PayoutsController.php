<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class PayoutsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $paidItems = OrderItem::query()
            ->with([
                'order:id,payment_status,created_at',
                'product:id,title',
            ])
            ->where('seller_id', $seller->id)
            ->whereHas('order', fn($query) => $query->where('payment_status', 'paid'))
            ->get();

        $payouts = $paidItems
            ->groupBy(function (OrderItem $item) {
                return $item->order?->created_at?->format('Y-m') ?? $item->created_at->format('Y-m');
            })
            ->map(function ($items, string $month) {
                $date = Carbon::createFromFormat('Y-m', $month)->endOfMonth();

                return [
                    'id' => $month,
                    'date' => $date->toDateString(),
                    'amount' => (float) $items->sum('price'),
                    'orders' => $items->count(),
                    'status' => $date->isPast() ? 'completed' : 'processing',
                ];
            })
            ->sortByDesc('date')
            ->values();

        $currentMonth = now()->format('Y-m');

        $upcomingSettlements = $paidItems
            ->filter(function (OrderItem $item) use ($currentMonth) {
                $date = $item->order?->created_at ?? $item->created_at;

                return $date?->format('Y-m') === $currentMonth;
            })
            ->sortByDesc(fn(OrderItem $item) => ($item->order?->created_at ?? $item->created_at)?->timestamp ?? 0)
            ->take(10)
            ->map(function (OrderItem $item) {
                $orderDate = $item->order?->created_at ?? $item->created_at;
                $expectedDate = $orderDate?->copy()->addDays(7);

                return [
                    'id' => $item->id,
                    'product' => $item->product?->title ?? 'Untitled Product',
                    'amount' => (float) $item->price,
                    'date' => $orderDate?->toDateString(),
                    'expected_date' => $expectedDate?->toDateString(),
                    'status' => $expectedDate?->isPast() ? 'completed' : 'pending',
                ];
            })
            ->values();

        return Inertia::render('seller/payouts', [
            'payouts' => $payouts,
            'upcomingSettlements' => $upcomingSettlements,
            'summary' => [
                'total_revenue' => (float) $paidItems->sum('price'),
                'available_balance' => (float) $payouts->where('status', 'completed')->sum('amount'),
                'pending_balance' => (float) $payouts->where('status', 'processing')->sum('amount'),
            ],
        ]);
    }
}
