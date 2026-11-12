<?php

use App\Models\AuditLog;
use App\Models\Category;
use App\Models\Order;
use App\Models\Payout;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createAuditLogTestAdmin(string $name = 'Audit Admin', string $email = 'audit.admin@example.com'): User
{
    return User::factory()->create([
        'role' => 'admin',
        'name' => $name,
        'email' => $email,
    ]);
}

function createAuditLogTestCustomer(string $name = 'Audit Customer', string $email = 'audit.customer@example.com'): User
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
function createAuditLogTestSeller(string $storeName = 'Audit Studio', string $status = 'approved'): array
{
    $user = User::factory()->create(['role' => 'seller']);

    $seller = Seller::create([
        'user_id' => $user->id,
        'store_name' => $storeName,
        'slug' => Str::slug($storeName).'-'.Str::random(6),
        'contact_email' => $user->email,
        'status' => $status,
    ]);

    return [$user, $seller];
}

function createAuditLogTestCategory(): Category
{
    return Category::create([
        'name' => 'Templates',
        'slug' => 'templates-'.Str::random(8),
    ]);
}

function createAuditLogTestProduct(Seller $seller, Category $category, string $title, string $status): Product
{
    return Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'title' => $title,
        'slug' => Str::slug($title).'-'.Str::random(6),
        'price' => 49.90,
        'status' => $status,
    ]);
}

function createAuditLogTestOrder(User $customer, string $paymentStatus = 'paid', float $total = 100.0): Order
{
    return Order::create([
        'user_id' => $customer->id,
        'total_price' => $total,
        'payment_status' => $paymentStatus,
        'payment_method' => 'mock',
    ]);
}

test('guests are redirected to login from the admin audit log route', function () {
    $this->get(route('admin.audit-logs.index'))
        ->assertRedirect(route('login', absolute: false));
});

test('non admin users cannot access the admin audit log', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $seller = User::factory()->create(['role' => 'seller']);

    $this->actingAs($customer)
        ->get(route('admin.audit-logs.index'))
        ->assertForbidden();

    $this->actingAs($seller)
        ->get(route('admin.audit-logs.index'))
        ->assertForbidden();
});

test('admin can list audit logs with pagination', function () {
    $admin = createAuditLogTestAdmin();

    foreach (range(1, 21) as $index) {
        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'product.approve',
            'target_type' => 'product',
            'target_id' => $index,
            'details' => ['title' => 'Product '.$index],
        ]);
    }

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/audit-logs')
            ->has('logs.data', 20)
            ->where('logs.total', 21)
            ->where('logs.last_page', 2)
            ->where('filters.search', '')
            ->where('filters.action', '')
        );

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index', ['page' => 2]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('logs.data', 1)
            ->where('logs.current_page', 2)
        );
});

test('admin can search and filter audit logs', function () {
    $admin = createAuditLogTestAdmin('Alice Admin', 'alice.admin@example.com');
    $otherAdmin = createAuditLogTestAdmin('Bob Admin', 'bob.admin@example.com');

    $productLog = AuditLog::create([
        'user_id' => $admin->id,
        'action' => 'product.approve',
        'target_type' => 'product',
        'target_id' => 10,
        'details' => ['title' => 'Alpha Product'],
    ]);

    $userLog = AuditLog::create([
        'user_id' => $otherAdmin->id,
        'action' => 'user.deactivate',
        'target_type' => 'user',
        'target_id' => 20,
        'details' => ['name' => 'Beta User'],
    ]);

    $orderLog = AuditLog::create([
        'user_id' => $admin->id,
        'action' => 'order.refund',
        'target_type' => 'order',
        'target_id' => 30,
        'details' => ['order_number' => 'ORD-0030'],
    ]);

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index', ['search' => 'product.approve']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('logs.data', 1)
            ->where('logs.data.0.id', $productLog->id)
            ->where('filters.search', 'product.approve')
            ->where('actions', fn ($actions) => collect($actions)->contains('product.approve')
                && collect($actions)->contains('user.deactivate')
                && collect($actions)->contains('order.refund'))
        );

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index', ['search' => 'user']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('logs.data', 1)
            ->where('logs.data.0.id', $userLog->id)
        );

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index', ['search' => '30']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('logs.data', 1)
            ->where('logs.data.0.id', $orderLog->id)
        );

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index', ['search' => 'Bob']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('logs.data', 1)
            ->where('logs.data.0.id', $userLog->id)
        );

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index', ['search' => 'alice.admin@example.com']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('logs.data', 2)
        );

    $this->actingAs($admin)
        ->get(route('admin.audit-logs.index', ['action' => 'order.refund']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('logs.data', 1)
            ->where('logs.data.0.id', $orderLog->id)
            ->where('filters.action', 'order.refund')
        );
});

