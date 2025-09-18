<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        Product::create([
            'name' => 'Samsung Galaxy S23',
            'description' => 'Samsung Galaxy S23 dengan performa tinggi dan kamera 50MP.',
            'price' => 12000000,
            'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyRiX5I8WZlDJX6mXo_JWOQBTv5Ec-m0uPaw&s',
            'merk_id' => 1,
            'category_id' => 1,
        ]);

        Product::create([
            'name' => 'iPhone 14 Pro',
            'description' => 'iPhone 14 Pro dengan Dynamic Island dan kamera 48MP.',
            'price' => 19000000,
            'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCk_vp0eyHTKYJpTeumeefipaUwvkI1-BqJw&s',
            'merk_id' => 2,
            'category_id' => 1,
        ]);

        Product::create([
            'name' => 'Xiaomi Pad 6',
            'description' => 'Tablet Xiaomi Pad 6 dengan Snapdragon 870 dan layar 120Hz.',
            'price' => 6500000,
            'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCk_vp0eyHTKYJpTeumeefipaUwvkI1-BqJw&s',
            'merk_id' => 4,
            'category_id' => 2,
        ]);

        Product::create([
            'name' => 'Oppo Reno 2',
            'description' => 'Earbuds TWS Oppo Enco Buds2 dengan suara bass yang kuat.',
            'price' => 500000,
            'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4bOSE7_hdQ2PdouN7zGgnqKnohv0zQ5OvNg&s',
            'merk_id' => 1,
            'category_id' => 3,
        ]);
    }
}
