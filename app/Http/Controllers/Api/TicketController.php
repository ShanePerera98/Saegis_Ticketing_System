<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\User;
use App\Models\DuplicateMerge;
use App\Services\TicketService;
use App\Services\ActivityLogger;
use App\Enums\TicketStatus;
use App\Enums\TicketPriority;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class TicketController extends Controller
{
    public function __construct(private TicketService $ticketService)
    {
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Ticket::with(['category', 'client', 'currentAssignee', 'creator'])
            ->when($user->isClient(), fn($q) => $q->forUser($user))
            ->when($request->has('mine') && $request->mine, fn($q) => $q->assignedTo($user))
            ->when($request->has('created_by_me') && $request->created_by_me, fn($q) => $q->where('created_by', $user->id))
            ->when($request->has('status'), fn($q) => $q->byStatus($request->status))
            ->when($request->has('priority'), fn($q) => $q->byPriority($request->priority))
            ->when($request->has('category_id'), fn($q) => $q->where('category_id', $request->category_id))
            ->when($request->has('search'), function($q) use ($request) {
                $q->where(function($sq) use ($request) {
                    $sq->where('title', 'like', "%{$request->search}%")
                       ->orWhere('description', 'like', "%{$request->search}%")
                       ->orWhere('ticket_number', 'like', "%{$request->search}%");
                });
            });

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:' . implode(',', TicketPriority::values()),
            'category_id' => 'nullable|exists:ticket_categories,id',
            'template_id' => 'nullable|exists:ticket_templates,id',
            'client_id' => 'nullable|exists:users,id',
            'field_values' => 'nullable|array',
            'location' => 'nullable|string|max:255',
        ]);

        Gate::authorize('create', Ticket::class);

        // If client_id is not provided and user is a client, use their own ID
        if (!isset($validated['client_id']) && $user->role === 'CLIENT') {
            $validated['client_id'] = $user->id;
        }

        $ticket = $this->ticketService->createTicket($validated, $user);

        return response()->json($ticket->load(['category', 'client', 'creator']), 201);
    }

    public function show(Ticket $ticket, Request $request)
    {
        Gate::authorize('view', $ticket);

        $ticket->load([
            'category',
            'client',
            'creator',
            'currentAssignee',
            'template.fields',
            'assignments.assignedTo',
            'collaborators.user',
            'statusTransitions.changedBy',
            'comments.user',
            'attachments',
            'fieldValues.field',
        ]);

        return response()->json($ticket);
    }

    public function update(Request $request, Ticket $ticket)
    {
        Gate::authorize('update', $ticket);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'sometimes|in:' . implode(',', TicketPriority::values()),
            'category_id' => 'sometimes|nullable|exists:ticket_categories,id',
        ]);

        $ticket->update($validated);

        return response()->json($ticket->fresh(['category', 'client', 'currentAssignee']));
    }

    public function assignSelf(Request $request, Ticket $ticket)
    {
        Gate::authorize('assignSelf', $ticket);

        $this->ticketService->assignToSelf($ticket, $request->user());

        return response()->json(['message' => 'Ticket assigned successfully']);
    }

    public function assign(Request $request, Ticket $ticket)
    {
        Gate::authorize('assignToOther', $ticket);

        $validated = $request->validate([
            'assignee_id' => 'required|exists:users,id',
        ]);

        $assignee = User::findOrFail($validated['assignee_id']);
        $this->ticketService->assignToOther($ticket, $assignee, $request->user());

        return response()->json(['message' => 'Ticket assigned successfully']);
    }

    public function addCollaborator(Request $request, Ticket $ticket)
    {
        Gate::authorize('addCollaborator', $ticket);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $collaborator = User::findOrFail($validated['user_id']);
        $this->ticketService->addCollaborator($ticket, $collaborator, $request->user());

        return response()->json(['message' => 'Collaborator added successfully']);
    }

    public function removeCollaborator(Request $request, Ticket $ticket, User $user)
    {
        Gate::authorize('removeCollaborator', $ticket);

        $ticket->collaborators()->where('user_id', $user->id)->delete();

        return response()->json(['message' => 'Collaborator removed successfully']);
    }

    public function updateStatus(Request $request, Ticket $ticket)
    {
        Gate::authorize('updateStatus', $ticket);

        $validated = $request->validate([
            'status' => 'required|in:' . implode(',', TicketStatus::values()),
            'reason' => 'nullable|string',
        ]);

        $newStatus = TicketStatus::from($validated['status']);
        $this->ticketService->transitionStatus($ticket, $newStatus, $request->user(), $validated['reason'] ?? null);

        return response()->json(['message' => 'Status updated successfully']);
    }

    public function cancelIrrelevant(Request $request, Ticket $ticket)
    {
        Gate::authorize('cancel', $ticket);

        $validated = $request->validate([
            'reason' => 'nullable|string',
        ]);

        $this->ticketService->cancelAsIrrelevant($ticket, $request->user(), $validated['reason'] ?? null);

        return response()->json(['message' => 'Ticket cancelled as irrelevant']);
    }

    public function merge(Request $request)
    {
        $validated = $request->validate([
            'parent' => 'required|array',
            'parent.title' => 'required|string|max:255',
            'parent.description' => 'required|string',
            'parent.priority' => 'required|in:' . implode(',', TicketPriority::values()),
            'parent.category_id' => 'nullable|exists:ticket_categories,id',
            'parent.client_id' => 'required|exists:users,id',
            'childrenIds' => 'required|array|min:1',
            'childrenIds.*' => 'exists:tickets,id',
        ]);

        $user = $request->user();
        Gate::authorize('merge', Ticket::class);

        $parentTicket = $this->ticketService->mergeDuplicates(
            $validated['childrenIds'],
            $validated['parent'],
            $user
        );

        return response()->json($parentTicket->load(['category', 'client', 'currentAssignee']), 201);
    }

    public function undoMerge(Request $request, int $mergeId)
    {
        Gate::authorize('undoMerge', Ticket::class);

        $this->ticketService->undoMerge($mergeId, $request->user());

        return response()->json(['message' => 'Merge undone successfully']);
    }

    public function clientDelete(Request $request, Ticket $ticket)
    {
        Gate::authorize('clientDelete', $ticket);

        $validated = $request->validate([
            'reason' => 'nullable|string',
        ]);

        $this->ticketService->clientDelete($ticket, $request->user(), $validated['reason'] ?? null);

        return response()->json(['message' => 'Ticket deleted successfully']);
    }

    public function addComment(Request $request, Ticket $ticket)
    {
        Gate::authorize('comment', $ticket);

        $validated = $request->validate([
            'body' => 'required|string',
            'is_internal' => 'boolean',
            'attachments' => 'nullable|array',
        ]);

        $comment = $ticket->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'is_internal' => $validated['is_internal'] ?? false,
            'attachments' => $validated['attachments'] ?? null,
        ]);

        return response()->json($comment->load('user'), 201);
    }

    public function cancelled(Request $request)
    {
        Gate::authorize('viewCancelled', Ticket::class);

        $query = Ticket::with(['category', 'client', 'cancelledTicket.cancelledBy'])
            ->whereHas('cancelledTicket');

        if ($request->has('type')) {
            $query->whereHas('cancelledTicket', fn($q) => $q->where('type', $request->type));
        }

        if ($request->has('status')) {
            $query->whereHas('cancelledTicket', fn($q) => $q->where('status', $request->status));
        }

        $tickets = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($tickets);
    }

    public function approveCancellation(Request $request, int $id)
    {
        Gate::authorize('approveCancellation', Ticket::class);

        $this->ticketService->approveCancellation($id, $request->user());

        return response()->json(['message' => 'Cancellation approved']);
    }

    public function restoreTicket(Request $request, int $id)
    {
        Gate::authorize('restoreTicket', Ticket::class);

        $this->ticketService->restoreTicket($id, $request->user());

        return response()->json(['message' => 'Ticket restored successfully']);
    }

    public function merges(Request $request)
    {
        Gate::authorize('viewMerges', Ticket::class);

        $query = DuplicateMerge::with([
            'parentTicket:id,ticket_number,title',
            'childTickets:id,ticket_number,title',
            'mergedBy:id,name'
        ]);

        $merges = $query->orderBy('merged_at', 'desc')->paginate(15);

        return response()->json($merges);
    }

    public function reports(Request $request)
    {
        Gate::authorize('viewReports', Ticket::class);

        $query = Ticket::with(['category', 'client', 'currentAssignee']);

        if ($request->has('start')) {
            $query->whereDate('created_at', '>=', $request->start);
        }

        if ($request->has('end')) {
            $query->whereDate('created_at', '<=', $request->end);
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();

        return response()->json($tickets);
    }

    public function stats(Request $request)
    {
        Gate::authorize('viewStats', Ticket::class);

        $query = Ticket::query();

        if ($request->has('start')) {
            $query->whereDate('created_at', '>=', $request->start);
        }

        if ($request->has('end')) {
            $query->whereDate('created_at', '<=', $request->end);
        }

        $total = $query->count();
        $resolved = $query->where('status', TicketStatus::RESOLVED->value)->count();
        $pending = $query->whereIn('status', [
            TicketStatus::NEW->value,
            TicketStatus::IN_PROGRESS->value,
            TicketStatus::ON_HOLD->value
        ])->count();
        $overdue = $query->where('created_at', '<', now()->subDays(7))
            ->whereNotIn('status', [TicketStatus::RESOLVED->value, TicketStatus::CLOSED->value])
            ->count();

        return response()->json([
            'total' => $total,
            'resolved' => $resolved,
            'pending' => $pending,
            'overdue' => $overdue,
        ]);
    }

    public function export(Request $request)
    {
        Gate::authorize('exportReports', Ticket::class);

        $format = $request->get('format', 'csv');
        $query = Ticket::with(['category', 'client', 'currentAssignee']);

        if ($request->has('start')) {
            $query->whereDate('created_at', '>=', $request->start);
        }

        if ($request->has('end')) {
            $query->whereDate('created_at', '<=', $request->end);
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();

        // For now, return CSV data
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="tickets_report.csv"',
        ];

        $callback = function() use ($tickets) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'Ticket Number',
                'Title',
                'Client',
                'Priority',
                'Status',
                'Created At',
                'Resolved At',
                'Category'
            ]);

            foreach ($tickets as $ticket) {
                fputcsv($file, [
                    $ticket->ticket_number,
                    $ticket->title,
                    $ticket->client?->name,
                    $ticket->priority->value,
                    $ticket->status->value,
                    $ticket->created_at->format('Y-m-d H:i:s'),
                    $ticket->resolved_at?->format('Y-m-d H:i:s'),
                    $ticket->category?->name,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
