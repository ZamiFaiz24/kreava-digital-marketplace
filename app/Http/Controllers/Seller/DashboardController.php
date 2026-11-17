<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Payout;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $seller = Seller::query()
            ->with('user:id,name,email,avatar,created_at')
            ->where('user_id', $user->id)
            ->firstOrFail();

        $now = now();
        $currentMonthStart = $now->copy()->startOfMonth();
        $previousMonthStart = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $previousMonthEnd = $now->copy()->subMonthNoOverflow()->endOfMonth();

        $currentMetrics = $this->metricsForPeriod($seller->id, $currentMonthStart, $now->copy());
        $previousMetrics = $this->metricsForPeriod($seller->id, $previousMonthStart, $previousMonthEnd);

        $totalRevenueAllTime = (float) OrderItem::query()
            ->where('seller_id', $seller->id)
            ->whereHas('order', fn ($query) => $query->where('payment_status', 'paid'))
            ->sum('price');

        $paidOut = (float) Payout::query()
            ->where('seller_id', $seller->id)
            ->where('status', 'paid')
            ->sum('amount');

        $pendingPayout = (float) Payout::query()
            ->where('seller_id', $seller->id)
            ->where('status', 'pending')
            ->sum('amount');

        $availablePayout = max(0, round($totalRevenueAllTime - $paidOut - $pendingPayout, 2));

        $pendingOrders = (int) OrderItem::query()
            ->where('seller_id', $seller->id)
            ->whereHas('order', fn ($query) => $query->where('payment_status', 'pending'))
            ->distinct()
            ->count('order_id');

        $weeklyRevenueData = collect(range(6, 0))
            ->map(function (int $daysAgo) use ($seller, $now) {
                $date = $now->copy()->subDays($daysAgo)->startOfDay();
                $end = $date->copy()->endOfDay();

                $point = OrderItem::query()
                    ->where('seller_id', $seller->id)
                    ->whereHas('order', fn ($query) => $query
                        ->where('payment_status', 'paid')
                        ->whereBetween('created_at', [$date, $end]))
                    ->selectRaw('COALESCE(SUM(price), 0) as revenue, COUNT(*) as sales')
                    ->first();

                return [
                    'date' => $date->toDateString(),
                    'revenue' => (float) ($point->revenue ?? 0),
                    'sales' => (int) ($point->sales ?? 0),
                ];
            })
            ->values();

        $monthlyRevenueData = collect(range(5, 0))
            ->map(function (int $monthsAgo) use ($seller, $now) {
                $start = $now->copy()->startOfMonth()->subMonthsNoOverflow($monthsAgo);
                $end = $start->copy()->endOfMonth();

                $point = OrderItem::query()
                    ->where('seller_id', $seller->id)
                    ->whereHas('order', fn ($query) => $query
                        ->where('payment_status', 'paid')
                        ->whereBetween('created_at', [$start, $end]))
                    ->selectRaw('COALESCE(SUM(price), 0) as revenue, COUNT(*) as sales')
                    ->first();

                return [
                    'date' => $start->toDateString(),
                    'revenue' => (float) ($point->revenue ?? 0),
                    'sales' => (int) ($point->sales ?? 0),
                ];
            })
            ->values();

        $recentOrders = OrderItem::query()
            ->with([
                'order:id,user_id,payment_status,created_at',
                'order.user:id,name',
                'product:id,title',
            ])
            ->where('seller_id', $seller->id)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (OrderItem $item) {
                $paymentStatus = $item->order?->payment_status;

                $status = match ($paymentStatus) {
                    'paid' => 'completed',
                    'pending' => 'processing',
                    default => 'cancelled',
                };

                return [
                    'id' => 'ORD-'.str_pad((string) $item->order_id, 4, '0', STR_PAD_LEFT),
                    'productName' => $item->product?->title ?? 'Untitled Product',
                    'buyer' => $item->order?->user?->name ?? 'Customer',
                    'amount' => (float) $item->price,
                    'status' => $status,
                    'date' => $item->order?->created_at?->format('Y-m-d') ?? $item->created_at->format('Y-m-d'),
                ];
            })
            ->values();

        $topProductsQuery = Product::query()
            ->withCount([
                'orderItems as sales_count' => fn ($query) => $query
                    ->whereHas('order', fn ($orderQuery) => $orderQuery->where('payment_status', 'paid')),
            ])
            ->withSum([
                'orderItems as revenue_sum' => fn ($query) => $query
                    ->whereHas('order', fn ($orderQuery) => $orderQuery->where('payment_status', 'paid')),
            ], 'price')
            ->where('seller_id', $seller->id)
            ->orderByDesc('revenue_sum')
            ->orderByDesc('sales_count')
            ->limit(5)
            ->get();

        $orderCounts = OrderItem::query()
            ->whereIn('product_id', $topProductsQuery->pluck('id'))
            ->whereHas('order', fn ($query) => $query->where('payment_status', 'paid'))
            ->selectRaw('product_id, COUNT(DISTINCT order_id) as orders_count')
            ->groupBy('product_id')
            ->pluck('orders_count', 'product_id');

        $topProducts = $topProductsQuery
            ->map(function (Product $product) use ($orderCounts) {
                return [
                    'id' => (string) $product->id,
                    'name' => $product->title,
                    'thumbnail' => $product->thumbnail ?: null,
                    'ordersCount' => (int) ($orderCounts[$product->id] ?? 0),
                    'salesCount' => (int) ($product->sales_count ?? 0),
                    'price' => (float) $product->price,
                    'revenue' => (float) ($product->revenue_sum ?? 0),
                ];
            })
            ->values();

        return Inertia::render('seller/dashboard', [
            'sellerProfile' => [
                'id' => (string) $seller->id,
                'name' => $seller->user?->name ?? $seller->store_name,
                'email' => $seller->contact_email ?: ($seller->user?->email ?? ''),
                'avatar' => $seller->user?->avatar ?: ($seller->logo ?: '/images/Brand.png'),
                'storeUrl' => route('creators', absolute: false),
                'joinedDate' => Carbon::parse($seller->created_at)->toDateString(),
                'totalEarnings' => $totalRevenueAllTime,
                'status' => $seller->status,
                'monthlyTarget' => (float) $seller->monthly_target,
            ],
            'dashboardStats' => [
                'totalRevenue' => $currentMetrics['revenue'],
                'totalSales' => $currentMetrics['orders'],
                'productsSold' => $currentMetrics['items'],
                'conversionRate' => $currentMetrics['conversion'],
                'deltas' => [
                    'revenue' => $this->growth($currentMetrics['revenue'], $previousMetrics['revenue']),
                    'sales' => $this->growth($currentMetrics['orders'], $previousMetrics['orders']),
                    'products' => $this->growth($currentMetrics['items'], $previousMetrics['items']),
                    'conversion' => round($currentMetrics['conversion'] - $previousMetrics['conversion'], 1),
                ],
            ],
            'revenueData' => [
                'weekly' => $weeklyRevenueData,
                'monthly' => $monthlyRevenueData,
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'pendingActions' => [
                'pendingOrders' => $pendingOrders,
                'availablePayout' => $availablePayout,
            ],
        ]);
    }

    /**
     * @return array{revenue: float, orders: int, items: int, conversion: float}
     */
    private function metricsForPeriod(int $sellerId, Carbon $start, Carbon $end): array
    {
        $paidItems = OrderItem::query()
            ->where('seller_id', $sellerId)
            ->whereHas('order', fn ($query) => $query
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$start, $end]));

        $allItems = OrderItem::query()
            ->where('seller_id', $sellerId)
            ->whereHas('order', fn ($query) => $query->whereBetween('created_at', [$start, $end]));

        $orders = (int) (clone $paidItems)->distinct()->count('order_id');
        $totalOrders = (int) (clone $allItems)->distinct()->count('order_id');

        return [
            'revenue' => (float) (clone $paidItems)->sum('price'),
            'orders' => $orders,
            'items' => (int) (clone $paidItems)->count(),
            'conversion' => $totalOrders > 0
                ? round(($orders / $totalOrders) * 100, 1)
                : 0.0,
        ];
    }

    private function growth(float $current, float $previous): float
    {
        if ($previous > 0) {
            return round((($current - $previous) / $previous) * 100, 1);
        }

        return $current > 0 ? 100.0 : 0.0;
    }
}
