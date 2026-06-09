<?php

namespace App\Http\Requests\Task;

use App\Enums\PricingType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSubTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'                  => ['sometimes', 'required', 'string', 'max:255'],
            'assigned_to_user_id'   => ['nullable', 'exists:users,id'],
            'description'           => ['nullable', 'string'],
            'estimation'            => ['nullable', 'numeric', 'min:0'],
            'pricing_type'          => ['sometimes', 'string', Rule::enum(PricingType::class)],
            'fixed_price'           => ['nullable', 'numeric', 'min:0'],
            'due_on'                => ['nullable', 'date'],
            'hidden_from_clients'   => ['boolean'],
            'billable'              => ['boolean'],
            'estimated_budget'      => ['nullable', 'numeric', 'min:0'],
            'actual_budget'         => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
