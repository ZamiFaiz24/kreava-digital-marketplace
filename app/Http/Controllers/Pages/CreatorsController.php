<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\OrderItem;
use App\Models\Seller;
use Inertia\Inertia;
use Inertia\Response;

class CreatorsController extends Controller
{
    public function __invoke(): Response
    {
        $sellers = Seller::query()
            ->where('status', 'approved')
            ->with([
                'user:id,name,avatar',
                'products' => fn($productQuery) => $productQuery
                    ->where('status', 'published')
                    ->with(['category:id,name,slug', 'images'])
                    ->withCount('reviews')
                    ->withAvg('reviews as reviews_avg_rating', 'rating')
                    ->latest(),
            ])
            ->get()
            ->map(function ($seller) {
                $products = $seller->products->sortByDesc('is_featured')->sortByDesc('created_at')->values();
                $productCount = $products->count();
                $salesCount = OrderItem::query()->where('seller_id', $seller->id)->count();
                $customerCount = OrderItem::query()
                    ->join('orders', 'orders.id', '=', 'order_items.order_id')
                    ->where('order_items.seller_id', $seller->id)
                    ->distinct()
                    ->count('orders.user_id');

                $ratingValues = $products
                    ->pluck('reviews_avg_rating')
                    ->filter(fn($rating) => $rating !== null)
                    ->values();

                $rating = $ratingValues->isNotEmpty()
                    ? round($ratingValues->avg(), 1)
                    : 0;

                $specialization = $products
                    ->pluck('category.name')
                    ->filter()
                    ->unique()
                    ->take(3)
                    ->values();

                $previewProducts = $products
                    ->take(3)
                    ->map(fn($product) => [
                        'title' => $product->title,
                        'slug' => $product->slug,
                        'category' => $product->category?->name ?? 'Digital Product',
                        'thumbnail' => $product->images->first()?->url ?? $product->thumbnail ?? '/images/Brand.png',
                        'price' => '$' . number_format((float) $product->price, 0),
                    ])
                    ->values();

                return [
                    'id' => $seller->id,
                    'slug' => $seller->slug,
                    'name' => $seller->user?->name ?? $seller->store_name,
                    'store_name' => $seller->store_name,
                    'avatar' => $seller->user?->avatar ?? $seller->logo,
                    'description' => $seller->description ?? 'Creator and studio seller on Kreava.',
                    'specialization' => $specialization,
                    'products_count' => $productCount,
                    'sales_count' => $salesCount,
                    'followers_count' => $customerCount,
                    'rating' => $rating,
                    'preview_products' => $previewProducts,
                ];
            })
            ->sortByDesc('sales_count')
            ->sortByDesc('products_count')
            ->values();

        $featuredCreator = $sellers->first();

        $stats = [
            'creators' => $sellers->count(),
            'products' => $sellers->sum('products_count'),
            'sales' => $sellers->sum('sales_count'),
            'average_rating' => $sellers->where('rating', '>', 0)->avg('rating') ? round((float) $sellers->where('rating', '>', 0)->avg('rating'), 1) : 0,
        ];

        return Inertia::render('creators/page', [
            'creators' => $sellers,
            'featuredCreator' => $featuredCreator,
            'stats' => $stats,
        ]);
    }
}
