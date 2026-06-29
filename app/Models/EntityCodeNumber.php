<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Lacodix\LaravelModelFilter\Traits\IsSearchable;
use Lacodix\LaravelModelFilter\Traits\IsSortable;

class EntityCodeNumber extends Model
{
    use IsSearchable, IsSortable;

    protected $fillable = ['entity_type', 'code_number', 'min_range', 'max_range'];

    protected $casts = [
        'min_range' => 'integer',
        'max_range' => 'integer',
    ];

    protected $searchable = [
        'entity_type',
    ];

    protected $sortable = [
        'entity_type' => 'asc',
    ];
}
