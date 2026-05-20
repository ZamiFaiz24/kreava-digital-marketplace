<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\UsersSeeder;
use Database\Seeders\SellersSeeder;
use Database\Seeders\CategoriesSeeder;
use Database\Seeders\ProductsSeeder;
use Database\Seeders\ProductImagesSeeder;
use Database\Seeders\ReviewsSeeder;
use Database\Seeders\OrdersSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UsersSeeder::class,
            SellersSeeder::class,
            CategoriesSeeder::class,
            ProductsSeeder::class,
            ProductImagesSeeder::class,
            ReviewsSeeder::class,
            OrdersSeeder::class,
        ]);
    }
}
