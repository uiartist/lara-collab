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
        Schema::table('projects', function (Blueprint $table) {
            $table->string('code_number', 20)->nullable()->unique()->after('id');
        });

        Schema::table('client_companies', function (Blueprint $table) {
            $table->string('code_number', 20)->nullable()->unique()->after('id');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('code_number', 20)->nullable()->unique()->after('id');
        });

        Schema::table('purchase_requests', function (Blueprint $table) {
            $table->string('code_number', 20)->nullable()->unique()->after('id');
        });

        Schema::table('owner_company', function (Blueprint $table) {
            $table->string('code_number', 20)->nullable()->unique()->after('id');
        });

        Schema::table('developments', function (Blueprint $table) {
            $table->string('code_number', 20)->nullable()->unique()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('code_number');
        });

        Schema::table('client_companies', function (Blueprint $table) {
            $table->dropColumn('code_number');
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn('code_number');
        });

        Schema::table('purchase_requests', function (Blueprint $table) {
            $table->dropColumn('code_number');
        });

        Schema::table('owner_company', function (Blueprint $table) {
            $table->dropColumn('code_number');
        });

        Schema::table('developments', function (Blueprint $table) {
            $table->dropColumn('code_number');
        });
    }
};
