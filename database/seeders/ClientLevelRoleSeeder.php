<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

class ClientLevelRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Get all permissions that exist in the system
        $allPermissions = DB::table('permissions')->pluck('name')->toArray();

        // Define client user level roles and their permissions
        $clientLevelPermissions = [
            '001' => [
                'name' => 'President',
                'permissions' => $allPermissions  // President gets ALL permissions
            ],
            '002' => [
                'name' => 'Vice President',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks', 'create task', 'edit task', 'complete task',
                    'view time logs', 'view comments', 'view costs', 'add costs', 'delete costs',
                    'create work order', 'approve work order',
                ]
            ],
            '003' => [
                'name' => 'Supervisor',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks', 'create task', 'edit task', 'complete task',
                    'view time logs', 'view comments', 'view costs', 'add costs',
                    'create work order', 'approve work order',
                ]
            ],
            '004' => [
                'name' => 'Manager',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks', 'create task', 'edit task', 'complete task',
                    'view time logs', 'view comments', 'view costs', 'add costs',
                    'create work order',
                ]
            ],
            '005' => [
                'name' => 'Senior Executive',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks', 'create task', 'edit task',
                    'view time logs', 'view comments', 'view costs', 'add costs',
                    'create work order',
                ]
            ],
            '006' => [
                'name' => 'Executive',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks', 'create task', 'edit task',
                    'view time logs', 'view comments', 'view costs', 'add costs',
                ]
            ],
            '007' => [
                'name' => 'Coordinator',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks', 'create task',
                    'view time logs', 'view comments', 'view costs', 'add costs',
                ]
            ],
            '008' => [
                'name' => 'Assistant',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks', 'create task',
                    'view time logs', 'view comments', 'view costs',
                ]
            ],
            '009' => [
                'name' => 'Trainee',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks',
                    'view time logs', 'view comments', 'view costs',
                ]
            ],
            '010' => [
                'name' => 'Consultant',
                'permissions' => [
                    'view projects', 'view project',
                    'view tasks',
                    'view time logs', 'view comments', 'view costs',
                ]
            ],
        ];

        // Create or update roles and assign permissions
        foreach ($clientLevelPermissions as $levelCode => $data) {
            $roleName = "client_level_{$levelCode}";

            // Create or get the role
            $role = Role::firstOrCreate(
                ['name' => $roleName, 'guard_name' => 'web'],
                ['is_client_level_role' => true]
            );

            // Sync permissions for this role
            $permissionIds = [];
            foreach ($data['permissions'] as $permissionName) {
                $permission = DB::table('permissions')->where('name', $permissionName)->first();
                if (!$permission) {
                    $permission = (object) DB::table('permissions')->insertGetId([
                        'name' => $permissionName,
                        'guard_name' => 'web',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                    $permission = (object) ['id' => DB::getPdo()->lastInsertId()];
                }
                $permissionIds[] = $permission->id;
            }

            // Delete old permissions
            DB::table('role_has_permissions')->where('role_id', $role->id)->delete();

            // Insert new permissions
            foreach ($permissionIds as $permissionId) {
                DB::table('role_has_permissions')->insert([
                    'role_id' => $role->id,
                    'permission_id' => $permissionId,
                ]);
            }
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
