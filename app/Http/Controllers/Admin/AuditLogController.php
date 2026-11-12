<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $search = is_string($search) ? trim($search) : '';

        $action = $request->query('action');
        $action = is_string($action) ? trim($action) : '';

        $targetId = ctype_digit($search) ? (int) $search : null;

        $logs = AuditLog::query()
            ->with('user:id,name,email')
            ->when($search !== '', function ($query) use ($search, $targetId) {
                $query->where(function ($query) use ($search, $targetId) {
                    $query->where('action', 'like', "%{$search}%")
                        ->orWhere('target_type', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });

                    if ($targetId !== null) {
                        $query->orWhere('target_id', $targetId);
                    }
                });
            })
            ->when($action !== '', function ($query) use ($action) {
                $query->where('action', $action);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (AuditLog $log) => [
                'id' => $log->id,
                'created_at' => $log->created_at?->format('Y-m-d H:i:s') ?? '',
                'admin' => $log->user?->name ?? 'Unknown Admin',
                'email' => $log->user?->email ?? '',
                'action' => $log->action,
                'target_type' => $log->target_type,
                'target_id' => $log->target_id,
                'details' => $log->details,
            ]);

        $actions = AuditLog::query()
            ->select('action')
            ->distinct()
            ->orderBy('action')
            ->pluck('action')
            ->values();

        return Inertia::render('admin/audit-logs', [
            'logs' => $logs,
            'actions' => $actions,
            'filters' => [
                'search' => $search,
                'action' => $action,
            ],
        ]);
    }
}
