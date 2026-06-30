<?php

namespace App\Http\Controllers;

use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Http\Resources\EntityCodeNumber\EntityCodeNumberResource;
use App\Http\Resources\Supplier\SupplierResource;
use App\Models\EntityCodeNumber;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Supplier::class);

        $codeNumberSettings = EntityCodeNumber::where('entity_type', 'Supplier')->first();

        return Inertia::render('Suppliers/Index', [
            'items' => SupplierResource::collection(
                Supplier::searchByQueryString()
                    ->sortByQueryString()
                    ->when($request->has('archived'), fn ($query) => $query->onlyArchived())
                    ->paginate(12)
            ),
            'codeNumberSettings' => $codeNumberSettings ? new EntityCodeNumberResource($codeNumberSettings) : null,
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

        $codeNumberSettings = EntityCodeNumber::where('entity_type', 'Supplier')->first();
        $data = $request->validated();

        if ($codeNumberSettings) {
            $data['code_number'] = $this->generateCodeNumber($codeNumberSettings);
        }

        Supplier::create($data);

        return redirect()->route('suppliers.index')->success('Supplier created', 'A new supplier was successfully created.');
    }

    private function generateCodeNumber(EntityCodeNumber $settings): string
    {
        $prefix = strtoupper($settings->code_number);
        $min = $settings->min_range ?? 1;
        $max = $settings->max_range ?? 999;
        $width = max(3, strlen((string) max($min, $max - 1)));

        $existingNumbers = Supplier::withArchived()
            ->where('code_number', 'like', "$prefix%")
            ->pluck('code_number')
            ->map(function ($code) use ($prefix) {
                $numeric = preg_replace('/^'.preg_quote($prefix, '/').'/', '', $code);

                return preg_match('/^\d+$/', $numeric) ? (int) $numeric : null;
            })
            ->filter()
            ->values();

        $next = $existingNumbers->isNotEmpty() ? $existingNumbers->max() + 1 : $min;

        if ($next > $max) {
            abort(400, 'Supplier code number range exceeded.');
        }

        return $prefix.str_pad($next, $width, '0', STR_PAD_LEFT);
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
