<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    private array $renames = [
        'view entity code numbers' => 'view code numbers',
        'create entity code number' => 'create code number',
        'edit entity code number' => 'edit code number',
        'delete entity code number' => 'delete code number',
    ];

    public function up(): void
    {
        $this->renamePermissions($this->renames);
    }

    public function down(): void
    {
        $this->renamePermissions(array_flip($this->renames));
    }

    private function renamePermissions(array $renames): void
    {
        foreach ($renames as $oldName => $newName) {
            $oldPermission = DB::table('permissions')->where('name', $oldName)->first();

            if (! $oldPermission) {
                continue;
            }

            $newPermission = DB::table('permissions')
                ->where('name', $newName)
                ->where('guard_name', $oldPermission->guard_name)
                ->first();

            if (! $newPermission) {
                DB::table('permissions')
                    ->where('id', $oldPermission->id)
                    ->update([
                        'name' => $newName,
                        'updated_at' => now(),
                    ]);

                continue;
            }

            $this->mergePermissionAssignments($oldPermission->id, $newPermission->id);
            DB::table('permissions')->where('id', $oldPermission->id)->delete();
        }

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }

    private function mergePermissionAssignments(int $oldPermissionId, int $newPermissionId): void
    {
        DB::table('role_has_permissions')
            ->where('permission_id', $oldPermissionId)
            ->get()
            ->each(function ($assignment) use ($newPermissionId) {
                DB::table('role_has_permissions')->insertOrIgnore([
                    'permission_id' => $newPermissionId,
                    'role_id' => $assignment->role_id,
                ]);
            });

        DB::table('model_has_permissions')
            ->where('permission_id', $oldPermissionId)
            ->get()
            ->each(function ($assignment) use ($newPermissionId) {
                DB::table('model_has_permissions')->insertOrIgnore([
                    'permission_id' => $newPermissionId,
                    'model_type' => $assignment->model_type,
                    'model_id' => $assignment->model_id,
                ]);
            });
    }
};
