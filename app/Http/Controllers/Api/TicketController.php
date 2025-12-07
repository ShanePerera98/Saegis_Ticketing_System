<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\User;
use App\Models\DuplicateMerge;
use App\Services\TicketService;
use App\Services\ActivityLogger;
use App\Enums\TicketStatus;
use App\Enums\TicketPriority;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    public function __construct(private TicketService $ticketService)
    {
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Ticket::with(['category', 'client', 'currentAssignee', 'creator']);
        
        // INDIVIDUAL PROFILE-BASED FILTERING - NO SYSTEM-WIDE SHARING
        if ($user->isClient()) {
            // Clients see only their own tickets
            $query->forUser($user);
        } else {
            // Admins/Super Admins: Individual profile-based ticket visibility by status
            if ($request->has('status')) {
                $status = $request->status;
                
                switch ($status) {
                    case TicketStatus::NEW->value:
                        // New tickets: unassigned tickets available to acquire (system-wide for admins)
                        $query->where('status', $status)->whereNull('current_assignee_id');
                        break;
                        
                    case TicketStatus::ACQUIRED->value:
                    case TicketStatus::IN_PROGRESS->value:
                    case TicketStatus::PENDING->value:
                    case TicketStatus::RESOLVED->value:
                    case TicketStatus::CANCELLED->value:
                    case TicketStatus::CLOSED->value:
                    case TicketStatus::DELETED->value:
                        // All other statuses: tickets assigned to THIS user OR where they are a collaborator
                        $query->where('status', $status)
                              ->where(function($q) use ($user) {
                                  $q->where('current_assignee_id', $user->id)
                                    ->orWhereHas('collaborators', function($subq) use ($user) {
                                        $subq->where('user_id', $user->id);
                                    });
                              });
                        break;
                        
                    default:
                        // Fallback: assigned to current user
                        $query->where('status', $status)->where('current_assignee_id', $user->id);
                        break;
                }
            } else {
                // No status filter: show tickets assigned to current user
                $query->assignedTo($user);
            }
        }
        
        // Apply additional filters
        $query->when($request->has('mine') && $request->mine, fn($q) => $q->assignedTo($user))
            ->when($request->has('created_by_me') && $request->created_by_me, fn($q) => $q->where('created_by', $user->id))
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

        // Transform tickets to include profile image URLs
        $tickets->getCollection()->transform(function ($ticket) {
            if ($ticket->client && $ticket->client->profile_image) {
                $ticket->client->profile_image = asset('storage/' . $ticket->client->profile_image);
            }
            if ($ticket->creator && $ticket->creator->profile_image) {
                $ticket->creator->profile_image = asset('storage/' . $ticket->creator->profile_image);
            }
            if ($ticket->currentAssignee && $ticket->currentAssignee->profile_image) {
                $ticket->currentAssignee->profile_image = asset('storage/' . $ticket->currentAssignee->profile_image);
            }
            return $ticket;
        });

        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        // Handle empty priority values before validation
        if ($request->has('priority') && (is_null($request->priority) || trim($request->priority) === '')) {
            $request->merge(['priority' => 'MEDIUM']);
        }
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:' . implode(',', TicketPriority::values()),
            'category_id' => 'nullable|exists:ticket_categories,id',
            'template_id' => 'nullable|exists:ticket_templates,id',
            'client_id' => 'nullable|exists:users,id',
            'field_values' => 'nullable|array',
            'location' => 'nullable|string|max:255',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:20480', // 20MB limit per file
        ]);

        Gate::authorize('create', Ticket::class);

        // If client_id is not provided and user is a client, use their own ID
        if (!isset($validated['client_id']) && $user->role === 'CLIENT') {
            $validated['client_id'] = $user->id;
        }

        $ticket = $this->ticketService->createTicket($validated, $user, $request->file('attachments'));

        $ticket->load(['category', 'client', 'creator', 'attachments']);

        // Transform profile image URLs
        if ($ticket->client && $ticket->client->profile_image) {
            $ticket->client->profile_image = asset('storage/' . $ticket->client->profile_image);
        }
        if ($ticket->creator && $ticket->creator->profile_image) {
            $ticket->creator->profile_image = asset('storage/' . $ticket->creator->profile_image);
        }

        return response()->json($ticket, 201);
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

        // Transform profile image URLs
        if ($ticket->client && $ticket->client->profile_image) {
            $ticket->client->profile_image = asset('storage/' . $ticket->client->profile_image);
        }
        if ($ticket->creator && $ticket->creator->profile_image) {
            $ticket->creator->profile_image = asset('storage/' . $ticket->creator->profile_image);
        }
        if ($ticket->currentAssignee && $ticket->currentAssignee->profile_image) {
            $ticket->currentAssignee->profile_image = asset('storage/' . $ticket->currentAssignee->profile_image);
        }
        
        // Transform comment user profile images
        if ($ticket->comments) {
            foreach ($ticket->comments as $comment) {
                if ($comment->user && $comment->user->profile_image) {
                    $comment->user->profile_image = asset('storage/' . $comment->user->profile_image);
                }
            }
        }

        // Transform collaborator user profile images  
        if ($ticket->collaborators) {
            foreach ($ticket->collaborators as $collaborator) {
                if ($collaborator->user && $collaborator->user->profile_image) {
                    $collaborator->user->profile_image = asset('storage/' . $collaborator->user->profile_image);
                }
            }
        }

        // Transform status transition user profile images
        if ($ticket->statusTransitions) {
            foreach ($ticket->statusTransitions as $transition) {
                if ($transition->changedBy && $transition->changedBy->profile_image) {
                    $transition->changedBy->profile_image = asset('storage/' . $transition->changedBy->profile_image);
                }
            }
        }

        // Transform assignment user profile images
        if ($ticket->assignments) {
            foreach ($ticket->assignments as $assignment) {
                if ($assignment->assignedTo && $assignment->assignedTo->profile_image) {
                    $assignment->assignedTo->profile_image = asset('storage/' . $assignment->assignedTo->profile_image);
                }
            }
        }

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

        $user = $request->user();
        $baseQuery = Ticket::query();

        // Apply date filters if provided
        if ($request->has('start')) {
            $baseQuery->whereDate('created_at', '>=', $request->start);
        }

        if ($request->has('end')) {
            $baseQuery->whereDate('created_at', '<=', $request->end);
        }

        // INDIVIDUAL PROFILE-BASED COUNTING - NO SYSTEM-WIDE SHARING
        if ($user->isClient()) {
            // Clients see only their own tickets
            $baseQuery->forUser($user);
            
            $stats = [
                'new' => (clone $baseQuery)->where('status', TicketStatus::NEW->value)->count(),
                'acquired' => 0, // Clients don't acquire tickets
                'in_progress' => (clone $baseQuery)->where('status', TicketStatus::IN_PROGRESS->value)->count(),
                'pending' => (clone $baseQuery)->where('status', TicketStatus::PENDING->value)->count(),
                'resolved' => (clone $baseQuery)->where('status', TicketStatus::RESOLVED->value)->count(),
                'cancelled' => (clone $baseQuery)->where('status', TicketStatus::CANCELLED->value)->count(),
                'closed' => (clone $baseQuery)->where('status', TicketStatus::CLOSED->value)->count(),
                'deleted' => (clone $baseQuery)->where('status', TicketStatus::DELETED->value)->count(),
            ];
        } else {
            // Admins and Super Admins see individual profile-based counts
            $stats = [
                // New tickets: unassigned tickets available to acquire
                'new' => (clone $baseQuery)->where('status', TicketStatus::NEW->value)
                    ->whereNull('current_assignee_id')->count(),
                    
                // Acquired: tickets assigned specifically to THIS user
                'acquired' => (clone $baseQuery)->where('status', TicketStatus::ACQUIRED->value)
                    ->where('current_assignee_id', $user->id)->count(),
                    
                // In Progress: tickets in progress assigned to THIS user  
                'in_progress' => (clone $baseQuery)->where('status', TicketStatus::IN_PROGRESS->value)
                    ->where('current_assignee_id', $user->id)->count(),
                    
                // Pending: tickets pending assigned to THIS user
                'pending' => (clone $baseQuery)->where('status', TicketStatus::PENDING->value)
                    ->where('current_assignee_id', $user->id)->count(),
                    
                // Resolved: tickets resolved by THIS user
                'resolved' => (clone $baseQuery)->where('status', TicketStatus::RESOLVED->value)
                    ->where('current_assignee_id', $user->id)->count(),
                    
                // Cancelled: tickets cancelled by THIS user
                'cancelled' => (clone $baseQuery)->where('status', TicketStatus::CANCELLED->value)
                    ->where('current_assignee_id', $user->id)->count(),
                    
                // Closed: tickets closed by THIS user
                'closed' => (clone $baseQuery)->where('status', TicketStatus::CLOSED->value)
                    ->where('current_assignee_id', $user->id)->count(),
                    
                // Deleted: tickets deleted by THIS user (only for super admins typically)
                'deleted' => (clone $baseQuery)->where('status', TicketStatus::DELETED->value)
                    ->where('current_assignee_id', $user->id)->count(),
            ];
        }

        // Calculate additional metrics based on individual profile
        $totalUserTickets = array_sum(array_values($stats));
        
        return response()->json([
            // Individual profile stats
            'new' => $stats['new'],
            'acquired' => $stats['acquired'],
            'in_progress' => $stats['in_progress'],
            'pending' => $stats['pending'],
            'resolved' => $stats['resolved'],
            'cancelled' => $stats['cancelled'],
            'closed' => $stats['closed'],
            'deleted' => $stats['deleted'],
            
            // Legacy compatibility (now individual-based)
            'total' => $totalUserTickets,
            'overdue' => $user->isClient() 
                ? (clone $baseQuery)->where('created_at', '<', now()->subDays(7))
                    ->whereNotIn('status', [TicketStatus::RESOLVED->value, TicketStatus::CLOSED->value])->count()
                : (clone $baseQuery)->where('created_at', '<', now()->subDays(7))
                    ->where('current_assignee_id', $user->id)
                    ->whereNotIn('status', [TicketStatus::RESOLVED->value, TicketStatus::CLOSED->value])->count(),
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

    // Workflow Methods
    public function acquire(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if (!$ticket->canBeAcquiredBy($user)) {
            return response()->json(['message' => 'Cannot acquire this ticket'], 403);
        }

        if ($ticket->acquire($user)) {
            return response()->json([
                'message' => 'Ticket acquired successfully',
                'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee'])
            ]);
        }

        return response()->json(['message' => 'Failed to acquire ticket'], 400);
    }

    public function setInProgress(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if ($ticket->setInProgress($user)) {
            return response()->json([
                'message' => 'Ticket set to in progress',
                'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee'])
            ]);
        }

        return response()->json(['message' => 'Cannot set ticket to in progress'], 403);
    }

    public function pause(Request $request, Ticket $ticket)
    {
        $request->validate([
            'reason' => 'nullable|string|max:200'
        ]);

        $user = $request->user();

        if ($ticket->pause($user, $request->reason)) {
            return response()->json([
                'message' => 'Ticket paused successfully',
                'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee'])
            ]);
        }

        return response()->json(['message' => 'Cannot pause this ticket'], 403);
    }

    public function resume(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if ($ticket->resume($user)) {
            return response()->json([
                'message' => 'Ticket resumed successfully',
                'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee'])
            ]);
        }

        return response()->json(['message' => 'Cannot resume this ticket'], 403);
    }

    public function resolve(Request $request, Ticket $ticket)
    {
        $request->validate([
            'note' => 'nullable|string|max:200'
        ]);

        $user = $request->user();

        if ($ticket->resolve($user, $request->note)) {
            return response()->json([
                'message' => 'Ticket resolved successfully',
                'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee'])
            ]);
        }

        return response()->json(['message' => 'Cannot resolve this ticket'], 403);
    }

    public function cancel(Request $request, Ticket $ticket)
    {
        $request->validate([
            'reason' => 'required|string|max:200',
            'type' => 'required|in:duplicate,irrelevant'
        ]);

        $user = $request->user();

        if ($ticket->cancel($user, $request->reason)) {
            return response()->json([
                'message' => 'Ticket cancelled successfully',
                'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee'])
            ]);
        }

        return response()->json(['message' => 'Cannot cancel this ticket'], 403);
    }

    public function close(Request $request, Ticket $ticket)
    {
        $request->validate([
            'reason' => 'required|string|max:200'
        ]);

        $user = $request->user();

        if ($ticket->close($user, $request->reason)) {
            return response()->json([
                'message' => 'Ticket closed successfully',
                'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee'])
            ]);
        }

        return response()->json(['message' => 'Cannot close this ticket'], 403);
    }

    public function deleteTicket(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        if (!$ticket->canBeDeletedBy($user)) {
            return response()->json(['message' => 'Cannot delete this ticket'], 403);
        }

        if ($ticket->deleteByClient($user)) {
            return response()->json(['message' => 'Ticket deleted successfully']);
        }

        return response()->json(['message' => 'Failed to delete ticket'], 400);
    }

    public function rate(Request $request, Ticket $ticket)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
            'feedback' => 'nullable|string|max:500'
        ]);

        $user = $request->user();

        if ($user->id !== $ticket->client_id) {
            return response()->json(['message' => 'Only the client can rate this ticket'], 403);
        }

        if ($ticket->status !== TicketStatus::RESOLVED) {
            return response()->json(['message' => 'Can only rate resolved tickets'], 400);
        }

        $rating = $ticket->rating()->updateOrCreate(
            ['client_id' => $user->id],
            [
                'rating' => $request->rating,
                'feedback' => $request->feedback
            ]
        );

        // Notify all participants who were involved in resolving the ticket
        $this->notifyTicketResolvers($ticket, $rating, $user);

        return response()->json([
            'message' => 'Rating submitted successfully',
            'rating' => $rating
        ]);
    }

    private function notifyTicketResolvers(Ticket $ticket, $rating, User $client)
    {
        $resolvers = collect();
        
        // Add the current assignee if they exist
        if ($ticket->current_assignee_id) {
            $resolvers->push($ticket->current_assignee_id);
        }
        
        // Add all active collaborators who participated in resolution
        $collaboratorIds = $ticket->collaborators()
            ->where('status', 'accepted')
            ->whereNotNull('joined_at')
            ->pluck('user_id');
        
        $resolvers = $resolvers->merge($collaboratorIds)->unique();
        
        // Create notifications for all resolvers
        foreach ($resolvers as $resolverId) {
            $ticket->notifications()->create([
                'user_id' => $resolverId,
                'sender_id' => $client->id,
                'type' => 'ticket_rated',
                'title' => 'Ticket Rated',
                'message' => "Client {$client->name} rated ticket #{$ticket->ticket_number} with {$rating->rating} stars" . 
                           ($rating->feedback ? ": \"{$rating->feedback}\"" : ""),
                'data' => [
                    'ticket_id' => $ticket->id,
                    'rating' => $rating->rating,
                    'feedback' => $rating->feedback,
                    'client_name' => $client->name
                ],
                'status' => 'pending',
            ]);
        }
    }

    public function downloadAttachment(Ticket $ticket, TicketAttachment $attachment)
    {
        // Ensure the attachment belongs to this ticket
        if ($attachment->ticket_id !== $ticket->id) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }

        // Check if file exists using Storage facade
        if (!Storage::disk('public')->exists($attachment->path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return Storage::disk('public')->download($attachment->path, $attachment->original_name);
    }

    public function viewAttachment(Ticket $ticket, TicketAttachment $attachment)
    {
        // Ensure the attachment belongs to this ticket
        if ($attachment->ticket_id !== $ticket->id) {
            return response()->json(['message' => 'Attachment not found'], 404);
        }

        // Check if file exists using Storage facade
        if (!Storage::disk('public')->exists($attachment->path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $filePath = Storage::disk('public')->path($attachment->path);

        return response()->file($filePath, [
            'Content-Type' => $attachment->mime_type,
            'Content-Disposition' => 'inline; filename="' . $attachment->original_name . '"'
        ]);
    }

    /**
     * Assign ticket to a specific staff member (Super Admin functionality)
     */
    public function assignToStaff(Request $request, Ticket $ticket)
    {
        $request->validate([
            'staff_id' => 'required|exists:users,id',
            'note' => 'nullable|string|max:500'
        ]);

        $user = $request->user();
        $staffMember = User::findOrFail($request->staff_id);

        // Only Super Admins can directly assign tickets
        if (!$user->isSuperAdmin()) {
            return response()->json(['message' => 'Only Super Admins can directly assign tickets'], 403);
        }

        // Staff member must be Admin or Super Admin
        if (!$staffMember->isAdmin() && !$staffMember->isSuperAdmin()) {
            return response()->json(['message' => 'Can only assign to Admin or Super Admin staff'], 400);
        }

        // Update ticket assignment
        $ticket->update([
            'status' => TicketStatus::ACQUIRED,
            'current_assignee_id' => $staffMember->id
        ]);

        // Log the assignment activity
        $ticket->recordActivity([
            'action' => 'assigned',
            'description' => "Ticket assigned to {$staffMember->name} by {$user->name}" . 
                           ($request->note ? " - Note: {$request->note}" : ''),
            'user_id' => $user->id,
            'changes' => [
                'assigned_to' => $staffMember->name,
                'assigned_by' => $user->name,
                'status' => 'ACQUIRED'
            ]
        ]);

        // Send notification to client about assignment
        $ticket->client->notify(new \App\Notifications\TicketAssigned($ticket, $staffMember));

        // Send notification to assigned staff member
        $staffMember->notify(new \App\Notifications\TicketAssignedToYou($ticket, $user));

        return response()->json([
            'message' => "Ticket successfully assigned to {$staffMember->name}",
            'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee'])
        ]);
    }

    /**
     * Request collaboration on a ticket (Admin functionality)
     */
    public function requestCollaboration(Request $request, Ticket $ticket)
    {
        $request->validate([
            'staff_id' => 'required|exists:users,id',
            'message' => 'nullable|string|max:500'
        ]);

        $user = $request->user();
        $collaborator = User::findOrFail($request->staff_id);

        // Only ticket assignees can request collaboration
        if ($ticket->current_assignee_id !== $user->id) {
            return response()->json(['message' => 'Only assigned staff can request collaboration'], 403);
        }

        // Collaborator must be Admin or Super Admin
        if (!$collaborator->isAdmin() && !$collaborator->isSuperAdmin()) {
            return response()->json(['message' => 'Can only request collaboration from Admin or Super Admin staff'], 400);
        }

        // Cannot request collaboration with yourself
        if ($collaborator->id === $user->id) {
            return response()->json(['message' => 'Cannot request collaboration with yourself'], 400);
        }

        // Check if already collaborating
        $existingCollaborator = $ticket->collaborators()->where('user_id', $collaborator->id)->exists();
        if ($existingCollaborator) {
            return response()->json(['message' => 'User is already collaborating on this ticket'], 400);
        }

        // Send collaboration request notification
        $collaborator->notify(new \App\Notifications\CollaborationRequest($ticket, $user, $request->message));

        // Log the request
        $ticket->recordActivity([
            'action' => 'collaboration_requested',
            'description' => "Collaboration requested from {$collaborator->name} by {$user->name}",
            'user_id' => $user->id,
            'changes' => [
                'collaboration_requested_to' => $collaborator->name,
                'requested_by' => $user->name
            ]
        ]);

        return response()->json([
            'message' => "Collaboration request sent to {$collaborator->name}",
            'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee', 'collaborators.user'])
        ]);
    }

    /**
     * Accept or decline collaboration request
     */
    public function respondToCollaboration(Request $request, Ticket $ticket)
    {
        $request->validate([
            'action' => 'required|in:accept,decline',
            'note' => 'nullable|string|max:500'
        ]);

        $user = $request->user();
        $action = $request->action;

        if ($action === 'accept') {
            // Add user as collaborator
            $ticket->collaborators()->create([
                'user_id' => $user->id,
                'role' => 'collaborator',
                'added_by' => $ticket->current_assignee_id ?? $user->id,
                'added_at' => now()
            ]);

            // If the ticket is ACQUIRED or IN_PROGRESS, assign the user to it based on current status
            $currentStatus = $ticket->status;
            if ($currentStatus === \App\Enums\TicketStatus::ACQUIRED || 
                $currentStatus === \App\Enums\TicketStatus::IN_PROGRESS) {
                
                // Create assignment record for the collaborator
                $ticket->assignments()->create([
                    'assigned_to' => $user->id,
                    'assigned_at' => now(),
                    'assigned_by' => $ticket->current_assignee_id ?? $user->id,
                    'is_current' => false // They are a collaborator, not the main assignee
                ]);
                
                $statusMessage = $currentStatus === \App\Enums\TicketStatus::ACQUIRED ? 
                    "added to your Acquired queue" : 
                    "added to your In Progress queue";
                    
                $responseMessage = "Collaboration request accepted. Ticket has been {$statusMessage}.";
            } else {
                $responseMessage = 'Collaboration request accepted. You are now a collaborator on this ticket.';
            }

            // Log the acceptance
            $ticket->recordActivity([
                'action' => 'collaboration_accepted',
                'description' => "Collaboration accepted by {$user->name}" . 
                               ($request->note ? " - Note: {$request->note}" : '') .
                               " (Status: {$currentStatus->value})",
                'user_id' => $user->id,
                'changes' => [
                    'collaborator_added' => $user->name,
                    'action' => 'accepted',
                    'ticket_status' => $currentStatus->value
                ]
            ]);

            return response()->json([
                'message' => $responseMessage,
                'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee', 'collaborators.user', 'assignments'])
            ]);
        } else {
            // Log the decline
            $ticket->recordActivity([
                'action' => 'collaboration_declined',
                'description' => "Collaboration declined by {$user->name}" . 
                               ($request->note ? " - Note: {$request->note}" : ''),
                'user_id' => $user->id,
                'changes' => [
                    'collaboration_declined_by' => $user->name,
                    'action' => 'declined'
                ]
            ]);

            return response()->json([
                'message' => 'Collaboration request declined'
            ]);
        }
    }

    /**
     * Leave collaboration on a ticket
     */
    public function leaveCollaboration(Request $request, Ticket $ticket)
    {
        $user = $request->user();

        // Check if user is the primary assignee or collaborator
        $isAssignee = $ticket->current_assignee_id === $user->id;
        $isCollaborator = $ticket->collaborators()->where('user_id', $user->id)->exists();

        if (!$isAssignee && !$isCollaborator) {
            return response()->json(['message' => 'You are not assigned to this ticket'], 403);
        }

        // Count total staff on ticket (assignee + collaborators)
        $totalStaff = 1 + $ticket->collaborators()->count(); // 1 for assignee + collaborators

        // Must have at least one staff member remaining
        if ($totalStaff <= 1) {
            return response()->json(['message' => 'Cannot leave ticket - at least one staff member must remain assigned'], 400);
        }

        if ($isAssignee) {
            // If primary assignee is leaving, promote a collaborator to assignee
            $newAssignee = $ticket->collaborators()->first();
            if ($newAssignee) {
                $ticket->update(['current_assignee_id' => $newAssignee->user_id]);
                $ticket->collaborators()->where('id', $newAssignee->id)->delete();
                
                $newAssigneeUser = $newAssignee->user;
                $logMessage = "Primary assignee {$user->name} left ticket. {$newAssigneeUser->name} promoted to primary assignee";
            } else {
                return response()->json(['message' => 'Cannot leave - no collaborators to promote to primary assignee'], 400);
            }
        } else {
            // Remove collaborator
            $ticket->collaborators()->where('user_id', $user->id)->delete();
            $logMessage = "Collaborator {$user->name} left ticket";
        }

        // Log the activity
        $ticket->recordActivity([
            'action' => 'left_collaboration',
            'description' => $logMessage,
            'user_id' => $user->id,
            'changes' => [
                'staff_left' => $user->name,
                'remaining_staff' => $totalStaff - 1
            ]
        ]);

        return response()->json([
            'message' => 'Successfully left ticket collaboration',
            'ticket' => $ticket->fresh(['category', 'client', 'currentAssignee', 'collaborators.user'])
        ]);
    }
}
