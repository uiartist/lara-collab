<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'view work orders',
            'view work order',
        ];

        foreach ($permissions as $name) {
            $permission = DB::table('permissions')
                ->where('name', $name)
                ->where('guard_name', 'web')
                ->first();

            if (! $permission) {
                DB::table('permissions')->insert([
                    'name' => $name,
                    'guard_name' => 'web',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $adminRole = DB::table('roles')->where('name', 'admin')->first();
        if ($adminRole) {
            foreach ($permissions as $name) {
                $permission = DB::table('permissions')
                    ->where('name', $name)
                    ->where('guard_name', 'web')
                    ->first();

                if ($permission) {
                    $exists = DB::table('role_has_permissions')
                        ->where('role_id', $adminRole->id)
                        ->where('permission_id', $permission->id)
                        ->exists();

                    if (! $exists) {
                        DB::table('role_has_permissions')->insert([
                            'role_id' => $adminRole->id,
                            'permission_id' => $permission->id,
                        ]);
                    }
                }
            }
        }
    }

    public function down(): void
    {
        $permissions = [
            'view work orders',
            'view work order',
        ];

        DB::table('role_has_permissions')
            ->whereIn('permission_id', function ($query) use ($permissions) {
                $query->select('id')
                    ->from('permissions')
                    ->whereIn('name', $permissions);
            })
            ->delete();

        DB::table('permissions')->whereIn('name', $permissions)->delete();
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
};
