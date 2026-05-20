<?php

namespace Database\Seeders;

use App\Models\Seller;
use App\Models\User;
use Illuminate\Database\Seeder;

class SellersSeeder extends Seeder
{
    public function run(): void
    {
        $sellerUsers = User::where('role', 'seller')->get();
        foreach ($sellerUsers as $idx => $sellerUser) {
            Seller::firstOrCreate([
                'user_id' => $sellerUser->id,
            ], [
                'store_name' => $sellerUser->name . "'s Store",
                'slug' => 'store-' . $sellerUser->id,
                'description' => 'Toko demo untuk seed data',
                'logo' => null,
                'banner' => null,
                'contact_email' => $sellerUser->email,
                'phone' => '0812345678' . ($idx + 10),
                'status' => 'approved',
            ]);
        }
    }
}