test('product moderation actions are recorded in the audit log', function () {
    $admin = createAuditLogTestAdmin();
    [, $seller] = createAuditLogTestSeller();
    $category = createAuditLogTestCategory();

    $approvedProduct = createAuditLogTestProduct($seller, $category, 'Approve Audit', 'pending');
    $rejectedProduct = createAuditLogTestProduct($seller, $category, 'Reject Audit', 'draft');
    $takedownProduct = createAuditLogTestProduct($seller, $category, 'Takedown Audit', 'published');

    $this->actingAs($admin)
        ->post(route('admin.moderation.products.approve', $approvedProduct))
        ->assertRedirect(route('admin.moderation.products'));

    $this->actingAs($admin)
        ->post(route('admin.moderation.products.reject', $rejectedProduct))
        ->assertRedirect(route('admin.moderation.products'));

    $this->actingAs($admin)
        ->post(route('admin.moderation.products.takedown', $takedownProduct))
        ->assertRedirect(route('admin.moderation.products'));

    $logs = AuditLog::query()
        ->where('user_id', $admin->id)
        ->orderBy('id')
        ->get();

    expect($logs)->toHaveCount(3)
        ->and($logs[0]->action)->toBe('product.approve')
        ->and($logs[0]->target_type)->toBe('product')
        ->and($logs[0]->target_id)->toBe($approvedProduct->id)
        ->and($logs[0]->details['title'])->toBe('Approve Audit')
        ->and($logs[0]->details['previous_status'])->toBe('pending')
        ->and($logs[0]->details['new_status'])->toBe('published')
        ->and($logs[1]->action)->toBe('product.reject')
        ->and($logs[1]->target_id)->toBe($rejectedProduct->id)
        ->and($logs[1]->details['previous_status'])->toBe('draft')
        ->and($logs[1]->details['new_status'])->toBe('rejected')
        ->and($logs[2]->action)->toBe('product.takedown')
        ->and($logs[2]->target_id)->toBe($takedownProduct->id)
        ->and($logs[2]->details['previous_status'])->toBe('published')
        ->and($logs[2]->details['new_status'])->toBe('rejected');
});

test('seller moderation actions are recorded in the audit log', function () {
    $admin = createAuditLogTestAdmin();
    [, $approvedSeller] = createAuditLogTestSeller('Approve Audit Studio', 'pending');
    [, $rejectedSeller] = createAuditLogTestSeller('Reject Audit Studio', 'pending');

    $this->actingAs($admin)
        ->post(route('admin.moderation.sellers.approve', $approvedSeller))
        ->assertRedirect(route('admin.moderation.sellers'));

    $this->actingAs($admin)
        ->post(route('admin.moderation.sellers.reject', $rejectedSeller))
        ->assertRedirect(route('admin.moderation.sellers'));

    $logs = AuditLog::query()
        ->where('user_id', $admin->id)
        ->orderBy('id')
        ->get();

    expect($logs)->toHaveCount(2)
        ->and($logs[0]->action)->toBe('seller.approve')
        ->and($logs[0]->target_type)->toBe('seller')
        ->and($logs[0]->target_id)->toBe($approvedSeller->id)
        ->and($logs[0]->details['store_name'])->toBe('Approve Audit Studio')
        ->and($logs[0]->details['previous_status'])->toBe('pending')
        ->and($logs[0]->details['new_status'])->toBe('approved')
        ->and($logs[1]->action)->toBe('seller.reject')
        ->and($logs[1]->target_id)->toBe($rejectedSeller->id)
        ->and($logs[1]->details['store_name'])->toBe('Reject Audit Studio')
        ->and($logs[1]->details['new_status'])->toBe('rejected');
});

