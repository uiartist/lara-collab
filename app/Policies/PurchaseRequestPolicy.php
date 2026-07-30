<?php

namespace App\Policies;

use App\Models\PurchaseRequest;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PurchaseRequestPolicy
{
    use HandlesAuthorization;

    /**
     * Check if user can view/access the work order based on task's project access
     */
    private function canAccessWorkOrder(User $user, PurchaseRequest $purchaseRequest): bool
    {
        // For client users, verify access to the task's project
        if ($user->isClientUser() && $purchaseRequest->task) {
            return $user->hasProjectAccess($purchaseRequest->task->project);
        }

        return true; // Internal staff can access all work orders
    }

    public function view(User $user, PurchaseRequest $purchaseRequest): bool
    {
        return $user->hasPermissionTo('view work orders') && $this->canAccessWorkOrder($user, $purchaseRequest);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create work order');
    }

    public function update(User $user, PurchaseRequest $purchaseRequest): bool
    {
        return $this->canAccessWorkOrder($user, $purchaseRequest) && $user->hasPermissionTo('edit work order');
    }

    public function approve(User $user, PurchaseRequest $purchaseRequest): bool
    {
        return $this->canAccessWorkOrder($user, $purchaseRequest) && $user->hasPermissionTo('approve work order');
    }

    public function archive(User $user, PurchaseRequest $purchaseRequest): bool
    {
        return $this->canAccessWorkOrder($user, $purchaseRequest) && 
               ($user->hasPermissionTo('archive purchase request') || $user->hasPermissionTo('approve work order'));
    }

    public function restore(User $user, PurchaseRequest $purchaseRequest): bool
    {
        return $this->canAccessWorkOrder($user, $purchaseRequest) && 
               ($user->hasPermissionTo('restore purchase request') || $user->hasPermissionTo('approve work order'));
    }
}
