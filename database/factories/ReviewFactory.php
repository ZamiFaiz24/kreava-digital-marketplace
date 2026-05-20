<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    private array $positive = [
        'The design is clean and easy to work with.',
        'This product saved a lot of setup time.',
        'The structure is clear and the files are easy to follow.',
        'A very practical and well-organized asset.',
        'The overall quality feels polished and professional.',
    ];

    private array $neutral = [
        'The product matches the description and works as expected.',
        'A solid option for basic project needs.',
        'It is useful, especially for quick implementation.',
        'The file structure is straightforward and manageable.',
        'A decent product with a clean presentation.',
    ];

    private array $lightCritic = [
        'The product is useful, but a few more examples would help.',
        'It works well, although the preview could be more detailed.',
        'Good overall, but the documentation could be expanded.',
        'The asset is helpful, yet a couple of sections feel minimal.',
        'Nice quality, but I expected a little more variation.',
    ];

    private function buildComment(int $rating): string
    {
        return match (true) {
            $rating >= 4 => fake()->randomElement($this->positive),
            $rating === 3 => fake()->randomElement($this->neutral),
            default => fake()->randomElement($this->lightCritic),
        };
    }

    public function definition(): array
    {
        $rating = fake()->numberBetween(1, 5);

        return [
            'user_id' => null,
            'product_id' => null,
            'rating' => $rating,
            'comment' => $this->buildComment($rating),
        ];
    }
}
