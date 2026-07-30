<?php

namespace App\Actions\Client;

use App\Events\UserCreated;
use App\Models\EntityCodeNumber;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateClient
{
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $codeNumber = null;
            $codeNumberSettings = EntityCodeNumber::where('entity_type', 'ClientUser')->first();
            if ($codeNumberSettings) {
                $codeNumber = $this->generateCodeNumber($codeNumberSettings);
            }

            $user = User::create([
                'name' => $data['name'],
                'code_number' => $codeNumber,
                'client_company_id' => $data['client_company_id'] ?? null,
                'job_title' => 'Client',
                'username' => $data['username'],
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
                'level' => $data['level'] ?? null,
                'password' => Hash::make($data['password']),
            ]);

            $user->update(['avatar' => UserService::storeOrFetchAvatar($user, $data['avatar'] ?? null)]);

            $user->assignRole('client');

            // Assign client level role based on level
            if (!empty($data['level'])) {
                $levelCode = str_pad($data['level'], 3, '0', STR_PAD_LEFT);
                $levelRole = "client_level_{$levelCode}";
                $user->assignRole($levelRole);
            }

            if (! empty($data['companies'])) {
                $user->clientCompanies()->attach($data['companies']);
            }

            // Assign project access
            if (! empty($data['projects'])) {
                $user->clientUserProjects()->attach($data['projects']);
            }

            UserCreated::dispatch($user, $data['password']);

            return $user;
        });
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
