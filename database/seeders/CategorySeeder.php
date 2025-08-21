<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        Category::create([
            'category_name' => 'Smartphone',
            'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCk_vp0eyHTKYJpTeumeefipaUwvkI1-BqJw&s', // bisa storage:link juga
        ]);

        Category::create([
            'category_name' => 'Tablet',
            'image' => 'https://assets.telkomsel.com/public/2024-12/5-Tablet-Samsung-Terbaru-Kamu-Incar-yang-Mana.png',
        ]);

        Category::create([
            'category_name' => 'Laptop',
            'image' => 'https://www.asus.com/media/Odin/Websites/global/Series/9.png',
        ]);
    }
}
