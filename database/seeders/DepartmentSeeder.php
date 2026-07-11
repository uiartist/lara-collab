<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            'Planning & Design',
            'Project Management',
            'Site Operations',
            'Civil Engineering',
            'Structural Engineering',
            'MEP',
            'Quality Assurance',
            'Safety & Compliance',
            'Procurement',
            'Logistics',
            'Finance',
            'HR & Admin',
            'IT & Digital',
            'Warehouse',
            'Customer Support',
        ];

        foreach ($departments as $department) {
            DB::table('departments')->updateOrInsert(
                ['name' => $department],
                ['slug' => str($department)->slug()->toString()]
            );
        }
    }
}
