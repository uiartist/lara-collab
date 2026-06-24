<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Development extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code_number',
        'user_id',
        'name',
        'description',
        'key',
        'secret',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
