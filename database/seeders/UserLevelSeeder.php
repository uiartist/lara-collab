<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EntityCodeNumber;

class UserLevelSeeder extends Seeder
{
    public function run(): void
    {
        // Create the User Level entity code number
        $userLevel = EntityCodeNumber::updateOrCreate(
            ['entity_type' => 'UserLevel'],
            [
                'code_number' => 'UL',
                'min_range' => 1,
                'max_range' => 20,
            ]
        );

        // Define user levels
        $levels = [
            '001' => 'President',
            '002' => 'Vice President',
            '003' => 'Supervisor',
            '004' => 'Manager',
            '005' => 'Senior Executive',
            '006' => 'Executive',
            '007' => 'Coordinator',
            '008' => 'Assistant',
            '009' => 'Trainee',
            '010' => 'Consultant',
        ];

        // Note: These values would typically be stored in a separate table
        // For now, they serve as reference values for the code number range
    }
}
