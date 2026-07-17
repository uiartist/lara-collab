<?php

namespace App\Actions\Client;

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
}
