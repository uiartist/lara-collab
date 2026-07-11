<?php

use App\Models\Supplier;

it('allows tax id fields to be mass assigned', function () {
    $supplier = new Supplier([
        'tax_id_1' => 'TAX-001',
        'tax_id_2' => 'TAX-002',
    ]);

    expect($supplier->tax_id_1)->toBe('TAX-001')
        ->and($supplier->tax_id_2)->toBe('TAX-002');
});
