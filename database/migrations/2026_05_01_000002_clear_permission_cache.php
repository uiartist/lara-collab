<?php

use Illuminate\Database\Migrations\Migration;
use Spatie\Permission\PermissionRegistrar;

return new class extends Migration
{
    public function up()
    {
        // Clear spatie permission cache so newly inserted permissions become available immediately
        try {
            app()[PermissionRegistrar::class]->forgetCachedPermissions();
        } catch (\Throwable $e) {
            // ignore
        }
    }

    public function down()
    {
        // no-op
    }
};
