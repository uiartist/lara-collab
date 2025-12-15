<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Configuration;
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
        // $items = Configuration::paginate(20);
        // return Inertia::render('Settings/Configuration/Index', compact('items'));
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
