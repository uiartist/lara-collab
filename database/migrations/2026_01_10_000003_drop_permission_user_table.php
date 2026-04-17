<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Drop the pivot table if it exists — useful when this project already uses a different permissions schema
        if (Schema::hasTable('permission_user')) {
            Schema::dropIfExists('permission_user');
        }
    }

    public function down()
    {
        // Recreate the pivot if needed when rolling back this migration
        if (! Schema::hasTable('permission_user')) {
            Schema::create('permission_user', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->cascadeOnDelete();
                $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['user_id', 'permission_id']);
            });
        }
    }
};
