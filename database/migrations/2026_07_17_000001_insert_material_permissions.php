<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up(): void
    {
        $permissions = [
            'view materials',
            'create material',
            'edit material',
            'archive material',
            'restore material',
            'delete material',
        ];

        $insertedIds = [];

        foreach ($permissions as $name) {
            $permission = DB::table('permissions')->where('name', $name)->first();
            if ($permission) {
                $insertedIds[$name] = $permission->id;
                continue;
            }

            $insertedIds[$name] = DB::table('permissions')->insertGetId([
                'name' => $name,
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $adminRole = DB::table('roles')->where('name', 'admin')->first();
        if ($adminRole) {
            foreach ($insertedIds as $pid) {
                $exists = DB::table('role_has_permissions')
                    ->where('role_id', $adminRole->id)
                    ->where('permission_id', $pid)
                    ->exists();

                if (! $exists) {
                    DB::table('role_has_permissions')->insert([
                        'role_id' => $adminRole->id,
                        'permission_id' => $pid,
                    ]);
                }
            }
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function down(): void
    {
        $names = [
            'view materials',
            'create material',
            'edit material',
            'archive material',
            'restore material',
            'delete material',
        ];

        DB::table('permissions')->whereIn('name', $names)->delete();
    }
};
