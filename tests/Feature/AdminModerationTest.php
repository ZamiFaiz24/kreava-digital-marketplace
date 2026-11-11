<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createModerationAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

/**
 * @return array{0: User, 1: Seller}
 */
function createModerationSeller(string $storeName, string $status = 'pending'): array
{
    $user = User::factory()->create(['role' => 'seller']);

    $seller = Seller::create([
        'user_id' => $user->id,
        'store_name' => $storeName,
        'slug' => Str::slug($storeName) . '-' . Str::random(6),
        'contact_email' => $user->email,
        'status' => $status,
    ]);

    return [$user, $seller];
}

function createModerationCategory(): Category
{
    return Category::create([
        'name' => 'Templates',
        'slug' => 'templates-' . Str::random(8),
    ]);
}

function createModerationProduct(Seller $seller, Category $category, string $title, string $status): Product
{
    return Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'title' => $title,
        'slug' => Str::slug($title) . '-' . Str::random(6),
        'price' => 49.90,
        'status' => $status,
    ]);
}

test('guests are redirected to login from admin moderation routes', function () {
    $this->get(route('admin.moderation.products'))
        ->assertRedirect(route('login', absolute: false));

    $this->get(route('admin.moderation.sellers'))
        ->assertRedirect(route('login', absolute: false));
});

test('non admin users cannot access admin moderation routes', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $sellerUser = User::factory()->create(['role' => 'seller']);

    $this->actingAs($customer)
        ->get(route('admin.moderation.products'))
        ->assertForbidden();

    $this->actingAs($sellerUser)
        ->get(route('admin.moderation.sellers'))
        ->assertForbidden();

    [, $seller] = createModerationSeller('Protected Studio', 'pending');
    $category = createModerationCategory();
    $product = createModerationProduct($seller, $category, 'Protected Product', 'pending');

    $this->actingAs($customer)
        ->post(route('admin.moderation.products.approve', $product))
        ->assertForbidden();

    $this->actingAs($customer)
        ->post(route('admin.moderation.products.takedown', $product))
        ->assertForbidden();
});

test('admin can see all products in the moderation list', function () {
    $admin = createModerationAdmin();
    [$sellerUser, $seller] = createModerationSeller('Moderation Studio', 'approved');
    $category = createModerationCategory();

    createModerationProduct($seller, $category, 'Pending Product', 'pending');
    createModerationProduct($seller, $category, 'Draft Product', 'draft');
    createModerationProduct($seller, $category, 'Rejected Product', 'rejected');
    createModerationProduct($seller, $category, 'Published Product', 'published');

    $this->actingAs($admin)
        ->get(route('admin.moderation.products'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/moderation/products')
            ->has('products', 4)
            ->where('products', function ($products) use ($sellerUser) {
                $items = collect($products);

                return $items->contains(fn ($product) => $product['title'] === 'Published Product'
                        && $product['status'] === 'published')
                    && $items->contains(fn ($product) => $product['title'] === 'Pending Product'
                        && $product['status'] === 'pending'
                        && $product['seller'] === 'Moderation Studio'
                        && $product['sellerEmail'] === $sellerUser->email
                        && $product['category'] === 'Templates'
                        && (float) $product['price'] === 49.9);
            })
        );
});

test('admin can see only non approved sellers in the moderation list', function () {
    $admin = createModerationAdmin();
    [$pendingUser, $pendingSeller] = createModerationSeller('Pending Studio', 'pending');
    createModerationSeller('Rejected Studio', 'rejected');
    createModerationSeller('Suspended Studio', 'suspended');
    createModerationSeller('Approved Studio', 'approved');

    $category = createModerationCategory();
    createModerationProduct($pendingSeller, $category, 'Pending Seller Product', 'pending');

    $this->actingAs($admin)
        ->get(route('admin.moderation.sellers'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/moderation/sellers')
            ->has('sellers', 3)
            ->where('sellers', function ($sellers) use ($pendingUser) {
                $items = collect($sellers);

                return $items->every(fn ($seller) => $seller['status'] !== 'approved')
                    && $items->contains(fn ($seller) => $seller['storeName'] === 'Pending Studio'
                        && $seller['owner'] === $pendingUser->name
                        && $seller['email'] === $pendingUser->email
                        && $seller['productsCount'] === 1);
            })
        );
});

test('admin can approve and reject products', function () {
    $admin = createModerationAdmin();
    [, $seller] = createModerationSeller('Product Moderation Studio', 'approved');
    $category = createModerationCategory();

    $approvedProduct = createModerationProduct($seller, $category, 'Approve Me', 'pending');
    $rejectedProduct = createModerationProduct($seller, $category, 'Reject Me', 'draft');

    $this->actingAs($admin)
        ->post(route('admin.moderation.products.approve', $approvedProduct))
        ->assertRedirect(route('admin.moderation.products'));

    $this->actingAs($admin)
        ->post(route('admin.moderation.products.reject', $rejectedProduct))
        ->assertRedirect(route('admin.moderation.products'));

    expect($approvedProduct->fresh()->status)->toBe('published')
        ->and($rejectedProduct->fresh()->status)->toBe('rejected');
});

test('admin can take down published products only', function () {
    $admin = createModerationAdmin();
    [, $seller] = createModerationSeller('Takedown Studio', 'approved');
    $category = createModerationCategory();

    $publishedProduct = createModerationProduct($seller, $category, 'Published Product', 'published');
    $pendingProduct = createModerationProduct($seller, $category, 'Pending Product', 'pending');

    $this->actingAs($admin)
        ->post(route('admin.moderation.products.takedown', $publishedProduct))
        ->assertRedirect(route('admin.moderation.products'))
        ->assertSessionHas('success');

    expect($publishedProduct->fresh()->status)->toBe('rejected');

    $this->actingAs($admin)
        ->post(route('admin.moderation.products.takedown', $pendingProduct))
        ->assertRedirect(route('admin.moderation.products'))
        ->assertSessionHas('error');

    expect($pendingProduct->fresh()->status)->toBe('pending');
});

test('admin can approve and reject sellers', function () {
    $admin = createModerationAdmin();
    [, $approvedSeller] = createModerationSeller('Approve Seller Studio', 'pending');
    [, $rejectedSeller] = createModerationSeller('Reject Seller Studio', 'pending');

    $this->actingAs($admin)
        ->post(route('admin.moderation.sellers.approve', $approvedSeller))
        ->assertRedirect(route('admin.moderation.sellers'));

    $this->actingAs($admin)
        ->post(route('admin.moderation.sellers.reject', $rejectedSeller))
        ->assertRedirect(route('admin.moderation.sellers'));

    expect($approvedSeller->fresh()->status)->toBe('approved')
        ->and($rejectedSeller->fresh()->status)->toBe('rejected');
});
