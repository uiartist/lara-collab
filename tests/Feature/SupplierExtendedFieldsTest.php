<?php

use App\Models\Supplier;

it('allows extended supplier fields to be mass assigned', function () {
    $supplier = new Supplier([
        'vendor_code' => 'V-1001',
        'legal_entity_name' => 'Acme Build Ltd',
        'supplier_type' => 'Contractor',
        'supplier_category' => 'General',
        'status' => 'Active',
        'gst_registration_type' => 'Regular',
        'contact_person_name' => 'Jane Doe',
        'designation' => 'Procurement Lead',
        'mobile_number' => '+91 9876543210',
        'website' => 'https://acme.example',
        'registered_address' => '123 Main Road',
        'billing_address' => '123 Billing Road',
        'dispatch_address' => '456 Dispatch Road',
        'city' => 'Mumbai',
        'state' => 'Maharashtra',
        'country' => 'India',
        'postal_code' => '400001',
        'gst_number' => '27ABCDE1234F1Z5',
        'pan_number' => 'ABCDE1234F',
        'tan_number' => 'MUMA12345A',
        'msme_registration_number' => 'UDYAM-XX-00-0000000',
        'cin_number' => 'U12345MH2020PTC123456',
        'trade_license_number' => 'TL-2024-001',
        'compliance_certificates' => 'ISO 9001',
        'insurance_details' => 'General Liability',
        'bank_name' => 'HDFC Bank',
        'account_holder_name' => 'Acme Build Ltd',
        'account_number' => '1234567890',
        'ifsc_code' => 'HDFC0001234',
        'swift_code' => 'HDFCINBB',
        'branch_name' => 'Andheri',
        'upi_id' => 'acme@hdfc',
        'material_categories_supplied' => 'Steel, Cement',
        'preferred_supplier' => true,
        'lead_time_days' => 10,
        'minimum_order_quantity' => 100,
        'delivery_terms' => 'FOB',
        'payment_terms' => 'Net 30',
        'credit_limit' => 500000,
        'currency' => 'INR',
    ]);

    expect($supplier->vendor_code)->toBe('V-1001');
    expect($supplier->legal_entity_name)->toBe('Acme Build Ltd');
    expect($supplier->preferred_supplier)->toBeTrue();
});
