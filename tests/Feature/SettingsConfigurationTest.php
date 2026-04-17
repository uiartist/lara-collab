<?php

use App\Models\Permission;
use App\Models\User;

it('saves permissions for a user', function () {
    $actor = User::factory()->create();
    $target = User::factory()->create();

    // create sample permissions
    $p1 = Permission::firstOrCreate(['name' => 'view invoices']);
    $p2 = Permission::firstOrCreate(['name' => 'manage projects']);

    $this->actingAs($actor)
        ->post(route('settings.configuration.permissions'), [
            'user_id' => $target->id,
            'permissions' => [$p1->id, $p2->id],
        ])
        ->assertRedirect();

    expect($target->fresh()->hasPermissionTo('view invoices'))->toBeTrue();
    expect($target->fresh()->hasPermissionTo('manage projects'))->toBeTrue();
});
