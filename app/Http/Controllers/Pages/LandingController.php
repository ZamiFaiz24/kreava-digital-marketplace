<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    public function __invoke(): Response
    {
        $categoryDescriptions = [
            'ui-kits' => 'Complete design systems and component libraries',
            'templates' => 'Figma, WordPress, and web app templates',
            'source-code' => 'Ready-to-use code snippets and frameworks',
            'ebooks' => 'Educational guides and digital books',
            'icons' => 'Icon packs and vector asset libraries',
            'mockups' => 'Realistic mockups for product presentations',
            'fonts' => 'Typography resources for branding projects',
            'music-audio' => 'Music, SFX, and audio assets for content',
        ];

        $categoryLinks = [
            'ui-kits' => '/marketplace?category=ui-kits',
            'templates' => '/marketplace?category=templates',
            'source-code' => '/marketplace?category=source-code',
            'ebooks' => '/marketplace?category=ebooks',
            'icons' => '/marketplace?category=icons',
            'mockups' => '/marketplace?category=mockups',
            'fonts' => '/marketplace?category=fonts',
            'music-audio' => '/marketplace?category=music-audio',
        ];

        $categories = Category::query()
            ->withCount('products')
            ->orderByDesc('products_count')
            ->limit(8)
            ->get()
            ->map(fn($category) => [
                'slug' => $category->slug,
                'title' => $category->name,
                'description' => $categoryDescriptions[$category->slug] ?? 'Explore premium digital assets from top creators.',
                'icon' => $category->icon,
                'href' => $categoryLinks[$category->slug] ?? '/marketplace?category=' . $category->slug,
                'count' => (int) $category->products_count,
            ])
            ->values();

        $trendingProducts = Product::query()
            ->with(['seller.user:id,name,avatar', 'seller:id,user_id,store_name,slug,logo', 'category:id,name'])
            ->withCount('reviews')
            ->withAvg('reviews as reviews_avg_rating', 'rating')
            ->where('status', 'published')
            ->orderByDesc('is_featured')
            ->orderByDesc('reviews_count')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn($product) => [
                'title' => $product->title,
                'creator' => $product->seller?->store_name ?? 'Independent Creator',
                'rating' => round((float) ($product->reviews_avg_rating ?? 0), 1),
                'reviews' => $product->reviews_count,
                'price' => '$' . number_format((float) $product->price, 0),
                'category' => $product->category?->name ?? 'Digital Product',
                'avatar' => $product->seller?->user?->avatar,
            ])
            ->values();

        $testimonials = Review::query()
            ->with(['user:id,name,avatar', 'product:id,title'])
            ->whereNotNull('comment')
            ->where('comment', '!=', '')
            ->orderByDesc('rating')
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($review) {
                $name = $review->user?->name ?? 'Verified Buyer';

                return [
                    'name' => $name,
                    'role' => 'Customer',
                    'content' => $review->comment,
                    'avatar' => $review->user?->avatar,
                    'rating' => max(1, min(5, (int) $review->rating)),
                ];
            })
            ->values();

        return Inertia::render('landing/page', [
            'categories' => $categories,
            'trendingProducts' => $trendingProducts,
            'testimonials' => $testimonials,
        ]);
    }
}
