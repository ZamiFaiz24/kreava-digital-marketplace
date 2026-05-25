<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    private function avatarPathForRole(string $role, int $index): string
    {
        return match ($role) {
            'admin' => 'images/avatars/admin/admin-1.jpg',
            'seller' => 'images/avatars/sellers/seller-' . (($index % 5) + 1) . '.jpg',
            default => 'images/avatars/customers/customer-' . (($index % 28) + 1) . '.jpg',
        };
    }

    public function run(): void
    {
        // Admin
        User::updateOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Admin User',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'avatar' => 'images/avatars/admin/admin-1.jpg',
        ]);

        // Seller
        // One demo seller and one demo customer
        User::updateOrCreate([
            'email' => 'seller@example.com',
        ], [
            'name' => 'Seller User',
            'password' => Hash::make('password123'),
            'role' => 'seller',
            'avatar' => 'images/avatars/sellers/seller-1.jpg',
        ]);

        User::updateOrCreate([
            'email' => 'customer@example.com',
        ], [
            'name' => 'Customer User',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'avatar' => 'images/avatars/customers/customer-1.jpg',
        ]);

        // Additional random users: customers and sellers
        $customers = User::factory()->count(27)->create(['role' => 'customer']);
        $sellers = User::factory()->count(4)->create(['role' => 'seller']);

        foreach ($customers->values() as $index => $user) {
            $user->update([
                'avatar' => $this->avatarPathForRole('customer', $index + 1),
            ]);
        }

        foreach ($sellers->values() as $index => $user) {
            $user->update([
                'avatar' => $this->avatarPathForRole('seller', $index + 1),
            ]);
        }
    }
}
