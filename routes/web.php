<?php

use Inertia\Inertia;
use App\Http\Controllers\Pages\CreatorsController;
use App\Http\Controllers\Pages\LandingController;
use App\Http\Controllers\Pages\MarketplaceController;
use App\Http\Controllers\Pages\ProductController;
use App\Http\Controllers\Pages\WelcomeController;
use App\Http\Controllers\Seller\DashboardController as SellerDashboardController;
use App\Http\Controllers\Seller\ProductsController as SellerProductsController;
use App\Http\Controllers\Seller\OrdersController as SellerOrdersController;
use App\Http\Controllers\Seller\PayoutsController as SellerPayoutsController;
use App\Http\Controllers\Seller\SettingsController as SellerSettingsController;
use App\Http\Controllers\Seller\AnalyticsController as SellerAnalyticsController;
use App\Http\Controllers\Seller\CustomersController as SellerCustomersController;
use App\Http\Controllers\Customer\CartController as CustomerCartController;
use App\Http\Controllers\Customer\CheckoutController as CustomerCheckoutController;
use App\Http\Controllers\Customer\OrdersController as CustomerOrdersController;
use App\Http\Controllers\Customer\DownloadsController as CustomerDownloadsController;
use App\Http\Controllers\Customer\WishlistController as CustomerWishlistController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landing');
Route::get('/marketplace', MarketplaceController::class)->name('marketplace');
Route::get('/products/{slug}', ProductController::class)->name('product.show');
Route::get('/creators', CreatorsController::class)->name('creators');
Route::get('/welcome', WelcomeController::class)->name('welcome');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Customer routes
    Route::get('orders', [CustomerOrdersController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [CustomerOrdersController::class, 'show'])->name('orders.show');
    Route::get('downloads', [CustomerDownloadsController::class, 'index'])->name('downloads.index');
    Route::get('downloads/{download}/file', [CustomerDownloadsController::class, 'download'])->name('downloads.download');
    Route::get('cart', [CustomerCartController::class, 'index'])->name('cart.index');
    Route::post('cart/add/{product}', [CustomerCartController::class, 'add'])->name('cart.add');
    Route::delete('cart/{item}', [CustomerCartController::class, 'remove'])->name('cart.remove');
    Route::delete('cart', [CustomerCartController::class, 'clear'])->name('cart.clear');
    Route::get('checkout', [CustomerCheckoutController::class, 'index'])->name('checkout.index');
    Route::post('checkout', [CustomerCheckoutController::class, 'store'])->name('checkout.store');
    Route::get('wishlist', [CustomerWishlistController::class, 'index'])->name('wishlist.index');
    Route::post('wishlist/toggle/{product}', [CustomerWishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::get('wishlist/check/{product}', [CustomerWishlistController::class, 'check'])->name('wishlist.check');
    Route::delete('wishlist/{item}', [CustomerWishlistController::class, 'remove'])->name('wishlist.remove');

    Route::prefix('seller')->name('seller.')->middleware('role:seller')->group(function () {
        Route::get('dashboard', SellerDashboardController::class)->name('dashboard');

        Route::get('products', SellerProductsController::class)->name('products');
        Route::get('products/new', [SellerProductsController::class, 'create'])->name('products.new');
        Route::post('products', [SellerProductsController::class, 'store'])->name('products.store');

        Route::get('orders', SellerOrdersController::class)->name('orders');

        Route::get('analytics', SellerAnalyticsController::class)->name('analytics');

        Route::get('customers', SellerCustomersController::class)->name('customers');

        Route::get('payouts', SellerPayoutsController::class)->name('payouts');

        Route::get('settings', [SellerSettingsController::class, 'edit'])->name('settings');
        Route::patch('settings', [SellerSettingsController::class, 'update'])->name('settings.update');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
