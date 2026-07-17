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
        Schema::create('materials', function (Blueprint $table) {
            $table->id();

            // Material Basic Information
            $table->string('material_code')->unique();
            $table->string('material_name');
            $table->text('material_description')->nullable();
            $table->string('material_category')->nullable();
            $table->string('material_sub_category')->nullable();
            $table->string('material_type')->nullable();
            $table->string('brand')->nullable();
            $table->string('manufacturer')->nullable();
            $table->string('material_status')->default('Active');

            // Unit & Measurement
            $table->string('uom')->nullable();
            $table->string('alternate_uom')->nullable();
            $table->decimal('conversion_factor', 15, 6)->nullable();
            $table->decimal('weight', 15, 4)->nullable();
            $table->decimal('length', 15, 4)->nullable();
            $table->decimal('width', 15, 4)->nullable();
            $table->decimal('height', 15, 4)->nullable();
            $table->decimal('volume', 15, 4)->nullable();

            // Inventory Information
            $table->boolean('stock_item')->default(true);
            $table->decimal('current_stock', 15, 4)->default(0);
            $table->decimal('reorder_level', 15, 4)->nullable();
            $table->decimal('reorder_quantity', 15, 4)->nullable();
            $table->decimal('minimum_stock_level', 15, 4)->nullable();
            $table->decimal('maximum_stock_level', 15, 4)->nullable();
            $table->decimal('safety_stock', 15, 4)->nullable();
            $table->string('storage_location')->nullable();
            $table->string('warehouse')->nullable();
            $table->string('bin_location')->nullable();

            // Procurement Details
            $table->unsignedBigInteger('preferred_supplier_id')->nullable();
            $table->string('supplier_material_code')->nullable();
            $table->unsignedInteger('lead_time_days')->nullable();
            $table->decimal('minimum_order_quantity', 15, 4)->nullable();
            $table->decimal('purchase_rate', 15, 4)->nullable();
            $table->decimal('last_purchase_rate', 15, 4)->nullable();
            $table->decimal('standard_cost', 15, 4)->nullable();
            $table->string('currency', 10)->nullable();

            // Costing Information
            $table->decimal('material_cost', 15, 4)->nullable();
            $table->decimal('transportation_cost', 15, 4)->nullable();
            $table->decimal('loading_unloading_cost', 15, 4)->nullable();
            $table->decimal('tax_percentage', 8, 4)->nullable();
            $table->decimal('landed_cost', 15, 4)->nullable();
            $table->decimal('budget_cost', 15, 4)->nullable();

            // Project Management
            $table->string('project_allocation')->nullable();
            $table->string('wbs_code')->nullable();
            $table->string('cost_center')->nullable();
            $table->string('material_usage_type')->nullable();
            $table->boolean('project_consumption_tracking')->default(false);
            $table->string('material_issue_method')->nullable();

            // Tax & Compliance
            $table->decimal('gst_rate', 8, 4)->nullable();
            $table->string('hsn_sac_code')->nullable();
            $table->string('tax_category')->nullable();
            $table->string('compliance_certificate_reference')->nullable();

            // Quality Management
            $table->boolean('quality_inspection_required')->default(false);
            $table->string('inspection_frequency')->nullable();
            $table->string('quality_standards')->nullable();
            $table->text('acceptance_criteria')->nullable();
            $table->boolean('test_certificate_required')->default(false);

            // Material Specifications
            $table->string('grade')->nullable();
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->string('thickness')->nullable();
            $table->string('density')->nullable();
            $table->string('strength_rating')->nullable();
            $table->text('technical_specifications')->nullable();

            // Tracking & Control
            $table->string('batch_number')->nullable();
            $table->string('lot_number')->nullable();
            $table->string('serial_number')->nullable();
            $table->date('manufacturing_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->string('warranty_period')->nullable();

            // Documents & Attachments (store file paths/urls)
            $table->json('material_datasheets')->nullable();
            $table->json('product_catalogs')->nullable();
            $table->json('test_certificates')->nullable();
            $table->json('quality_reports')->nullable();
            $table->json('material_images')->nullable();
            $table->json('safety_data_sheets')->nullable();

            $table->timestamps();
            $table->archivedAt();

            $table->foreign('preferred_supplier_id')->references('id')->on('suppliers')->nullOnDelete();
            $table->index(['material_category', 'material_status']);
            $table->index('warehouse');
            $table->index('hsn_sac_code');
            $table->index('project_allocation');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
