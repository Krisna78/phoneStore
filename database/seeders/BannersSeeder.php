<?php

namespace Database\Seeders;

use App\Models\Banners;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BannersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Banners::insert([
            [
                'image_banners' => 'images/rectangle_5.png', // contoh path, nanti bisa taruh di storage/app/public/banners
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'image_banners' => 'images/rectangle_5.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'image_banners' => 'images/rectangle_5.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
