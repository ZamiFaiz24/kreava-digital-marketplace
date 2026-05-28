<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    public function __invoke(Request $request): Response
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
}
