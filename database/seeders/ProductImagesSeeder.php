<?php

namespace Database\Seeders;

use App\Models\ProductImage;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductImagesSeeder extends Seeder
{
    public function run(): void
    {
        Product::all()->each(function ($product) {
            $count = rand(1, 3);
            ProductImage::factory()->count($count)->create(['product_id' => $product->id]);
        });
    }
}
