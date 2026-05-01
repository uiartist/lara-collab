<?php

namespace App\Policies;

use App\Models\Permission;
use App\Models\TaskCost;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Spatie\Permission\Exceptions\PermissionDoesNotExist;

class TaskCostPolicy
{
    use HandlesAuthorization;

    public function create(User $user)
    {
        if (! Permission::where('name', 'add costs')->exists()) {
            return false;
        }

        try {
            return $user->hasPermissionTo('add costs');
        } catch (PermissionDoesNotExist $e) {
            return false;
        }
    }

    public function delete(User $user, TaskCost $taskCost)
    {
        if (! Permission::where('name', 'delete costs')->exists()) {
            return false;
        }

        try {
            return $user->hasPermissionTo('delete costs');
        } catch (PermissionDoesNotExist $e) {
            return false;
        }
    }

    public function viewAny(User $user)
    {
        if (! Permission::where('name', 'view costs')->exists()) {
            return false;
        }

        try {
            return $user->hasPermissionTo('view costs');
        } catch (PermissionDoesNotExist $e) {
            return false;
        }
    }

    public function view(User $user, TaskCost $taskCost)
    {
        if (! Permission::where('name', 'view costs')->exists()) {
            return false;
        }

        try {
            return $user->hasPermissionTo('view costs');
        } catch (PermissionDoesNotExist $e) {
            return false;
        }
    }
}
