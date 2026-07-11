<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Lacodix\LaravelModelFilter\Traits\IsSearchable;
use Lacodix\LaravelModelFilter\Traits\IsSortable;
use LaravelArchivable\Archivable;

class Supplier extends Model
{
    use Archivable, HasFactory, IsSearchable, IsSortable;

    protected $fillable = [
        'code_number',
        'vendor_code',
        'name',
        'legal_entity_name',
        'supplier_type',
        'supplier_category',
        'status',
        'gst_registration_type',
        'contact_person',
        'contact_person_name',
        'designation',
        'mobile_number',
        'email',
        'website',
        'alternate_contact_details',
        'phone',
        'address',
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
        'tax_id_1',
        'tax_id_2',
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
    ];

    protected $searchable = [
        'name',
        'email',
        'contact_person',
        'contact_person_name',
        'vendor_code',
        'gst_number',
    ];

    protected $sortable = [
        'name' => 'asc',
        'email',
        'vendor_code',
    ];

    public function purchaseRequests(): HasMany
    {
        return $this->hasMany(PurchaseRequest::class);
    }
}
