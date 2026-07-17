<?php

namespace App\Http\Requests\Material;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMaterialRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'material_code' => ['required', 'string', 'max:100', Rule::unique('materials', 'material_code')->ignore($this->route('material')->id)],
            'material_name' => ['required', 'string', 'max:255'],
            'material_description' => ['nullable', 'string'],
            'material_category' => ['required', 'string', 'max:255'],
            'material_sub_category' => ['nullable', 'string', 'max:255'],
            'material_type' => ['nullable', 'string', 'max:100'],
            'brand' => ['nullable', 'string', 'max:255'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'material_status' => ['required', 'string', 'max:50'],
            'uom' => ['required', 'string', 'max:50'],
            'alternate_uom' => ['nullable', 'string', 'max:50'],
            'conversion_factor' => ['nullable', 'numeric', 'min:0'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'height' => ['nullable', 'numeric', 'min:0'],
            'volume' => ['nullable', 'numeric', 'min:0'],
            'stock_item' => ['nullable', 'boolean'],
            'current_stock' => ['nullable', 'numeric', 'min:0'],
            'reorder_level' => ['nullable', 'numeric', 'min:0'],
            'reorder_quantity' => ['nullable', 'numeric', 'min:0'],
            'minimum_stock_level' => ['nullable', 'numeric', 'min:0'],
            'maximum_stock_level' => ['nullable', 'numeric', 'min:0'],
            'safety_stock' => ['nullable', 'numeric', 'min:0'],
            'storage_location' => ['nullable', 'string', 'max:255'],
            'warehouse' => ['required', 'string', 'max:255'],
            'bin_location' => ['nullable', 'string', 'max:255'],
            'preferred_supplier_id' => ['nullable', 'integer', 'exists:suppliers,id'],
            'supplier_material_code' => ['nullable', 'string', 'max:255'],
            'lead_time_days' => ['nullable', 'integer', 'min:0'],
            'minimum_order_quantity' => ['nullable', 'numeric', 'min:0'],
            'purchase_rate' => ['nullable', 'numeric', 'min:0'],
            'last_purchase_rate' => ['nullable', 'numeric', 'min:0'],
            'standard_cost' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'max:10'],
            'material_cost' => ['nullable', 'numeric', 'min:0'],
            'transportation_cost' => ['nullable', 'numeric', 'min:0'],
            'loading_unloading_cost' => ['nullable', 'numeric', 'min:0'],
            'tax_percentage' => ['nullable', 'numeric', 'min:0'],
            'landed_cost' => ['nullable', 'numeric', 'min:0'],
            'budget_cost' => ['nullable', 'numeric', 'min:0'],
            'project_allocation' => ['required', 'string', 'max:255'],
            'wbs_code' => ['nullable', 'string', 'max:255'],
            'cost_center' => ['nullable', 'string', 'max:255'],
            'material_usage_type' => ['nullable', 'string', 'max:255'],
            'project_consumption_tracking' => ['nullable', 'boolean'],
            'material_issue_method' => ['nullable', 'string', 'max:255'],
            'gst_rate' => ['nullable', 'numeric', 'min:0'],
            'hsn_sac_code' => ['required', 'string', 'max:100'],
            'tax_category' => ['nullable', 'string', 'max:255'],
            'compliance_certificate_reference' => ['nullable', 'string', 'max:255'],
            'quality_inspection_required' => ['required', 'boolean'],
            'inspection_frequency' => ['nullable', 'string', 'max:255'],
            'quality_standards' => ['nullable', 'string', 'max:255'],
            'acceptance_criteria' => ['nullable', 'string'],
            'test_certificate_required' => ['nullable', 'boolean'],
            'grade' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:255'],
            'size' => ['nullable', 'string', 'max:255'],
            'thickness' => ['nullable', 'string', 'max:255'],
            'density' => ['nullable', 'string', 'max:255'],
            'strength_rating' => ['nullable', 'string', 'max:255'],
            'technical_specifications' => ['nullable', 'string'],
            'batch_number' => ['nullable', 'string', 'max:255'],
            'lot_number' => ['nullable', 'string', 'max:255'],
            'serial_number' => ['nullable', 'string', 'max:255'],
            'manufacturing_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date'],
            'warranty_period' => ['nullable', 'string', 'max:255'],
        ];
    }
}
