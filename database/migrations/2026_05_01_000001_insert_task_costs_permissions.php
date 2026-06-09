<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        $permissions = [
            'view costs',
            'add costs',
            'delete costs',
        ];

        $insertedIds = [];

        foreach ($permissions as $name) {
            $permission = DB::table('permissions')->where('name', $name)->first();
            if ($permission) {
                $insertedIds[] = $permission->id;

                continue;
            }

            $insertedIds[] = DB::table('permissions')->insertGetId([
                'name' => $name,
                'guard_name' => 'web',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // if admin role exists, assign these permissions to admin
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
    }

    public function down()
    {
        $names = ['view costs', 'add costs', 'delete costs'];

        $permissions = DB::table('permissions')->whereIn('name', $names)->get();

        foreach ($permissions as $p) {
            DB::table('role_has_permissions')->where('permission_id', $p->id)->delete();
        }

        DB::table('permissions')->whereIn('name', $names)->delete();
    }
};
