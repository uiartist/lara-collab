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
        Schema::table('users', function (Blueprint $table) {
            $table->string('customer_type')->nullable()->after('job_title');
            $table->string('status')->nullable()->after('customer_type');
            $table->string('designation')->nullable()->after('status');
            $table->string('mobile_number')->nullable()->after('phone');
            $table->string('website')->nullable()->after('email');
            $table->string('country')->nullable()->after('website');
            $table->string('gst_vat_number')->nullable()->after('country');
            $table->string('tax_id_1')->nullable()->after('gst_vat_number');
            $table->string('tax_id_2')->nullable()->after('tax_id_1');
            $table->string('payment_terms')->nullable()->after('tax_id_2');
            $table->decimal('credit_limit', 15, 2)->nullable()->after('payment_terms');
            $table->text('notes')->nullable()->after('credit_limit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'customer_type',
                'status',
                'designation',
                'mobile_number',
                'website',
                'country',
                'gst_vat_number',
                'tax_id_1',
                'tax_id_2',
                'payment_terms',
                'credit_limit',
                'notes',
            ]);
        });
    }
};
