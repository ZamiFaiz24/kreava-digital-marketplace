<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $products = Product::query()
            ->with('category:id,name')
            ->withCount([
                'orderItems as sales_count' => fn($query) => $query->whereHas('order', fn($orderQuery) => $orderQuery->where('payment_status', 'paid')),
            ])
            ->withSum([
                'orderItems as revenue_sum' => fn($query) => $query->whereHas('order', fn($orderQuery) => $orderQuery->where('payment_status', 'paid')),
            ], 'price')
            ->withAvg('reviews as reviews_avg_rating', 'rating')
            ->where('seller_id', $seller->id)
            ->latest()
            ->paginate(10)
            ->through(function (Product $product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'thumbnail' => $product->thumbnail ?? '/images/Brand.png',
                    'category' => $product->category?->name ?? 'Digital Product',
                    'price' => (float) $product->price,
                    'status' => $product->status,
                    'sales_count' => (int) ($product->sales_count ?? 0),
                    'revenue' => (float) ($product->revenue_sum ?? 0),
                    'rating' => round((float) ($product->reviews_avg_rating ?? 0), 1),
                    'created_at' => $product->created_at?->toDateString(),
                ];
            });

        return Inertia::render('seller/products', [
            'products' => $products,
            'summary' => [
                'total_products' => Product::query()->where('seller_id', $seller->id)->count(),
                'published_products' => Product::query()->where('seller_id', $seller->id)->where('status', 'published')->count(),
                'draft_products' => Product::query()->where('seller_id', $seller->id)->where('status', 'draft')->count(),
            ],
        ]);
    }
}
