<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createAdminDashboardAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

/**
 * @return array{0: User, 1: Seller}
 */
function createAdminDashboardSeller(string $storeName): array
{
    $user = User::factory()->create(['role' => 'seller']);

    $seller = Seller::create([
        'user_id' => $user->id,
        'store_name' => $storeName,
        'slug' => Str::slug($storeName) . '-' . Str::random(6),
        'contact_email' => $user->email,
        'status' => 'approved',
    ]);

    return [$user, $seller];
}

function createAdminDashboardCategory(): Category
{
    return Category::create([
        'name' => 'Templates',
        'slug' => 'templates-' . Str::random(8),
    ]);
}

function createAdminDashboardProduct(Seller $seller, Category $category, string $status): Product
{
    return Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'status' => $status,
    ]);
}

function createAdminDashboardOrder(User $customer, string $status, float $amount): Order
{
    return Order::factory()->create([
        'user_id' => $customer->id,
        'payment_status' => $status,
        'total_price' => $amount,
        'payment_method' => 'mock',
    ]);
}

test('guests are redirected to login from the admin dashboard', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login', absolute: false));
});

test('non admin users cannot access the admin dashboard', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $seller = User::factory()->create(['role' => 'seller']);

    $this->actingAs($customer)
        ->get(route('admin.dashboard'))
        ->assertForbidden();

    $this->actingAs($seller)
        ->get(route('admin.dashboard'))
        ->assertForbidden();
});

test('admin dashboard returns the correct platform statistics', function () {
    $admin = createAdminDashboardAdmin();

    $customerOne = User::factory()->create(['role' => 'customer']);
    $customerTwo = User::factory()->create(['role' => 'customer']);

    [$sellerUser, $seller] = createAdminDashboardSeller('Admin Test Studio');
    $category = createAdminDashboardCategory();

    createAdminDashboardProduct($seller, $category, 'published');
    createAdminDashboardProduct($seller, $category, 'published');
    createAdminDashboardProduct($seller, $category, 'draft');

    createAdminDashboardOrder($customerOne, 'paid', 100.0);
    createAdminDashboardOrder($customerTwo, 'paid', 50.0);
    createAdminDashboardOrder($customerOne, 'pending', 75.0);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.totalUsers', 4)
            ->where('stats.totalSellers', 1)
            ->where('stats.totalCustomers', 2)
            ->where('stats.totalProducts', 3)
            ->where('stats.publishedProducts', 2)
            ->where('stats.totalOrders', 3)
            ->where('stats.paidOrders', 2)
            ->where('stats.totalRevenue', fn ($value) => (float) $value === 150.0)
            ->has('recentOrders', 3)
            ->has('recentSellers', 1)
            ->where('recentSellers.0.storeName', 'Admin Test Studio')
            ->where('recentSellers.0.owner', $sellerUser->name)
            ->where('recentSellers.0.productsCount', 3)
            ->where('recentSellers.0.status', 'approved')
        );
});

test('admin dashboard handles an empty platform without errors', function () {
    $admin = createAdminDashboardAdmin();

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('stats.totalUsers', 1)
            ->where('stats.totalSellers', 0)
            ->where('stats.totalCustomers', 0)
            ->where('stats.totalProducts', 0)
            ->where('stats.publishedProducts', 0)
            ->where('stats.totalOrders', 0)
            ->where('stats.paidOrders', 0)
            ->where('stats.totalRevenue', fn ($value) => (float) $value === 0.0)
            ->has('recentOrders', 0)
            ->has('recentSellers', 0)
        );
});

test('admin dashboard only returns the five most recent orders and sellers', function () {
    $admin = createAdminDashboardAdmin();
    $customer = User::factory()->create(['role' => 'customer']);

    foreach (range(1, 6) as $index) {
        createAdminDashboardSeller("Recent Seller {$index}");
    }

    foreach (range(1, 7) as $index) {
        createAdminDashboardOrder($customer, 'paid', 10.0 * $index);
    }

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('recentOrders', 5)
            ->has('recentSellers', 5)
        );
});
