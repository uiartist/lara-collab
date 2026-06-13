<?php

namespace App\Models;

use App\Enums\PricingType;
use App\Models\Filters\IsNullFilter;
use App\Models\Filters\TaskCompletedFilter;
use App\Models\Filters\TaskOverdueFilter;
use App\Models\Filters\WhereHasFilter;
use App\Models\Filters\WhereInFilter;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\DB;
use Lacodix\LaravelModelFilter\Traits\HasFilters;
use Lacodix\LaravelModelFilter\Traits\IsSearchable;
use LaravelArchivable\Archivable;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;

class Task extends Model implements AuditableContract, Sortable
{
    use Archivable, Auditable, HasFactory, HasFilters, IsSearchable, SortableTrait;

    protected $fillable = [
        'project_id',
        'group_id',
        'created_by_user_id',
        'assigned_to_user_id',
        'invoice_id',
        'name',
        'number',
        'description',
        'due_on',
        'estimation',
        'pricing_type',
        'fixed_price',
        'hidden_from_clients',
        'billable',
        'order_column',
        'parent_id',
        'item_type',
        'depth',
        'assigned_at',
        'completed_at',
        'estimated_budget',
        'actual_budget',
        'estimated_date',
        'actual_date',
    ];

    protected $searchable = [
        'name',
        'number',
    ];

    protected $casts = [
        'due_on' => 'date',
        'completed_at' => 'datetime',
        'hidden_from_clients' => 'boolean',
        'billable' => 'boolean',
        'estimation' => 'float',
        'fixed_price' => 'integer',
        'pricing_type' => PricingType::class,
        'estimated_budget' => 'integer',
        'actual_budget' => 'integer',
        'estimated_date' => 'date',
        'actual_date' => 'date',
    ];

    protected $appends = [
        'price',
    ];

    protected $with = [];

    protected $observables = [
        'archived',
        'unArchived',
    ];

    public array $defaultWith = [
        'project:id,name',
        'createdByUser:id,name,avatar',
        'assignedToUser:id,name,avatar',
        'subscribedUsers:id',
        'labels:id,name,color',
        'attachments',
        'timeLogs.user:id,name',
    ];

    public function filters(): array
    {
        return [
            (new WhereInFilter('group_id'))->setQueryName('groups'),
            (new WhereInFilter('assigned_to_user_id'))->setQueryName('assignees'),
            (new TaskOverdueFilter('due_on'))->setQueryName('overdue'),
            (new IsNullFilter('due_on'))->setQueryName('not_set'),
            (new TaskCompletedFilter('completed_at'))->setQueryName('status'),
            (new WhereHasFilter('labels'))->setQueryName('labels'),
        ];
    }

    protected static function booted(): void
    {
        static::addGlobalScope('ordered', function ($query) {
            $query->ordered();
        });

        static::created(function (Task $task) {
            // insert self in closure
            DB::table('task_closure')->insert([
                'ancestor_id' => $task->id,
                'descendant_id' => $task->id,
                'depth' => 0,
            ]);

            if ($task->parent_id) {
                $ancestors = DB::table('task_closure')
                    ->where('descendant_id', $task->parent_id)
                    ->get();

                $inserts = [];
                foreach ($ancestors as $a) {
                    $inserts[] = [
                        'ancestor_id' => $a->ancestor_id,
                        'descendant_id' => $task->id,
                        'depth' => $a->depth + 1,
                    ];
                }

                if (! empty($inserts)) {
                    DB::table('task_closure')->insert($inserts);
                }
            }
        });
        static::updating(function (Task $task) {
            if (! $task->isDirty('parent_id')) {
                return;
            }

            $originalParent = $task->getOriginal('parent_id');
            $newParent = $task->parent_id;

            // get descendants of the task (including self) and their depth relative to the task
            $depths = DB::table('task_closure')
                ->where('ancestor_id', $task->id)
                ->pluck('depth', 'descendant_id')
                ->toArray();

            $descendantIds = array_keys($depths);

            if (empty($descendantIds)) {
                return;
            }

            // remove closure rows for descendants (we will rebuild them)
            DB::table('task_closure')->whereIn('descendant_id', $descendantIds)->delete();

            $inserts = [];

            // re-insert self links for all descendants
            foreach ($descendantIds as $d) {
                $inserts[] = [
                    'ancestor_id' => $d,
                    'descendant_id' => $d,
                    'depth' => 0,
                ];
            }

            // if new parent exists, get its ancestors to link into subtree
            if ($newParent) {
                $parentAncestors = DB::table('task_closure')
                    ->where('descendant_id', $newParent)
                    ->get();

                foreach ($parentAncestors as $pa) {
                    foreach ($descendantIds as $d) {
                        $inserts[] = [
                            'ancestor_id' => $pa->ancestor_id,
                            'descendant_id' => $d,
                            'depth' => $pa->depth + 1 + $depths[$d],
                        ];
                    }
                }
            }

            if (! empty($inserts)) {
                // bulk insert (chunk to avoid very large queries)
                $chunks = array_chunk($inserts, 500);
                foreach ($chunks as $chunk) {
                    DB::table('task_closure')->insert($chunk);
                }
            }
        });
    }

    public function scopeWithDefault(Builder $query)
    {
        $query->with($this->defaultWith);
    }

    public function loadDefault()
    {
        return $this->load($this->defaultWith);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_id');
    }

    public function subTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_id');
    }

    public function ancestors()
    {
        return $this->belongsToMany(Task::class, 'task_closure', 'descendant_id', 'ancestor_id')->withPivot('depth');
    }

    public function descendants()
    {
        return $this->belongsToMany(Task::class, 'task_closure', 'ancestor_id', 'descendant_id')->withPivot('depth');
    }

    public function taskGroup(): BelongsTo
    {
        return $this->belongsTo(TaskGroup::class, 'group_id');
    }

    public function createdByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }

    public function assignedToUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id');
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    public function subscribedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'subscribe_task');
    }

    public function labels(): BelongsToMany
    {
        return $this->belongsToMany(Label::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    public function timeLogs(): HasMany
    {
        return $this->hasMany(TimeLog::class);
    }

    public function taskCosts(): HasMany
    {
        return $this->hasMany(TaskCost::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function activities(): MorphMany
    {
        return $this->morphMany(Activity::class, 'activity_capable');
    }

    public function isFixedPrice(): bool
    {
        return $this->pricing_type === PricingType::FIXED;
    }

    public function isHourly(): bool
    {
        return $this->pricing_type === PricingType::HOURLY;
    }

    public function getPriceAttribute(): ?int
    {
        if ($this->isFixedPrice()) {
            return $this->fixed_price;
        }

        // For hourly pricing, calculate based on time logs if needed
        if ($this->isHourly()) {
            $this->loadMissing('timeLogs');

            $totalMinutes = $this->timeLogs->sum('minutes');
            $hourlyRate = $this->project->rate ?? 0;

            return (int) ($totalMinutes / 60 * $hourlyRate);
        }

        return null;
    }
}
