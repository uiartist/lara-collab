<?php

namespace App\Http\Requests\EntityCodeNumber;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEntityCodeNumberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $entityCodeNumber = $this->route('code_number');

        return [
            'entity_type' => 'required|string|max:100|unique:entity_code_numbers,entity_type,'.$entityCodeNumber->id,
            'code_number' => 'required|string|max:2',
            'min_range' => 'nullable|integer|min:0',
            'max_range' => 'nullable|integer|gt:min_range',
        ];
    }
}
