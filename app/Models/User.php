<?php

namespace App\Models;

use App\Services\PermissionService;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Lacodix\LaravelModelFilter\Traits\IsSearchable;
use Lacodix\LaravelModelFilter\Traits\IsSortable;
use Laravel\Sanctum\HasApiTokens;
use LaravelArchivable\Archivable;
use Overtrue\LaravelFavorite\Traits\Favoriter;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements AuditableContract, CanResetPasswordContract
{
    use Archivable, Auditable, CanResetPassword, Favoriter, HasApiTokens, HasFactory, HasRoles, IsSearchable, IsSortable, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'code_number',
        'job_title',
        'customer_type',
        'status',
        'designation',
        'avatar',
        'phone',
        'mobile_number',
        'website',
        'country',
        'gst_vat_number',
        'tax_id_1',
        'tax_id_2',
        'payment_terms',
        'credit_limit',
        'notes',
        'rate',
        'google_id',
    ];

    protected $searchable = [
        'name',
        'email',
        'job_title',
        'code_number',
    ];

    protected $sortable = [
        'name' => 'asc',
        'email',
        'rate',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getFirstName(): string
    {
        return Str::beforeLast($this->name, ' ');
    }

    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    public function isNotAdmin(): bool
    {
        return ! $this->isAdmin();
    }

    public function clientCompany(): BelongsTo
    {
        return $this->belongsTo(ClientCompany::class);
    }

    public function clientCompanies(): BelongsToMany
    {
        return $this->belongsToMany(ClientCompany::class, 'client_company', 'client_id', 'client_company_id');
    }

    /**
     * Projects that user can access
     */
    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class, 'project_user_access');
    }

    public function subscribedToTasks(): BelongsToMany
    {
        return $this->belongsToMany(Task::class, 'subscribe_task');
    }

    public function hasProjectAccess(Project $project): bool
    {
        $users = PermissionService::usersWithAccessToProject($project);

        return $users->pluck('id')->contains($this->id);
    }

    public static function userDropdownValues($exclude = ['client']): array
    {
        return self::orderBy('name')
            ->withoutRole($exclude)
            ->get(['id', 'name'])
            ->map(fn ($i) => ['value' => (string) $i->id, 'label' => $i->name])
            ->toArray();
    }

    public static function clientDropdownValues(): array
    {
        return self::orderBy('name')
            ->role('client')
            ->get(['id', 'name'])
            ->map(fn ($i) => ['value' => (string) $i->id, 'label' => $i->name])
            ->toArray();
    }
}
