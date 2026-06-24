<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $purchaseRequest->subject }}</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px;">
    <h2 style="color: #1a73e8;">Purchase Request</h2>

    <p><strong>From:</strong> {{ $fromUser->name }} ({{ $fromUser->email }})</p>
    <p><strong>To:</strong> {{ $purchaseRequest->supplier->name }}</p>
    <p><strong>Subject:</strong> {{ $purchaseRequest->subject }}</p>
    <p><strong>Related Task:</strong> #{{ $purchaseRequest->task->number }} - {{ $purchaseRequest->task->name }}</p>

    @if($relatedTasks->isNotEmpty())
        <p><strong>Selected Tasks:</strong></p>
        <ul>
            @foreach($relatedTasks as $relatedTask)
                <li>#{{ $relatedTask->number }} - {{ $relatedTask->name }}</li>
            @endforeach
        </ul>
    @endif

    @if($purchaseRequest->notes)
        <hr>
        <p><strong>Notes:</strong></p>
        <p>{{ $purchaseRequest->notes }}</p>
    @endif

    <hr>
    <p style="font-size: 12px; color: #888;">This message was sent via {{ config('app.name') }}.</p>
</body>
</html>
