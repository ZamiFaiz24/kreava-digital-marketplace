<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payout;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

/**
 * @return array{0: User, 1: Seller}
 */
function createPayoutTestSeller(string $storeName = 'Payout Studio'): array
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

function createPayoutTestCategory(): Category
{
    return Category::create([
        'name' => 'Templates',
        'slug' => 'templates-' . Str::random(8),
    ]);
}

function createPayoutTestProduct(Seller $seller, Category $category, string $title = 'Payout Product'): Product
{
    return Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'title' => $title,
        'slug' => Str::slug($title) . '-' . Str::random(6),
        'status' => 'published',
    ]);
}

function createPayoutTestOrderItem(Seller $seller, Product $product, float $amount, string $paymentStatus = 'paid'): OrderItem
{
    $order = Order::create([
        'user_id' => User::factory()->create(['role' => 'customer'])->id,
        'total_price' => $amount,
        'payment_status' => $paymentStatus,
        'payment_method' => 'mock',
    ]);

    return OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'seller_id' => $seller->id,
        'price' => $amount,
    ]);
}

test('guests are redirected to login from payout routes', function () {
    $this->get(route('seller.payouts'))
        ->assertRedirect(route('login', absolute: false));

    $this->get(route('admin.payouts'))
        ->assertRedirect(route('login', absolute: false));

    $this->post(route('seller.payouts.request'), ['amount' => 10])
        ->assertRedirect(route('login', absolute: false));
});

test('payout routes are protected by the correct roles', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    [$sellerUser, $seller] = createPayoutTestSeller('Role Protected Studio');

    $payout = Payout::create([
        'seller_id' => $seller->id,
        'amount' => 20,
        'status' => 'pending',
    ]);

    $this->actingAs($customer)
        ->get(route('seller.payouts'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->post(route('seller.payouts.request'), ['amount' => 10])
        ->assertForbidden();

    $this->actingAs($sellerUser)
        ->get(route('admin.payouts'))
        ->assertForbidden();

    $this->actingAs($sellerUser)
        ->post(route('admin.payouts.approve', $payout))
        ->assertForbidden();
});

test('seller payout page calculates balance from paid orders and existing payouts', function () {
    [$user, $seller] = createPayoutTestSeller('Balance Studio');
    $category = createPayoutTestCategory();
    $product = createPayoutTestProduct($seller, $category);

    createPayoutTestOrderItem($seller, $product, 100, 'paid');
    createPayoutTestOrderItem($seller, $product, 50, 'pending');
    createPayoutTestOrderItem($seller, $product, 25, 'failed');

    [, $otherSeller] = createPayoutTestSeller('Other Studio');
    $otherProduct = createPayoutTestProduct($otherSeller, $category, 'Other Product');
    createPayoutTestOrderItem($otherSeller, $otherProduct, 999, 'paid');

    Payout::create([
        'seller_id' => $seller->id,
        'amount' => 20,
        'status' => 'pending',
    ]);

    Payout::create([
        'seller_id' => $seller->id,
        'amount' => 30,
        'status' => 'paid',
        'paid_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('seller.payouts'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/payouts')
            ->has('payouts', 2)
            ->where('summary.total_revenue', fn ($value) => (float) $value === 100.0)
            ->where('summary.available_balance', fn ($value) => (float) $value === 50.0)
            ->where('summary.pending_balance', fn ($value) => (float) $value === 20.0)
            ->where('summary.paid_out', fn ($value) => (float) $value === 30.0)
        );
});

test('seller can request a payout from available balance', function () {
    [$user, $seller] = createPayoutTestSeller('Request Studio');
    $category = createPayoutTestCategory();
    $product = createPayoutTestProduct($seller, $category);

    createPayoutTestOrderItem($seller, $product, 100, 'paid');

    $this->actingAs($user)
        ->post(route('seller.payouts.request'), ['amount' => 40])
        ->assertRedirect(route('seller.payouts'));

    $payout = Payout::query()->where('seller_id', $seller->id)->first();

    expect($payout)->not->toBeNull()
        ->and((float) $payout->amount)->toBe(40.0)
        ->and($payout->status)->toBe('pending')
        ->and($payout->paid_at)->toBeNull();

    $this->actingAs($user)
        ->get(route('seller.payouts'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('summary.available_balance', fn ($value) => (float) $value === 60.0)
            ->where('summary.pending_balance', fn ($value) => (float) $value === 40.0)
        );
});

test('seller cannot request more than the available balance', function () {
    [$user, $seller] = createPayoutTestSeller('Limited Studio');
    $category = createPayoutTestCategory();
    $product = createPayoutTestProduct($seller, $category);

    createPayoutTestOrderItem($seller, $product, 100, 'paid');

    Payout::create([
        'seller_id' => $seller->id,
        'amount' => 80,
        'status' => 'pending',
    ]);

    $this->actingAs($user)
        ->from(route('seller.payouts'))
        ->post(route('seller.payouts.request'), ['amount' => 30])
        ->assertRedirect(route('seller.payouts'))
        ->assertSessionHasErrors('amount');

    expect(Payout::query()->where('seller_id', $seller->id)->count())->toBe(1);
});

test('admin can see all payouts and approve or reject pending payouts', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    [, $seller] = createPayoutTestSeller('Admin Payout Studio');

    $approvedPayout = Payout::create([
        'seller_id' => $seller->id,
        'amount' => 40,
        'status' => 'pending',
    ]);

    $rejectedPayout = Payout::create([
        'seller_id' => $seller->id,
        'amount' => 15,
        'status' => 'pending',
    ]);

    Payout::create([
        'seller_id' => $seller->id,
        'amount' => 25,
        'status' => 'paid',
        'paid_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.payouts'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/payouts')
            ->has('payouts', 3)
            ->where('payouts.0.seller', 'Admin Payout Studio')
        );

    $this->actingAs($admin)
        ->post(route('admin.payouts.approve', $approvedPayout))
        ->assertRedirect(route('admin.payouts'));

    $this->actingAs($admin)
        ->post(route('admin.payouts.reject', $rejectedPayout))
        ->assertRedirect(route('admin.payouts'));

    expect($approvedPayout->fresh()->status)->toBe('paid')
        ->and($approvedPayout->fresh()->paid_at)->not->toBeNull()
        ->and($rejectedPayout->fresh()->status)->toBe('failed')
        ->and($rejectedPayout->fresh()->paid_at)->toBeNull();
});
