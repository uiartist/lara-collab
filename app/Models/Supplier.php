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
        'name',
        'email',
        'phone',
        'address',
        'contact_person',
    ];

    protected $searchable = [
        'name',
        'email',
        'contact_person',
    ];

    protected $sortable = [
        'name' => 'asc',
        'email',
    ];

    public function purchaseRequests(): HasMany
    {
        return $this->hasMany(PurchaseRequest::class);
    }
}
