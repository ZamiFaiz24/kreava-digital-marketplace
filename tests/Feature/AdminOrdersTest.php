<?php

use App\Models\Order;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createAdminOrdersAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

function createAdminOrdersCustomer(string $name = 'Order Customer', string $email = 'order.customer@example.com'): User
{
    return User::factory()->create([
        'role' => 'customer',
        'name' => $name,
        'email' => $email,
    ]);
}

function createAdminOrdersOrder(User $customer, string $paymentStatus = 'paid', float $total = 100.0, $refundedAt = null): Order
{
    return Order::create([
        'user_id' => $customer->id,
        'total_price' => $total,
        'payment_status' => $paymentStatus,
        'payment_method' => 'mock',
        'refunded_at' => $refundedAt,
    ]);
}

test('guests are redirected to login from admin order routes', function () {
    $customer = createAdminOrdersCustomer();
    $order = createAdminOrdersOrder($customer);

    $this->get(route('admin.orders.index'))
        ->assertRedirect(route('login', absolute: false));

    $this->post(route('admin.orders.refund', $order))
        ->assertRedirect(route('login', absolute: false));
});

test('non admin users cannot access admin order routes', function () {
    $customer = createAdminOrdersCustomer();
    $order = createAdminOrdersOrder($customer);

    $this->actingAs($customer)
        ->get(route('admin.orders.index'))
        ->assertForbidden();

    $this->actingAs($customer)
        ->post(route('admin.orders.refund', $order))
        ->assertForbidden();
});

test('admin can list all orders with customer and refund details', function () {
    $admin = createAdminOrdersAdmin();
    $alice = createAdminOrdersCustomer('Alice Buyer', 'alice@example.com');
    $bob = createAdminOrdersCustomer('Bob Buyer', 'bob@example.com');

    $paidOrder = createAdminOrdersOrder($alice, 'paid', 100.0);
    $pendingOrder = createAdminOrdersOrder($bob, 'pending', 50.0);
    $refundedOrder = createAdminOrdersOrder($alice, 'paid', 75.0, now());

    $this->actingAs($admin)
        ->get(route('admin.orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders')
            ->has('orders.data', 3)
            ->where('filters.search', '')
            ->where('filters.status', '')
            ->where('orders.data', function ($orders) use ($paidOrder, $pendingOrder, $refundedOrder, $alice) {
                $items = collect($orders);
                $paid = $items->firstWhere('id', $paidOrder->id);
                $pending = $items->firstWhere('id', $pendingOrder->id);
                $refunded = $items->firstWhere('id', $refundedOrder->id);

                return $paid !== null
                    && $paid['order_number'] === 'ORD-'.str_pad((string) $paidOrder->id, 4, '0', STR_PAD_LEFT)
                    && $paid['customer'] === $alice->name
                    && $paid['email'] === $alice->email
                    && (float) $paid['total_price'] === 100.0
                    && $paid['payment_status'] === 'paid'
                    && $paid['refunded_at'] === null
                    && $paid['can_refund'] === true
                    && $pending['payment_status'] === 'pending'
                    && $pending['can_refund'] === false
                    && $refunded['refunded_at'] !== null
                    && $refunded['can_refund'] === false;
            })
        );
});

test('admin can search orders by number, customer name, and email', function () {
    $admin = createAdminOrdersAdmin();
    $alice = createAdminOrdersCustomer('Alice Buyer', 'alice@example.com');
    $bob = createAdminOrdersCustomer('Bob Buyer', 'bob@example.com');

    $aliceOrder = createAdminOrdersOrder($alice, 'paid', 100.0);
    $bobOrder = createAdminOrdersOrder($bob, 'pending', 50.0);
    $aliceOrderNumber = 'ORD-'.str_pad((string) $aliceOrder->id, 4, '0', STR_PAD_LEFT);

    $this->actingAs($admin)
        ->get(route('admin.orders.index', ['search' => $aliceOrderNumber]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $aliceOrder->id)
            ->where('filters.search', $aliceOrderNumber)
        );

    $this->actingAs($admin)
        ->get(route('admin.orders.index', ['search' => 'Alice']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $aliceOrder->id)
        );

    $this->actingAs($admin)
        ->get(route('admin.orders.index', ['search' => 'bob@example.com']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $bobOrder->id)
        );
});

test('admin can filter orders by status', function () {
    $admin = createAdminOrdersAdmin();
    $customer = createAdminOrdersCustomer();

    $paidOrder = createAdminOrdersOrder($customer, 'paid', 100.0);
    $pendingOrder = createAdminOrdersOrder($customer, 'pending', 50.0);
    $refundedOrder = createAdminOrdersOrder($customer, 'paid', 75.0, now());
    createAdminOrdersOrder($customer, 'failed', 25.0);

    $this->actingAs($admin)
        ->get(route('admin.orders.index', ['status' => 'paid']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $paidOrder->id)
            ->where('filters.status', 'paid')
        );

    $this->actingAs($admin)
        ->get(route('admin.orders.index', ['status' => 'pending']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $pendingOrder->id)
            ->where('filters.status', 'pending')
        );

    $this->actingAs($admin)
        ->get(route('admin.orders.index', ['status' => 'refunded']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.id', $refundedOrder->id)
            ->where('filters.status', 'refunded')
        );
});

test('admin can mark a paid order as refunded without changing payment status', function () {
    $admin = createAdminOrdersAdmin();
    $customer = createAdminOrdersCustomer();
    $order = createAdminOrdersOrder($customer, 'paid', 100.0);

    $this->actingAs($admin)
        ->post(route('admin.orders.refund', $order))
        ->assertRedirect(route('admin.orders.index'))
        ->assertSessionHas('success');

    $order->refresh();

    expect($order->payment_status)->toBe('paid')
        ->and($order->refunded_at)->not->toBeNull();
});

test('admin cannot refund orders that are not paid', function () {
    $admin = createAdminOrdersAdmin();
    $customer = createAdminOrdersCustomer();
    $pendingOrder = createAdminOrdersOrder($customer, 'pending', 50.0);
    $failedOrder = createAdminOrdersOrder($customer, 'failed', 25.0);

    $this->actingAs($admin)
        ->post(route('admin.orders.refund', $pendingOrder))
        ->assertRedirect(route('admin.orders.index'))
        ->assertSessionHas('error');

    $this->actingAs($admin)
        ->post(route('admin.orders.refund', $failedOrder))
        ->assertRedirect(route('admin.orders.index'))
        ->assertSessionHas('error');

    expect($pendingOrder->fresh()->refunded_at)->toBeNull()
        ->and($failedOrder->fresh()->refunded_at)->toBeNull();
});

test('admin cannot refund an order twice', function () {
    $admin = createAdminOrdersAdmin();
    $customer = createAdminOrdersCustomer();
    $order = createAdminOrdersOrder($customer, 'paid', 100.0, now());

    $this->actingAs($admin)
        ->post(route('admin.orders.refund', $order))
        ->assertRedirect(route('admin.orders.index'))
        ->assertSessionHas('error');

    $order->refresh();

    expect($order->payment_status)->toBe('paid')
        ->and($order->refunded_at)->not->toBeNull();
});
