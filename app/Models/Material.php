<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Lacodix\LaravelModelFilter\Traits\IsSearchable;
use Lacodix\LaravelModelFilter\Traits\IsSortable;
use LaravelArchivable\Archivable;

class Material extends Model
{
    use Archivable, HasFactory, IsSearchable, IsSortable;

    protected $fillable = [
        'material_code',
        'material_name',
        'material_description',
        'material_category',
        'material_sub_category',
        'material_type',
        'brand',
        'manufacturer',
        'material_status',
        'uom',
        'alternate_uom',
        'conversion_factor',
        'weight',
        'length',
        'width',
        'height',
        'volume',
        'stock_item',
        'current_stock',
        'reorder_level',
        'reorder_quantity',
        'minimum_stock_level',
        'maximum_stock_level',
        'safety_stock',
        'storage_location',
        'warehouse',
        'bin_location',
        'preferred_supplier_id',
        'supplier_material_code',
        'lead_time_days',
        'minimum_order_quantity',
        'purchase_rate',
        'last_purchase_rate',
        'standard_cost',
        'currency',
        'material_cost',
        'transportation_cost',
        'loading_unloading_cost',
        'tax_percentage',
        'landed_cost',
        'budget_cost',
        'project_allocation',
        'wbs_code',
        'cost_center',
        'material_usage_type',
        'project_consumption_tracking',
        'material_issue_method',
        'gst_rate',
        'hsn_sac_code',
        'tax_category',
        'compliance_certificate_reference',
        'quality_inspection_required',
        'inspection_frequency',
        'quality_standards',
        'acceptance_criteria',
        'test_certificate_required',
        'grade',
        'color',
        'size',
        'thickness',
        'density',
        'strength_rating',
        'technical_specifications',
        'batch_number',
        'lot_number',
        'serial_number',
        'manufacturing_date',
        'expiry_date',
        'warranty_period',
        'material_datasheets',
        'product_catalogs',
        'test_certificates',
        'quality_reports',
        'material_images',
        'safety_data_sheets',
    ];

    protected $casts = [
        'stock_item' => 'boolean',
        'project_consumption_tracking' => 'boolean',
        'quality_inspection_required' => 'boolean',
        'test_certificate_required' => 'boolean',
        'material_datasheets' => 'array',
        'product_catalogs' => 'array',
        'test_certificates' => 'array',
        'quality_reports' => 'array',
        'material_images' => 'array',
        'safety_data_sheets' => 'array',
        'manufacturing_date' => 'date',
        'expiry_date' => 'date',
    ];

    protected $searchable = [
        'material_code',
        'material_name',
        'material_category',
        'hsn_sac_code',
    ];

    protected $sortable = [
        'material_name' => 'asc',
        'material_code',
        'material_status',
    ];

    public function preferredSupplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'preferred_supplier_id');
    }
}
