<?php

namespace Database\Seeders;

use App\Models\ProductImage;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductImagesSeeder extends Seeder
{
    private function svgDataUri(string $title, string $startColor, string $endColor): string
    {
        $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" fill="none">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="800" y2="600" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#{$startColor}"/>
      <stop offset="100%" stop-color="#{$endColor}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" rx="32" fill="url(#bg)"/>
  <rect x="86" y="86" width="628" height="428" rx="30" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)"/>
  <text x="400" y="286" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700">KREAVA</text>
  <text x="400" y="346" text-anchor="middle" fill="#ffffff" opacity="0.9" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600">{$safeTitle}</text>
</svg>
SVG;

        return 'data:image/svg+xml;charset=UTF-8,' . rawurlencode($svg);
    }

    public function run(): void
    {
        $gradients = [
            ['0f766e', '14b8a6'],
            ['0ea5e9', '22c55e'],
            ['8b5cf6', '06b6d4'],
            ['f97316', 'ec4899'],
            ['10b981', '84cc16'],
            ['2563eb', '14b8a6'],
        ];

        Product::all()->each(function ($product) use ($gradients) {
            $count = rand(1, 3);

            for ($index = 0; $index < $count; $index += 1) {
                [$startColor, $endColor] = $gradients[array_rand($gradients)];

                ProductImage::create([
                    'product_id' => $product->id,
                    'image' => $this->svgDataUri($product->title . ' #' . ($index + 1), $startColor, $endColor),
                ]);
            }
        });
    }
}
