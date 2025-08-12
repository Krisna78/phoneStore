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
            'merk_name' => 'Oppo',
        ]);

        Merk::create([
            'merk_name' => 'Vivo',
        ]);

        Merk::create([
            'merk_name' => 'Samsung',
        ]);
    }
}
