<?php

namespace App\Actions\Client;

use App\Events\UserCreated;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateClient
{
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'job_title' => 'Client',
                'customer_type' => $data['customer_type'] ?? null,
                'status' => $data['status'] ?? 'Active',
                'designation' => $data['designation'] ?? null,
                'phone' => $data['phone'],
                'mobile_number' => $data['mobile_number'] ?? null,
                'rate' => null,
                'email' => $data['email'],
                'website' => $data['website'] ?? null,
                'country' => $data['country'] ?? null,
                'gst_vat_number' => $data['gst_vat_number'] ?? null,
                'tax_id_1' => $data['tax_id_1'] ?? null,
                'tax_id_2' => $data['tax_id_2'] ?? null,
                'payment_terms' => $data['payment_terms'] ?? null,
                'credit_limit' => $data['credit_limit'] ?? null,
                'notes' => $data['notes'] ?? null,
                'password' => Hash::make($data['password']),
            ]);

            $user->update(['avatar' => UserService::storeOrFetchAvatar($user, $data['avatar'])]);

            $user->assignRole('client');

            if (! empty($data['companies'])) {
                $user->clientCompanies()->attach($data['companies']);
            }

            UserCreated::dispatch($user, $data['password']);

            return $user;
        });
    }
}
