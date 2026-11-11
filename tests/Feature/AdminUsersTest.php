<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function createAdminUsersAdmin(): User
{
    return User::factory()->create(['role' => 'admin']);
}

test('guests are redirected to login from admin user routes', function () {
    $user = User::factory()->create();

    $this->get(route('admin.users.index'))->assertRedirect(route('login', absolute: false));
    $this->post(route('admin.users.status', $user))->assertRedirect(route('login', absolute: false));
});

test('non admin users cannot access admin user routes', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $target = User::factory()->create(['role' => 'seller']);

    $this->actingAs($customer)->get(route('admin.users.index'))->assertForbidden();
    $this->actingAs($customer)->post(route('admin.users.status', $target))->assertForbidden();
});

test('admin can list users with search and role filter', function () {
    $admin = createAdminUsersAdmin();
    $alice = User::factory()->create(['name' => 'Alice Customer', 'email' => 'alice@example.com', 'role' => 'customer']);
    $bob = User::factory()->create(['name' => 'Bob Seller', 'email' => 'bob@example.com', 'role' => 'seller']);
    User::factory()->create(['name' => 'Carol Admin', 'email' => 'carol@example.com', 'role' => 'admin']);

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/users')
            ->has('users.data', 4)
            ->where('filters.search', '')
            ->where('filters.role', '')
            ->where('users.data', function ($users) use ($admin) {
                return collect($users)->contains(
                    fn ($user) => $user['id'] === $admin->id && $user['is_self'] === true
                );
            })
        );

    $this->actingAs($admin)
        ->get(route('admin.users.index', ['search' => 'Alice']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.id', $alice->id)
            ->where('filters.search', 'Alice')
        );

    $this->actingAs($admin)
        ->get(route('admin.users.index', ['search' => 'bob@example.com']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.id', $bob->id)
            ->where('filters.search', 'bob@example.com')
        );

    $this->actingAs($admin)
        ->get(route('admin.users.index', ['role' => 'seller']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.id', $bob->id)
            ->where('filters.role', 'seller')
        );
});

test('admin cannot change their own status', function () {
    $admin = createAdminUsersAdmin();

    $this->actingAs($admin)
        ->post(route('admin.users.status', $admin))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('error');

    expect($admin->fresh()->is_active)->toBeTrue();
});

test('admin can toggle another users status', function () {
    $admin = createAdminUsersAdmin();
    $user = User::factory()->create(['role' => 'customer']);

    $this->actingAs($admin)
        ->post(route('admin.users.status', $user))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    expect($user->fresh()->is_active)->toBeFalse();

    $this->actingAs($admin)
        ->post(route('admin.users.status', $user))
        ->assertRedirect(route('admin.users.index'))
        ->assertSessionHas('success');

    expect($user->fresh()->is_active)->toBeTrue();
});

test('users are active by default', function () {
    $user = User::factory()->create();

    expect($user->fresh()->is_active)->toBeTrue();
});

test('inactive users cannot log in', function () {
    $user = User::factory()->create(['is_active' => false]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});
