<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Download;
use App\Models\Order;
use App\Services\PaymentGateway;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(private readonly PaymentGateway $paymentGateway)
    {
    }

    public function index(): Response
    {
        $cart = Auth::user()
            ->cart()
            ->with(['items.product.seller.user', 'items.product.images'])
            ->first();

        return Inertia::render('customer/checkout', [
            'cart' => $cart,
            'total' => $cart ? (float) $cart->items->sum('price') : 0.0,
        ]);
    }

    public function store(): RedirectResponse
    {
        $user = Auth::user();

        $cart = $user->cart()->with('items.product')->first();

        if (! $cart || $cart->items->isEmpty()) {
            return redirect()
                ->route('checkout.index')
                ->withErrors(['checkout' => 'Keranjang kamu kosong. Tambahkan produk terlebih dahulu.']);
        }

        $order = DB::transaction(function () use ($user, $cart) {
            $order = Order::create([
                'user_id' => $user->id,
                'total_price' => (float) $cart->items->sum('price'),
                'payment_status' => 'pending',
                'payment_method' => 'mock',
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'seller_id' => $item->product->seller_id,
                    'price' => $item->price,
                ]);
            }

            return $order;
        });

        $payment = $this->paymentGateway->pay([
            'order_id' => $order->id,
            'amount' => (float) $order->total_price,
            'payment_method' => $order->payment_method,
        ]);

        if (! ($payment['success'] ?? false)) {
            $order->update(['payment_status' => 'failed']);

            return redirect()
                ->route('checkout.index')
                ->withErrors(['checkout' => $payment['error'] ?? 'Pembayaran gagal. Coba lagi nanti.']);
        }

        DB::transaction(function () use ($order, $cart) {
            $order->update(['payment_status' => 'paid']);

            foreach ($order->items as $orderItem) {
                Download::firstOrCreate([
                    'user_id' => $order->user_id,
                    'product_id' => $orderItem->product_id,
                    'order_item_id' => $orderItem->id,
                ]);
            }

            $cart->items()->delete();
        });

        return redirect()
            ->route('orders.show', $order)
            ->with('success', 'Pembayaran berhasil. Produk kamu siap diunduh.');
    }
}
