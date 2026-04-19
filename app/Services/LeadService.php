<?php

namespace App\Services;

use App\Models\Lead;

class LeadService
{
    public function getLeads($filters)
    {
        return Lead::query()
            ->when($filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%$search%")
                        ->orWhere('email', 'like', "%$search%");
                });
            })
            ->when(
                $filters['status'] ?? null,
                fn($q, $status) =>
                $q->where('status', $status)
            )
            ->orderBy('created_at', $filters['sort'] ?? 'desc')
            ->paginate(10)
            ->withQueryString();
    }

    public function createLead($data)
    {
        return Lead::create($data);
    }

    public function updateLead($lead, $data)
    {
        $lead->update($data);
        return $lead;
    }

    public function deleteLead($lead)
    {
        return $lead->delete();
    }

    public function updateStatus($lead, $data)
    {
        return $lead->update($data);
    }
}
