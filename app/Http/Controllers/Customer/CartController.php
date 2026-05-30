<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();
        /** @var User|null $user */

        if (! $user) {
            return Inertia::render('customer/cart', [
                'cart' => null,
            ]);
        }

        $cart = $user->cart()
            ->with(['items.product.seller', 'items.product.images'])
            ->first();

        return Inertia::render('customer/cart', [
            'cart' => $cart,
        ]);
    }

    public function remove(int $itemId): JsonResponse
    {
        $user = Auth::user();
        $item = CartItem::with('cart')->find($itemId);

        if (! $user || ! $item || $item->cart?->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $item->delete();

        return response()->json(['success' => true]);
    }

    public function clear(): JsonResponse
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (! $cart) {
            return response()->json(['success' => true]);
        }

        $cart->items()->delete();

        return response()->json(['success' => true]);
    }

    public function add(Request $request, Product $product): JsonResponse
    {
        $user = Auth::user();
        /** @var User|null $user */

        if (! $user) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $cart = $user->cart()->firstOrCreate();

        $item = CartItem::firstOrCreate(
            [
                'cart_id' => $cart->id,
                'product_id' => $product->id,
            ],
            [
                'price' => $product->price,
            ]
        );

        return response()->json([
            'added' => $item->wasRecentlyCreated,
            'cart_count' => $cart->items()->count(),
        ]);
    }
}
