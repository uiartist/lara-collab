<?php

use App\Models\PurchaseRequest;

it('allows the purchase request country field to be mass assigned', function () {
    $purchaseRequest = new PurchaseRequest([
        'country' => 'India',
    ]);

    expect($purchaseRequest->country)->toBe('India');
});
