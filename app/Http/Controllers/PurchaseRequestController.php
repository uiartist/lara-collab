<?php

namespace App\Http\Controllers;

use App\Mail\PurchaseRequestMail;
use App\Models\PurchaseRequest;
use App\Models\Supplier;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PurchaseRequestController extends Controller
{
    public function store(Request $request, Task $task): JsonResponse
    {
        $this->authorize('create', PurchaseRequest::class);

        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'subject' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
            'selected_task_ids' => ['required', 'array', 'min:1'],
            'selected_task_ids.*' => ['integer', 'distinct', 'exists:tasks,id'],
            'attachments' => ['nullable', 'array'],
            'attachments.*' => ['file', 'max:51200'],
        ]);

        $supplier = Supplier::findOrFail($validated['supplier_id']);
        $allowedTaskIds = $task->descendants()->pluck('tasks.id')->all();
        $selectedTaskIds = array_values(array_intersect(
            array_map('intval', $validated['selected_task_ids']),
            $allowedTaskIds
        ));

        if (count($selectedTaskIds) !== count($validated['selected_task_ids'])) {
            return response()->json([
                'message' => 'The selected tasks are invalid.',
                'errors' => ['selected_task_ids' => ['Please select tasks from this work order hierarchy.']],
            ], 422);
        }

        $purchaseRequest = DB::transaction(function () use ($request, $task, $validated, $selectedTaskIds) {
            $purchaseRequest = PurchaseRequest::create([
                'task_id' => $task->id,
                'from_user_id' => $request->user()->id,
                'supplier_id' => $validated['supplier_id'],
                'subject' => $validated['subject'],
                'notes' => $validated['notes'] ?? null,
                'related_task_ids' => $selectedTaskIds,
            ]);

            foreach ($request->file('attachments', []) as $file) {
                $path = $file->store("work-order-attachments/{$purchaseRequest->id}");

                $purchaseRequest->attachments()->create([
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                ]);
            }

            return $purchaseRequest;
        });

        $purchaseRequest->load(['attachments', 'supplier', 'task']);

        if ($supplier->email) {
            Mail::to($supplier->email)->send(
                new PurchaseRequestMail($purchaseRequest, $request->user())
            );
            $purchaseRequest->update(['sent_at' => now()]);
        }

        return response()->json(['message' => 'Purchase request sent successfully.']);
    }

    public function suppliers(): JsonResponse
    {
        $this->authorize('create', PurchaseRequest::class);

        return response()->json(
            Supplier::whereNull('archived_at')->orderBy('name')->get(['id', 'name', 'email'])
        );
    }
}
