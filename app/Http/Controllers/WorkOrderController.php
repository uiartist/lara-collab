<?php

namespace App\Http\Controllers;

use App\Http\Resources\PurchaseRequest\PurchaseRequestResource;
use App\Models\PurchaseRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkOrderController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('WorkOrders/Index', [
            'items' => PurchaseRequestResource::collection(
                PurchaseRequest::searchByQueryString()
                    ->sortByQueryString()
                    ->paginate(12)
            ),
        ]);
    }

    public function destroy(Request $request, PurchaseRequest $purchaseRequest)
    {
        $this->authorize('archive', $purchaseRequest);

        $purchaseRequest->archive();

        return redirect()->back()->success('Work order archived', 'The work order was successfully archived.');
    }

    public function restore(Request $request, int $purchaseRequestId)
    {
        $purchaseRequest = PurchaseRequest::withArchived()->findOrFail($purchaseRequestId);

        $this->authorize('restore', $purchaseRequest);

        $purchaseRequest->unArchive();

        return redirect()->back()->success('Work order restored', 'The work order was successfully restored.');
    }
}
