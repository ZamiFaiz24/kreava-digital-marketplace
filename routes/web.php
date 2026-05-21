<?php

use Inertia\Inertia;
use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PageController::class, 'landing'])->name('landing');
Route::get('/marketplace', [PageController::class, 'marketplace'])->name('marketplace');
Route::get('/products/{slug}', [PageController::class, 'product'])->name('product.show');
Route::get('/welcome', [PageController::class, 'welcome'])->name('welcome');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
