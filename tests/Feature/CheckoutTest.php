<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Download;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Seller;
use App\Models\User;
use App\Services\MockPaymentGateway;
use Inertia\Testing\AssertableInertia as Assert;

function createCheckoutProduct(float $price = 25.00): Product
{
    $sellerUser = User::factory()->create();

    $seller = Seller::create([
        'user_id' => $sellerUser->id,
        'store_name' => 'Checkout Studio',
        'slug' => 'checkout-studio-' . $sellerUser->id,
        'status' => 'approved',
    ]);

    $category = Category::create([
        'name' => 'Templates',
        'slug' => 'templates-' . $sellerUser->id,
    ]);

    return Product::factory()->create([
        'seller_id' => $seller->id,
        'category_id' => $category->id,
        'price' => $price,
        'status' => 'published',
    ]);
}

test('guests are redirected to login for checkout', function () {
    $this->get(route('checkout.index'))->assertRedirect(route('login', absolute: false));
    $this->post(route('checkout.store'))->assertRedirect(route('login', absolute: false));
});

test('buyer can see checkout summary from cart', function () {
    $buyer = User::factory()->create();
    $product = createCheckoutProduct(40);

    $cart = Cart::create(['user_id' => $buyer->id]);
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $product->id,
        'price' => 40,
    ]);

    $this->actingAs($buyer)
        ->get(route('checkout.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('customer/checkout')
            ->has('cart.items', 1)
            ->where('total', fn ($total) => (float) $total === 40.0)
        );
});

test('checkout creates a paid order, order items, downloads, and clears the cart', function () {
    $buyer = User::factory()->create();
    $firstProduct = createCheckoutProduct(10);
    $secondProduct = createCheckoutProduct(15.50);

    $cart = Cart::create(['user_id' => $buyer->id]);
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $firstProduct->id,
        'price' => 10,
    ]);
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $secondProduct->id,
        'price' => 15.50,
    ]);

    $response = $this->actingAs($buyer)->post(route('checkout.store'));

    $order = Order::where('user_id', $buyer->id)->first();

    expect($order)->not->toBeNull()
        ->and($order->payment_status)->toBe('paid')
        ->and($order->payment_method)->toBe('mock')
        ->and((float) $order->total_price)->toBe(25.5);

    expect($order->items()->count())->toBe(2)
        ->and(OrderItem::where('order_id', $order->id)->pluck('product_id')->all())
        ->toEqualCanonicalizing([$firstProduct->id, $secondProduct->id])
        ->and(Download::where('user_id', $buyer->id)->count())->toBe(2)
        ->and($cart->items()->count())->toBe(0);

    $response->assertRedirect(route('orders.show', $order, absolute: false));
});

test('checkout with an empty cart does not create an order', function () {
    $buyer = User::factory()->create();

    $response = $this->actingAs($buyer)->post(route('checkout.store'));

    $response->assertRedirect(route('checkout.index', absolute: false));
    $response->assertSessionHasErrors('checkout');

    expect(Order::count())->toBe(0);
});

test('mock payment gateway always succeeds and returns a transaction id', function () {
    $result = (new MockPaymentGateway())->pay(['amount' => 25.5]);

    expect($result['success'])->toBeTrue()
        ->and($result['transaction_id'])->toBeString()
        ->and($result['error'])->toBeNull();
});
