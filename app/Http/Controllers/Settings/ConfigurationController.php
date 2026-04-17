<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Configuration;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfigurationController extends Controller
{
    public function __construct()
    {
        // $this->authorizeResource(Configuration::class, 'configuration');
    }

    public function index()
    {
        // load users and available permissions for the UI
        $users = User::orderBy('name')->get(['id', 'name']);
        $permissions = Permission::orderBy('name')->get(['id', 'name']);

        // 'label' column doesn't exist in DB; synthesize a display label from the name
        $permissions = $permissions->map(function ($p) {
            return [
                'id' => $p->id,
                'name' => $p->name,
                'label' => ucwords($p->name),
            ];
        });

        // prepare permissions assigned to each user
        $usersWithPermissions = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'permissions' => $user->getDirectPermissions()->pluck('id')->toArray(),
            ];
        });

        // if there are no permissions in DB yet create a few sample permissions for demonstration
        if ($permissions->isEmpty()) {
            $sample = [
                ['name' => 'view dashboard', 'label' => 'View dashboard'],
                ['name' => 'view invoices', 'label' => 'View invoices'],
                ['name' => 'manage projects', 'label' => 'Manage projects'],
            ];
            foreach ($sample as $s) {
                Permission::firstOrCreate(['name' => $s['name']]);
            }

            $permissions = Permission::orderBy('name')->get(['id', 'name']);

            // synthesize label for newly created permissions as well
            $permissions = $permissions->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'label' => ucwords($p->name),
                ];
            });
        }

        $selectedUser = session('selected_user') ?? ($users->first()?->id ?? null);

        return Inertia::render('Settings/Configuration/Index', [
            'users' => $users,
            'permissions' => $permissions,
            'usersWithPermissions' => $usersWithPermissions,
            'selectedUser' => $selectedUser,
        ]);
    }

    public function create()
    {
        return Inertia::render('Settings/Configuration/Create');
    }

    public function store(Request $request)
    {
        /*$data = $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]);

        Configuration::create($data);

        return redirect()->route('settings.configuration.index')->with('success', 'Configuration created.');*/
    }

    public function edit(Configuration $configuration)
    {
        // return Inertia::render('Settings/Configuration/Edit', compact('configuration'));
    }

    public function update(Request $request, Configuration $configuration)
    {
        /*$data = $request->validate([
            'name' => 'required|string|max:255',
            'value' => 'nullable|string',
        ]);

        $configuration->update($data);

        return redirect()->route('settings.configuration.index')->with('success', 'Configuration updated.');*/
    }

    /**
     * Save permissions for a given user.
     */
    public function savePermissions(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'integer|exists:permissions,id',
        ]);

        $user = User::findOrFail($data['user_id']);

        $permissions = Permission::whereIn('id', $data['permissions'] ?? [])->get();

        $user->syncPermissions($permissions);

        return back()->success('Permissions updated', 'Permissions updated.')->with('selected_user', $user->id);
    }

    public function destroy(Configuration $configuration)
    {
        // $configuration->delete();

        // return back()->with('success', 'Configuration archived.');
    }

    public function restore($id)
    {
        /*$configuration = Configuration::withTrashed()->findOrFail($id);
        $this->authorize('restore', $configuration);
        $configuration->restore();

        return back()->with('success', 'Configuration restored.');*/
    }
}
