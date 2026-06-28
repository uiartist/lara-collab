<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseRequest extends Model
{
    protected $fillable = [
        'code_number',
        'task_id',
        'from_user_id',
        'supplier_id',
        'subject',
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
        'notes',
        'related_task_ids',
        'sent_at',
    ];

    protected $casts = [
        'work_order_date' => 'date',
        'expected_start_date' => 'date',
        'expected_finish_date' => 'date',
        'signature_date' => 'date',
        'shipping_handling_cost' => 'decimal:2',
        'labor_items' => 'array',
        'material_items' => 'array',
        'related_task_ids' => 'array',
        'sent_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(PurchaseRequestAttachment::class);
    }
}
