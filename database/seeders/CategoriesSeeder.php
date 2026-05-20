<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategoriesSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'UI Kits',
                'slug' => 'ui-kits',
                'icon' => 'layout-grid',
            ],
            [
                'name' => 'Templates',
                'slug' => 'templates',
                'icon' => 'layout-template',
            ],
            [
                'name' => 'Source Code',
                'slug' => 'source-code',
                'icon' => 'code-2',
            ],
            [
                'name' => 'Ebooks',
                'slug' => 'ebooks',
                'icon' => 'book-open',
            ],
            [
                'name' => 'Icons',
                'slug' => 'icons',
                'icon' => 'shapes',
            ],
            [
                'name' => 'Mockups',
                'slug' => 'mockups',
                'icon' => 'monitor-smartphone',
            ],
            [
                'name' => 'Fonts',
                'slug' => 'fonts',
                'icon' => 'type',
            ],
            [
                'name' => 'Music & Audio',
                'slug' => 'music-audio',
                'icon' => 'music-4',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
