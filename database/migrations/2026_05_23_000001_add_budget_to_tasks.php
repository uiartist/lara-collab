<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Stored in cents (integer) like fixed_price
            $table->unsignedBigInteger('estimated_budget')->nullable()->after('fixed_price');
            $table->unsignedBigInteger('actual_budget')->nullable()->after('estimated_budget');
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['estimated_budget', 'actual_budget']);
        });
    }
};
