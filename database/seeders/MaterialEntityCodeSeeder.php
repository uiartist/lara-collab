<?php

namespace Database\Seeders;

use App\Models\EntityCodeNumber;
use Illuminate\Database\Seeder;

class MaterialEntityCodeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EntityCodeNumber::updateOrCreate(
            ['entity_type' => 'Material'],
            ['code_number' => 'MT', 'min_range' => 1, 'max_range' => 9999]
        );
    }
}
