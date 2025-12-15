<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Development;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DevelopmentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Development::class, 'development');
    }

    public function index()
    {
        $items = Development::paginate(20);
        return Inertia::render('Settings/Development/Index', compact('items'));
    }

    public function create()
    {
        return Inertia::render('Settings/Development/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Development::create($data);

        return redirect()->route('settings.development.index')->with('success', 'Development item created.');
    }

    public function edit(Development $development)
    {
        return Inertia::render('Settings/Development/Edit', compact('development'));
    }

    public function update(Request $request, Development $development)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $development->update($data);

        return redirect()->route('settings.development.index')->with('success', 'Development item updated.');
    }

    public function destroy(Development $development)
    {
        $development->delete();

        return back()->with('success', 'Development item archived.');
    }

    public function restore($id)
    {
        $development = Development::withTrashed()->findOrFail($id);
        $this->authorize('restore', $development);
        $development->restore();

        return back()->with('success', 'Development item restored.');
    }
}