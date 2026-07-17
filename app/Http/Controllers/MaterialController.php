<?php

namespace App\Http\Controllers;

use App\Http\Requests\Material\StoreMaterialRequest;
use App\Http\Requests\Material\UpdateMaterialRequest;
use App\Http\Resources\Material\MaterialResource;
use App\Models\Material;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MaterialController extends Controller
{
    private function canAccessMaterial(Request $request, string $permission): bool
    {
        $user = $request->user();

        return $user->hasRole('admin') || $user->can($permission);
    }

    public function index(Request $request): Response
    {
        abort_if(! $this->canAccessMaterial($request, 'view materials'), 401);

        return Inertia::render('Materials/Index', [
            'items' => MaterialResource::collection(
                Material::searchByQueryString()
                    ->sortByQueryString()
                    ->with('preferredSupplier:id,name')
                    ->when($request->has('archived'), fn ($query) => $query->onlyArchived())
                    ->paginate(12)
            ),
        ]);
    }

    public function create(Request $request): Response
    {
        abort_if(! $this->canAccessMaterial($request, 'create material'), 401);

        return Inertia::render('Materials/Create', [
            'suppliers' => Supplier::whereNull('archived_at')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn ($supplier) => ['value' => (string) $supplier->id, 'label' => $supplier->name])
                ->toArray(),
        ]);
    }

    public function store(StoreMaterialRequest $request)
    {
        abort_if(! $this->canAccessMaterial($request, 'create material'), 401);

        Material::create($request->validated());

        return redirect()->route('materials.index')->success('Material created', 'A new material was successfully created.');
    }

    public function edit(Request $request, Material $material): Response
    {
        abort_if(! $this->canAccessMaterial($request, 'edit material'), 401);

        return Inertia::render('Materials/Edit', [
            'item' => new MaterialResource($material->load('preferredSupplier:id,name')),
            'suppliers' => Supplier::whereNull('archived_at')
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn ($supplier) => ['value' => (string) $supplier->id, 'label' => $supplier->name])
                ->toArray(),
        ]);
    }

    public function update(Material $material, UpdateMaterialRequest $request)
    {
        abort_if(! $this->canAccessMaterial($request, 'edit material'), 401);

        $material->update($request->validated());

        return redirect()->route('materials.index')->success('Material updated', 'The material was successfully updated.');
    }

    public function destroy(Request $request, Material $material)
    {
        abort_if(! $this->canAccessMaterial($request, 'archive material'), 401);

        $material->archive();

        return redirect()->back()->success('Material archived', 'The material was successfully archived.');
    }

    public function restore(Request $request, int $materialId)
    {
        abort_if(! $this->canAccessMaterial($request, 'restore material'), 401);

        $material = Material::withArchived()->findOrFail($materialId);

        $material->unArchive();

        return redirect()->back()->success('Material restored', 'The material was successfully restored.');
    }
}
