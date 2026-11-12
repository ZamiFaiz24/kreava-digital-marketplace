<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->withoutVite();
});

function createExportTestAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

function createExportTestCustomer(string $name = 'Export Buyer', string $email = 'buyer@example.com'): User
{
    return User::factory()->create([
        'role' => 'customer',
        'name' => $name,
        'email' => $email,
    ]);
}

/**
 * @return array{0: User, 1: Seller}
 */
function createExportTestSeller(string $storeName = 'Export Studio'): array
{
    $user = User::factory()->create(['role' => 'seller']);

    $seller = Seller::create([
        'user_id' => $user->id,
        'store_name' => $storeName,
        'slug' => Str::slug($storeName).'-'.Str::random(6),
        'contact_email' => $user->email,
        'status' => 'approved',
    ]);

    return [$user, $seller];
}

function createExportTestCategory(): Category
{
    return Category::create([
        'name' => 'Templates',
        'slug' => 'templates-'.Str::random(8),
    ]);
}

function createExportTestProduct(Seller $seller, Category $category, string $title, float $price): Product
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
function createExportTestOrder(
    User $buyer,
    array $items,
    string $paymentStatus = 'paid',
    ?Carbon $createdAt = null,
    ?Carbon $refundedAt = null,
    ?float $total = null,
): Order {
    $order = Order::create([
        'user_id' => $buyer->id,
        'total_price' => $total ?? collect($items)->sum('price'),
        'payment_status' => $paymentStatus,
        'payment_method' => 'mock',
        'refunded_at' => $refundedAt,
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

/**
 * @return array<int, array<int, string|null>>
 */
function parseExportCsv(string $content): array
{
    if (str_starts_with($content, "\xEF\xBB\xBF")) {
        $content = substr($content, 3);
    }

    $lines = preg_split('/\r\n|\n|\r/', rtrim($content, "\r\n"));

    return array_map(fn (string $line) => str_getcsv($line), $lines);
}

function exportOrderNumber(Order $order): string
{
    return 'ORD-'.str_pad((string) $order->id, 4, '0', STR_PAD_LEFT);
}

test('guests are redirected to login from csv export routes', function () {
    $this->get(route('seller.reports.export'))
        ->assertRedirect(route('login', absolute: false));

    $this->get(route('admin.orders.export'))
        ->assertRedirect(route('login', absolute: false));
});

test('non seller users cannot export seller reports', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->actingAs($customer)
        ->get(route('seller.reports.export'))
        ->assertForbidden();
});

test('non admin users cannot export admin orders', function () {
    $seller = User::factory()->create(['role' => 'seller']);

    $this->actingAs($seller)
        ->get(route('admin.orders.export'))
        ->assertForbidden();
});

test('seller can export only their order items with active date filters', function () {
    $this->travelTo(Carbon::parse('2026-06-15 12:00:00'));

    [$sellerUser, $seller] = createExportTestSeller('Export Studio');
    [, $otherSeller] = createExportTestSeller('Other Studio');
    $category = createExportTestCategory();
    $ownProduct = createExportTestProduct($seller, $category, 'Own Product', 25.5);
    $otherProduct = createExportTestProduct($otherSeller, $category, 'Other Product', 500);
    $buyer = createExportTestCustomer('Alice Buyer', 'alice@example.com');

    $juneOrder = createExportTestOrder(
        $buyer,
        [['product' => $ownProduct, 'price' => 25.5]],
        'paid',
        Carbon::parse('2026-06-10 10:00:00'),
    );

    createExportTestOrder(
        $buyer,
        [['product' => $ownProduct, 'price' => 25.5]],
        'pending',
        Carbon::parse('2026-05-10 10:00:00'),
    );

    createExportTestOrder(
        $buyer,
        [['product' => $otherProduct, 'price' => 500]],
        'paid',
        Carbon::parse('2026-06-11 10:00:00'),
    );

    $response = $this->actingAs($sellerUser)->get(route('seller.reports.export', [
        'start_date' => '2026-06-01',
        'end_date' => '2026-06-30',
    ]));

    $response->assertOk();

    expect($response->headers->get('Content-Type'))->toContain('text/csv')
        ->and($response->headers->get('Content-Disposition'))->toContain('attachment')->toContain('.csv');

    $content = $response->streamedContent();

    expect(str_starts_with($content, "\xEF\xBB\xBF"))->toBeTrue();

    $rows = parseExportCsv($content);

    expect($rows[0])->toBe([
        'order_number',
        'customer',
        'product',
        'qty',
        'price',
        'total',
        'payment_status',
        'created_at',
    ])
        ->and($rows)->toHaveCount(2)
        ->and($rows[1][0])->toBe(exportOrderNumber($juneOrder))
        ->and($rows[1][1])->toBe('Alice Buyer')
        ->and($rows[1][2])->toBe('Own Product')
        ->and($rows[1][3])->toBe('1')
        ->and($rows[1][4])->toBe('25.50')
        ->and($rows[1][5])->toBe('25.50')
        ->and($rows[1][6])->toBe('paid')
        ->and($rows[1][7])->toBe('2026-06-10 10:00:00');

    $allRows = parseExportCsv(
        $this->actingAs($sellerUser)
            ->get(route('seller.reports.export'))
            ->streamedContent()
    );

    expect($allRows)->toHaveCount(3);
});

test('admin can export orders with status and date filters', function () {
    $this->travelTo(Carbon::parse('2026-06-15 12:00:00'));

    $admin = createExportTestAdmin();
    $alice = createExportTestCustomer('Alice Buyer', 'alice@example.com');
    $bob = createExportTestCustomer('Bob Buyer', 'bob@example.com');

    $paidOrder = createExportTestOrder(
        $alice,
        [],
        'paid',
        Carbon::parse('2026-06-10 10:00:00'),
        null,
        100.0,
    );

    createExportTestOrder(
        $bob,
        [],
        'pending',
        Carbon::parse('2026-06-11 10:00:00'),
        null,
        50.0,
    );

    $refundedOrder = createExportTestOrder(
        $alice,
        [],
        'paid',
        Carbon::parse('2026-06-12 10:00:00'),
        Carbon::parse('2026-06-13 09:00:00'),
        75.0,
    );

    createExportTestOrder(
        $alice,
        [],
        'paid',
        Carbon::parse('2026-05-10 10:00:00'),
        null,
        80.0,
    );

    $response = $this->actingAs($admin)->get(route('admin.orders.export', [
        'status' => 'paid',
        'start_date' => '2026-06-01',
        'end_date' => '2026-06-30',
    ]));

    $response->assertOk();

    expect($response->headers->get('Content-Type'))->toContain('text/csv')
        ->and($response->headers->get('Content-Disposition'))->toContain('attachment')->toContain('.csv');

    $content = $response->streamedContent();

    expect(str_starts_with($content, "\xEF\xBB\xBF"))->toBeTrue();

    $rows = parseExportCsv($content);

    expect($rows[0])->toBe([
        'order_number',
        'customer',
        'email',
        'total',
        'payment_status',
        'refunded_at',
        'created_at',
    ])
        ->and($rows)->toHaveCount(2)
        ->and($rows[1][0])->toBe(exportOrderNumber($paidOrder))
        ->and($rows[1][1])->toBe('Alice Buyer')
        ->and($rows[1][2])->toBe('alice@example.com')
        ->and($rows[1][3])->toBe('100.00')
        ->and($rows[1][4])->toBe('paid')
        ->and($rows[1][5])->toBe('')
        ->and($rows[1][6])->toBe('2026-06-10 10:00:00');

    $refundedRows = parseExportCsv(
        $this->actingAs($admin)
            ->get(route('admin.orders.export', ['status' => 'refunded']))
            ->streamedContent()
    );

    expect($refundedRows)->toHaveCount(2)
        ->and($refundedRows[1][0])->toBe(exportOrderNumber($refundedOrder))
        ->and($refundedRows[1][5])->toBe('2026-06-13 09:00:00');

    $searchRows = parseExportCsv(
        $this->actingAs($admin)
            ->get(route('admin.orders.export', ['search' => 'Bob']))
            ->streamedContent()
    );

    expect($searchRows)->toHaveCount(2)
        ->and($searchRows[1][1])->toBe('Bob Buyer');
});
