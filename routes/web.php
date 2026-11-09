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
use App\Http\Controllers\Seller\PayoutController as SellerPayoutController;
use App\Http\Controllers\Seller\SettingsController as SellerSettingsController;
use App\Http\Controllers\Seller\AnalyticsController as SellerAnalyticsController;
use App\Http\Controllers\Seller\CustomersController as SellerCustomersController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ModerationController as AdminModerationController;
use App\Http\Controllers\Admin\PayoutController as AdminPayoutController;
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

    // Admin routes
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('dashboard', AdminDashboardController::class)->name('dashboard');

        Route::prefix('moderation')->name('moderation.')->group(function () {
            Route::get('products', [AdminModerationController::class, 'products'])->name('products');
            Route::post('products/{product}/approve', [AdminModerationController::class, 'approveProduct'])->name('products.approve');
            Route::post('products/{product}/reject', [AdminModerationController::class, 'rejectProduct'])->name('products.reject');

            Route::get('sellers', [AdminModerationController::class, 'sellers'])->name('sellers');
            Route::post('sellers/{seller}/approve', [AdminModerationController::class, 'approveSeller'])->name('sellers.approve');
            Route::post('sellers/{seller}/reject', [AdminModerationController::class, 'rejectSeller'])->name('sellers.reject');
        });

        Route::get('payouts', [AdminPayoutController::class, 'index'])->name('payouts');
        Route::post('payouts/{payout}/approve', [AdminPayoutController::class, 'approve'])->name('payouts.approve');
        Route::post('payouts/{payout}/reject', [AdminPayoutController::class, 'reject'])->name('payouts.reject');
    });

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

        Route::get('payouts', [SellerPayoutController::class, 'index'])->name('payouts');
        Route::post('payouts/request', [SellerPayoutController::class, 'store'])->name('payouts.request');

        Route::get('settings', [SellerSettingsController::class, 'edit'])->name('settings');
        Route::patch('settings', [SellerSettingsController::class, 'update'])->name('settings.update');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
