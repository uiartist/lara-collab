<?php

namespace App\Http\Resources\Client;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'avatar' => $this->avatar,
            'phone' => $this->phone,
            'customer_type' => $this->customer_type,
            'status' => $this->status,
            'designation' => $this->designation,
            'mobile_number' => $this->mobile_number,
            'website' => $this->website,
            'country' => $this->country,
            'gst_vat_number' => $this->gst_vat_number,
            'tax_id_1' => $this->tax_id_1,
            'tax_id_2' => $this->tax_id_2,
            'payment_terms' => $this->payment_terms,
            'credit_limit' => $this->credit_limit,
            'notes' => $this->notes,
            'companies' => $this->clientCompanies->map->only(['id', 'name']),
        ];
    }
}
