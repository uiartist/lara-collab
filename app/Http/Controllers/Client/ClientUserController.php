<?php

namespace App\Http\Controllers\Client;

use App\Actions\Client\CreateClient;
use App\Actions\Client\UpdateClient;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Http\Resources\Client\ClientResource;
use App\Models\ClientCompany;
use App\Models\Country;
use App\Models\EntityCodeNumber;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientUserController extends Controller
{
    public function index(ClientCompany $company, Request $request): Response
    {
        $this->authorize('viewAny', [User::class, $company]);

        return Inertia::render('Clients/Users/Index', [
            'company' => $company,
            'items' => ClientResource::collection(
                $company->users()
                    ->searchByQueryString()
                    ->sortByQueryString()
                    ->when($request->has('archived'), fn ($query) => $query->onlyArchived())
                    ->paginate(12)
            ),
        ]);
    }

    public function create(ClientCompany $company)
    {
        $this->authorize('create', [User::class, $company]);

        $userLevelSettings = EntityCodeNumber::where('entity_type', 'UserLevel')->first();
        $userLevels = $this->buildUserLevelOptions($userLevelSettings);

        // Get non-archived projects belonging to this company
        $projects = $company->projects()
            ->whereNull('archived_at')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($p) => ['value' => (string) $p->id, 'label' => $p->name])
            ->toArray();

        return Inertia::render('Clients/Users/Create', [
            'company' => $company,
            'dropdowns' => [
                'countries' => Country::dropdownValues(),
                'userLevels' => $userLevels,
                'projects' => $projects,
            ],
        ]);
    }

    public function store(ClientCompany $company, StoreClientRequest $request)
    {
        abort_if(! request()->user()->can('create client user'), 401);

        $data = $request->validated();
        $data['client_company_id'] = $company->id;

        $client = (new CreateClient)->create($data);

        return redirect()->route('clients.companies.users.index', $company->id)->success('User created', 'A new user was successfully created for this company.');
    }

    public function edit(ClientCompany $company, User $user)
    {
        $this->authorize('update', $user);

        $userLevelSettings = EntityCodeNumber::where('entity_type', 'UserLevel')->first();
        $userLevels = $this->buildUserLevelOptions($userLevelSettings);

        // Get non-archived projects belonging to this company
        $projects = $company->projects()
            ->whereNull('archived_at')
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($p) => ['value' => (string) $p->id, 'label' => $p->name])
            ->toArray();

        return Inertia::render('Clients/Users/Edit', [
            'company' => $company,
            'item' => new ClientResource($user),
            'dropdowns' => [
                'countries' => Country::dropdownValues(),
                'userLevels' => $userLevels,
                'projects' => $projects,
            ],
        ]);
    }

    public function update(ClientCompany $company, User $user, UpdateClientRequest $request)
    {
        $this->authorize('update', $user);

        $data = $request->validated();
        $data['client_company_id'] = $company->id;

        (new UpdateClient)->update($user, $data);

        return redirect()->route('clients.companies.users.index', $company->id)->success('User updated', 'The user was successfully updated.');
    }

    public function destroy(ClientCompany $company, User $user)
    {
        $this->authorize('delete', $user);

        if (auth()->id() === $user->id) {
            return redirect()->route('clients.companies.users.index', $company->id)->warning('Action stopped', 'You cannot archive the user with whom you are currently logged in.');
        }
        $user->archive();

        return redirect()->back()->success('User archived', 'The user was successfully archived.');
    }

    public function restore(ClientCompany $company, int $user)
    {
        $user = User::withArchived()->findOrFail($user);

        $this->authorize('restore', $user);

        $user->unArchive();

        return redirect()->back()->success('User restored', 'The restoring of the user was completed successfully.');
    }

    private function buildUserLevelOptions($userLevelSettings)
    {
        $levels = [
            '001' => 'President',
            '002' => 'Vice President',
            '003' => 'Supervisor',
            '004' => 'Manager',
            '005' => 'Senior Executive',
            '006' => 'Executive',
            '007' => 'Coordinator',
            '008' => 'Assistant',
            '009' => 'Trainee',
            '010' => 'Consultant',
        ];

        return array_map(fn ($value, $label) => [
            'value' => $value,
            'label' => "$value - $label",
        ], array_keys($levels), array_values($levels));
    }
}
