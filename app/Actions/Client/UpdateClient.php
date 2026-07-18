<?php

namespace App\Actions\Client;

use App\Models\EntityCodeNumber;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\Hash;

class UpdateClient
{
    public function update($user, array $data): bool
    {
        $newData = [
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'customer_type' => $data['customer_type'] ?? null,
            'status' => $data['status'] ?? 'Active',
            'designation' => $data['designation'] ?? null,
            'mobile_number' => $data['mobile_number'] ?? null,
            'website' => $data['website'] ?? null,
            'country' => $data['country'] ?? null,
            'gst_vat_number' => $data['gst_vat_number'] ?? null,
            'tax_id_1' => $data['tax_id_1'] ?? null,
            'tax_id_2' => $data['tax_id_2'] ?? null,
            'payment_terms' => $data['payment_terms'] ?? null,
            'credit_limit' => $data['credit_limit'] ?? null,
            'notes' => $data['notes'] ?? null,
        ];

        if (! $user->code_number) {
            $codeNumberSettings = EntityCodeNumber::where('entity_type', 'ClientUser')->first();
            if ($codeNumberSettings) {
                $newData['code_number'] = $this->generateCodeNumber($codeNumberSettings);
            }
        }

        if ($user->avatar === null || $data['avatar']) {
            $newData['avatar'] = UserService::storeOrFetchAvatar($user, $data['avatar']);
        }

        if (! empty($data['password'])) {
            $newData['password'] = Hash::make($data['password']);
        }

        if (! empty($data['companies'])) {
            $user->clientCompanies()->sync($data['companies']);
        }

        return $user->update($newData);
    }

    private function generateCodeNumber(EntityCodeNumber $settings): string
    {
        $prefix = strtoupper($settings->code_number);
        $min = $settings->min_range ?? 1;
        $max = $settings->max_range ?? 999;
        $width = max(3, strlen((string) max($min, $max - 1)));

        $existingNumbers = User::withArchived()
            ->where('code_number', 'like', "$prefix%")
            ->pluck('code_number')
            ->map(function ($code) use ($prefix) {
                $numeric = preg_replace('/^'.preg_quote($prefix, '/').'/', '', $code);

                return preg_match('/^\d+$/', $numeric) ? (int) $numeric : null;
            })
            ->filter()
            ->values();

        $next = $existingNumbers->isNotEmpty() ? $existingNumbers->max() + 1 : $min;

        if ($next > $max) {
            abort(400, 'Client user code number range exceeded.');
        }

        return $prefix.str_pad($next, $width, '0', STR_PAD_LEFT);
    }
}
