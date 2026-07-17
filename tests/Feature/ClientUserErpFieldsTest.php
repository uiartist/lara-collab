<?php

use App\Models\User;

it('allows phase-1 ERP client fields to be mass assigned on users', function () {
    $user = new User([
        'customer_type' => 'Corporate',
        'status' => 'Active',
        'designation' => 'Procurement Head',
        'mobile_number' => '+91 9876543210',
        'website' => 'https://acme.example',
        'country' => 'India',
        'gst_vat_number' => '27ABCDE1234F1Z5',
        'tax_id_1' => '',
        'tax_id_2' => '',
        'payment_terms' => 'Net 30',
        'credit_limit' => 50000,
        'notes' => 'Preferred for urgent deliveries.',
    ]);

    expect($user->customer_type)->toBe('Corporate')
        ->and($user->status)->toBe('Active')
        ->and($user->designation)->toBe('Procurement Head')
        ->and($user->mobile_number)->toBe('+91 9876543210')
        ->and($user->website)->toBe('https://acme.example')
        ->and($user->country)->toBe('India')
        ->and($user->gst_vat_number)->toBe('27ABCDE1234F1Z5')
        ->and($user->payment_terms)->toBe('Net 30')
        ->and($user->credit_limit)->toBe(50000)
        ->and($user->notes)->toBe('Preferred for urgent deliveries.');
});
