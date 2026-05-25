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
            ->map(fn($category) => [
                'title' => $category->name,
                'description' => $categoryDescriptions[$category->slug] ?? 'Explore premium digital assets from top creators.',
                'icon' => strtoupper(substr($category->name, 0, 1)),
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

    /**
     * Show the marketplace page.
     */
    public function marketplace(Request $request)
    {
        $query = Product::query()
            ->with(['seller.user:id,name,avatar', 'seller:id,user_id,store_name,slug,logo', 'category', 'images'])
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
            $images = $product->images
                ->map(fn($image) => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'alt' => $product->title,
                ])
                ->values();

            return [
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
            ];
        });

        $categories = Category::query()
            ->withCount('products')
            ->orderBy('name')
            ->get()
            ->map(fn($category) => [
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

    /**
     * Show the creators page.
     */
    public function creators()
    {
        return Inertia::render('creators/page');
    }

    /**
     * Show a single product detail page.
     */
    public function product($slug)
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
