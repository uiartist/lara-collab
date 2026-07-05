<?php

namespace App\Http\Resources\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code_number' => $this->code_number,
            'vendor_code' => $this->vendor_code,
            'name' => $this->name,
            'legal_entity_name' => $this->legal_entity_name,
            'supplier_type' => $this->supplier_type,
            'supplier_category' => $this->supplier_category,
            'status' => $this->status,
            'gst_registration_type' => $this->gst_registration_type,
            'contact_person' => $this->contact_person,
            'contact_person_name' => $this->contact_person_name,
            'designation' => $this->designation,
            'mobile_number' => $this->mobile_number,
            'email' => $this->email,
            'website' => $this->website,
            'alternate_contact_details' => $this->alternate_contact_details,
            'phone' => $this->phone,
            'address' => $this->address,
            'registered_address' => $this->registered_address,
            'billing_address' => $this->billing_address,
            'dispatch_address' => $this->dispatch_address,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'postal_code' => $this->postal_code,
            'gst_number' => $this->gst_number,
            'pan_number' => $this->pan_number,
            'tan_number' => $this->tan_number,
            'msme_registration_number' => $this->msme_registration_number,
            'cin_number' => $this->cin_number,
            'trade_license_number' => $this->trade_license_number,
            'compliance_certificates' => $this->compliance_certificates,
            'insurance_details' => $this->insurance_details,
            'bank_name' => $this->bank_name,
            'account_holder_name' => $this->account_holder_name,
            'account_number' => $this->account_number,
            'ifsc_code' => $this->ifsc_code,
            'swift_code' => $this->swift_code,
            'branch_name' => $this->branch_name,
            'upi_id' => $this->upi_id,
            'material_categories_supplied' => $this->material_categories_supplied,
            'preferred_supplier' => (bool) $this->preferred_supplier,
            'lead_time_days' => $this->lead_time_days,
            'minimum_order_quantity' => $this->minimum_order_quantity,
            'delivery_terms' => $this->delivery_terms,
            'payment_terms' => $this->payment_terms,
            'credit_limit' => $this->credit_limit,
            'currency' => $this->currency,
            'archived_at' => $this->archived_at,
        ];
    }
}
