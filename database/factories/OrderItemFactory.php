<?php

namespace Database\Factories;

use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        return [
            'order_id' => null,
            'product_id' => null,
            'seller_id' => null,
            'price' => fake()->randomFloat(2, 1, 200),
        ];
    }
}
