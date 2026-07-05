<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->string('vendor_code')->nullable()->after('code_number');
            $table->string('legal_entity_name')->nullable()->after('name');
            $table->string('supplier_type')->nullable()->after('legal_entity_name');
            $table->string('supplier_category')->nullable()->after('supplier_type');
            $table->string('status')->default('Active')->after('supplier_category');
            $table->string('gst_registration_type')->nullable()->after('status');
            $table->string('contact_person_name')->nullable()->after('contact_person');
            $table->string('designation')->nullable()->after('contact_person_name');
            $table->string('mobile_number')->nullable()->after('designation');
            $table->string('website')->nullable()->after('email');
            $table->text('alternate_contact_details')->nullable()->after('website');
            $table->text('registered_address')->nullable()->after('address');
            $table->text('billing_address')->nullable()->after('registered_address');
            $table->text('dispatch_address')->nullable()->after('billing_address');
            $table->string('city')->nullable()->after('dispatch_address');
            $table->string('state')->nullable()->after('city');
            $table->string('country')->nullable()->after('state');
            $table->string('postal_code')->nullable()->after('country');
            $table->string('gst_number')->nullable()->after('postal_code');
            $table->string('pan_number')->nullable()->after('gst_number');
            $table->string('tan_number')->nullable()->after('pan_number');
            $table->string('msme_registration_number')->nullable()->after('tan_number');
            $table->string('cin_number')->nullable()->after('msme_registration_number');
            $table->string('trade_license_number')->nullable()->after('cin_number');
            $table->text('compliance_certificates')->nullable()->after('trade_license_number');
            $table->text('insurance_details')->nullable()->after('compliance_certificates');
            $table->string('bank_name')->nullable()->after('insurance_details');
            $table->string('account_holder_name')->nullable()->after('bank_name');
            $table->string('account_number')->nullable()->after('account_holder_name');
            $table->string('ifsc_code')->nullable()->after('account_number');
            $table->string('swift_code')->nullable()->after('ifsc_code');
            $table->string('branch_name')->nullable()->after('swift_code');
            $table->string('upi_id')->nullable()->after('branch_name');
            $table->text('material_categories_supplied')->nullable()->after('upi_id');
            $table->boolean('preferred_supplier')->default(false)->after('material_categories_supplied');
            $table->unsignedInteger('lead_time_days')->nullable()->after('preferred_supplier');
            $table->unsignedInteger('minimum_order_quantity')->nullable()->after('lead_time_days');
            $table->string('delivery_terms')->nullable()->after('minimum_order_quantity');
            $table->string('payment_terms')->nullable()->after('delivery_terms');
            $table->decimal('credit_limit', 12, 2)->nullable()->after('payment_terms');
            $table->string('currency')->nullable()->after('credit_limit');
        });
    }

    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn([
                'vendor_code',
                'legal_entity_name',
                'supplier_type',
                'supplier_category',
                'status',
                'gst_registration_type',
                'contact_person_name',
                'designation',
                'mobile_number',
                'website',
                'alternate_contact_details',
                'registered_address',
                'billing_address',
                'dispatch_address',
                'city',
                'state',
                'country',
                'postal_code',
                'gst_number',
                'pan_number',
                'tan_number',
                'msme_registration_number',
                'cin_number',
                'trade_license_number',
                'compliance_certificates',
                'insurance_details',
                'bank_name',
                'account_holder_name',
                'account_number',
                'ifsc_code',
                'swift_code',
                'branch_name',
                'upi_id',
                'material_categories_supplied',
                'preferred_supplier',
                'lead_time_days',
                'minimum_order_quantity',
                'delivery_terms',
                'payment_terms',
                'credit_limit',
                'currency',
            ]);
        });
    }
};
