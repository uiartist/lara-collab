<?php

namespace App\Policies;

use App\Models\ClientCompany;
use App\Models\User;

class ClientUserPolicy
{
    /**
     * Determine whether the user can view any client users.
     */
    public function viewAny(User $user, ClientCompany $company): bool
    {
        // Internal staff with permission can view any
        if ($user->hasPermissionTo('view client users')) {
            return true;
        }

        // Client users can only view their own company's users
        if ($user->isClientUser()) {
            return $user->clientCompanies()->where('client_company_id', $company->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create a client user in this company.
     */
    public function create(User $user, ClientCompany $company): bool
    {
        // Internal staff with permission can create
        if ($user->hasPermissionTo('create client user')) {
            return true;
        }

        // Client users can only create in their own company
        if ($user->isClientUser()) {
            return $user->clientCompanies()->where('client_company_id', $company->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can update the client user.
     */
    public function update(User $user, User $clientUser): bool
    {
        // Internal staff with permission can edit any
        if ($user->hasPermissionTo('edit client user')) {
            return true;
        }

        // Client users can only edit users in their own company
        if ($user->isClientUser() && $clientUser->clientCompany) {
            return $user->clientCompanies()->where('client_company_id', $clientUser->client_company_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the client user.
     */
    public function delete(User $user, User $clientUser): bool
    {
        // Internal staff with permission can delete
        if ($user->hasPermissionTo('archive client user')) {
            return true;
        }

        // Client users can only delete users in their own company
        if ($user->isClientUser() && $clientUser->clientCompany) {
            return $user->clientCompanies()->where('client_company_id', $clientUser->client_company_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can restore the client user.
     */
    public function restore(User $user, User $clientUser): bool
    {
        // Internal staff with permission can restore
        if ($user->hasPermissionTo('restore client user')) {
            return true;
        }

        // Client users can only restore users in their own company
        if ($user->isClientUser() && $clientUser->clientCompany) {
            return $user->clientCompanies()->where('client_company_id', $clientUser->client_company_id)->exists();
        }

        return false;
    }
}
