<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $purchaseRequest->subject }}</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 760px; margin: auto; padding: 20px;">
    <h2 style="color: #1a73e8;">Work Order</h2>

    <p><strong>From:</strong> {{ $fromUser->name }} ({{ $fromUser->email }})</p>
    <p><strong>To:</strong> {{ $purchaseRequest->supplier->name }}</p>
    <p><strong>Subject:</strong> {{ $purchaseRequest->subject }}</p>
    @if($purchaseRequest->work_order_number)
        <p><strong>Work Order #:</strong> {{ $purchaseRequest->work_order_number }}</p>
    @endif
    @if($purchaseRequest->work_order_date)
        <p><strong>Work Order Date:</strong> {{ $purchaseRequest->work_order_date->toDateString() }}</p>
    @endif
    @if($purchaseRequest->priority_level)
        <p><strong>Priority Level:</strong> {{ $purchaseRequest->priority_level }}</p>
    @endif
    <p><strong>Related Task:</strong> #{{ $purchaseRequest->task->number }} - {{ $purchaseRequest->task->name }}</p>

    @if($purchaseRequest->requested_by || $purchaseRequest->customer_id || $purchaseRequest->department || $purchaseRequest->work_assigned_to || $purchaseRequest->expected_start_date || $purchaseRequest->expected_finish_date || $purchaseRequest->work_completed_by)
        <hr>
        <h3>Assignment</h3>
        @if($purchaseRequest->requested_by)<p><strong>Requested By:</strong> {{ $purchaseRequest->requested_by }}</p>@endif
        @if($purchaseRequest->customer_id)<p><strong>Customer ID:</strong> {{ $purchaseRequest->customer_id }}</p>@endif
        @if($purchaseRequest->department)<p><strong>Department:</strong> {{ $purchaseRequest->department }}</p>@endif
        @if($purchaseRequest->work_assigned_to)<p><strong>Work Assigned To:</strong> {{ $purchaseRequest->work_assigned_to }}</p>@endif
        @if($purchaseRequest->expected_start_date)<p><strong>Expected Start:</strong> {{ $purchaseRequest->expected_start_date->toDateString() }}</p>@endif
        @if($purchaseRequest->expected_finish_date)<p><strong>Expected Finish:</strong> {{ $purchaseRequest->expected_finish_date->toDateString() }}</p>@endif
        @if($purchaseRequest->work_completed_by)<p><strong>Work Completed By:</strong> {{ $purchaseRequest->work_completed_by }}</p>@endif
    @endif

    @if($relatedTasks->isNotEmpty())
        <hr>
        <p><strong>Selected Tasks:</strong></p>
        <ul>
            @foreach($relatedTasks as $relatedTask)
                <li>#{{ $relatedTask->number }} - {{ $relatedTask->name }}</li>
            @endforeach
        </ul>
    @endif

    @if($purchaseRequest->job_description)
        <hr>
        <h3>Job</h3>
        <p>{{ $purchaseRequest->job_description }}</p>
    @endif

    @if($purchaseRequest->bill_to_name || $purchaseRequest->ship_to_name)
        <hr>
        <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
            <tr>
                <th align="left" style="border-bottom: 1px solid #ddd;">Bill To</th>
                <th align="left" style="border-bottom: 1px solid #ddd;">Ship To</th>
            </tr>
            <tr>
                <td valign="top">
                    @foreach(['bill_to_name', 'bill_to_company', 'bill_to_street_address', 'bill_to_city_state_zip', 'bill_to_phone'] as $field)
                        @if($purchaseRequest->{$field})<div>{{ $purchaseRequest->{$field} }}</div>@endif
                    @endforeach
                </td>
                <td valign="top">
                    @foreach(['ship_to_name', 'ship_to_company', 'ship_to_street_address', 'ship_to_city_state_zip', 'ship_to_phone'] as $field)
                        @if($purchaseRequest->{$field})<div>{{ $purchaseRequest->{$field} }}</div>@endif
                    @endforeach
                </td>
            </tr>
        </table>
    @endif

    @if(! empty($purchaseRequest->labor_items))
        <hr>
        <h3>Labor</h3>
        <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
            <tr>
                <th align="left" style="border-bottom: 1px solid #ddd;">Description</th>
                <th align="right" style="border-bottom: 1px solid #ddd;">Hours</th>
                <th align="right" style="border-bottom: 1px solid #ddd;">Rate</th>
                <th align="right" style="border-bottom: 1px solid #ddd;">Line Total</th>
            </tr>
            @foreach($purchaseRequest->labor_items as $item)
                @php
                    $hours = (float) ($item['hours'] ?? 0);
                    $rate = (float) ($item['rate'] ?? 0);
                @endphp
                <tr>
                    <td>{{ $item['description'] ?? '' }}</td>
                    <td align="right">{{ number_format($hours, 2) }}</td>
                    <td align="right">{{ number_format($rate, 2) }}</td>
                    <td align="right">{{ number_format($hours * $rate, 2) }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    @if(! empty($purchaseRequest->material_items))
        <hr>
        <h3>Materials</h3>
        <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse;">
            <tr>
                <th align="left" style="border-bottom: 1px solid #ddd;">Parts and Material</th>
                <th align="right" style="border-bottom: 1px solid #ddd;">Tax</th>
                <th align="right" style="border-bottom: 1px solid #ddd;">Quantity</th>
                <th align="right" style="border-bottom: 1px solid #ddd;">Unit Price</th>
                <th align="right" style="border-bottom: 1px solid #ddd;">Line Total</th>
            </tr>
            @foreach($purchaseRequest->material_items as $item)
                @php
                    $tax = (float) ($item['tax'] ?? 0);
                    $quantity = (float) ($item['quantity'] ?? 0);
                    $unitPrice = (float) ($item['unit_price'] ?? 0);
                @endphp
                <tr>
                    <td>{{ $item['part'] ?? '' }}</td>
                    <td align="right">{{ number_format($tax, 2) }}</td>
                    <td align="right">{{ number_format($quantity, 2) }}</td>
                    <td align="right">{{ number_format($unitPrice, 2) }}</td>
                    <td align="right">{{ number_format(($quantity * $unitPrice) + $tax, 2) }}</td>
                </tr>
            @endforeach
        </table>
    @endif

    @if($purchaseRequest->shipping_handling_cost !== null)
        <p><strong>S&amp;H Cost:</strong> {{ number_format((float) $purchaseRequest->shipping_handling_cost, 2) }}</p>
    @endif

    @if($purchaseRequest->additional_info)
        <hr>
        <p><strong>Additional Info:</strong></p>
        <p>{{ $purchaseRequest->additional_info }}</p>
    @endif

    @if($purchaseRequest->notes)
        <hr>
        <p><strong>Notes:</strong></p>
        <p>{{ $purchaseRequest->notes }}</p>
    @endif

    @if($purchaseRequest->signature_name || $purchaseRequest->signature_date)
        <hr>
        @if($purchaseRequest->signature_name)<p><strong>Signature:</strong> {{ $purchaseRequest->signature_name }}</p>@endif
        @if($purchaseRequest->signature_date)<p><strong>Date:</strong> {{ $purchaseRequest->signature_date->toDateString() }}</p>@endif
    @endif

    <hr>
    <p style="font-size: 12px; color: #888;">This message was sent via {{ config('app.name') }}.</p>
</body>
</html>
