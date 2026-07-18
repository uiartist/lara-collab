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
        // Add client_company_id foreign key to users table if it doesn't exist
        if (!Schema::hasColumn('users', 'client_company_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->foreignId('client_company_id')->nullable()->after('id')->constrained('client_companies')->onDelete('cascade');
            });
        }

        // Migrate data from pivot table to foreign key
        // For each user-company mapping in the pivot table, set the first one as the primary company
        DB::statement("
            UPDATE users u
            SET u.client_company_id = (
                SELECT client_company_id FROM client_company
                WHERE client_id = u.id
                LIMIT 1
            )
            WHERE u.id IN (
                SELECT DISTINCT client_id FROM client_company
            )
            AND u.client_company_id IS NULL
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeignKey(['client_company_id']);
            $table->dropColumn('client_company_id');
        });
    }
};
