<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class StoreSupplierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code_number' => ['nullable', 'string', 'max:20'],
            'vendor_code' => ['nullable', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'legal_entity_name' => ['nullable', 'string', 'max:255'],
            'supplier_type' => ['nullable', 'string', 'max:100'],
            'supplier_category' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:50'],
            'gst_registration_type' => ['nullable', 'string', 'max:100'],
            'contact_person' => ['nullable', 'string', 'max:255'],
            'contact_person_name' => ['nullable', 'string', 'max:255'],
            'designation' => ['nullable', 'string', 'max:100'],
            'mobile_number' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'url', 'max:255'],
            'alternate_contact_details' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'registered_address' => ['nullable', 'string', 'max:500'],
            'billing_address' => ['nullable', 'string', 'max:500'],
            'dispatch_address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'gst_number' => ['nullable', 'string', 'max:50'],
            'pan_number' => ['nullable', 'string', 'max:50'],
            'tan_number' => ['nullable', 'string', 'max:50'],
            'tax_id_1' => ['nullable', 'string', 'max:50'],
            'tax_id_2' => ['nullable', 'string', 'max:50'],
            'msme_registration_number' => ['nullable', 'string', 'max:100'],
            'cin_number' => ['nullable', 'string', 'max:100'],
            'trade_license_number' => ['nullable', 'string', 'max:100'],
            'compliance_certificates' => ['nullable', 'string', 'max:500'],
            'insurance_details' => ['nullable', 'string', 'max:500'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'account_holder_name' => ['nullable', 'string', 'max:255'],
            'account_number' => ['nullable', 'string', 'max:100'],
            'ifsc_code' => ['nullable', 'string', 'max:50'],
            'swift_code' => ['nullable', 'string', 'max:50'],
            'branch_name' => ['nullable', 'string', 'max:255'],
            'upi_id' => ['nullable', 'string', 'max:100'],
            'material_categories_supplied' => ['nullable', 'string', 'max:500'],
            'preferred_supplier' => ['nullable', 'boolean'],
            'lead_time_days' => ['nullable', 'integer', 'min:0'],
            'minimum_order_quantity' => ['nullable', 'integer', 'min:0'],
            'delivery_terms' => ['nullable', 'string', 'max:255'],
            'payment_terms' => ['nullable', 'string', 'max:255'],
            'credit_limit' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
        ];
    }
}
