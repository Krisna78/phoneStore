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
            'image' => 'https://static.vecteezy.com/system/resources/previews/022/722/945/non_2x/samsung-galaxy-s23-ultra-transparent-image-free-png.png',
            'merk_id' => 1,
            'category_id' => 1,
        ]);

        Product::create([
            'name' => 'iPhone 14 Pro',
            'description' => 'iPhone 14 Pro dengan Dynamic Island dan kamera 48MP.',
            'price' => 19000000,
            'image' => 'https://pngimg.com/d/iphone_14_PNG6.png',
            'merk_id' => 2,
            'category_id' => 1,
        ]);

        Product::create([
            'name' => 'Xiaomi 13',
            'description' => 'Xiaomi 13 dengan Snapdragon 8 Gen 2 dan layar AMOLED.',
            'price' => 9500000,
            'image' => 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1677427681.17943185.png',
            'merk_id' => 3,
            'category_id' => 1,
        ]);

        Product::create([
            'name' => 'Oppo Find X6',
            'description' => 'Oppo Find X6 dengan kamera 200MP dan fast charging 100W.',
            'price' => 11000000,
            'image' => 'https://www.oppo.com/content/dam/oppo/common/mkt/v2-2/find-x6-series-cn/listpage/find-x6-gold.png',
            'merk_id' => 4,
            'category_id' => 1,
        ]);
        Product::create([
            'name' => 'Vivo X90 Pro',
            'description' => 'Vivo X90 Pro dengan kamera Zeiss dan performa flagship.',
            'price' => 10500000,
            'image' => 'https://asia-exstatic-vivofs.vivo.com/PSee2l50xoirPK7y/1672821918740/6b1b2db1c93c56c59c5d0a8ef4ccd3c5.png',
            'merk_id' => 5,
            'category_id' => 1,
        ]);
        Product::create([
            'name' => 'iPad Pro 12.9',
            'description' => 'iPad Pro 12.9 dengan M2 chip dan layar Liquid Retina XDR.',
            'price' => 18000000,
            'image' => 'https://www.dimprice.co.uk/image/cache/png/apple-ipad-pro-2021/12.9-inch/silver/apple-ipad-pro-2021-12.9-inch-silver-01-800x800.png',
            'merk_id' => 2,
            'category_id' => 2,
        ]);
        Product::create([
            'name' => 'Samsung Galaxy Tab S9',
            'description' => 'Tablet Samsung Galaxy Tab S9 dengan S Pen dan Snapdragon 8 Gen 2.',
            'price' => 12500000,
            'image' => 'https://titaniummobile.net/cdn/shop/files/S9TABPLUS.png?v=1690249090',
            'merk_id' => 1,
            'category_id' => 2,
        ]);
        Product::create([
            'name' => 'Xiaomi Pad 6',
            'description' => 'Xiaomi Pad 6 dengan Snapdragon 870 dan layar 120Hz.',
            'price' => 6500000,
            'image' => 'https://i02.appmifile.com/982_item_id/05/06/2025/b163c9bef772a23f44319fa9397dbbe1.png',
            'merk_id' => 3,
            'category_id' => 2,
        ]);
        Product::create([
            'name' => 'Lenovo Tab P12 Pro',
            'description' => 'Tablet Lenovo dengan stylus dan layar AMOLED.',
            'price' => 7000000,
            'image' => 'https://p2-ofp.static.pub/fes/cms/2022/08/02/ujl3re6c4f0h3s4siwuhr5yhhd61mh455254.png',
            'merk_id' => 4,
            'category_id' => 2,
        ]);
        Product::create([
            'name' => 'Huawei MatePad 11',
            'description' => 'Huawei MatePad 11 dengan HarmonyOS dan performa tinggi.',
            'price' => 6000000,
            'image' => 'https://consumer.huawei.com/dam/content/dam/huawei-cbg-site/common/mkt/pdp/admin-image/tablets/matepad-11-5-papermatte-edition/specs.png',
            'merk_id' => 5,
            'category_id' => 2,
        ]);
        Product::create([
            'name' => 'MacBook Air M2',
            'description' => 'MacBook Air M2 dengan performa luar biasa dan baterai tahan lama.',
            'price' => 20000000,
            'image' => 'https://png.pngtree.com/png-clipart/20250206/original/pngtree-open-laptop-png-image_20346668.png',
            'merk_id' => 2,
            'category_id' => 3,
        ]);
        Product::create([
            'name' => 'Dell XPS 13',
            'description' => 'Laptop Dell XPS 13 dengan Intel Core i7 generasi terbaru.',
            'price' => 17500000,
            'image' => 'https://www.pngplay.com/wp-content/uploads/7/Dell-Laptop-PNG-Clipart-Background.png',
            'merk_id' => 6,
            'category_id' => 3,
        ]);
    }
}
