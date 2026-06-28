<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_requests', function (Blueprint $table) {
            $table->string('work_order_number')->nullable()->after('subject');
            $table->date('work_order_date')->nullable()->after('work_order_number');
            $table->string('priority_level')->nullable()->after('work_order_date');
            $table->string('requested_by')->nullable()->after('priority_level');
            $table->string('customer_id')->nullable()->after('requested_by');
            $table->string('department')->nullable()->after('customer_id');
            $table->string('work_assigned_to')->nullable()->after('department');
            $table->date('expected_start_date')->nullable()->after('work_assigned_to');
            $table->date('expected_finish_date')->nullable()->after('expected_start_date');
            $table->string('work_completed_by')->nullable()->after('expected_finish_date');
            $table->text('job_description')->nullable()->after('work_completed_by');
            $table->string('bill_to_name')->nullable()->after('job_description');
            $table->string('bill_to_company')->nullable()->after('bill_to_name');
            $table->string('bill_to_street_address')->nullable()->after('bill_to_company');
            $table->string('bill_to_city_state_zip')->nullable()->after('bill_to_street_address');
            $table->string('bill_to_phone')->nullable()->after('bill_to_city_state_zip');
            $table->string('ship_to_name')->nullable()->after('bill_to_phone');
            $table->string('ship_to_company')->nullable()->after('ship_to_name');
            $table->string('ship_to_street_address')->nullable()->after('ship_to_company');
            $table->string('ship_to_city_state_zip')->nullable()->after('ship_to_street_address');
            $table->string('ship_to_phone')->nullable()->after('ship_to_city_state_zip');
            $table->decimal('shipping_handling_cost', 12, 2)->nullable()->after('ship_to_phone');
            $table->json('labor_items')->nullable()->after('shipping_handling_cost');
            $table->json('material_items')->nullable()->after('labor_items');
            $table->text('additional_info')->nullable()->after('material_items');
            $table->string('signature_name')->nullable()->after('additional_info');
            $table->date('signature_date')->nullable()->after('signature_name');
        });
    }

    public function down(): void
    {
        Schema::table('purchase_requests', function (Blueprint $table) {
            $table->dropColumn([
                'work_order_number',
                'work_order_date',
                'priority_level',
                'requested_by',
                'customer_id',
                'department',
                'work_assigned_to',
                'expected_start_date',
                'expected_finish_date',
                'work_completed_by',
                'job_description',
                'bill_to_name',
                'bill_to_company',
                'bill_to_street_address',
                'bill_to_city_state_zip',
                'bill_to_phone',
                'ship_to_name',
                'ship_to_company',
                'ship_to_street_address',
                'ship_to_city_state_zip',
                'ship_to_phone',
                'shipping_handling_cost',
                'labor_items',
                'material_items',
                'additional_info',
                'signature_name',
                'signature_date',
            ]);
        });
    }
};
