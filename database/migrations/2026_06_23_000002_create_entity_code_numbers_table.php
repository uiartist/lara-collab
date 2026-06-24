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
        Schema::create('entity_code_numbers', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type', 100);
            $table->string('code_number', 2);
            $table->timestamps();

            $table->unique(['entity_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_code_numbers');
    }
};
