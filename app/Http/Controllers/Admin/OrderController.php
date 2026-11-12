<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $search = is_string($search) ? trim($search) : '';

        $status = $request->query('status');
        $status = is_string($status) && in_array($status, ['pending', 'paid', 'refunded'], true) ? $status : '';

        $orderId = null;
        if ($search !== '' && preg_match('/^(?:ord-?|#)?0*(\d+)$/i', $search, $matches)) {
            $orderId = (int) $matches[1];
        }

        $orders = Order::query()
            ->with('user:id,name,email')
            ->when($search !== '', function ($query) use ($search, $orderId) {
                $query->where(function ($query) use ($search, $orderId) {
                    $query->whereHas('user', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });

                    if ($orderId !== null) {
                        $query->orWhere('orders.id', $orderId);
                    }
                });
            })
            ->when($status === 'pending', function ($query) {
                $query->where('payment_status', 'pending');
            })
            ->when($status === 'paid', function ($query) {
                $query->where('payment_status', 'paid')->whereNull('refunded_at');
            })
            ->when($status === 'refunded', function ($query) {
                $query->whereNotNull('refunded_at');
            })
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Order $order) => [
                'id' => $order->id,
                'order_number' => 'ORD-'.str_pad((string) $order->id, 4, '0', STR_PAD_LEFT),
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

        return redirect()
            ->route('admin.orders.index')
            ->with('success', 'Order berhasil ditandai refund.');
    }
}
