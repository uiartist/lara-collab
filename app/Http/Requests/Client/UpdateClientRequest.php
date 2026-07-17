<?php

namespace App\Http\Requests\Client;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class UpdateClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'phone' => 'string|nullable',
            'customer_type' => 'nullable|string|max:100',
            'status' => 'nullable|string|max:50',
            'designation' => 'nullable|string|max:100',
            'mobile_number' => 'nullable|string|max:50',
            'email' => ['required', 'email', Rule::unique('users')->ignore($this->route('user')->id)],
            'website' => 'nullable|url|max:255',
            'country' => 'nullable|string|max:100',
            'gst_vat_number' => 'nullable|string|max:100',
            'tax_id_1' => 'nullable|string|max:100',
            'tax_id_2' => 'nullable|string|max:100',
            'payment_terms' => 'nullable|string|max:255',
            'credit_limit' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:2000',
            'password' => 'nullable|min:8|confirmed',
            'avatar' => [File::image(), 'nullable'],
            'companies' => 'required|array|min:1',
        ];
    }
}
