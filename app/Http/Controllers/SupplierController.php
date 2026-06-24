<?php

namespace App\Http\Controllers;

use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Http\Resources\Supplier\SupplierResource;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Supplier::class);

        return Inertia::render('Suppliers/Index', [
            'items' => SupplierResource::collection(
                Supplier::searchByQueryString()
                    ->sortByQueryString()
                    ->when($request->has('archived'), fn ($query) => $query->onlyArchived())
                    ->paginate(12)
            ),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Supplier::class);

        return Inertia::render('Suppliers/Create');
    }

    public function store(StoreSupplierRequest $request)
    {
        $this->authorize('create', Supplier::class);

        Supplier::create($request->validated());

        return redirect()->route('suppliers.index')->success('Supplier created', 'A new supplier was successfully created.');
    }

    public function edit(Supplier $supplier): Response
    {
        $this->authorize('update', $supplier);

        return Inertia::render('Suppliers/Edit', ['item' => new SupplierResource($supplier)]);
    }

    public function update(Supplier $supplier, UpdateSupplierRequest $request)
    {
        $this->authorize('update', $supplier);

        $supplier->update($request->validated());

        return redirect()->route('suppliers.index')->success('Supplier updated', 'The supplier was successfully updated.');
    }

    public function destroy(Supplier $supplier)
    {
        $this->authorize('delete', $supplier);

        $supplier->archive();

        return redirect()->back()->success('Supplier archived', 'The supplier was successfully archived.');
    }

    public function restore(int $supplierId)
    {
        $supplier = Supplier::withArchived()->findOrFail($supplierId);

        $this->authorize('restore', $supplier);

        $supplier->unArchive();

        return redirect()->back()->success('Supplier restored', 'The supplier was successfully restored.');
    }
}
