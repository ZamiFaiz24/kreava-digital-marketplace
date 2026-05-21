<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
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
     * Show the marketplace page.
     */
    public function marketplace(Request $request)
    {
        $query = Product::query()
            ->with(['seller', 'category'])
            ->withCount('reviews')
            ->withAvg('reviews as reviews_avg_rating', 'rating')
            ->where('status', 'published');

        if ($request->filled('category')) {
            $query->whereHas('category', function ($categoryQuery) use ($request) {
                $categoryQuery->where('slug', $request->string('category'));
            });
        }

        if ($request->filled('query')) {
            $search = $request->string('query');
            $query->where(function ($productQuery) use ($search) {
                $productQuery->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->latest()->paginate(12);

        $products->getCollection()->transform(function ($product) {
            return [
                'id' => $product->id,
                'slug' => $product->slug,
                'title' => $product->title,
                'thumbnail' => $product->thumbnail ?? '/images/Logo.png',
                'price' => (float) $product->price,
                'old_price' => null,
                'rating' => round((float) ($product->reviews_avg_rating ?? 0), 1),
                'reviews_count' => (int) $product->reviews_count,
                'trending' => (bool) $product->is_featured,
                'category' => [
                    'id' => $product->category?->id,
                    'name' => $product->category?->name ?? 'Digital Product',
                    'slug' => $product->category?->slug ?? 'digital-product',
                ],
                'seller' => [
                    'id' => $product->seller?->id,
                    'name' => $product->seller?->store_name ?? 'Independent Creator',
                    'slug' => $product->seller?->slug ?? '',
                    'avatar' => $product->seller?->logo,
                ],
            ];
        });

        $categories = Category::query()
            ->withCount('products')
            ->orderBy('name')
            ->get()
            ->map(fn ($category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'icon' => $category->icon,
                'count' => $category->products_count,
            ])
            ->values();

        return Inertia::render('marketplace/page', [
            'products' => $products->items(),
            'categories' => $categories,
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'from' => $products->firstItem() ?? 0,
                'to' => $products->lastItem() ?? 0,
            ],
            'filters' => [
                'query' => $request->string('query')->toString() ?: null,
                'category' => $request->string('category')->toString() ?: null,
                'sort' => $request->string('sort')->toString() ?: null,
            ],
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
