<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
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
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfPreviousMonth = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $endOfPreviousMonth = $now->copy()->subMonthNoOverflow()->endOfMonth();

        $paidItemsQuery = OrderItem::query()
            ->where('seller_id', $seller->id)
            ->whereHas('order', fn($query) => $query->where('payment_status', 'paid'));

        $totalRevenueAllTime = (float) (clone $paidItemsQuery)->sum('price');
        $totalSales = (int) (clone $paidItemsQuery)->count();

        $thisMonthRevenue = (float) (clone $paidItemsQuery)
            ->whereHas('order', fn($query) => $query->whereBetween('created_at', [$startOfMonth, $now]))
            ->sum('price');

        $lastMonthRevenue = (float) (clone $paidItemsQuery)
            ->whereHas('order', fn($query) => $query->whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth]))
            ->sum('price');

        $monthlyGrowth = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : ($thisMonthRevenue > 0 ? 100.0 : 0.0);

        $totalOrderItems = OrderItem::query()
            ->where('seller_id', $seller->id)
            ->count();

        $conversionRate = $totalOrderItems > 0
            ? round(($totalSales / $totalOrderItems) * 100, 1)
            : 0.0;

        $dailyMetrics = OrderItem::query()
            ->selectRaw('DATE(orders.created_at) as metric_date, SUM(order_items.price) as revenue, COUNT(order_items.id) as sales')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller->id)
            ->where('orders.payment_status', 'paid')
            ->whereDate('orders.created_at', '>=', $now->copy()->subDays(6)->toDateString())
            ->groupByRaw('DATE(orders.created_at)')
            ->get()
            ->keyBy('metric_date');

        $revenueData = collect(range(6, 0))
            ->map(function (int $daysAgo) use ($now, $dailyMetrics) {
                $date = $now->copy()->subDays($daysAgo);
                $key = $date->toDateString();
                $point = $dailyMetrics->get($key);

                return [
                    'date' => $date->format('D'),
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
                    'failed', 'expired' => 'failed',
                    default => 'pending',
                };

                return [
                    'id' => 'ORD-' . str_pad((string) $item->order_id, 4, '0', STR_PAD_LEFT),
                    'productName' => $item->product?->title ?? 'Untitled Product',
                    'buyer' => $item->order?->user?->name ?? 'Customer',
                    'amount' => (float) $item->price,
                    'status' => $status,
                    'date' => $item->order?->created_at?->format('Y-m-d') ?? $item->created_at->format('Y-m-d'),
                ];
            })
            ->values();

        $topProducts = Product::query()
            ->with('category:id,name')
            ->withAvg('reviews as reviews_avg_rating', 'rating')
            ->withCount([
                'orderItems as sales_count' => fn($query) => $query->whereHas('order', fn($orderQuery) => $orderQuery->where('payment_status', 'paid')),
            ])
            ->withSum([
                'orderItems as revenue_sum' => fn($query) => $query->whereHas('order', fn($orderQuery) => $orderQuery->where('payment_status', 'paid')),
            ], 'price')
            ->where('seller_id', $seller->id)
            ->orderByDesc('revenue_sum')
            ->orderByDesc('sales_count')
            ->limit(5)
            ->get()
            ->map(function (Product $product) {
                return [
                    'id' => (string) $product->id,
                    'name' => $product->title,
                    'thumbnail' => $product->thumbnail ?? '/images/Brand.png',
                    'salesCount' => (int) ($product->sales_count ?? 0),
                    'revenue' => (float) ($product->revenue_sum ?? 0),
                    'rating' => round((float) ($product->reviews_avg_rating ?? 0), 1),
                    'category' => $product->category?->name ?? 'Digital Product',
                ];
            })
            ->values();

        return Inertia::render('seller/dashboard', [
            'sellerProfile' => [
                'id' => (string) $seller->id,
                'name' => $seller->store_name,
                'email' => $seller->contact_email ?: ($seller->user?->email ?? ''),
                'avatar' => $seller->user?->avatar ?: ($seller->logo ?: '/images/Brand.png'),
                'storeUrl' => route('creators', absolute: false),
                'joinedDate' => Carbon::parse($seller->created_at)->toDateString(),
                'totalEarnings' => $totalRevenueAllTime,
            ],
            'dashboardStats' => [
                'totalRevenue' => $thisMonthRevenue,
                'totalSales' => $totalSales,
                'productsSold' => $totalSales,
                'conversionRate' => $conversionRate,
                'monthlyGrowth' => $monthlyGrowth,
            ],
            'revenueData' => $revenueData,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }
}
