<?php

use App\Http\Requests\Client\UpdateClientRequest;

it('uses a plain email validator for client user updates', function () {
    $request = new UpdateClientRequest();
    $rules = $request->rules();

    expect($rules['email'])->toContain('email')
        ->and($rules['email'])->not->toContain('email:rfc,dns');
});
