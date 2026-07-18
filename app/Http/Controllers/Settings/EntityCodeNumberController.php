<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\EntityCodeNumber\StoreEntityCodeNumberRequest;
use App\Http\Requests\EntityCodeNumber\UpdateEntityCodeNumberRequest;
use App\Http\Resources\EntityCodeNumber\EntityCodeNumberResource;
use App\Models\EntityCodeNumber;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EntityCodeNumberController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(EntityCodeNumber::class, 'code_number');
    }

    public function index(Request $request): Response
    {
        return Inertia::render('Settings/EntityCodeNumbers/Index', [
            'items' => EntityCodeNumberResource::collection(
                EntityCodeNumber::searchByQueryString()
                    ->sortByQueryString()
                    ->paginate(12)
            ),
        ]);
    }

    public function create()
    {
        $entityTypes = [
            'Project' => 'Project',
            'ClientCompany' => 'Client Company',
            'ClientUser' => 'Client User',
            'Supplier' => 'Supplier',
            'PurchaseRequest' => 'Purchase Request',
            'WorkOrder' => 'Work Order',
            'OwnerCompany' => 'Owner Company',
            'Development' => 'Development',
        ];

        return Inertia::render('Settings/EntityCodeNumbers/Create', [
            'entityTypes' => $entityTypes,
        ]);
    }

    public function store(StoreEntityCodeNumberRequest $request)
    {
        EntityCodeNumber::create($request->validated());

        return redirect()->route('settings.code-numbers.index')
            ->success('Entity code number created', 'A new entity code number was successfully created.');
    }

    public function edit(EntityCodeNumber $code_number)
    {
        $entityTypes = [
            'Project' => 'Project',
            'ClientCompany' => 'Client Company',
            'ClientUser' => 'Client User',
            'Supplier' => 'Supplier',
            'PurchaseRequest' => 'Purchase Request',
            'WorkOrder' => 'Work Order',
            'OwnerCompany' => 'Owner Company',
            'Development' => 'Development',
        ];

        return Inertia::render('Settings/EntityCodeNumbers/Edit', [
            'item' => new EntityCodeNumberResource($code_number),
            'entityTypes' => $entityTypes,
        ]);
    }

    public function update(EntityCodeNumber $code_number, UpdateEntityCodeNumberRequest $request)
    {
        $code_number->update($request->validated());

        return redirect()->route('settings.code-numbers.index')
            ->success('Entity code number updated', 'The entity code number was successfully updated.');
    }

    public function destroy(EntityCodeNumber $code_number)
    {
        $code_number->delete();

        return redirect()->back()
            ->success('Entity code number deleted', 'The entity code number was successfully deleted.');
    }
}
