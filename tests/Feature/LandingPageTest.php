<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

it('renders the landing page with platform stats and featured content', function () {
    $sellerUser = User::factory()->create(['role' => 'seller']);
    $seller = Seller::create([
        'user_id' => $sellerUser->id,
        'store_name' => 'Landing Studio',
        'slug' => 'landing-studio-'.Str::random(6),
        'status' => 'approved',
    ]);

    $pendingSellerUser = User::factory()->create(['role' => 'seller']);
    Seller::create([
        'user_id' => $pendingSellerUser->id,
        'store_name' => 'Pending Studio',
        'slug' => 'pending-studio-'.Str::random(6),
        'status' => 'pending',
    ]);

    $category = Category::create([
        'name' => 'UI Kits',
        'slug' => 'ui-kits-'.Str::random(6),
        'icon' => 'layout-grid',
    ]);

    $product = Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'title' => 'Landing Page UI Kit',
        'price' => 25,
        'status' => 'published',
        'is_featured' => true,
    ]);

    Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'status' => 'draft',
    ]);

    ProductImage::create([
        'product_id' => $product->id,
        'image' => 'products/thumbnails/landing-page.jpg',
    ]);

    $reviewer = User::factory()->create();

    Review::create([
        'user_id' => $reviewer->id,
        'product_id' => $product->id,
        'rating' => 5,
        'comment' => 'Produknya sangat membantu.',
    ]);

    Review::create([
        'user_id' => $reviewer->id,
        'product_id' => $product->id,
        'rating' => 4,
        'comment' => 'Kualitasnya bagus dan mudah dipakai.',
    ]);

    $buyer = User::factory()->create();

    Order::create([
        'user_id' => $buyer->id,
        'total_price' => 25,
        'payment_status' => 'paid',
        'payment_method' => 'mock',
    ]);

    Order::create([
        'user_id' => $buyer->id,
        'total_price' => 10,
        'payment_status' => 'pending',
        'payment_method' => 'mock',
    ]);

    $this->get(route('landing'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('landing/page')
            ->where('stats.products', 1)
            ->where('stats.creators', 1)
            ->where('stats.transactions', 1)
            ->where('stats.average_rating', 4.5)
            ->has('categories', 1)
            ->where('categories.0.slug', $category->slug)
            ->where('categories.0.count', 1)
            ->has('trendingProducts', 1)
            ->where('trendingProducts.0.title', $product->title)
            ->where('trendingProducts.0.slug', $product->slug)
            ->where('trendingProducts.0.href', route('product.show', $product->slug))
            ->where('trendingProducts.0.thumbnail', asset('products/thumbnails/landing-page.jpg'))
            ->where('trendingProducts.0.creator', $seller->store_name)
            ->where('trendingProducts.0.rating', 4.5)
            ->where('trendingProducts.0.reviews', 2)
            ->where('trendingProducts.0.price', '$25')
            ->has('testimonials', 2)
        );
});

it('returns safe empty platform stats when there is no data', function () {
    $this->get(route('landing'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('landing/page')
            ->where('stats.products', 0)
            ->where('stats.creators', 0)
            ->where('stats.transactions', 0)
            ->where('stats.average_rating', 0)
            ->has('categories', 0)
            ->has('trendingProducts', 0)
            ->has('testimonials', 0)
        );
});
