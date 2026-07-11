<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('tax_id_1')->nullable()->after('tan_number');
            $table->string('tax_id_2')->nullable()->after('tax_id_1');
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn(['tax_id_1', 'tax_id_2']);
        });
    }
};
