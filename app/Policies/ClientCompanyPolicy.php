<?php

namespace App\Policies;

use App\Models\ClientCompany;
use App\Models\User;

class ClientCompanyPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Internal staff with permission can view all
        if ($user->hasPermissionTo('view client companies')) {
            return true;
        }

        // Client users can only view their own companies
        if ($user->isClientUser()) {
            return $user->clientCompanies()->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can view a specific model.
     */
    public function view(User $user, ClientCompany $model): bool
    {
        // Internal staff with permission can view any
        if ($user->hasPermissionTo('view client companies')) {
            return true;
        }

        // Client users can only view their own company
        if ($user->isClientUser()) {
            return $user->clientCompanies()->where('client_company_id', $model->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create client company');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ClientCompany $model): bool
    {
        // Internal staff with permission can edit any
        if ($user->hasPermissionTo('edit client company')) {
            return true;
        }

        // Client users can only edit their own company
        if ($user->isClientUser()) {
            return $user->clientCompanies()->where('client_company_id', $model->id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ClientCompany $model): bool
    {
        return $user->hasPermissionTo('archive client company');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ClientCompany $model): bool
    {
        return $user->hasPermissionTo('restore client company');
    }
}
