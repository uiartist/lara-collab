<?php

namespace App\Http\Resources\EntityCodeNumber;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EntityCodeNumberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'entity_type' => $this->entity_type,
            'code_number' => $this->code_number,
            'min_range' => $this->min_range,
            'max_range' => $this->max_range,
        ];
    }
}
