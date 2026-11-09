<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ModerationController extends Controller
{
    public function products(): Response
    {
        $products = Product::query()
            ->with([
                'seller:id,user_id,store_name',
                'seller.user:id,name,email',
                'category:id,name',
            ])
            ->where('status', '!=', 'published')
            ->latest()
            ->get()
            ->map(function (Product $product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'thumbnail' => $product->thumbnail ?? '/images/Brand.png',
                    'seller' => $product->seller?->store_name ?? 'Unknown Seller',
                    'sellerEmail' => $product->seller?->user?->email ?? '',
                    'category' => $product->category?->name ?? 'Uncategorized',
                    'price' => (float) $product->price,
                    'status' => $product->status,
                    'createdAt' => $product->created_at?->format('Y-m-d') ?? '',
                ];
            })
            ->values();

        return Inertia::render('admin/moderation/products', [
            'products' => $products,
        ]);
    }

    public function approveProduct(Product $product): RedirectResponse
    {
        $product->update(['status' => 'published']);

        return redirect()
            ->route('admin.moderation.products')
            ->with('success', 'Produk berhasil disetujui.');
    }

    public function rejectProduct(Product $product): RedirectResponse
    {
        $product->update(['status' => 'rejected']);

        return redirect()
            ->route('admin.moderation.products')
            ->with('success', 'Produk berhasil ditolak.');
    }

    public function sellers(): Response
    {
        $sellers = Seller::query()
            ->with('user:id,name,email')
            ->withCount('products')
            ->where('status', '!=', 'approved')
            ->latest()
            ->get()
            ->map(function (Seller $seller) {
                return [
                    'id' => $seller->id,
                    'storeName' => $seller->store_name,
                    'owner' => $seller->user?->name ?? 'Seller',
                    'email' => $seller->contact_email ?: ($seller->user?->email ?? ''),
                    'productsCount' => (int) $seller->products_count,
                    'status' => $seller->status,
                    'joinedDate' => $seller->created_at?->format('Y-m-d') ?? '',
                ];
            })
            ->values();

        return Inertia::render('admin/moderation/sellers', [
            'sellers' => $sellers,
        ]);
    }

    public function approveSeller(Seller $seller): RedirectResponse
    {
        $seller->update(['status' => 'approved']);

        return redirect()
            ->route('admin.moderation.sellers')
            ->with('success', 'Seller berhasil disetujui.');
    }

    public function rejectSeller(Seller $seller): RedirectResponse
    {
        $seller->update(['status' => 'rejected']);

        return redirect()
            ->route('admin.moderation.sellers')
            ->with('success', 'Seller berhasil ditolak.');
    }
}
