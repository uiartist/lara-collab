<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\User;

class InvoicePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view invoices');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create invoice');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Invoice $model): bool
    {
        if (!$user->hasPermissionTo('view invoices')) {
            return false;
        }

        // For client users, verify access to at least one project in the invoice
        if ($user->isClientUser()) {
            $invoiceProjectIds = $model->tasks()->pluck('project_id')->unique();
            if ($invoiceProjectIds->isEmpty()) {
                return false; // Invoice has no tasks/projects
            }
            return $user->clientUserProjects()
                ->whereIn('project_id', $invoiceProjectIds)
                ->exists();
        }

        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Invoice $model): bool
    {
        return $this->view($user, $model) && $user->hasPermissionTo('edit invoice');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Invoice $model): bool
    {
        return $this->view($user, $model) && $user->hasPermissionTo('archive invoice');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Invoice $model): bool
    {
        return $this->view($user, $model) && $user->hasPermissionTo('restore invoice');
    }

    /**
     * Determine whether the user can change status of the model.
     */
    public function changeStatus(User $user, Invoice $model): bool
    {
        return $this->view($user, $model) && $user->hasPermissionTo('change invoice status');
    }

    /**
     * Determine whether the user can download the model.
     */
    public function download(User $user, Invoice $model): bool
    {
        return $this->view($user, $model) && $user->hasPermissionTo('download invoice');
    }

    /**
     * Determine whether the user can print the model.
     */
    public function print(User $user, Invoice $model): bool
    {
        return $this->view($user, $model) && $user->hasPermissionTo('print invoice');
    }
}
