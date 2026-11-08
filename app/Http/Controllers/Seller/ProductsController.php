<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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

    public function create(Request $request): Response
    {
        Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('seller/products/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $seller = Seller::query()
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'thumbnail' => ['nullable', 'image', 'max:2048'],
            'file' => ['required', 'file', 'max:51200'],
            'preview_link' => ['nullable', 'url', 'max:255'],
            'status' => ['required', 'in:published,draft'],
        ]);

        $file = $request->file('file');
        $fileSize = $file->getSize();
        $filePath = $file->store('products/files', 'local');

        $thumbnailUrl = null;

        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('products/thumbnails', 'public');
            $thumbnailUrl = Storage::disk('public')->url($thumbnailPath);
        }

        Product::create([
            'seller_id' => $seller->id,
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'slug' => $validated['slug'],
            'description' => $validated['description'] ?? null,
            'thumbnail' => $thumbnailUrl,
            'preview_link' => $validated['preview_link'] ?? null,
            'price' => $validated['price'],
            'file_path' => $filePath,
            'file_size' => $fileSize,
            'status' => $validated['status'],
        ]);

        return redirect()
            ->route('seller.products')
            ->with('success', 'Produk berhasil diunggah.');
    }
}
