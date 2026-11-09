<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $totalUsers = User::query()->count();
        $totalSellers = User::query()->where('role', 'seller')->count();
        $totalCustomers = User::query()->where('role', 'customer')->count();

        $totalProducts = Product::query()->count();
        $totalPublishedProducts = Product::query()->where('status', 'published')->count();

        $paidOrders = Order::query()->where('payment_status', 'paid');

        $totalOrders = Order::query()->count();
        $totalPaidOrders = (int) (clone $paidOrders)->count();
        $totalRevenue = (float) (clone $paidOrders)->sum('total_price');

        $recentOrders = Order::query()
            ->with('user:id,name,email')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => 'ORD-' . str_pad((string) $order->id, 4, '0', STR_PAD_LEFT),
                    'customer' => $order->user?->name ?? 'Customer',
                    'email' => $order->user?->email ?? '',
                    'amount' => (float) $order->total_price,
                    'status' => $order->payment_status,
                    'date' => $order->created_at?->format('Y-m-d') ?? '',
                ];
            })
            ->values();

        $recentSellers = Seller::query()
            ->with('user:id,name,email,avatar')
            ->withCount('products')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function (Seller $seller) {
                return [
                    'id' => (string) $seller->id,
                    'storeName' => $seller->store_name,
                    'owner' => $seller->user?->name ?? 'Seller',
                    'email' => $seller->contact_email ?: ($seller->user?->email ?? ''),
                    'productsCount' => (int) $seller->products_count,
                    'status' => $seller->status,
                    'joinedDate' => $seller->created_at?->format('Y-m-d') ?? '',
                ];
            })
            ->values();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalSellers' => $totalSellers,
                'totalCustomers' => $totalCustomers,
                'totalProducts' => $totalProducts,
                'publishedProducts' => $totalPublishedProducts,
                'totalOrders' => $totalOrders,
                'paidOrders' => $totalPaidOrders,
                'totalRevenue' => $totalRevenue,
            ],
            'recentOrders' => $recentOrders,
            'recentSellers' => $recentSellers,
        ]);
    }
}
