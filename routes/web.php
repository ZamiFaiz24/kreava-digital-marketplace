<?php

use Inertia\Inertia;
use App\Http\Controllers\PageController;
use App\Http\Controllers\Seller\DashboardController as SellerDashboardController;
use App\Http\Controllers\Seller\ProductsController as SellerProductsController;
use App\Http\Controllers\Seller\OrdersController as SellerOrdersController;
use App\Http\Controllers\Seller\AnalyticsController as SellerAnalyticsController;
use App\Http\Controllers\Seller\CustomersController as SellerCustomersController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'landing'])->name('landing');
Route::get('/marketplace', [PageController::class, 'marketplace'])->name('marketplace');
Route::get('/products/{slug}', [PageController::class, 'product'])->name('product.show');
Route::get('/creators', [PageController::class, 'creators'])->name('creators');
Route::get('/welcome', [PageController::class, 'welcome'])->name('welcome');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

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
