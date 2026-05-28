<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfPreviousMonth = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $endOfPreviousMonth = $now->copy()->subMonthNoOverflow()->endOfMonth();

        $paidItems = OrderItem::query()
            ->where('seller_id', $seller->id)
            ->whereHas('order', fn($query) => $query->where('payment_status', 'paid'));

        $thisMonthRevenue = (float) (clone $paidItems)
            ->whereHas('order', fn($query) => $query->whereBetween('created_at', [$startOfMonth, $now]))
            ->sum('price');

        $lastMonthRevenue = (float) (clone $paidItems)
            ->whereHas('order', fn($query) => $query->whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth]))
            ->sum('price');

        $monthlyGrowth = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : ($thisMonthRevenue > 0 ? 100.0 : 0.0);

        $totalRevenue = (float) (clone $paidItems)->sum('price');
        $totalPaidOrders = (int) (clone $paidItems)->count();
        $avgOrderValue = $totalPaidOrders > 0 ? round($totalRevenue / $totalPaidOrders, 2) : 0.0;

        $dailyMetrics = OrderItem::query()
            ->selectRaw('DATE(orders.created_at) as metric_date, SUM(order_items.price) as revenue, COUNT(order_items.id) as sales')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller->id)
            ->where('orders.payment_status', 'paid')
            ->whereDate('orders.created_at', '>=', $now->copy()->subDays(13)->toDateString())
            ->groupByRaw('DATE(orders.created_at)')
            ->get()
            ->keyBy('metric_date');

        $revenueData = collect(range(13, 0))
            ->map(function (int $daysAgo) use ($now, $dailyMetrics) {
                $date = $now->copy()->subDays($daysAgo);
                $key = $date->toDateString();
                $point = $dailyMetrics->get($key);

                return [
                    'label' => $date->format('d M'),
                    'revenue' => (float) ($point->revenue ?? 0),
                    'sales' => (int) ($point->sales ?? 0),
                ];
            })
            ->values();

        $topProducts = Product::query()
            ->with('category:id,name')
            ->withCount([
                'orderItems as sales_count' => fn($query) => $query->whereHas('order', fn($orderQuery) => $orderQuery->where('payment_status', 'paid')),
            ])
            ->withSum([
                'orderItems as revenue_sum' => fn($query) => $query->whereHas('order', fn($orderQuery) => $orderQuery->where('payment_status', 'paid')),
            ], 'price')
            ->where('seller_id', $seller->id)
            ->orderByDesc('revenue_sum')
            ->limit(5)
            ->get()
            ->map(fn(Product $product) => [
                'id' => $product->id,
                'title' => $product->title,
                'category' => $product->category?->name ?? 'Digital Product',
                'sales_count' => (int) ($product->sales_count ?? 0),
                'revenue' => (float) ($product->revenue_sum ?? 0),
            ])
            ->values();

        $categoryBreakdown = Product::query()
            ->selectRaw('categories.name as category_name, SUM(order_items.price) as revenue, COUNT(order_items.id) as sales_count')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->join('order_items', 'order_items.product_id', '=', 'products.id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('products.seller_id', $seller->id)
            ->where('orders.payment_status', 'paid')
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->limit(6)
            ->get()
            ->map(fn($row) => [
                'category' => $row->category_name,
                'revenue' => (float) $row->revenue,
                'sales_count' => (int) $row->sales_count,
            ])
            ->values();

        return Inertia::render('seller/analytics', [
            'summary' => [
                'total_revenue' => $totalRevenue,
                'total_paid_orders' => $totalPaidOrders,
                'avg_order_value' => $avgOrderValue,
                'monthly_growth' => $monthlyGrowth,
                'this_month_revenue' => $thisMonthRevenue,
            ],
            'revenue_data' => $revenueData,
            'top_products' => $topProducts,
            'category_breakdown' => $categoryBreakdown,
        ]);
    }
}
