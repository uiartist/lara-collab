<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableName = 'entity_code_numbers';

        if (Schema::hasColumn($tableName, 'min_value')) {
            DB::statement("ALTER TABLE `$tableName` CHANGE `min_value` `min_range` INT UNSIGNED NULL");
        }

        if (Schema::hasColumn($tableName, 'max_value')) {
            DB::statement("ALTER TABLE `$tableName` CHANGE `max_value` `max_range` INT UNSIGNED NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tableName = 'entity_code_numbers';

        if (Schema::hasColumn($tableName, 'min_range')) {
            DB::statement("ALTER TABLE `$tableName` CHANGE `min_range` `min_value` INT UNSIGNED NULL");
        }

        if (Schema::hasColumn($tableName, 'max_range')) {
            DB::statement("ALTER TABLE `$tableName` CHANGE `max_range` `max_value` INT UNSIGNED NULL");
        }
    }
};
