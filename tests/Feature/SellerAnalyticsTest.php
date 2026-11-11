<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

/**
 * @return array{0: User, 1: Seller}
 */
function createAnalyticsSeller(): array
{
    $user = User::factory()->create(['role' => 'seller']);

    $seller = Seller::create([
        'user_id' => $user->id,
        'store_name' => 'Analytics Studio',
        'slug' => 'analytics-studio-' . Str::random(8),
        'status' => 'approved',
    ]);

    return [$user, $seller];
}

function createAnalyticsCategory(string $name = 'Templates'): Category
{
    return Category::create([
        'name' => $name,
        'slug' => Str::slug($name) . '-' . Str::random(6),
    ]);
}

function createAnalyticsProduct(Seller $seller, Category $category, string $title, float $price): Product
{
    return Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'title' => $title,
        'price' => $price,
        'status' => 'published',
    ]);
}

/**
 * @param  array<int, array{product: Product, price: float}>  $items
 */
function createAnalyticsOrder(User $buyer, array $items, string $paymentStatus = 'paid', ?Carbon $createdAt = null): Order
{
    $order = Order::create([
        'user_id' => $buyer->id,
        'total_price' => collect($items)->sum('price'),
        'payment_status' => $paymentStatus,
        'payment_method' => 'mock',
    ]);

    if ($createdAt) {
        $order->created_at = $createdAt;
        $order->updated_at = $createdAt;
        $order->save();
    }

    foreach ($items as $item) {
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $item['product']->id,
            'seller_id' => $item['product']->seller_id,
            'price' => $item['price'],
        ]);
    }

    return $order;
}

test('guests are redirected to login from seller analytics', function () {
    $this->get(route('seller.analytics'))
        ->assertRedirect(route('login', absolute: false));
});

test('non seller users cannot access seller analytics', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)
        ->get(route('seller.analytics'))
        ->assertForbidden();
});

