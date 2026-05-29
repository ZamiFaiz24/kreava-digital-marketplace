<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        /** @var User|null $user */
        if (! $user) {
            return Inertia::render('customer/wishlist', [
                'wishlist' => null,
            ]);
        }

        $wishlist = $user->wishlist()->with(['items.product.seller', 'items.product.images'])->first();

        return Inertia::render('customer/wishlist', [
            'wishlist' => $wishlist,
        ]);
    }

    public function toggle($productId): JsonResponse
    {
        $user = Auth::user();
        /** @var User $user */
        $wishlist = $user->wishlist()->firstOrCreate();

        $item = WishlistItem::where('wishlist_id', $wishlist->id)
            ->where('product_id', $productId)
            ->first();

        if ($item) {
            $item->delete();
            return response()->json(['added' => false]);
        } else {
            WishlistItem::create([
                'wishlist_id' => $wishlist->id,
                'product_id' => $productId,
            ]);
            return response()->json(['added' => true]);
        }
    }

    public function check($productId): JsonResponse
    {
        $user = Auth::user();
        /** @var User|null $user */
        if (! $user) {
            return response()->json(['inWishlist' => false]);
        }

        $wishlist = $user->wishlist;

        if (!$wishlist) {
            return response()->json(['inWishlist' => false]);
        }

        $inWishlist = WishlistItem::where('wishlist_id', $wishlist->id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json(['inWishlist' => $inWishlist]);
    }

    public function remove($wishlistItemId): JsonResponse
    {
        $user = Auth::user();
        $item = WishlistItem::find($wishlistItemId);

        if (!$item || $item->wishlist->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $item->delete();

        return response()->json(['success' => true]);
    }
}
