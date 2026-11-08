<?php

use App\Models\Category;
use App\Models\Download;
use App\Models\DownloadLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @return array{0: User, 1: Product, 2: Download}
 */
function createDownloadFlowFixture(string $paymentStatus = 'paid', ?string $filePath = 'products/files/download.zip'): array
{
    $sellerUser = User::factory()->create(['role' => 'seller']);

    $seller = Seller::create([
        'user_id' => $sellerUser->id,
        'store_name' => 'Download Studio',
        'slug' => 'download-studio-' . Str::random(8),
        'status' => 'approved',
    ]);

    $category = Category::create([
        'name' => 'Templates',
        'slug' => 'download-templates-' . Str::random(8),
    ]);

    $product = Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'title' => 'Downloadable Product',
        'file_path' => $filePath,
        'status' => 'published',
    ]);

    $buyer = User::factory()->create(['role' => 'customer']);

    $order = Order::create([
        'user_id' => $buyer->id,
        'total_price' => 25,
        'payment_status' => $paymentStatus,
        'payment_method' => 'mock',
    ]);

    $orderItem = OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'seller_id' => $seller->id,
        'price' => 25,
    ]);

    $download = Download::create([
        'user_id' => $buyer->id,
        'product_id' => $product->id,
        'order_item_id' => $orderItem->id,
    ]);

    return [$buyer, $product, $download];
}

test('guests are redirected to login when accessing a download file', function () {
    [, , $download] = createDownloadFlowFixture();

    $this->get(route('downloads.download', $download))
        ->assertRedirect(route('login', absolute: false));
});

test('non owners cannot download a file', function () {
    [, , $download] = createDownloadFlowFixture();
    $otherUser = User::factory()->create(['role' => 'customer']);

    $this->actingAs($otherUser)
        ->get(route('downloads.download', $download))
        ->assertForbidden();
});

test('downloads with an unpaid order are forbidden', function () {
    [$buyer, , $download] = createDownloadFlowFixture('pending');

    $this->actingAs($buyer)
        ->get(route('downloads.download', $download))
        ->assertForbidden();

    expect(DownloadLog::query()->where('download_id', $download->id)->count())->toBe(0);
});

test('owners can download a paid product file and it is logged', function () {
    Storage::fake('local');

    [$buyer, $product, $download] = createDownloadFlowFixture('paid', 'products/files/guide.zip');
    Storage::disk('local')->put($product->file_path, 'digital file contents');

    $response = $this->actingAs($buyer)
        ->get(route('downloads.download', $download));

    $response->assertOk();
    $response->assertDownload($product->title . '.zip');

    expect($response->streamedContent())->toBe('digital file contents');
    expect(DownloadLog::query()->where('download_id', $download->id)->count())->toBe(1);

    $download->refresh();

    expect($download->download_count)->toBe(1)
        ->and($download->last_downloaded_at)->not->toBeNull();
});

test('downloads without a file path return not found', function () {
    [$buyer, , $download] = createDownloadFlowFixture('paid', null);

    $this->actingAs($buyer)
        ->get(route('downloads.download', $download))
        ->assertNotFound();
});

test('downloads whose file is missing from storage return not found', function () {
    Storage::fake('local');

    [$buyer, , $download] = createDownloadFlowFixture('paid', 'products/files/missing.zip');

    $this->actingAs($buyer)
        ->get(route('downloads.download', $download))
        ->assertNotFound();
});

test('downloads are rate limited to five per month', function () {
    Storage::fake('local');

    [$buyer, $product, $download] = createDownloadFlowFixture('paid', 'products/files/guide.zip');
    Storage::disk('local')->put($product->file_path, 'digital file contents');

    foreach (range(1, 5) as $index) {
        DownloadLog::create(['download_id' => $download->id]);
    }

    $response = $this->from(route('downloads.index'))
        ->actingAs($buyer)
        ->get(route('downloads.download', $download));

    $response->assertRedirect(route('downloads.index'));
    $response->assertSessionHas('error', 'Download limit reached (5 per month).');

    expect(DownloadLog::query()->where('download_id', $download->id)->count())->toBe(5);

    $download->refresh();

    expect($download->download_count)->toBe(0)
        ->and($download->last_downloaded_at)->toBeNull();
});
