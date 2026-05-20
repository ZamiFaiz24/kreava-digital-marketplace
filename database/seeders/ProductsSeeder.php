<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Seller;
use App\Models\Category;
use Illuminate\Database\Seeder;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = Seller::all();
        $categories = Category::all();
        if ($sellers->isEmpty() || $categories->isEmpty()) {
            return;
        }

        foreach ($sellers as $seller) {
            // create ~5 products per seller
            Product::factory()->count(5)->create([
                'seller_id' => $seller->id,
                'category_id' => $categories->random()->id,
            ]);
        }
    }
}
