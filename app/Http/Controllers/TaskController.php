<?php

namespace App\Http\Controllers;

use App\Actions\Task\CreateTask;
use App\Actions\Task\UpdateTask;
use App\Events\Task\TaskDeleted;
use App\Events\Task\TaskGroupChanged;
use App\Events\Task\TaskOrderChanged;
use App\Events\Task\TaskRestored;
use App\Events\Task\TaskUpdated;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Models\Label;
use App\Models\OwnerCompany;
use App\Models\Project;
use App\Models\Task;
use App\Models\TaskCost;
use App\Models\TaskGroup;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(Request $request, Project $project, ?Task $task = null): Response
    {
        $this->authorize('viewAny', [Task::class, $project]);

        $groups = $project
            ->taskGroups()
            ->when($request->has('archived'), fn ($query) => $query->onlyArchived())
            ->get();

        $groupedTasks = $project
            ->taskGroups()
            ->with(['project' => fn ($query) => $query->withArchived()])
            ->get()
            ->mapWithKeys(function (TaskGroup $group) use ($request, $project) {
                return [
                    $group->id => Task::where('project_id', $project->id)
                        ->where('group_id', $group->id)
                        ->searchByQueryString()
                        ->filterByQueryString()
                        ->when($request->user()->hasRole('client'), fn ($query) => $query->where('hidden_from_clients', false))
                        ->when($request->has('archived'), fn ($query) => $query->onlyArchived())
                        ->when(! $request->has('status'), fn ($query) => $query->whereNull('completed_at'))
                        ->withDefault()
                        ->when($project->isArchived(), fn ($query) => $query->with(['project' => fn ($query) => $query->withArchived()]))
                        ->get(),
                ];
            });

        return Inertia::render('Projects/Tasks/Index', [
            'project' => $project,
            'usersWithAccessToProject' => PermissionService::usersWithAccessToProject($project),
            'labels' => Label::get(['id', 'name', 'color']),
            'taskGroups' => $groups,
            'groupedTasks' => $groupedTasks,
            'openedTask' => $task ? $task->load(array_merge($task->defaultWith, ['descendants']))->load(['descendants' => function ($q) use ($task) {
                $q->with($task->defaultWith);
            }]) : null,
            'currency' => [
                'symbol' => OwnerCompany::with('currency')->first()->currency->symbol,
            ],
        ]);
    }

    public function store(StoreTaskRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('create', [Task::class, $project]);

        (new CreateTask)->create($project, $request->validated());

        return redirect()->route('projects.tasks', $project)->success('Task added', 'A new task was successfully added.');
    }

    public function update(UpdateTaskRequest $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', [$task, $project]);

        (new UpdateTask)->update($task, $request->validated());

        return response()->json();
    }

    public function reorder(Request $request, Project $project): JsonResponse
    {
        $this->authorize('reorder', [Task::class, $project]);

        Task::setNewOrder($request->ids);

        TaskOrderChanged::dispatch(
            $project->id,
            $request->group_id,
            $request->from_index,
            $request->to_index,
        );

        return response()->json();
    }

    public function move(Request $request, Project $project): JsonResponse
    {
        $this->authorize('reorder', [Task::class, $project]);

        Task::setNewOrder($request->ids);
        Task::whereIn('id', $request->ids)->update(['group_id' => $request->to_group_id]);

        TaskGroupChanged::dispatch(
            $project->id,
            $request->from_group_id,
            $request->to_group_id,
            $request->from_index,
            $request->to_index,
        );

        return response()->json();
    }

    public function descendants(Project $project, Task $task): JsonResponse
    {
        $this->authorize('viewAny', [Task::class, $project]);

        // exclude the self-row (depth 0) so only actual children/descendants are returned
        $descendants = $task->descendants()
            ->wherePivot('depth', '>', 0)
            ->with([...$task->defaultWith, 'taskCosts'])
            ->get();

        // Append costs_total and normalize date fields to date strings on each descendant
        $descendants->each(function ($t) {
            $t->costs_total = (float) $t->taskCosts->sum('amount');
            $t->estimated_date = $t->estimated_date?->toDateString();
            $t->actual_date = $t->actual_date?->toDateString();
        });

        // Also load costs for root task
        $task->loadMissing('taskCosts');
        $task->costs_total = (float) $task->taskCosts->sum('amount');

        return response()->json([
            'descendants' => $descendants,
            'root_costs_total' => $task->costs_total,
            'root_estimated_date' => $task->estimated_date?->toDateString(),
            'root_actual_date' => $task->actual_date?->toDateString(),
        ]);
    }

    public function projectDatesSummary(Project $project): JsonResponse
    {
        $this->authorize('viewAny', [Task::class, $project]);

        $allTasks = Task::where('project_id', $project->id)
            ->whereNull('archived_at')
            ->get(['id', 'parent_id', 'number', 'name', 'depth', 'estimated_date', 'actual_date']);

        $grouped = $allTasks->groupBy('parent_id');
        $sortedTasks = collect();

        $buildTree = function ($parentId) use (&$buildTree, $grouped, &$sortedTasks) {
            $children = $grouped->get($parentId);
            if ($children) {
                foreach ($children as $child) {
                    $sortedTasks->push($child);
                    $buildTree($child->id);
                }
            }
        };

        $allIds = $allTasks->pluck('id')->all();
        $rootTasks = $allTasks->filter(fn ($t) => $t->depth == 0 || ! in_array($t->parent_id, $allIds));

        foreach ($rootTasks as $rootTask) {
            $sortedTasks->push($rootTask);
            $buildTree($rootTask->id);
        }

        $sortedIds = $sortedTasks->pluck('id')->all();
        $remaining = $allTasks->filter(fn ($t) => ! in_array($t->id, $sortedIds));
        foreach ($remaining as $rem) {
            $sortedTasks->push($rem);
        }

        $tasks = $sortedTasks->map(fn ($t) => [
            'id' => $t->id,
            'parent_id' => $t->parent_id,
            'number' => $t->number,
            'name' => $t->name,
            'depth' => $t->depth,
            'estimated_date' => $t->estimated_date?->toDateString(),
            'actual_date' => $t->actual_date?->toDateString(),
        ]);

        return response()->json(['tasks' => $tasks]);
    }

    public function projectCostsSummary(Project $project): JsonResponse
    {
        $this->authorize('viewAny', [Task::class, $project]);

        $rootTasks = Task::where('project_id', $project->id)
            ->where('depth', 0)
            ->whereNull('archived_at')
            ->get(['id', 'number', 'name', 'estimated_budget']);

        $tasks = $rootTasks->map(function ($rootTask) {
            $allIds = DB::table('task_closure')
                ->where('ancestor_id', $rootTask->id)
                ->pluck('descendant_id');

            $costsTotal = TaskCost::whereIn('task_id', $allIds)->sum('amount');

            return [
                'id' => $rootTask->id,
                'number' => $rootTask->number,
                'name' => $rootTask->name,
                'estimated_budget' => $rootTask->estimated_budget, // cents
                'costs_total' => (float) $costsTotal,         // dollars
            ];
        });

        return response()->json(['tasks' => $tasks]);
    }

    public function hierarchyCosts(Project $project, Task $task): JsonResponse
    {
        $this->authorize('viewAny', [Task::class, $project]);

        $costsWith = ['taskCosts' => fn ($q) => $q->with('user:id,name')->orderBy('date', 'desc')];

        $descendants = $task->descendants()
            ->wherePivot('depth', '>', 0)
            ->with($costsWith)
            ->get();

        $task->load($costsWith);

        $toNode = fn ($t) => [
            'id' => $t->id,
            'parent_id' => $t->parent_id,
            'name' => $t->name,
            'number' => $t->number,
            'depth' => $t->depth,
            'estimated_budget' => $t->estimated_budget,
            'actual_budget' => $t->actual_budget,
            'costs_total' => $t->taskCosts->sum(fn ($c) => (float) $c->amount),
            'costs' => $t->taskCosts->map(fn ($c) => [
                'id' => $c->id,
                'amount' => (float) $c->amount,
                'date' => $c->date,
                'user' => $c->user ? ['id' => $c->user->id, 'name' => $c->user->name] : null,
            ])->values(),
        ];

        return response()->json([
            'nodes' => collect([$task])->concat($descendants)->map($toNode)->values(),
        ]);
    }

    public function updateBudget(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('update', [$task, $project]);

        $data = $request->validate([
            'estimated_budget' => ['nullable', 'numeric', 'min:0'],
            'actual_budget' => ['nullable', 'numeric', 'min:0'],
            'estimated_date' => ['nullable', 'date'],
            'actual_date' => ['nullable', 'date'],
        ]);

        $update = [];
        foreach (['estimated_budget', 'actual_budget'] as $field) {
            if (array_key_exists($field, $data)) {
                $update[$field] = $data[$field] !== null
                    ? (int) round($data[$field] * 100)
                    : null;
            }
        }
        foreach (['estimated_date', 'actual_date'] as $field) {
            if (array_key_exists($field, $data)) {
                $update[$field] = $data[$field]; // already a date string or null
            }
        }

        $task->update($update);

        return response()->json([
            'estimated_budget' => $task->estimated_budget,
            'actual_budget' => $task->actual_budget,
            'estimated_date' => $task->estimated_date?->toDateString(),
            'actual_date' => $task->actual_date?->toDateString(),
        ]);
    }

    public function complete(Request $request, Project $project, Task $task): JsonResponse
    {
        $this->authorize('complete', [Task::class, $project]);

        $task->update([
            'completed_at' => ($request->completed === true) ? now() : null,
        ]);
        TaskUpdated::dispatch($task, 'completed_at');

        return response()->json();
    }

    public function destroy(Project $project, Task $task): RedirectResponse
    {
        $this->authorize('archive task', [$task, $project]);

        $task->archive();
        TaskDeleted::dispatch($task->id, $task->project_id);

        return redirect()->back()->success('Task archived', 'The task was successfully archived.');
    }

    public function restore(Project $project, Task $task)
    {

        $this->authorize('restore', [$task, $project]);

        $task->unArchive();
        TaskRestored::dispatch($task);

        return redirect()->back()->success('Task restored', 'The restoring of the Task was completed successfully.');
    }
}
