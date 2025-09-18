<?php

namespace Database\Seeders;

use App\Models\Merk;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MerkTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Merk::create([
            "id_merk" => 1,
            'merk_name' => 'Oppo',
        ]);

        Merk::create([
            'id_merk' => 2,
            'merk_name' => 'Vivo',
        ]);

        Merk::create([
            'id_merk' => 3,
            'merk_name' => 'Samsung',
        ]);
        Merk::create([
            'id_merk' => 4,
            'merk_name' => 'Xiaomi',
        ]);
    }
}
