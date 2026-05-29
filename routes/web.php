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
use App\Http\Controllers\Seller\AnalyticsController as SellerAnalyticsController;
use App\Http\Controllers\Seller\CustomersController as SellerCustomersController;
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
    Route::get('downloads', [CustomerDownloadsController::class, 'index'])->name('downloads.index');
    Route::get('wishlist', [CustomerWishlistController::class, 'index'])->name('wishlist.index');
    Route::post('wishlist/toggle/{product}', [CustomerWishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::get('wishlist/check/{product}', [CustomerWishlistController::class, 'check'])->name('wishlist.check');
    Route::delete('wishlist/{item}', [CustomerWishlistController::class, 'remove'])->name('wishlist.remove');

    Route::prefix('seller')->name('seller.')->middleware('role:seller')->group(function () {
        Route::get('dashboard', SellerDashboardController::class)->name('dashboard');

        Route::get('products', SellerProductsController::class)->name('products');

        Route::get('products/new', function () {
            return Inertia::render('seller/placeholder', [
                'title' => 'Upload Product',
                'description' => 'Create a new listing with files, thumbnails, and pricing.',
            ]);
        })->name('products.new');

        Route::get('orders', SellerOrdersController::class)->name('orders');

        Route::get('analytics', SellerAnalyticsController::class)->name('analytics');

        Route::get('customers', SellerCustomersController::class)->name('customers');

        Route::get('payouts', function () {
            return Inertia::render('seller/placeholder', [
                'title' => 'Payouts',
                'description' => 'Check payout history and upcoming settlements.',
            ]);
        })->name('payouts');

        Route::get('settings', function () {
            return Inertia::render('seller/placeholder', [
                'title' => 'Seller Settings',
                'description' => 'Configure store profile, branding, and seller preferences.',
            ]);
        })->name('settings');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
