<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Lacodix\LaravelModelFilter\Traits\IsSearchable;
use Lacodix\LaravelModelFilter\Traits\IsSortable;

class EntityCodeNumber extends Model
{
    use IsSearchable, IsSortable;

    protected $fillable = ['entity_type', 'code_number'];

    protected $searchable = [
        'entity_type',
    ];

    protected $sortable = [
        'entity_type' => 'asc',
    ];
}