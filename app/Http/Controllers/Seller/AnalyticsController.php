<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Concerns\ResolvesDateRange;
use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    use ResolvesDateRange;

    public function __invoke(Request $request): Response
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        [$period, $startDate, $endDate] = $this->resolvePeriod($request);

        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfPreviousMonth = $now->copy()->subMonthNoOverflow()->startOfMonth();
        $endOfPreviousMonth = $now->copy()->subMonthNoOverflow()->endOfMonth();

        $sellerPaidItems = OrderItem::query()
            ->where('seller_id', $seller->id)
            ->whereHas('order', fn ($query) => $query->where('payment_status', 'paid'));

        $thisMonthRevenue = (float) (clone $sellerPaidItems)
            ->whereHas('order', fn ($query) => $query->whereBetween('created_at', [$startOfMonth, $now]))
            ->sum('price');

        $lastMonthRevenue = (float) (clone $sellerPaidItems)
            ->whereHas('order', fn ($query) => $query->whereBetween('created_at', [$startOfPreviousMonth, $endOfPreviousMonth]))
            ->sum('price');

        $monthlyGrowth = $lastMonthRevenue > 0
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : ($thisMonthRevenue > 0 ? 100.0 : 0.0);

        $paidItems = (clone $sellerPaidItems)
            ->whereHas('order', fn ($query) => $query->whereBetween('created_at', [$startDate, $endDate]));

        $totalRevenue = (float) (clone $paidItems)->sum('price');
        $totalPaidOrders = (int) (clone $paidItems)->distinct()->count('order_id');
        $avgOrderValue = $totalPaidOrders > 0 ? round($totalRevenue / $totalPaidOrders, 2) : 0.0;

        $dailyMetrics = OrderItem::query()
            ->selectRaw('DATE(orders.created_at) as metric_date, SUM(order_items.price) as revenue, COUNT(order_items.id) as sales')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('order_items.seller_id', $seller->id)
            ->where('orders.payment_status', 'paid')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupByRaw('DATE(orders.created_at)')
            ->get()
            ->keyBy('metric_date');

        $dayCount = (int) $startDate->diffInDays($endDate) + 1;

        $revenueData = collect(range(0, $dayCount - 1))
            ->map(function (int $offset) use ($startDate, $dailyMetrics) {
                $date = $startDate->copy()->addDays($offset);
                $key = $date->toDateString();
                $point = $dailyMetrics->get($key);

                return [
                    'date' => $key,
                    'label' => $date->format('d M'),
                    'revenue' => (float) ($point->revenue ?? 0),
                    'sales' => (int) ($point->sales ?? 0),
                ];
            })
            ->values();

        $paidInPeriod = fn ($query) => $query->whereHas(
            'order',
            fn ($orderQuery) => $orderQuery
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$startDate, $endDate])
        );

        $topProducts = Product::query()
            ->with('category:id,name')
            ->withCount(['orderItems as sales_count' => $paidInPeriod])
            ->withSum(['orderItems as revenue_sum' => $paidInPeriod], 'price')
            ->whereHas('orderItems', $paidInPeriod)
            ->where('seller_id', $seller->id)
            ->orderByDesc('revenue_sum')
            ->limit(5)
            ->get()
            ->map(fn (Product $product) => [
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
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->groupBy('categories.name')
            ->orderByDesc('revenue')
            ->limit(6)
            ->get()
            ->map(fn ($row) => [
                'category' => $row->category_name,
                'revenue' => (float) $row->revenue,
                'sales_count' => (int) $row->sales_count,
            ])
            ->values();

        $periodLabel = match ($period) {
            'today' => 'Today',
            '7d' => 'Last 7 days',
            '30d' => 'Last 30 days',
            'custom' => $startDate->format('d M Y').' – '.$endDate->format('d M Y'),
        };

        return Inertia::render('seller/analytics', [
            'filters' => [
                'period' => $period,
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'label' => $periodLabel,
            ],
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

    /**
     * @return array{0: string, 1: Carbon, 2: Carbon}
     */
    private function resolvePeriod(Request $request): array
    {
        $period = $request->query('period', '30d');
        $period = is_string($period) ? $period : '30d';
        $now = now();

        if ($period === 'custom') {
            $startDate = $this->parseDate($request->query('start_date'));
            $endDate = $this->parseDate($request->query('end_date'));

            if ($startDate && $endDate && $endDate->gte($startDate)) {
                return ['custom', $startDate->startOfDay(), $endDate->endOfDay()];
            }

            $period = '30d';
        }

        if (! in_array($period, ['today', '7d', '30d'], true)) {
            $period = '30d';
        }

        return match ($period) {
            'today' => ['today', $now->copy()->startOfDay(), $now->copy()->endOfDay()],
            '7d' => ['7d', $now->copy()->subDays(6)->startOfDay(), $now->copy()->endOfDay()],
            default => ['30d', $now->copy()->subDays(29)->startOfDay(), $now->copy()->endOfDay()],
        };
    }
}
