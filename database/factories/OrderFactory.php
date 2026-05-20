<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        // payment status distribution: 70% paid, 20% pending, 10% failed
        $r = fake()->numberBetween(1, 100);
        if ($r <= 70) {
            $status = 'paid';
        } elseif ($r <= 90) {
            $status = 'pending';
        } else {
            $status = 'failed';
        }

        $methods = ['credit_card', 'paypal', 'bank_transfer'];

        return [
            'user_id' => null,
            'total_price' => 0,
            'payment_status' => $status,
            'payment_method' => fake()->randomElement($methods),
        ];
    }
}
