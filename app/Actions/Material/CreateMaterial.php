<?php

namespace App\Actions\Material;

use App\Models\EntityCodeNumber;
use App\Models\Material;
use Illuminate\Support\Facades\DB;

class CreateMaterial
{
    public function create(array $data): Material
    {
        return DB::transaction(function () use ($data) {
            $codeNumber = null;
            $codeNumberSettings = EntityCodeNumber::where('entity_type', 'Material')->first();
            if ($codeNumberSettings) {
                $codeNumber = $this->generateCodeNumber($codeNumberSettings);
            }

            // Set the generated code number if available
            if ($codeNumber) {
                $data['material_code'] = $codeNumber;
            }

            return Material::create($data);
        });
    }

    private function generateCodeNumber(EntityCodeNumber $settings): string
    {
        $prefix = strtoupper($settings->code_number);
        $min = $settings->min_range ?? 1;
        $max = $settings->max_range ?? 999;
        $width = max(3, strlen((string) max($min, $max - 1)));

        $existingNumbers = Material::where('material_code', 'like', "$prefix%")
            ->pluck('material_code')
            ->map(function ($code) use ($prefix) {
                $numeric = preg_replace('/^'.preg_quote($prefix, '/').'/', '', $code);

                return preg_match('/^\d+$/', $numeric) ? (int) $numeric : null;
            })
            ->filter()
            ->values();

        $next = $existingNumbers->isNotEmpty() ? $existingNumbers->max() + 1 : $min;

        if ($next > $max) {
            abort(400, 'Material code number range exceeded.');
        }

        return $prefix.str_pad($next, $width, '0', STR_PAD_LEFT);
    }
}
