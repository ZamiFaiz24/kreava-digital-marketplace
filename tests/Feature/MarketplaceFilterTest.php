<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createMarketplaceSeller(): Seller
{
    $user = User::factory()->create(['role' => 'seller']);

    return Seller::create([
        'user_id' => $user->id,
        'store_name' => 'Marketplace Studio',
        'slug' => 'marketplace-studio-'.Str::random(6),
        'status' => 'approved',
    ]);
}

function createMarketplaceCategory(): Category
{
    return Category::create([
        'name' => 'Templates',
        'slug' => 'templates-'.Str::random(6),
    ]);
}

function createMarketplaceProduct(Seller $seller, Category $category, string $title, float $price, ?Carbon $createdAt = null): Product
{
    $product = Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'title' => $title,
        'price' => $price,
        'status' => 'published',
    ]);

    if ($createdAt) {
        $product->created_at = $createdAt;
        $product->save();
    }

    return $product;
}

function addMarketplaceReview(Product $product, int $rating): void
{
    Review::create([
        'user_id' => User::factory()->create()->id,
        'product_id' => $product->id,
        'rating' => $rating,
        'comment' => 'Ulasan untuk '.$product->title,
    ]);
}

it('filters products by minimum and maximum price', function () {
    $seller = createMarketplaceSeller();
    $category = createMarketplaceCategory();

    createMarketplaceProduct($seller, $category, 'Budget Kit', 10);
    createMarketplaceProduct($seller, $category, 'Standard Kit', 50);
    createMarketplaceProduct($seller, $category, 'Premium Kit', 100);

    $this->get(route('marketplace', ['min_price' => 20]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('marketplace/page')
            ->where('pagination.total', 2)
            ->where('filters.min_price', 20)
            ->has('products', 2)
        );

    $this->get(route('marketplace', ['max_price' => 20]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pagination.total', 1)
            ->where('filters.max_price', 20)
            ->where('products.0.title', 'Budget Kit')
        );

    $this->get(route('marketplace', ['min_price' => 20, 'max_price' => 80]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pagination.total', 1)
            ->where('products.0.title', 'Standard Kit')
        );
});

it('filters products by minimum rating', function () {
    $seller = createMarketplaceSeller();
    $category = createMarketplaceCategory();

    $fiveStar = createMarketplaceProduct($seller, $category, 'Five Star Kit', 10);
    $fourAndHalfStar = createMarketplaceProduct($seller, $category, 'Four and Half Star Kit', 20);
    $fourStar = createMarketplaceProduct($seller, $category, 'Four Star Kit', 30);
    $threeStar = createMarketplaceProduct($seller, $category, 'Three Star Kit', 40);

    addMarketplaceReview($fiveStar, 5);
    addMarketplaceReview($fourAndHalfStar, 5);
    addMarketplaceReview($fourAndHalfStar, 4);
    addMarketplaceReview($fourStar, 4);
    addMarketplaceReview($threeStar, 3);

    $this->get(route('marketplace', ['min_rating' => 4.5]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pagination.total', 2)
            ->where('filters.min_rating', 4.5)
            ->where('products.0.title', 'Four and Half Star Kit')
            ->where('products.1.title', 'Five Star Kit')
        );

    $this->get(route('marketplace', ['min_rating' => 4]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pagination.total', 3)
            ->where('products.0.title', 'Four Star Kit')
            ->where('products.1.title', 'Four and Half Star Kit')
            ->where('products.2.title', 'Five Star Kit')
        );

    $this->get(route('marketplace', ['min_rating' => 5]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('pagination.total', 1)
            ->where('products.0.title', 'Five Star Kit')
        );
});

it('sorts products by latest, price, and rating', function () {
    $seller = createMarketplaceSeller();
    $category = createMarketplaceCategory();

    $oldest = createMarketplaceProduct($seller, $category, 'Oldest Kit', 10, Carbon::parse('2026-01-01 10:00:00'));
    $middle = createMarketplaceProduct($seller, $category, 'Middle Kit', 30, Carbon::parse('2026-02-01 10:00:00'));
    $newest = createMarketplaceProduct($seller, $category, 'Newest Kit', 20, Carbon::parse('2026-03-01 10:00:00'));

    addMarketplaceReview($oldest, 4);
    addMarketplaceReview($middle, 5);
    addMarketplaceReview($newest, 3);

    $this->get(route('marketplace'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort', 'latest')
            ->where('products.0.title', 'Newest Kit')
            ->where('products.1.title', 'Middle Kit')
            ->where('products.2.title', 'Oldest Kit')
        );

    $this->get(route('marketplace', ['sort' => 'price_asc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort', 'price_asc')
            ->where('products.0.title', 'Oldest Kit')
            ->where('products.1.title', 'Newest Kit')
            ->where('products.2.title', 'Middle Kit')
        );

    $this->get(route('marketplace', ['sort' => 'price_desc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort', 'price_desc')
            ->where('products.0.title', 'Middle Kit')
            ->where('products.1.title', 'Newest Kit')
            ->where('products.2.title', 'Oldest Kit')
        );

    $this->get(route('marketplace', ['sort' => 'rating_desc']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.sort', 'rating_desc')
            ->where('products.0.title', 'Middle Kit')
            ->where('products.1.title', 'Oldest Kit')
            ->where('products.2.title', 'Newest Kit')
        );
});
