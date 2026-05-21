<?php

namespace Database\Factories;

use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    protected $model = ProductImage::class;

    private array $gradients = [
        ['0f766e', '14b8a6'],
        ['0ea5e9', '22c55e'],
        ['8b5cf6', '06b6d4'],
        ['f97316', 'ec4899'],
        ['10b981', '84cc16'],
        ['2563eb', '14b8a6'],
    ];

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
        <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="60"/>
        </filter>
    </defs>
    <rect width="800" height="600" rx="32" fill="url(#bg)"/>
    <circle cx="180" cy="140" r="120" fill="rgba(255,255,255,0.18)" filter="url(#blur)"/>
    <circle cx="650" cy="460" r="150" fill="rgba(255,255,255,0.12)" filter="url(#blur)"/>
    <rect x="92" y="92" width="616" height="416" rx="28" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.18)"/>
    <text x="400" y="292" text-anchor="middle" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="62" font-weight="700">KREAVA</text>
    <text x="400" y="352" text-anchor="middle" fill="#ffffff" opacity="0.9" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="600">{$safeTitle}</text>
</svg>
SVG;

        return 'data:image/svg+xml;charset=UTF-8,' . rawurlencode($svg);
    }

    public function definition(): array
    {
        [$startColor, $endColor] = fake()->randomElement($this->gradients);

        return [
            'product_id' => null,
            'image' => $this->svgDataUri(fake()->words(2, true), $startColor, $endColor),
        ];
    }
}
