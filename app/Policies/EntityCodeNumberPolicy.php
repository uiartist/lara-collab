<?php

namespace App\Policies;

use App\Models\EntityCodeNumber;
use App\Models\User;

class EntityCodeNumberPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view code numbers');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create code number');
    }

    public function update(User $user, EntityCodeNumber $entityCodeNumber): bool
    {
        return $user->hasPermissionTo('edit code number');
    }

    public function delete(User $user, EntityCodeNumber $entityCodeNumber): bool
    {
        return $user->hasPermissionTo('delete code number');
    }
}
