<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Inertia\Inertia;

class PageController extends Controller
{
    /**
     * Show the landing page.
     */
    public function landing()
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

        $categories = Category::query()
            ->withCount('products')
            ->orderByDesc('products_count')
            ->limit(6)
            ->get()
            ->map(fn ($category) => [
                'title' => $category->name,
                'description' => $categoryDescriptions[$category->slug] ?? 'Explore premium digital assets from top creators.',
                'icon' => strtoupper(substr($category->name, 0, 1)),
            ])
            ->values();

        $trendingProducts = Product::query()
            ->with(['seller:id,store_name', 'category:id,name'])
            ->withCount('reviews')
            ->withAvg('reviews as reviews_avg_rating', 'rating')
            ->where('status', 'published')
            ->orderByDesc('is_featured')
            ->orderByDesc('reviews_count')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn ($product) => [
                'title' => $product->title,
                'creator' => $product->seller?->store_name ?? 'Independent Creator',
                'rating' => round((float) ($product->reviews_avg_rating ?? 0), 1),
                'reviews' => $product->reviews_count,
                'price' => '$' . number_format((float) $product->price, 0),
                'category' => $product->category?->name ?? 'Digital Product',
            ])
            ->values();

        $testimonials = Review::query()
            ->with(['user:id,name', 'product:id,title'])
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
                    'avatar' => strtoupper(substr($name, 0, 1)),
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

    /**
     * Show the welcome page.
     */
    public function welcome()
    {
        return Inertia::render('welcome');
    }
}
