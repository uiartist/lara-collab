<?php

namespace App\Http\Requests\EntityCodeNumber;

use Illuminate\Foundation\Http\FormRequest;

class StoreEntityCodeNumberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'entity_type' => 'required|string|max:100|unique:entity_code_numbers,entity_type',
            'code_number' => 'required|string|max:2',
        ];
    }
}