test('payout moderation actions are recorded in the audit log', function () {
    $admin = createAuditLogTestAdmin();
    [, $seller] = createAuditLogTestSeller('Payout Audit Studio');

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

    $this->actingAs($admin)
        ->post(route('admin.payouts.approve', $approvedPayout))
        ->assertRedirect(route('admin.payouts'));

    $this->actingAs($admin)
        ->post(route('admin.payouts.reject', $rejectedPayout))
        ->assertRedirect(route('admin.payouts'));

    $logs = AuditLog::query()
        ->where('user_id', $admin->id)
        ->orderBy('id')
        ->get();

    expect($logs)->toHaveCount(2)
        ->and($logs[0]->action)->toBe('payout.approve')
        ->and($logs[0]->target_type)->toBe('payout')
        ->and($logs[0]->target_id)->toBe($approvedPayout->id)
        ->and($logs[0]->details['seller'])->toBe('Payout Audit Studio')
        ->and((float) $logs[0]->details['amount'])->toBe(40.0)
        ->and($logs[0]->details['previous_status'])->toBe('pending')
        ->and($logs[0]->details['new_status'])->toBe('paid')
        ->and($logs[1]->action)->toBe('payout.reject')
        ->and($logs[1]->target_id)->toBe($rejectedPayout->id)
        ->and($logs[1]->details['new_status'])->toBe('failed');
});

test('user status changes are recorded in the audit log', function () {
    $admin = createAuditLogTestAdmin();
    $user = createAuditLogTestCustomer('Target User', 'target@example.com');

    $this->actingAs($admin)
        ->post(route('admin.users.status', $user))
        ->assertRedirect(route('admin.users.index'));

    $this->actingAs($admin)
        ->post(route('admin.users.status', $user))
        ->assertRedirect(route('admin.users.index'));

    $logs = AuditLog::query()
        ->where('user_id', $admin->id)
        ->orderBy('id')
        ->get();

    expect($logs)->toHaveCount(2)
        ->and($logs[0]->action)->toBe('user.deactivate')
        ->and($logs[0]->target_type)->toBe('user')
        ->and($logs[0]->target_id)->toBe($user->id)
        ->and($logs[0]->details['name'])->toBe('Target User')
        ->and($logs[0]->details['previous_status'])->toBe('active')
        ->and($logs[0]->details['new_status'])->toBe('inactive')
        ->and($logs[1]->action)->toBe('user.activate')
        ->and($logs[1]->target_id)->toBe($user->id)
        ->and($logs[1]->details['previous_status'])->toBe('inactive')
        ->and($logs[1]->details['new_status'])->toBe('active');
});

test('order refunds are recorded in the audit log', function () {
    $admin = createAuditLogTestAdmin();
    $customer = createAuditLogTestCustomer();
    $order = createAuditLogTestOrder($customer, 'paid', 125.5);

    $this->actingAs($admin)
        ->post(route('admin.orders.refund', $order))
        ->assertRedirect(route('admin.orders.index'));

    $log = AuditLog::query()
        ->where('user_id', $admin->id)
        ->sole();

    expect($log->action)->toBe('order.refund')
        ->and($log->target_type)->toBe('order')
        ->and($log->target_id)->toBe($order->id)
        ->and($log->details['order_number'])->toBe('ORD-'.str_pad((string) $order->id, 4, '0', STR_PAD_LEFT))
        ->and((float) $log->details['total_price'])->toBe(125.5)
        ->and($log->details['payment_status'])->toBe('paid')
        ->and($log->details['refunded_at'])->not->toBeNull();
});

test('failed admin actions do not create audit logs', function () {
    $admin = createAuditLogTestAdmin();
    $customer = createAuditLogTestCustomer();
    $pendingOrder = createAuditLogTestOrder($customer, 'pending');
    $refundedOrder = createAuditLogTestOrder($customer, 'paid');
    $refundedOrder->update(['refunded_at' => now()]);

    [, $seller] = createAuditLogTestSeller();
    $category = createAuditLogTestCategory();
    $pendingProduct = createAuditLogTestProduct($seller, $category, 'Pending Audit', 'pending');

    $this->actingAs($admin)
        ->post(route('admin.users.status', $admin))
        ->assertSessionHas('error');

    $this->actingAs($admin)
        ->post(route('admin.moderation.products.takedown', $pendingProduct))
        ->assertSessionHas('error');

    $this->actingAs($admin)
        ->post(route('admin.orders.refund', $pendingOrder))
        ->assertSessionHas('error');

    $this->actingAs($admin)
        ->post(route('admin.orders.refund', $refundedOrder))
        ->assertSessionHas('error');

    expect(AuditLog::query()->count())->toBe(0);
});
