<?php

use App\Models\Role;
use Database\Seeders\PermissionSeeder;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

it('creates material permissions for the admin role', function () {
    foreach (['admin', 'manager', 'developer', 'designer', 'client'] as $roleName) {
        Role::firstOrCreate([
            'name' => $roleName,
            'guard_name' => 'web',
        ]);
    }

    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    Artisan::call('db:seed', ['--class' => PermissionSeeder::class]);

    $permissions = Permission::query()
        ->whereIn('name', ['view materials', 'create material', 'edit material', 'delete material', 'restore material'])
        ->pluck('name');

    expect($permissions)->toContain('view materials')
        ->and($permissions)->toContain('create material')
        ->and($permissions)->toContain('edit material')
        ->and($permissions)->toContain('delete material')
        ->and($permissions)->toContain('restore material');
});
