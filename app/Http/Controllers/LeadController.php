<?php

namespace App\Http\Controllers;

use App\Models\Lead;

use App\Http\Requests\LeadStoreRequest;
use App\Http\Requests\LeadUpdateRequest;
use App\Http\Requests\LeadUpdateStatusRequest;

use App\Services\LeadService;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function __construct(private LeadService $leadService) {}

    public function index(Request $request)
    {
        $leads = $this->leadService->getLeads($request->all());

        return Inertia::render('Leads/Index', [
            'leads' => $leads,
            'filters' => $request->only(['search', 'status', 'sort']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Leads/Create');
    }

    public function store(LeadStoreRequest $request)
    {
        $this->leadService->createLead($request->validated());

        return redirect()->route('leads.index');
    }

    public function edit(Lead $lead)
    {
        return Inertia::render('Leads/Edit', [
            'lead' => $lead,
        ]);
    }

    public function update(LeadUpdateRequest $request, Lead $lead)
    {
        $this->leadService->updateLead($lead, $request->validated());

        return redirect()->route('leads.index');
    }

    public function destroy(Lead $lead)
    {
        $this->leadService->deleteLead($lead);

        return redirect()->back();
    }

    public function updateStatus(LeadUpdateStatusRequest $request, Lead $lead)
    {
        $this->leadService->updateStatus($lead, $request->validated());

        return back();
    }
}
