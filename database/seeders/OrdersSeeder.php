<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrdersSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $products = Product::all();
        if ($customers->isEmpty() || $products->isEmpty()) {
            return;
        }

        foreach ($customers as $customer) {
            $ordersCount = rand(1, 5);
            for ($i = 0; $i < $ordersCount; $i++) {
                $order = Order::factory()->create(['user_id' => $customer->id]);

                $items = $products->random(rand(1, min(4, $products->count())));
                $total = 0;
                foreach ($items as $product) {
                    $price = $product->price;
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'seller_id' => $product->seller_id,
                        'price' => $price,
                    ]);
                    $total += $price;
                }

                $order->total_price = $total;
                $order->save();
            }
        }
    }
}
