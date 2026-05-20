<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::firstOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Admin User',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Seller
        // One demo seller and one demo customer
        User::firstOrCreate([
            'email' => 'seller@example.com',
        ], [
            'name' => 'Seller User',
            'password' => Hash::make('password123'),
            'role' => 'seller',
        ]);

        User::firstOrCreate([
            'email' => 'customer@example.com',
        ], [
            'name' => 'Customer User',
            'password' => Hash::make('password123'),
            'role' => 'customer',
        ]);

        // Additional random users: customers and sellers
        User::factory()->count(27)->create(['role' => 'customer']);
        User::factory()->count(4)->create(['role' => 'seller']);
    }
}
