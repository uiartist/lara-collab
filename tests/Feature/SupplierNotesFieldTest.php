<?php

use App\Models\Supplier;

it('allows supplier notes to be mass assigned', function () {
    $supplier = new Supplier([
        'notes' => 'Preferred for urgent deliveries.',
    ]);

    expect($supplier->notes)->toBe('Preferred for urgent deliveries.');
});
