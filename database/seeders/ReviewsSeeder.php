<?php

namespace Database\Seeders;

use App\Models\Review;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewsSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $products = Product::all();
        if ($customers->isEmpty() || $products->isEmpty()) {
            return;
        }

        foreach ($products as $product) {
            $count = rand(0, 10);
            Review::factory()->count($count)->make()->each(function ($review) use ($product, $customers) {
                $review->product_id = $product->id;
                $review->user_id = $customers->random()->id;
                $review->save();
            });
        }
    }
}

