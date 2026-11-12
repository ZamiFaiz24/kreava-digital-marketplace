<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function approveProduct(Request $request, Product $product): RedirectResponse
    {
        $previousStatus = $product->status;
        $product->update(['status' => 'published']);

        $this->recordProductAudit($request, $product, 'product.approve', $previousStatus, 'published');

        return redirect()
            ->route('admin.moderation.products')
            ->with('success', 'Produk berhasil disetujui.');
    }

    public function rejectProduct(Request $request, Product $product): RedirectResponse
    {
        $previousStatus = $product->status;
        $product->update(['status' => 'rejected']);

        $this->recordProductAudit($request, $product, 'product.reject', $previousStatus, 'rejected');

        return redirect()
            ->route('admin.moderation.products')
            ->with('success', 'Produk berhasil ditolak.');
    }

    public function takedownProduct(Request $request, Product $product): RedirectResponse
    {
        if ($product->status !== 'published') {
            return redirect()
                ->route('admin.moderation.products')
                ->with('error', 'Hanya produk yang sudah tayang yang dapat ditakedown.');
        }

        $previousStatus = $product->status;
        $product->update(['status' => 'rejected']);

        $this->recordProductAudit($request, $product, 'product.takedown', $previousStatus, 'rejected');

        return redirect()
            ->route('admin.moderation.products')
            ->with('success', 'Produk berhasil ditakedown.');
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

    public function approveSeller(Request $request, Seller $seller): RedirectResponse
    {
        $previousStatus = $seller->status;
        $seller->update(['status' => 'approved']);

        $this->recordSellerAudit($request, $seller, 'seller.approve', $previousStatus, 'approved');

        return redirect()
            ->route('admin.moderation.sellers')
            ->with('success', 'Seller berhasil disetujui.');
    }

    public function rejectSeller(Request $request, Seller $seller): RedirectResponse
    {
        $previousStatus = $seller->status;
        $seller->update(['status' => 'rejected']);

        $this->recordSellerAudit($request, $seller, 'seller.reject', $previousStatus, 'rejected');

        return redirect()
            ->route('admin.moderation.sellers')
            ->with('success', 'Seller berhasil ditolak.');
    }

    private function recordProductAudit(Request $request, Product $product, string $action, string $previousStatus, string $newStatus): void
    {
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'target_type' => 'product',
            'target_id' => $product->id,
            'details' => [
                'title' => $product->title,
                'previous_status' => $previousStatus,
                'new_status' => $newStatus,
            ],
        ]);
    }

    private function recordSellerAudit(Request $request, Seller $seller, string $action, string $previousStatus, string $newStatus): void
    {
        AuditLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'target_type' => 'seller',
            'target_id' => $seller->id,
            'details' => [
                'store_name' => $seller->store_name,
                'previous_status' => $previousStatus,
                'new_status' => $newStatus,
            ],
        ]);
    }
}
