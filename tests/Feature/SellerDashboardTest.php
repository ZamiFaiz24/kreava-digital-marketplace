<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
    Carbon::setTestNow(Carbon::parse('2026-11-15 12:00:00'));
});

afterEach(function () {
    Carbon::setTestNow();
});

function createDashboardSeller(?float $monthlyTarget = 1000): array
{
    $user = User::factory()->create(['role' => 'seller']);

    $seller = Seller::create([
        'user_id' => $user->id,
        'store_name' => 'Dashboard Studio',
        'slug' => 'dashboard-studio-'.$user->id,
        'contact_email' => $user->email,
        'status' => 'approved',
        'monthly_target' => $monthlyTarget,
    ]);

    return [$user, $seller];
}

function createDashboardProduct(Seller $seller, string $title, float $price): Product
{
    $category = Category::create([
        'name' => 'Templates',
        'slug' => 'templates-'.fake()->unique()->numberBetween(1, 999999),
    ]);

    return Product::create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'title' => $title,
        'slug' => str($title)->slug().'-'.fake()->unique()->numberBetween(1, 999999),
        'description' => 'Dashboard test product.',
        'price' => $price,
        'status' => 'published',
    ]);
}

function createDashboardOrder(User $customer, string $status, Carbon $date): Order
{
    $order = Order::create([
        'user_id' => $customer->id,
        'total_price' => 0,
        'payment_status' => $status,
        'payment_method' => 'mock',
    ]);

    $order->forceFill(['created_at' => $date, 'updated_at' => $date])->save();

    return $order;
}

function addDashboardOrderItem(Order $order, Product $product, Carbon $date, float $price): OrderItem
{
    $item = OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'seller_id' => $product->seller_id,
        'price' => $price,
    ]);

    $item->forceFill(['created_at' => $date, 'updated_at' => $date])->save();

    return $item;
}

test('seller dashboard exposes monthly metrics, deltas, pending actions and top product prices', function () {
    [$user, $seller] = createDashboardSeller(1000);
    $customer = User::factory()->create(['role' => 'customer']);

    $productA = createDashboardProduct($seller, 'UI Kit Pro', 100);
    $productB = createDashboardProduct($seller, 'Icon Pack', 50);

    $paidOrderOne = createDashboardOrder($customer, 'paid', Carbon::parse('2026-11-10 10:00:00'));
    addDashboardOrderItem($paidOrderOne, $productA, Carbon::parse('2026-11-10 10:00:00'), 100);
    addDashboardOrderItem($paidOrderOne, $productB, Carbon::parse('2026-11-10 10:00:00'), 50);

    $paidOrderTwo = createDashboardOrder($customer, 'paid', Carbon::parse('2026-11-12 10:00:00'));
    addDashboardOrderItem($paidOrderTwo, $productA, Carbon::parse('2026-11-12 10:00:00'), 100);

    $pendingOrder = createDashboardOrder($customer, 'pending', Carbon::parse('2026-11-13 10:00:00'));
    addDashboardOrderItem($pendingOrder, $productA, Carbon::parse('2026-11-13 10:00:00'), 100);

    $failedOrder = createDashboardOrder($customer, 'failed', Carbon::parse('2026-11-14 10:00:00'));
    addDashboardOrderItem($failedOrder, $productA, Carbon::parse('2026-11-14 10:00:00'), 100);

    $lastMonthOrder = createDashboardOrder($customer, 'paid', Carbon::parse('2026-10-10 10:00:00'));
    addDashboardOrderItem($lastMonthOrder, $productA, Carbon::parse('2026-10-10 10:00:00'), 100);

    $this->actingAs($user)
        ->get(route('seller.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/dashboard')
            ->where('sellerProfile.status', 'approved')
            ->where('sellerProfile.monthlyTarget', fn ($value) => (float) $value === 1000.0)
            ->where('dashboardStats.totalRevenue', fn ($value) => (float) $value === 250.0)
            ->where('dashboardStats.totalSales', 2)
            ->where('dashboardStats.productsSold', 3)
            ->where('dashboardStats.conversionRate', fn ($value) => (float) $value === 50.0)
            ->where('dashboardStats.deltas.revenue', fn ($value) => (float) $value === 150.0)
            ->where('dashboardStats.deltas.sales', fn ($value) => (float) $value === 100.0)
            ->where('dashboardStats.deltas.products', fn ($value) => (float) $value === 200.0)
            ->where('dashboardStats.deltas.conversion', fn ($value) => (float) $value === -50.0)
            ->has('revenueData.weekly', 7)
            ->has('revenueData.monthly', 6)
            ->where('pendingActions.pendingOrders', 1)
            ->where('pendingActions.availablePayout', fn ($value) => (float) $value === 350.0)
            ->has('topProducts', 2)
            ->where('topProducts.0.price', fn ($value) => (float) $value === 100.0)
            ->where('topProducts.0.ordersCount', 3)
            ->where('topProducts.1.price', fn ($value) => (float) $value === 50.0)
            ->where('recentOrders.0.status', 'cancelled')
            ->where('recentOrders.1.status', 'processing')
            ->where('recentOrders.2.status', 'completed')
        );
});

test('seller dashboard returns zeros and a six month series for an empty store', function () {
    [$user] = createDashboardSeller(0);

    $this->actingAs($user)
        ->get(route('seller.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/dashboard')
            ->where('dashboardStats.totalRevenue', fn ($value) => (float) $value === 0.0)
            ->where('dashboardStats.totalSales', 0)
            ->where('dashboardStats.productsSold', 0)
            ->where('dashboardStats.conversionRate', fn ($value) => (float) $value === 0.0)
            ->where('dashboardStats.deltas.revenue', fn ($value) => (float) $value === 0.0)
            ->where('dashboardStats.deltas.conversion', fn ($value) => (float) $value === 0.0)
            ->has('revenueData.weekly', 7)
            ->has('revenueData.monthly', 6)
            ->has('topProducts', 0)
            ->has('recentOrders', 0)
            ->where('pendingActions.pendingOrders', 0)
            ->where('pendingActions.availablePayout', fn ($value) => (float) $value === 0.0)
        );
});

test('seller can update the monthly target from store settings', function () {
    [$user, $seller] = createDashboardSeller(1000);

    $this->actingAs($user)
        ->patch(route('seller.settings.update'), [
            'store_name' => 'Updated Dashboard Studio',
            'monthly_target' => 2500,
        ])
        ->assertRedirect(route('seller.settings', absolute: false));

    expect((float) $seller->refresh()->monthly_target)->toBe(2500.0);
});

test('seller settings preserves the monthly target when the field is submitted empty', function () {
    [$user, $seller] = createDashboardSeller(1000);

    $this->actingAs($user)
        ->patch(route('seller.settings.update'), [
            'store_name' => 'Dashboard Studio',
            'monthly_target' => '',
        ])
        ->assertRedirect(route('seller.settings', absolute: false));

    expect((float) $seller->refresh()->monthly_target)->toBe(1000.0);
});

test('seller settings rejects a negative monthly target', function () {
    [$user] = createDashboardSeller(1000);

    $this->actingAs($user)
        ->patch(route('seller.settings.update'), [
            'store_name' => 'Dashboard Studio',
            'monthly_target' => -10,
        ])
        ->assertSessionHasErrors('monthly_target');
});
