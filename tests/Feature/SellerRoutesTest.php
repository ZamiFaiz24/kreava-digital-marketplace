<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createSellerAccountForTest(): array
{
    $user = User::factory()->create(['role' => 'seller']);

    $seller = Seller::create([
        'user_id' => $user->id,
        'store_name' => 'Test Studio',
        'slug' => 'test-studio-' . $user->id,
        'contact_email' => $user->email,
        'status' => 'approved',
    ]);

    return [$user, $seller];
}

function createTestCategory(): Category
{
    return Category::create([
        'name' => 'Templates',
        'slug' => 'templates-' . fake()->unique()->numberBetween(1, 999999),
    ]);
}

function fakePngUpload(string $name): UploadedFile
{
    $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=');

    return UploadedFile::fake()->createWithContent($name, $png);
}

test('guests are redirected to login from seller routes', function () {
    $this->get(route('seller.products.new'))->assertRedirect(route('login', absolute: false));
    $this->get(route('seller.payouts'))->assertRedirect(route('login', absolute: false));
    $this->get(route('seller.settings'))->assertRedirect(route('login', absolute: false));
});

test('non seller users cannot access seller routes', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)
        ->get(route('seller.products.new'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->get(route('seller.payouts'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->get(route('seller.settings'))
        ->assertForbidden();
});

test('seller can open the product upload form', function () {
    [$user] = createSellerAccountForTest();
    createTestCategory();

    $this->actingAs($user)
        ->get(route('seller.products.new'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/products/create')
            ->has('categories', 1)
        );
});

test('seller can create a product with a thumbnail and digital file', function () {
    Storage::fake('public');
    Storage::fake('local');

    [$user, $seller] = createSellerAccountForTest();
    $category = createTestCategory();

    $response = $this->actingAs($user)->post(route('seller.products.store'), [
        'title' => 'Minimal UI Kit',
        'slug' => 'minimal-ui-kit',
        'description' => 'A clean UI kit for modern products.',
        'category_id' => $category->id,
        'price' => '49.90',
        'thumbnail' => fakePngUpload('thumbnail.png'),
        'file' => UploadedFile::fake()->create('product.zip', 1024, 'application/zip'),
        'preview_link' => 'https://example.com/preview',
        'status' => 'published',
    ]);

    $response->assertRedirect(route('seller.products', absolute: false));

    $product = Product::query()->where('seller_id', $seller->id)->first();

    expect($product)->not->toBeNull()
        ->and($product->title)->toBe('Minimal UI Kit')
        ->and($product->slug)->toBe('minimal-ui-kit')
        ->and($product->category_id)->toBe($category->id)
        ->and((float) $product->price)->toBe(49.9)
        ->and($product->status)->toBe('published')
        ->and($product->file_path)->not->toBeNull()
        ->and($product->file_size)->toBeGreaterThan(0);

    Storage::disk('local')->assertExists($product->file_path);
    expect(Storage::disk('public')->allFiles('products/thumbnails'))->toHaveCount(1);
});

test('product upload validates required fields and unique slug', function () {
    [$user] = createSellerAccountForTest();
    $category = createTestCategory();

    Product::factory()->create([
        'seller_id' => Seller::query()->first()->id,
        'category_id' => $category->id,
        'slug' => 'taken-slug',
    ]);

    $this->actingAs($user)
        ->post(route('seller.products.store'), [
            'title' => '',
            'slug' => 'taken-slug',
            'category_id' => $category->id,
            'price' => '-1',
            'status' => 'pending',
        ])
        ->assertSessionHasErrors(['title', 'slug', 'price', 'file', 'status']);
});

test('seller can see payout history and available balance', function () {
    [$user, $seller] = createSellerAccountForTest();
    $category = createTestCategory();

    $product = Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
    ]);

    $order = Order::create([
        'user_id' => User::factory()->create(['role' => 'customer'])->id,
        'total_price' => 25,
        'payment_status' => 'paid',
        'payment_method' => 'mock',
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'seller_id' => $seller->id,
        'price' => 25,
    ]);

    $this->actingAs($user)
        ->get(route('seller.payouts'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('seller/payouts')
            ->has('payouts', 0)
            ->where('summary.total_revenue', 25)
            ->where('summary.available_balance', 25)
            ->where('summary.pending_balance', 0)
            ->where('summary.paid_out', 0)
        );
});

test('seller can update store settings and upload branding images', function () {
    Storage::fake('public');

    [$user, $seller] = createSellerAccountForTest();

    $response = $this->actingAs($user)->patch(route('seller.settings.update'), [
        'store_name' => 'Updated Studio',
        'description' => 'Updated store description.',
        'contact_email' => 'hello@updated.test',
        'phone' => '08123456789',
        'logo' => fakePngUpload('logo.png'),
        'banner' => fakePngUpload('banner.png'),
    ]);

    $response->assertRedirect(route('seller.settings', absolute: false));

    $seller->refresh();

    expect($seller->store_name)->toBe('Updated Studio')
        ->and($seller->description)->toBe('Updated store description.')
        ->and($seller->contact_email)->toBe('hello@updated.test')
        ->and($seller->phone)->toBe('08123456789')
        ->and($seller->logo)->not->toBeNull()
        ->and($seller->banner)->not->toBeNull();

    expect(Storage::disk('public')->allFiles('sellers/logos'))->toHaveCount(1);
    expect(Storage::disk('public')->allFiles('sellers/banners'))->toHaveCount(1);

    $logo = $seller->logo;
    $banner = $seller->banner;

    $this->actingAs($user)
        ->patch(route('seller.settings.update'), [
            'store_name' => 'Updated Studio Again',
        ])
        ->assertRedirect(route('seller.settings', absolute: false));

    $seller->refresh();

    expect($seller->store_name)->toBe('Updated Studio Again')
        ->and($seller->logo)->toBe($logo)
        ->and($seller->banner)->toBe($banner);
});