test('seller without orders sees zero analytics without errors', function () {
    [$user, $seller] = createAnalyticsSeller();
    $category = createAnalyticsCategory();
    createAnalyticsProduct($seller, $category, 'Unsold Product', 50);

    $this->actingAs($user)
        ->get(route('seller.analytics'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/analytics')
            ->where('filters.period', '30d')
            ->where('summary.total_revenue', fn ($value) => (float) $value === 0.0)
            ->where('summary.total_paid_orders', 0)
            ->where('summary.avg_order_value', fn ($value) => (float) $value === 0.0)
            ->where('summary.monthly_growth', fn ($value) => (float) $value === 0.0)
            ->where('summary.this_month_revenue', fn ($value) => (float) $value === 0.0)
            ->has('revenue_data', 30)
            ->has('top_products', 0)
            ->has('category_breakdown', 0)
        );
});

test('seller analytics only counts paid orders in the selected period and calculates revenue correctly', function () {
    $this->travelTo(Carbon::parse('2026-06-15 12:00:00'));

    [$user, $seller] = createAnalyticsSeller();
    $category = createAnalyticsCategory();
    $productA = createAnalyticsProduct($seller, $category, 'Product A', 100);
    $productB = createAnalyticsProduct($seller, $category, 'Product B', 50);
    $buyer = User::factory()->create(['role' => 'customer']);

    createAnalyticsOrder($buyer, [
        ['product' => $productA, 'price' => 100],
        ['product' => $productB, 'price' => 50],
    ], 'paid', Carbon::parse('2026-06-10 10:00:00'));

    createAnalyticsOrder($buyer, [
        ['product' => $productA, 'price' => 100],
    ], 'paid', Carbon::parse('2026-05-10 10:00:00'));

    createAnalyticsOrder($buyer, [
        ['product' => $productA, 'price' => 999],
    ], 'pending', Carbon::parse('2026-06-12 10:00:00'));

    $this->actingAs($user)
        ->get(route('seller.analytics'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/analytics')
            ->where('filters.period', '30d')
            ->where('summary.total_revenue', fn ($value) => (float) $value === 150.0)
            ->where('summary.total_paid_orders', 1)
            ->where('summary.avg_order_value', fn ($value) => (float) $value === 150.0)
            ->where('summary.this_month_revenue', fn ($value) => (float) $value === 150.0)
            ->where('summary.monthly_growth', fn ($value) => (float) $value === 50.0)
            ->has('revenue_data', 30)
            ->where('revenue_data', fn ($data) => (float) collect($data)->sum('revenue') === 150.0)
            ->has('top_products', 2)
            ->where('top_products.0.title', 'Product A')
            ->where('top_products.0.revenue', fn ($value) => (float) $value === 100.0)
            ->where('top_products.0.sales_count', 1)
            ->where('top_products.1.title', 'Product B')
            ->has('category_breakdown', 1)
            ->where('category_breakdown.0.category', 'Templates')
            ->where('category_breakdown.0.revenue', fn ($value) => (float) $value === 150.0)
            ->where('category_breakdown.0.sales_count', 2)
        );
});

test('seller analytics filters metrics by selected period', function () {
    $this->travelTo(Carbon::parse('2026-06-15 12:00:00'));

    [$user, $seller] = createAnalyticsSeller();
    $category = createAnalyticsCategory();
    $product = createAnalyticsProduct($seller, $category, 'Filtered Product', 10);
    $buyer = User::factory()->create(['role' => 'customer']);

    createAnalyticsOrder($buyer, [
        ['product' => $product, 'price' => 10],
    ], 'paid', Carbon::parse('2026-06-15 09:00:00'));

    createAnalyticsOrder($buyer, [
        ['product' => $product, 'price' => 20],
    ], 'paid', Carbon::parse('2026-06-10 09:00:00'));

    createAnalyticsOrder($buyer, [
        ['product' => $product, 'price' => 30],
    ], 'paid', Carbon::parse('2026-05-20 09:00:00'));

    createAnalyticsOrder($buyer, [
        ['product' => $product, 'price' => 40],
    ], 'paid', Carbon::parse('2026-05-01 09:00:00'));

    $this->actingAs($user)
        ->get(route('seller.analytics', ['period' => 'today']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/analytics')
            ->where('filters.period', 'today')
            ->where('filters.start_date', '2026-06-15')
            ->where('filters.end_date', '2026-06-15')
            ->where('summary.total_revenue', fn ($value) => (float) $value === 10.0)
            ->where('summary.total_paid_orders', 1)
            ->where('summary.avg_order_value', fn ($value) => (float) $value === 10.0)
            ->has('revenue_data', 1)
            ->where('top_products.0.revenue', fn ($value) => (float) $value === 10.0)
            ->where('category_breakdown.0.revenue', fn ($value) => (float) $value === 10.0)
        );

    $this->actingAs($user)
        ->get(route('seller.analytics', ['period' => '7d']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.period', '7d')
            ->where('summary.total_revenue', fn ($value) => (float) $value === 30.0)
            ->where('summary.total_paid_orders', 2)
            ->where('summary.avg_order_value', fn ($value) => (float) $value === 15.0)
            ->has('revenue_data', 7)
            ->where('top_products.0.revenue', fn ($value) => (float) $value === 30.0)
            ->where('category_breakdown.0.revenue', fn ($value) => (float) $value === 30.0)
        );

    $this->actingAs($user)
        ->get(route('seller.analytics', ['period' => '30d']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.period', '30d')
            ->where('summary.total_revenue', fn ($value) => (float) $value === 60.0)
            ->where('summary.total_paid_orders', 3)
            ->where('summary.avg_order_value', fn ($value) => (float) $value === 20.0)
            ->has('revenue_data', 30)
            ->where('top_products.0.revenue', fn ($value) => (float) $value === 60.0)
            ->where('category_breakdown.0.revenue', fn ($value) => (float) $value === 60.0)
        );

    $this->actingAs($user)
        ->get(route('seller.analytics', [
            'period' => 'custom',
            'start_date' => '2026-05-01',
            'end_date' => '2026-05-31',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.period', 'custom')
            ->where('filters.start_date', '2026-05-01')
            ->where('filters.end_date', '2026-05-31')
            ->where('summary.total_revenue', fn ($value) => (float) $value === 70.0)
            ->where('summary.total_paid_orders', 2)
            ->where('summary.avg_order_value', fn ($value) => (float) $value === 35.0)
            ->has('revenue_data', 31)
            ->where('top_products.0.revenue', fn ($value) => (float) $value === 70.0)
            ->where('top_products.0.sales_count', 2)
            ->where('category_breakdown.0.revenue', fn ($value) => (float) $value === 70.0)
            ->where('category_breakdown.0.sales_count', 2)
        );
});

test('seller analytics ignores orders belonging to other sellers', function () {
    $this->travelTo(Carbon::parse('2026-06-15 12:00:00'));

    [$user, $seller] = createAnalyticsSeller();
    [$otherUser, $otherSeller] = createAnalyticsSeller();
    $category = createAnalyticsCategory();

    $ownProduct = createAnalyticsProduct($seller, $category, 'Own Product', 40);
    $otherProduct = createAnalyticsProduct($otherSeller, $category, 'Other Product', 500);

    $buyer = User::factory()->create(['role' => 'customer']);

    createAnalyticsOrder($buyer, [
        ['product' => $ownProduct, 'price' => 40],
    ], 'paid', Carbon::parse('2026-06-10 10:00:00'));

    createAnalyticsOrder($buyer, [
        ['product' => $otherProduct, 'price' => 500],
    ], 'paid', Carbon::parse('2026-06-11 10:00:00'));

    $this->actingAs($user)
        ->get(route('seller.analytics'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/analytics')
            ->where('summary.total_revenue', fn ($value) => (float) $value === 40.0)
            ->where('summary.total_paid_orders', 1)
            ->has('top_products', 1)
            ->where('top_products.0.title', 'Own Product')
            ->where('category_breakdown.0.revenue', fn ($value) => (float) $value === 40.0)
        );
});
