<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __invoke(string $slug): Response
    {
        $product = Product::query()
            ->with(['seller.user:id,name,avatar', 'seller:id,user_id,store_name,slug,logo', 'category', 'images', 'reviews.user'])
            ->withCount('reviews')
            ->withAvg('reviews as reviews_avg_rating', 'rating')
            ->where('slug', $slug)
            ->where('status', 'published')
            ->firstOrFail();

        $images = $product->images
            ->map(fn($image) => [
                'id' => $image->id,
                'url' => $image->url,
                'alt' => $product->title,
            ])
            ->values();

        $mappedProduct = [
            'id' => $product->id,
            'slug' => $product->slug,
            'title' => $product->title,
            'thumbnail' => $images->first()['url'] ?? $product->thumbnail ?? '/images/Brand.png',
            'price' => (float) $product->price,
            'old_price' => null,
            'rating' => round((float) ($product->reviews_avg_rating ?? 0), 1),
            'reviews_count' => (int) $product->reviews_count,
            'trending' => (bool) $product->is_featured,
            'images' => $images,
            'category' => [
                'id' => $product->category?->id,
                'name' => $product->category?->name ?? 'Digital Product',
                'slug' => $product->category?->slug ?? 'digital-product',
            ],
            'seller' => [
                'id' => $product->seller?->id,
                'name' => $product->seller?->store_name ?? 'Independent Creator',
                'slug' => $product->seller?->slug ?? '',
                'avatar' => $product->seller?->user?->avatar ?? $product->seller?->logo,
            ],
            'downloads_count' => $product->downloads_count ?? 0,
            'long_description' => $product->long_description ?? null,
            'created_at' => $product->created_at?->toDateTimeString(),
        ];

        $reviews = $product->reviews()
            ->with('user')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'author' => $r->user?->name ?? 'Buyer',
                'avatar' => $r->user?->avatar,
                'rating' => (int) $r->rating,
                'comment' => $r->comment,
                'created_at' => $r->created_at->toDateTimeString(),
            ])
            ->values();

        $rating_breakdown = [
            'five_star' => $product->reviews()->where('rating', 5)->count(),
            'four_star' => $product->reviews()->where('rating', 4)->count(),
            'three_star' => $product->reviews()->where('rating', 3)->count(),
            'two_star' => $product->reviews()->where('rating', 2)->count(),
            'one_star' => $product->reviews()->where('rating', 1)->count(),
        ];

        $related = Product::query()
            ->where('id', '!=', $product->id)
            ->whereHas('category', fn($q) => $q->where('id', $product->category?->id))
            ->where('status', 'published')
            ->with(['seller.user:id,name,avatar', 'seller:id,user_id,store_name,slug,logo', 'images', 'category'])
            ->withCount('reviews')
            ->withAvg('reviews as reviews_avg_rating', 'rating')
            ->latest()
            ->limit(4)
            ->get()
            ->map(function ($p) {
                $imgs = $p->images->map(fn($img) => ['id' => $img->id, 'url' => $img->url, 'alt' => $p->title])->values();

                return [
                    'id' => $p->id,
                    'slug' => $p->slug,
                    'title' => $p->title,
                    'thumbnail' => $imgs->first()['url'] ?? $p->thumbnail ?? '/images/Brand.png',
                    'price' => (float) $p->price,
                    'rating' => round((float) ($p->reviews_avg_rating ?? 0), 1),
                    'reviews_count' => (int) ($p->reviews_count ?? 0),
                    'seller' => [
                        'id' => $p->seller?->id,
                        'name' => $p->seller?->store_name ?? 'Independent Creator',
                        'slug' => $p->seller?->slug ?? '',
                        'avatar' => $p->seller?->user?->avatar ?? $p->seller?->logo,
                    ],
                    'category' => [
                        'id' => $p->category?->id,
                        'name' => $p->category?->name ?? 'Digital Product',
                        'slug' => $p->category?->slug ?? 'digital-product',
                    ],
                ];
            })
            ->values();

        return Inertia::render('marketplace/product', [
            'product' => $mappedProduct,
            'reviews' => $reviews,
            'rating_breakdown' => $rating_breakdown,
            'related_products' => $related,
        ]);
    }
}
