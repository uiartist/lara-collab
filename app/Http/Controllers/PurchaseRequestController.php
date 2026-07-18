<?php

namespace App\Http\Controllers;

use App\Mail\PurchaseRequestMail;
use App\Models\Country;
use App\Models\Department;
use App\Models\EntityCodeNumber;
use App\Models\PurchaseRequest;
use App\Models\Supplier;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class PurchaseRequestController extends Controller
{
    public function store(Request $request, Task $task): JsonResponse
    {
        $this->authorize('create', PurchaseRequest::class);

        $validated = $request->validate([
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'subject' => ['required', 'string', 'max:255'],
            'work_order_number' => ['nullable', 'string', 'max:255'],
            'work_order_date' => ['nullable', 'date'],
            'priority_level' => ['nullable', 'string', 'max:255'],
            'requested_by' => ['nullable', 'string', 'max:255'],
            'customer_id' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'country' => ['required', 'string', 'max:255'],
            'work_assigned_to' => ['nullable', 'string', 'max:255'],
            'expected_start_date' => ['nullable', 'date'],
            'expected_finish_date' => ['nullable', 'date'],
            'work_completed_by' => ['nullable', 'string', 'max:255'],
            'job_description' => ['nullable', 'string'],
            'bill_to_name' => ['nullable', 'string', 'max:255'],
            'bill_to_company' => ['nullable', 'string', 'max:255'],
            'bill_to_street_address' => ['nullable', 'string', 'max:255'],
            'bill_to_city_state_zip' => ['nullable', 'string', 'max:255'],
            'bill_to_phone' => ['nullable', 'string', 'max:255'],
            'ship_to_name' => ['nullable', 'string', 'max:255'],
            'ship_to_company' => ['nullable', 'string', 'max:255'],
            'ship_to_street_address' => ['nullable', 'string', 'max:255'],
            'ship_to_city_state_zip' => ['nullable', 'string', 'max:255'],
            'ship_to_phone' => ['nullable', 'string', 'max:255'],
            'shipping_handling_cost' => ['nullable', 'numeric', 'min:0'],
            'labor_items' => ['nullable', 'json'],
            'material_items' => ['nullable', 'json'],
            'additional_info' => ['nullable', 'string'],
            'signature_name' => ['nullable', 'string', 'max:255'],
            'signature_date' => ['nullable', 'date'],
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

        $laborItems = $this->decodeLineItems($validated['labor_items'] ?? null, 'labor_items');
        $materialItems = $this->decodeLineItems($validated['material_items'] ?? null, 'material_items');

        $purchaseRequest = DB::transaction(function () use ($request, $task, $validated, $selectedTaskIds, $laborItems, $materialItems) {
            $codeNumber = null;
            $codeNumberSettings = EntityCodeNumber::where('entity_type', 'WorkOrder')->first();
            if ($codeNumberSettings) {
                $codeNumber = $this->generateCodeNumber($codeNumberSettings);
            }

            $purchaseRequest = PurchaseRequest::create([
                'task_id' => $task->id,
                'from_user_id' => $request->user()->id,
                'supplier_id' => $validated['supplier_id'],
                'code_number' => $codeNumber,
                'subject' => $validated['subject'],
                'work_order_number' => $validated['work_order_number'] ?? null,
                'work_order_date' => $validated['work_order_date'] ?? null,
                'priority_level' => $validated['priority_level'] ?? null,
                'requested_by' => $validated['requested_by'] ?? null,
                'customer_id' => $validated['customer_id'] ?? null,
                'department' => $validated['department'] ?? null,
                'country' => $validated['country'] ?? null,
                'work_assigned_to' => $validated['work_assigned_to'] ?? null,
                'expected_start_date' => $validated['expected_start_date'] ?? null,
                'expected_finish_date' => $validated['expected_finish_date'] ?? null,
                'work_completed_by' => $validated['work_completed_by'] ?? null,
                'job_description' => $validated['job_description'] ?? null,
                'bill_to_name' => $validated['bill_to_name'] ?? null,
                'bill_to_company' => $validated['bill_to_company'] ?? null,
                'bill_to_street_address' => $validated['bill_to_street_address'] ?? null,
                'bill_to_city_state_zip' => $validated['bill_to_city_state_zip'] ?? null,
                'bill_to_phone' => $validated['bill_to_phone'] ?? null,
                'ship_to_name' => $validated['ship_to_name'] ?? null,
                'ship_to_company' => $validated['ship_to_company'] ?? null,
                'ship_to_street_address' => $validated['ship_to_street_address'] ?? null,
                'ship_to_city_state_zip' => $validated['ship_to_city_state_zip'] ?? null,
                'ship_to_phone' => $validated['ship_to_phone'] ?? null,
                'shipping_handling_cost' => $validated['shipping_handling_cost'] ?? null,
                'labor_items' => $laborItems,
                'material_items' => $materialItems,
                'additional_info' => $validated['additional_info'] ?? null,
                'signature_name' => $validated['signature_name'] ?? null,
                'signature_date' => $validated['signature_date'] ?? null,
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

    public function departments(): JsonResponse
    {
        $this->authorize('create', PurchaseRequest::class);

        return response()->json(
            Department::orderBy('name')->get(['id', 'name'])
        );
    }

    public function countries(): JsonResponse
    {
        $this->authorize('create', PurchaseRequest::class);

        return response()->json(Country::dropdownValues());
    }

    private function decodeLineItems(?string $value, string $field): array
    {
        if ($value === null || $value === '') {
            return [];
        }

        $items = json_decode($value, true);

        if (! is_array($items)) {
            throw ValidationException::withMessages([
                $field => ['The line items are invalid.'],
            ]);
        }

        return collect($items)
            ->filter(fn ($item) => is_array($item) && collect($item)->filter(fn ($v) => $v !== null && $v !== '')->isNotEmpty())
            ->values()
            ->all();
    }

    private function generateCodeNumber(EntityCodeNumber $settings): string
    {
        $prefix = strtoupper($settings->code_number);
        $min = $settings->min_range ?? 1;
        $max = $settings->max_range ?? 999;
        $width = max(3, strlen((string) max($min, $max - 1)));

        $existingNumbers = PurchaseRequest::withArchived()
            ->where('code_number', 'like', "$prefix%")
            ->pluck('code_number')
            ->map(function ($code) use ($prefix) {
                $numeric = preg_replace('/^'.preg_quote($prefix, '/').'/', '', $code);

                return preg_match('/^\d+$/', $numeric) ? (int) $numeric : null;
            })
            ->filter()
            ->values();

        $next = $existingNumbers->isNotEmpty() ? $existingNumbers->max() + 1 : $min;

        if ($next > $max) {
            abort(400, 'Work order code number range exceeded.');
        }

        return $prefix.str_pad($next, $width, '0', STR_PAD_LEFT);
    }
}
