<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    private array $formats = [
        'UI Kit',
        'Landing Page Template',
        'Dashboard Template',
        'Presentation Template',
        'Icon Pack',
        'Mockup Pack',
        'Brand Asset Kit',
        'Starter Template',
    ];

    private array $adjectives = [
        'Minimal',
        'Modern',
        'Clean',
        'Professional',
        'Flexible',
        'Responsive',
        'Creative',
        'Premium',
    ];

    private array $useCases = [
        'for SaaS products',
        'for startup teams',
        'for freelance designers',
        'for marketing websites',
        'for product launches',
        'for portfolio projects',
        'for business dashboards',
        'for digital agencies',
    ];

    private array $features = [
        'fully responsive layout',
        'well-organized components',
        'easy customization flow',
        'clean design system',
        'ready-to-use sections',
        'consistent spacing and typography',
        'production-friendly structure',
        'developer-friendly file setup',
    ];

    private array $deliverables = [
        'source files included',
        'preview assets included',
        'documentation included',
        'editable layers included',
        'optimized for quick implementation',
        'organized for easy handoff',
        'designed for fast deployment',
        'built for scalable reuse',
    ];

    private function buildTitle(): string
    {
        return fake()->randomElement($this->adjectives) . ' ' .
            fake()->randomElement($this->formats) . ' ' .
            fake()->randomElement($this->useCases);
    }

    private function buildDescription(string $title): string
    {
        $featureOne = fake()->randomElement($this->features);
        $featureTwo = fake()->randomElement($this->features);
        $deliverable = fake()->randomElement($this->deliverables);

        return implode("\n\n", [
            $title . ' is a carefully structured digital product designed to help teams move faster without sacrificing quality.',
            'It includes ' . $featureOne . ' and ' . $featureTwo . '. This makes it a practical choice for modern workflows.',
            'What you get: ' . $deliverable . '.',
            'Built for creators who want a clean, professional result with less setup time.',
        ]);
    }

    public function definition(): array
    {
        $title = $this->buildTitle();
        return [
            'seller_id' => null,
            'category_id' => null,
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(4),
            'description' => $this->buildDescription($title),
            'thumbnail' => null,
            'preview_link' => null,
            'price' => fake()->randomFloat(2, 1, 200),
            // 80% published, 20% draft
            'status' => fake()->boolean(80) ? 'published' : 'draft',
            // 10% featured
            'is_featured' => fake()->boolean(10),
            'file_path' => null,
            'file_size' => null,
        ];
    }
}
