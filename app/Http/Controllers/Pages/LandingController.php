<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Seller;
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
            ->withCount(['products' => fn ($query) => $query->where('status', 'published')])
            ->orderByDesc('products_count')
            ->limit(8)
            ->get()
            ->map(fn ($category) => [
                'slug' => $category->slug,
                'title' => $category->name,
                'description' => $categoryDescriptions[$category->slug] ?? 'Explore premium digital assets from top creators.',
                'icon' => $category->icon,
                'href' => $categoryLinks[$category->slug] ?? '/marketplace?category='.$category->slug,
                'count' => (int) $category->products_count,
            ])
            ->values();

        $trendingProducts = Product::query()
            ->with([
                'seller.user:id,name,avatar',
                'seller:id,user_id,store_name,slug,logo',
                'category:id,name,slug',
                'images:id,product_id,image',
            ])
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
                'slug' => $product->slug,
                'href' => route('product.show', $product->slug),
                'thumbnail' => $product->images->first()?->url ?? $product->thumbnail,
                'creator' => $product->seller?->store_name ?? 'Independent Creator',
                'rating' => round((float) ($product->reviews_avg_rating ?? 0), 1),
                'reviews' => $product->reviews_count,
                'price' => '$'.number_format((float) $product->price, 0),
                'category' => $product->category?->name ?? 'Digital Product',
                'avatar' => $product->seller?->user?->avatar ?? $product->seller?->logo,
            ])
            ->values();

        $stats = [
            'products' => Product::query()->where('status', 'published')->count(),
            'creators' => Seller::query()->where('status', 'approved')->count(),
            'transactions' => Order::query()->where('payment_status', 'paid')->count(),
            'average_rating' => round((float) Review::query()->avg('rating'), 1),
        ];

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
            'stats' => $stats,
            'trendingProducts' => $trendingProducts,
            'testimonials' => $testimonials,
        ]);
    }
}
