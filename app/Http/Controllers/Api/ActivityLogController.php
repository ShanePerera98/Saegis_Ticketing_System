<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('actor')
            ->orderBy('created_at', 'desc');

        // Filter by entity type
        if ($request->has('entity_type')) {
            $query->where('entity_type', $request->entity_type);
        }

        // Filter by entity ID
        if ($request->has('entity_id')) {
            $query->where('entity_id', $request->entity_id);
        }

        // Filter by action
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        // Filter by actor
        if ($request->has('actor_id')) {
            $query->where('actor_id', $request->actor_id);
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->where('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->where('created_at', '<=', $request->to_date);
        }

        $logs = $query->paginate($request->get('per_page', 15));

        return response()->json($logs);
    }

    public function show(ActivityLog $activityLog): JsonResponse
    {
        $activityLog->load('actor');
        
        return response()->json($activityLog);
    }

    public function forTicket(Request $request, int $ticketId): JsonResponse
    {
        $logs = ActivityLog::with('actor')
            ->where('entity_type', 'App\\Models\\Ticket')
            ->where('entity_id', $ticketId)
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($logs);
    }

    public function stats(Request $request): JsonResponse
    {
        $stats = [
            'total_activities' => ActivityLog::count(),
            'today_activities' => ActivityLog::whereDate('created_at', today())->count(),
            'this_week_activities' => ActivityLog::whereBetween('created_at', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->count(),
            'this_month_activities' => ActivityLog::whereMonth('created_at', now()->month)->count(),
        ];

        // Activity breakdown by action
        $actionStats = ActivityLog::selectRaw('action, COUNT(*) as count')
            ->groupBy('action')
            ->orderBy('count', 'desc')
            ->get()
            ->pluck('count', 'action');

        $stats['actions'] = $actionStats;

        // Most active users
        $userStats = ActivityLog::selectRaw('actor_id, COUNT(*) as count')
            ->with('actor:id,name,email')
            ->groupBy('actor_id')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($log) {
                return [
                    'user' => $log->actor,
                    'activity_count' => $log->count
                ];
            });

        $stats['most_active_users'] = $userStats;

        // Daily activity for the past 30 days
        $dailyActivity = ActivityLog::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date')
            ->pluck('count', 'date');

        $stats['daily_activity'] = $dailyActivity;

        return response()->json($stats);
    }
}
