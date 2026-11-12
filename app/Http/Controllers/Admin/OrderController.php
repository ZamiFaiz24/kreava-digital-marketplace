<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Concerns\ResolvesDateRange;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class OrderController extends Controller
{
    use ResolvesDateRange;

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $search = is_string($search) ? trim($search) : '';

        $status = $request->query('status');
        $status = is_string($status) && in_array($status, ['pending', 'paid', 'refunded'], true) ? $status : '';

        $orders = Order::query()->with('user:id,name,email');
        $this->applySearch($orders, $search);
        $this->applyStatus($orders, $status);

        $orders = $orders
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => $this->orderNumber($order),
                'customer' => $order->user?->name ?? 'Unknown Customer',
                'email' => $order->user?->email ?? '',
                'created_at' => $order->created_at?->format('Y-m-d H:i') ?? '',
                'total_price' => (float) $order->total_price,
                'payment_status' => $order->payment_status,
                'refunded_at' => $order->refunded_at?->format('Y-m-d H:i'),
                'can_refund' => $order->payment_status === 'paid' && $order->refunded_at === null,
            ]);

        return Inertia::render('admin/orders', [
            'orders' => $orders,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }

    public function export(Request $request): StreamedResponse
    {
        $search = $request->query('search');
        $search = is_string($search) ? trim($search) : '';

        $status = $request->query('status');
        $status = is_string($status) && in_array($status, ['pending', 'paid', 'refunded'], true) ? $status : '';

        [$startDate, $endDate] = $this->resolveDateRange($request);

        $orders = Order::query()->with('user:id,name,email');
        $this->applySearch($orders, $search);
        $this->applyStatus($orders, $status);

        $orders = $orders
            ->when($startDate, fn ($query) => $query->where('created_at', '>=', $startDate))
            ->when($endDate, fn ($query) => $query->where('created_at', '<=', $endDate))
            ->latest()
            ->lazy(200);

        $filename = 'admin-orders-'.now()->format('Y-m-d_His').'.csv';

        return response()->streamDownload(function () use ($orders) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'order_number',
                'customer',
                'email',
                'total',
                'payment_status',
                'refunded_at',
                'created_at',
            ]);

            foreach ($orders as $order) {
                fputcsv($handle, [
                    $this->orderNumber($order),
                    $order->user?->name ?? 'Unknown Customer',
                    $order->user?->email ?? '',
                    number_format((float) $order->total_price, 2, '.', ''),
                    $order->payment_status,
                    $order->refunded_at?->toDateTimeString() ?? '',
                    $order->created_at?->toDateTimeString() ?? '',
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    public function refund(Request $request, Order $order): RedirectResponse
    {
        if ($order->payment_status !== 'paid') {
            return redirect()
                ->route('admin.orders.index')
                ->with('error', 'Hanya order berstatus paid yang dapat ditandai refund.');
        }

        if ($order->refunded_at !== null) {
            return redirect()
                ->route('admin.orders.index')
                ->with('error', 'Order sudah ditandai refund.');
        }

        $order->update(['refunded_at' => now()]);

        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => 'order.refund',
            'target_type' => 'order',
            'target_id' => $order->id,
            'details' => [
                'order_number' => $this->orderNumber($order),
                'total_price' => (float) $order->total_price,
                'payment_status' => $order->payment_status,
                'refunded_at' => $order->refunded_at?->toDateTimeString(),
            ],
        ]);

        return redirect()
            ->route('admin.orders.index')
            ->with('success', 'Order berhasil ditandai refund.');
    }

    private function applySearch(Builder $query, string $search): void
    {
        if ($search === '') {
            return;
        }

        $orderId = null;
        if (preg_match('/^(?:ord-?|#)?0*(\d+)$/i', $search, $matches)) {
            $orderId = (int) $matches[1];
        }

        $query->where(function ($query) use ($search, $orderId) {
            $query->whereHas('user', function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });

            if ($orderId !== null) {
                $query->orWhere('orders.id', $orderId);
            }
        });
    }

    private function applyStatus(Builder $query, string $status): void
    {
        $query->when($status === 'pending', fn ($query) => $query->where('payment_status', 'pending'))
            ->when($status === 'paid', fn ($query) => $query->where('payment_status', 'paid')->whereNull('refunded_at'))
            ->when($status === 'refunded', fn ($query) => $query->whereNotNull('refunded_at'));
    }

    private function orderNumber(Order $order): string
    {
        return 'ORD-'.str_pad((string) $order->id, 4, '0', STR_PAD_LEFT);
    }
}
