<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('entity_code_numbers', function (Blueprint $table) {
            $table->unsignedInteger('min_value')->nullable()->after('code_number');
            $table->unsignedInteger('max_value')->nullable()->after('min_value');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entity_code_numbers', function (Blueprint $table) {
            $table->dropColumn(['min_value', 'max_value']);
        });
    }
};
