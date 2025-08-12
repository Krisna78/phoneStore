<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Category::create([
            'category_name' => 'Handphone',
            'image' => 'handphone.jpg',
        ]);

        Category::create([
            'category_name' => 'Tablet',
            'image' => 'tablet.jpg',
        ]);

        Category::create([
            'category_name' => 'Laptop',
            'image' => 'laptop.jpg',
        ]);
    }
}
