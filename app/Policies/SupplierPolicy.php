<?php

namespace App\Policies;

use App\Models\Supplier;
use App\Models\User;

class SupplierPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view suppliers');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create supplier');
    }

    public function update(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('edit supplier');
    }

    public function delete(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('archive supplier');
    }

    public function restore(User $user, Supplier $supplier): bool
    {
        return $user->hasPermissionTo('restore supplier');
    }
}
