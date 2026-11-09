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

test('admins are redirected to the admin dashboard after login', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->post('/login', [
        'email' => $admin->email,
        'password' => 'password',
    ])->assertRedirect(route('admin.dashboard', absolute: false));

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

test('guests trying to access the admin area are sent to login then the admin dashboard', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login', absolute: false));

    $this->post('/login', [
        'email' => $admin->email,
        'password' => 'password',
    ])->assertRedirect(route('admin.dashboard', absolute: false));

    $this->assertAuthenticatedAs($admin);
});

test('authenticated users can logout', function () {
    foreach (['admin', 'seller', 'customer'] as $role) {
        $user = User::factory()->create(['role' => $role]);

        $this->actingAs($user)
            ->post(route('logout'))
            ->assertRedirect('/');

        $this->assertGuest();
    }
});

test('admin can logout from admin pages', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $pages = [
        route('admin.dashboard'),
        route('admin.moderation.products'),
        route('admin.moderation.sellers'),
        route('admin.payouts'),
    ];

    foreach ($pages as $page) {
        $this->actingAs($admin)
            ->get($page)
            ->assertOk();

        $this->post(route('logout'))
            ->assertRedirect('/');

        $this->assertGuest();
    }
});
