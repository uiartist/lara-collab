<?php

use App\Http\Requests\Supplier\StoreSupplierRequest;

it('requires a supplier country during creation', function () {
    $request = new StoreSupplierRequest;

    $rules = $request->rules();

    expect($rules['country'])->toContain('required');
});
