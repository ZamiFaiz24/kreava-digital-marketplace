<?php

use App\Models\User;

test('sellers are redirected to the seller dashboard after login', function () {
    $seller = User::factory()->create(['role' => 'seller']);

    $this->post('/login', [
        'email' => $seller->email,
        'password' => 'password',
    ])->assertRedirect(route('seller.dashboard', absolute: false));

    $this->assertAuthenticatedAs($seller);
});

test('customers are redirected to the dashboard after login', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $this->post('/login', [
        'email' => $customer->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($customer);
});

test('admins are redirected to the dashboard after login', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->post('/login', [
        'email' => $admin->email,
        'password' => 'password',
    ])->assertRedirect(route('dashboard', absolute: false));

    $this->assertAuthenticatedAs($admin);
});

test('guests trying to access the seller area are sent to login then the seller dashboard', function () {
    $seller = User::factory()->create(['role' => 'seller']);

    $this->get(route('seller.dashboard'))
        ->assertRedirect(route('login', absolute: false));

    $this->post('/login', [
        'email' => $seller->email,
        'password' => 'password',
    ])->assertRedirect(route('seller.dashboard', absolute: false));

    $this->assertAuthenticatedAs($seller);
});
