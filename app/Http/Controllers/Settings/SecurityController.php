<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Security;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SecurityController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Security::class, 'security');
    }

    public function index()
    {
        $items = Security::paginate(20);
        return Inertia::render('Settings/Security/Index', compact('items'));
    }

    public function create()
    {
        return Inertia::render('Settings/Security/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Security::create($data);

        return redirect()->route('settings.security.index')->with('success', 'Security item created.');
    }

    public function edit(Security $security)
    {
        return Inertia::render('Settings/Security/Edit', compact('security'));
    }

    public function update(Request $request, Security $security)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $security->update($data);

        return redirect()->route('settings.security.index')->with('success', 'Security item updated.');
    }

    public function destroy(Security $security)
    {
        $security->delete();

        return back()->with('success', 'Security item archived.');
    }

    public function restore($id)
    {
        $security = Security::withTrashed()->findOrFail($id);
        $this->authorize('restore', $security);
        $security->restore();

        return back()->with('success', 'Security item restored.');
    }
}