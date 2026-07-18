<?php

namespace App\Http\Resources\PurchaseRequest;

use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseRequestResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->code_number,
            'title' => $this->subject,
            'subject' => $this->subject,
            'supplier' => $this->supplier ? $this->supplier->name : 'N/A',
            'created_at' => $this->created_at,
        ];
    }
}
