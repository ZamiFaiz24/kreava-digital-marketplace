<?php

use Inertia\Inertia;
use App\Http\Controllers\PageController;
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
        Route::get('dashboard', function () {
            return Inertia::render('seller/dashboard');
        })->name('dashboard');

        Route::get('products', function () {
            return Inertia::render('seller/placeholder', [
                'title' => 'Products',
                'description' => 'Manage and publish your digital products from one place.',
            ]);
        })->name('products');

        Route::get('products/new', function () {
            return Inertia::render('seller/placeholder', [
                'title' => 'Upload Product',
                'description' => 'Create a new listing with files, thumbnails, and pricing.',
            ]);
        })->name('products.new');

        Route::get('orders', function () {
            return Inertia::render('seller/placeholder', [
                'title' => 'Orders',
                'description' => 'Track incoming sales and order statuses.',
            ]);
        })->name('orders');

        Route::get('analytics', function () {
            return Inertia::render('seller/placeholder', [
                'title' => 'Analytics',
                'description' => 'View performance trends, revenue, and conversion metrics.',
            ]);
        })->name('analytics');

        Route::get('customers', function () {
            return Inertia::render('seller/placeholder', [
                'title' => 'Customers',
                'description' => 'Review customer activity and interactions.',
            ]);
        })->name('customers');

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
