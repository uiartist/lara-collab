<?php

namespace App\Http\Controllers\Task;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskCost;
use Illuminate\Http\Request;

class TaskCostController extends Controller
{
    public function index(Project $project, Task $task)
    {
        $this->authorize('viewAny', TaskCost::class);

        $costs = TaskCost::where('task_id', $task->id)
            ->with('user:id,name')
            ->orderBy('date', 'desc')
            ->get();

        return response()->json(['costs' => $costs]);
    }

    public function store(Request $request, Project $project, Task $task)
    {
        $this->authorize('create', TaskCost::class);

        $data = $request->validate([
            'amount' => 'required|numeric|min:0',
            'date' => 'nullable|date',
        ]);

        $cost = TaskCost::create([
            'task_id' => $task->id,
            'user_id' => $request->user()->id ?? null,
            'amount' => $data['amount'],
            'date' => $data['date'] ?? now()->toDateString(),
        ]);

        $cost->load('user:id,name');

        return response()->json(['cost' => $cost]);
    }

    public function destroy(Project $project, Task $task, TaskCost $taskCost)
    {
        $this->authorize('delete', $taskCost);
        $taskCost->delete();

        return response()->json(['deleted' => true]);
    }

    public function projectCosts(Project $project)
    {
        $this->authorize('viewAny', TaskCost::class);

        $taskIds = $project->tasks()->pluck('id');

        $costs = TaskCost::whereIn('task_id', $taskIds)
            ->with('task:id,number,name')
            ->get()
            ->groupBy('task_id')
            ->map(function ($items) {
                return [
                    'total' => $items->sum('amount'),
                    'items' => $items,
                ];
            });

        return response()->json(['task_costs' => $costs]);
    }
}
