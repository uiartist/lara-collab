<?php

namespace App\Http\Controllers;

use App\Enums\PricingType;
use App\Http\Requests\Task\StoreSubTaskRequest;
use App\Http\Requests\Task\UpdateSubTaskRequest;
use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class SubTaskController extends Controller
{
    /**
     * List all direct children (depth=1) of a task.
     */
    public function index(Project $project, Task $task): JsonResponse
    {
        $this->authorize('viewAny', [Task::class, $project]);

        $subTasks = $task->children()->with([
            'assignedToUser:id,name,avatar',
            'createdByUser:id,name',
            'labels:id,name,color',
        ])->get();

        return response()->json(['sub_tasks' => $subTasks]);
    }

    /**
     * Create a new sub-task under the given parent task.
     */
    public function store(StoreSubTaskRequest $request, Project $project, Task $parentTask): JsonResponse
    {
        $this->authorize('create', [Task::class, $project]);

        $data = $request->validated();

        if (($data['pricing_type'] ?? null) === PricingType::HOURLY->value) {
            $data['fixed_price'] = null;
        } elseif (isset($data['fixed_price'])) {
            $data['fixed_price'] = (int) ($data['fixed_price'] * 100);
        }

        $subTask = $project->tasks()->create([
            'parent_id' => $parentTask->id,
            'group_id' => $parentTask->group_id,
            'created_by_user_id' => auth()->id(),
            'assigned_to_user_id' => $data['assigned_to_user_id'] ?? null,
            'name' => $data['name'],
            'number' => $project->tasks()->withArchived()->count() + 1,
            'description' => $data['description'] ?? null,
            'due_on' => $data['due_on'] ?? null,
            'estimation' => $data['estimation'] ?? null,
            'pricing_type' => $data['pricing_type'],
            'fixed_price' => $data['fixed_price'] ?? null,
            'hidden_from_clients' => $data['hidden_from_clients'],
            'billable' => $data['billable'],
            'depth' => $parentTask->depth + 1,
            'estimated_budget' => isset($data['estimated_budget']) && $data['estimated_budget'] !== null
                                        ? (int) round($data['estimated_budget'] * 100)
                                        : null,
            'actual_budget' => isset($data['actual_budget']) && $data['actual_budget'] !== null
                                        ? (int) round($data['actual_budget'] * 100)
                                        : null,
        ]);

        $subTask->load(['assignedToUser:id,name,avatar', 'createdByUser:id,name', 'labels:id,name,color']);

        return response()->json(['sub_task' => $subTask], 201);
    }

    /**
     * Update an existing sub-task.
     */
    public function update(UpdateSubTaskRequest $request, Project $project, Task $parentTask, Task $subTask): JsonResponse
    {
        $this->authorize('update', [$subTask, $project]);

        $data = $request->validated();

        if (isset($data['fixed_price'])) {
            $data['fixed_price'] = (int) ($data['fixed_price'] * 100);
        }

        foreach (['estimated_budget', 'actual_budget'] as $field) {
            if (isset($data[$field]) && $data[$field] !== null) {
                $data[$field] = (int) round($data[$field] * 100);
            }
        }

        $subTask->update($data);

        $subTask->load(['assignedToUser:id,name,avatar', 'createdByUser:id,name', 'labels:id,name,color']);

        return response()->json(['sub_task' => $subTask]);
    }

    /**
     * Delete (archive) a sub-task.
     */
    public function destroy(Project $project, Task $parentTask, Task $subTask): JsonResponse
    {
        $this->authorize('archive task', [$subTask, $project]);

        $subTask->archive();

        return response()->json(['message' => 'Sub-task archived.']);
    }
}
