<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

/**
 * @return array{0: User, 1: Seller}
 */
function createProductEditSeller(string $storeName = 'Edit Studio'): array
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

function createProductEditCategory(): Category
{
    return Category::create([
        'name' => 'Templates',
        'slug' => 'templates-' . Str::random(8),
    ]);
}

function createProductEditProduct(Seller $seller, Category $category, array $attributes = []): Product
{
    return Product::factory()->create(array_merge([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'status' => 'published',
    ], $attributes));
}

function productEditPayload(Product $product, array $overrides = []): array
{
    return array_merge([
        'title' => $product->title,
        'slug' => $product->slug,
        'description' => $product->description ?? '',
        'category_id' => $product->category_id,
        'price' => (string) $product->price,
        'preview_link' => $product->preview_link ?? '',
    ], $overrides);
}

function attachPaidOrderToProduct(Product $product): OrderItem
{
    $order = Order::create([
        'user_id' => User::factory()->create(['role' => 'customer'])->id,
        'total_price' => $product->price,
        'payment_status' => 'paid',
        'payment_method' => 'mock',
    ]);

    return OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'seller_id' => $product->seller_id,
        'price' => $product->price,
    ]);
}

test('guests are redirected to login from product management routes', function () {
    [, $seller] = createProductEditSeller();
    $category = createProductEditCategory();
    $product = createProductEditProduct($seller, $category);

    $this->get(route('seller.products.edit', $product))
        ->assertRedirect(route('login', absolute: false));

    $this->patch(route('seller.products.update', $product), productEditPayload($product))
        ->assertRedirect(route('login', absolute: false));

    $this->delete(route('seller.products.destroy', $product))
        ->assertRedirect(route('login', absolute: false));
});

test('non seller users cannot manage products', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    [, $seller] = createProductEditSeller();
    $category = createProductEditCategory();
    $product = createProductEditProduct($seller, $category);

    $this->actingAs($customer)
        ->get(route('seller.products.edit', $product))
        ->assertForbidden();

    $this->actingAs($customer)
        ->patch(route('seller.products.update', $product), productEditPayload($product))
        ->assertForbidden();

    $this->actingAs($customer)
        ->delete(route('seller.products.destroy', $product))
        ->assertForbidden();
});

test('seller can view the edit product page', function () {
    [$user, $seller] = createProductEditSeller();
    $category = createProductEditCategory();
    $product = createProductEditProduct($seller, $category, ['title' => 'Editable Product']);

    $this->actingAs($user)
        ->get(route('seller.products.edit', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/products/edit')
            ->where('product.id', $product->id)
            ->where('product.title', 'Editable Product')
            ->where('product.category_id', $category->id)
            ->where('can_delete', true)
            ->has('categories', 1)
        );
});

test('seller cannot edit or delete another sellers product', function () {
    [$user] = createProductEditSeller('Owner Studio');
    [, $otherSeller] = createProductEditSeller('Other Studio');
    $category = createProductEditCategory();
    $otherProduct = createProductEditProduct($otherSeller, $category);

    $this->actingAs($user)
        ->get(route('seller.products.edit', $otherProduct))
        ->assertForbidden();

    $this->actingAs($user)
        ->patch(route('seller.products.update', $otherProduct), productEditPayload($otherProduct, ['title' => 'Hijacked']))
        ->assertForbidden();

    $this->actingAs($user)
        ->delete(route('seller.products.destroy', $otherProduct))
        ->assertForbidden();

    expect($otherProduct->fresh())->not->toBeNull()
        ->and($otherProduct->fresh()->title)->not->toBe('Hijacked');
});

test('seller can update, unpublish, and publish a product', function () {
    [$user, $seller] = createProductEditSeller();
    $category = createProductEditCategory();
    $newCategory = createProductEditCategory();
    $product = createProductEditProduct($seller, $category);

    $this->actingAs($user)
        ->patch(route('seller.products.update', $product), productEditPayload($product, [
            'title' => 'Updated Product',
            'slug' => 'updated-product',
            'description' => 'Updated description.',
            'category_id' => $newCategory->id,
            'price' => '79.99',
            'preview_link' => 'https://example.com/updated',
            'status' => 'draft',
        ]))
        ->assertRedirect(route('seller.products'))
        ->assertSessionHas('success');

    $product->refresh();

    expect($product->title)->toBe('Updated Product')
        ->and($product->slug)->toBe('updated-product')
        ->and($product->description)->toBe('Updated description.')
        ->and($product->category_id)->toBe($newCategory->id)
        ->and((float) $product->price)->toBe(79.99)
        ->and($product->preview_link)->toBe('https://example.com/updated')
        ->and($product->status)->toBe('draft');

    $this->actingAs($user)
        ->patch(route('seller.products.update', $product), productEditPayload($product, [
            'status' => 'published',
        ]))
        ->assertRedirect(route('seller.products'));

    expect($product->fresh()->status)->toBe('published');
});

test('seller can update a product using only the prefilled form fields', function () {
    [$user, $seller] = createProductEditSeller();
    $category = createProductEditCategory();
    $product = createProductEditProduct($seller, $category, [
        'description' => null,
        'preview_link' => null,
        'thumbnail' => null,
    ]);

    $this->actingAs($user)
        ->post(route('seller.products.update', $product), [
            '_method' => 'patch',
            'title' => $product->title,
            'slug' => $product->slug,
            'description' => '',
            'category_id' => $category->id,
            'price' => '55.00',
            'preview_link' => '',
            'thumbnail' => '',
        ])
        ->assertRedirect(route('seller.products'))
        ->assertSessionHasNoErrors();

    expect((float) $product->fresh()->price)->toBe(55.0);
});

test('seller can update a product with a new thumbnail using method spoofing', function () {
    Storage::fake('public');

    [$user, $seller] = createProductEditSeller();
    $category = createProductEditCategory();
    $product = createProductEditProduct($seller, $category);
    $thumbnail = UploadedFile::fake()->createWithContent(
        'thumbnail.png',
        base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=')
    );

    $this->actingAs($user)
        ->call('POST', route('seller.products.update', $product), [
            '_method' => 'put',
            ...productEditPayload($product),
        ], [], ['thumbnail' => $thumbnail])
        ->assertRedirect(route('seller.products'))
        ->assertSessionHasNoErrors();

    expect($product->fresh()->thumbnail)->not->toBeNull();
});

test('seller cannot delete a product that has been purchased', function () {
    [$user, $seller] = createProductEditSeller();
    $category = createProductEditCategory();
    $product = createProductEditProduct($seller, $category);

    attachPaidOrderToProduct($product);

    $this->actingAs($user)
        ->get(route('seller.products.edit', $product))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('can_delete', false));

    $this->actingAs($user)
        ->delete(route('seller.products.destroy', $product))
        ->assertRedirect(route('seller.products'))
        ->assertSessionHas('error');

    expect($product->fresh())->not->toBeNull();
});

test('seller can delete a product that has not been purchased', function () {
    [$user, $seller] = createProductEditSeller();
    $category = createProductEditCategory();
    $product = createProductEditProduct($seller, $category);

    $this->actingAs($user)
        ->delete(route('seller.products.destroy', $product))
        ->assertRedirect(route('seller.products'))
        ->assertSessionHas('success');

    expect(Product::query()->find($product->id))->toBeNull();
});
