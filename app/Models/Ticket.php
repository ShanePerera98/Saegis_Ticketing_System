<?php

namespace App\Models;

use App\Enums\TicketStatus;
use App\Enums\TicketPriority;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ticket extends Model
{
    use HasFactory, SoftDeletes; // LogsActivity temporarily removed

    protected $fillable = [
        'ticket_number',
        'title',
        'description',
        'location',
        'status',
        'priority',
        'category_id',
        'client_id',
        'created_by',
        'current_assignee_id',
        'resolved_at',
        'closed_at',
        'due_date',
        'estimated_resolution_time',
        'actual_resolution_time',
        'satisfaction_rating',
        'satisfaction_feedback',
        'internal_notes',
        'tags',
        'custom_fields',
    ];

    protected $casts = [
        'status' => TicketStatus::class,
        'priority' => TicketPriority::class,
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
        'due_date' => 'datetime',
        'tags' => 'array',
        'custom_fields' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($ticket) {
            if (!$ticket->ticket_number) {
                $ticket->ticket_number = self::generateTicketNumber();
            }
            // Ensure status is never empty
            if (is_null($ticket->status) || $ticket->status === '') {
                $ticket->status = TicketStatus::NEW;
            }
        });

        static::updating(function ($ticket) {
            // Ensure status is never empty during updates
            if (is_null($ticket->status) || $ticket->status === '') {
                $ticket->status = TicketStatus::NEW;
            }
        });
    }

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function currentAssignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'current_assignee_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TicketAssignment::class);
    }

    public function collaborators(): HasMany
    {
        return $this->hasMany(TicketCollaborator::class);
    }

    public function activityLogs(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(ActivityLog::class, 'subject');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class)->orderBy('created_at');
    }

    public function statusTransitions(): HasMany
    {
        return $this->hasMany(TicketStatusTransition::class)->orderBy('created_at');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }

    public function cancelledTicket(): HasOne
    {
        return $this->hasOne(CancelledTicket::class);
    }

    public function duplicateMerges(): HasMany
    {
        return $this->hasMany(DuplicateMerge::class, 'parent_ticket_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(TicketTemplate::class);
    }

    public function fieldValues(): HasMany
    {
        return $this->hasMany(TicketTemplateFieldValue::class);
    }

    public function deletedTicketsLog(): HasMany
    {
        return $this->hasMany(DeletedTicketsLog::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(TicketNotification::class);
    }

    public function rating(): HasOne
    {
        return $this->hasOne(TicketRating::class);
    }

    // Query Scopes
    public function scopeForUser($query, User $user)
    {
        if ($user->isClient()) {
            return $query->where('client_id', $user->id);
        }
        return $query;
    }

    public function scopeAssignedTo($query, User $user)
    {
        return $query->where('current_assignee_id', $user->id);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeOpen($query)
    {
        return $query->whereIn('status', [
            TicketStatus::NEW,
            TicketStatus::IN_PROGRESS,
            TicketStatus::ON_HOLD
        ]);
    }

    public function scopeClosed($query)
    {
        return $query->whereIn('status', [
            TicketStatus::RESOLVED,
            TicketStatus::CLOSED
        ]);
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
                    ->whereNotIn('status', [TicketStatus::RESOLVED, TicketStatus::CLOSED]);
    }

    // Helper Methods
    public function isOpen(): bool
    {
        return in_array($this->status, [
            TicketStatus::NEW,
            TicketStatus::IN_PROGRESS,
            TicketStatus::ON_HOLD
        ]);
    }

    public function isClosed(): bool
    {
        return in_array($this->status, [
            TicketStatus::RESOLVED,
            TicketStatus::CLOSED
        ]);
    }

    public function isOverdue(): bool
    {
        return $this->due_date && 
               $this->due_date->isPast() && 
               !$this->isClosed();
    }

    public function isAssignedTo(User $user): bool
    {
        return $this->current_assignee_id === $user->id;
    }

    public function canTransitionTo(TicketStatus $newStatus): bool
    {
        $currentStatus = $this->status;
        
        // Define valid transitions for the enhanced workflow
        $validTransitions = [
            TicketStatus::NEW->value => [
                TicketStatus::ACQUIRED->value,
                TicketStatus::CANCELLED_IRRELEVANT->value,
                TicketStatus::CANCELLED_DUPLICATE->value,
            ],
            TicketStatus::ACQUIRED->value => [
                TicketStatus::IN_PROGRESS->value,
                TicketStatus::CANCELLED->value,
                TicketStatus::CLOSED->value,
            ],
            TicketStatus::IN_PROGRESS->value => [
                TicketStatus::PENDING->value,
                TicketStatus::ON_HOLD->value,
                TicketStatus::RESOLVED->value,
                TicketStatus::CANCELLED->value,
                TicketStatus::CLOSED->value,
            ],
            TicketStatus::PENDING->value => [
                TicketStatus::IN_PROGRESS->value,
                TicketStatus::RESOLVED->value,
                TicketStatus::CANCELLED->value,
                TicketStatus::CLOSED->value,
            ],
            TicketStatus::ON_HOLD->value => [
                TicketStatus::IN_PROGRESS->value,
                TicketStatus::RESOLVED->value,
                TicketStatus::CANCELLED_IRRELEVANT->value,
                TicketStatus::CANCELLED_DUPLICATE->value,
            ],
            TicketStatus::RESOLVED->value => [
                TicketStatus::CLOSED->value,
                TicketStatus::IN_PROGRESS->value, // Reopen
            ],
            TicketStatus::CLOSED->value => [
                TicketStatus::IN_PROGRESS->value, // Reopen
            ],
            TicketStatus::CANCELLED->value => [],
            TicketStatus::CANCELLED_IRRELEVANT->value => [],
            TicketStatus::CANCELLED_DUPLICATE->value => [],
        ];

        return in_array($newStatus->value, $validTransitions[$currentStatus->value] ?? []);
    }

    public function canBeAssignedTo(User $user): bool
    {
        return $user->isAdmin() || $user->isSuperAdmin();
    }

    public function canBeViewedBy(User $user): bool
    {
        if ($user->isAdmin() || $user->isSuperAdmin()) {
            return true;
        }

        if ($user->isClient()) {
            return $this->client_id === $user->id;
        }

        return false;
    }

    public function canBeModifiedBy(User $user): bool
    {
        if ($user->isSuperAdmin()) {
            return true;
        }

        if ($user->isAdmin()) {
            return true;
        }

        if ($user->isClient() && $this->client_id === $user->id) {
            return $this->isOpen(); // Clients can only modify open tickets
        }

        return false;
    }

    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            TicketStatus::NEW => 'blue',
            TicketStatus::IN_PROGRESS => 'yellow',
            TicketStatus::ON_HOLD => 'orange',
            TicketStatus::RESOLVED => 'green',
            TicketStatus::CLOSED => 'gray',
            default => 'gray',
        };
    }

    protected static function generateTicketNumber(): string
    {
        $prefix = 'TKT';
        $date = now()->format('Ymd');
        
        // Get all ticket numbers for today including soft deleted and find the highest sequence
        $todayTickets = self::withTrashed()->where('ticket_number', 'LIKE', $prefix . '-' . $date . '-%')
                           ->pluck('ticket_number')
                           ->toArray();
        
        $maxSequence = 0;
        foreach ($todayTickets as $ticketNumber) {
            $parts = explode('-', $ticketNumber);
            if (count($parts) === 3) {
                $sequence = (int) $parts[2];
                $maxSequence = max($maxSequence, $sequence);
            }
        }
        
        $newSequence = $maxSequence + 1;
        
        return $prefix . '-' . $date . '-' . str_pad($newSequence, 4, '0', STR_PAD_LEFT);
    }

    // Workflow Status Validation Methods
    public function canBeAcquiredBy(User $user): bool
    {
        return $this->status === TicketStatus::NEW && $user->isSupport();
    }

    public function canBeDeletedBy(User $user): bool
    {
        return $user->id === $this->client_id && 
               in_array($this->status, [TicketStatus::NEW, TicketStatus::ACQUIRED, TicketStatus::IN_PROGRESS]);
    }

    // Workflow Action Methods
    public function acquire(User $user): bool
    {
        if (!$this->canBeAcquiredBy($user)) {
            return false;
        }

        $oldStatus = $this->status;
        
        $this->update([
            'status' => TicketStatus::ACQUIRED,
            'current_assignee_id' => $user->id,
        ]);

        $this->notifyClientStatusChange($oldStatus, TicketStatus::ACQUIRED, $user);

        return true;
    }

    public function setInProgress(User $user): bool
    {
        if ($this->status !== TicketStatus::ACQUIRED || $this->current_assignee_id !== $user->id) {
            return false;
        }

        $oldStatus = $this->status;
        $this->update(['status' => TicketStatus::IN_PROGRESS]);
        $this->notifyClientStatusChange($oldStatus, TicketStatus::IN_PROGRESS, $user);
        
        return true;
    }

    public function pause(User $user, ?string $reason = null): bool
    {
        if ($this->status !== TicketStatus::IN_PROGRESS || $this->current_assignee_id !== $user->id) {
            return false;
        }

        $oldStatus = $this->status;
        
        $this->update([
            'status' => TicketStatus::PENDING,
            'pause_reason' => $reason,
        ]);

        $this->notifyClientStatusChange($oldStatus, TicketStatus::PENDING, $user, $reason);

        return true;
    }

    public function resume(User $user): bool
    {
        if ($this->status !== TicketStatus::PENDING || $this->current_assignee_id !== $user->id) {
            return false;
        }

        $oldStatus = $this->status;
        $this->update(['status' => TicketStatus::IN_PROGRESS]);
        $this->notifyClientStatusChange($oldStatus, TicketStatus::IN_PROGRESS, $user);
        
        return true;
    }

    public function resolve(User $user, ?string $note = null): bool
    {
        if (!in_array($this->status, [TicketStatus::IN_PROGRESS, TicketStatus::PENDING]) || 
            $this->current_assignee_id !== $user->id) {
            return false;
        }

        $oldStatus = $this->status;
        
        $this->update([
            'status' => TicketStatus::RESOLVED,
            'resolution_note' => $note,
            'resolved_at' => now(),
            'expires_at' => now()->addDays(7), // Expires after 7 days for admin
        ]);

        $this->notifyClientStatusChange($oldStatus, TicketStatus::RESOLVED, $user, $note);

        return true;
    }

    public function cancel(User $user, string $reason): bool
    {
        if (!in_array($this->status, [TicketStatus::ACQUIRED, TicketStatus::IN_PROGRESS, TicketStatus::PENDING])) {
            return false;
        }

        $oldStatus = $this->status;
        
        $this->update([
            'status' => TicketStatus::CANCELLED,
            'cancel_reason' => $reason,
            'cancelled_at' => now(),
            'expires_at' => now()->addDays(7), // Expires after 7 days
        ]);

        $this->notifyClientStatusChange($oldStatus, TicketStatus::CANCELLED, $user, $reason);

        return true;
    }

    public function close(User $user, string $reason): bool
    {
        if (!in_array($this->status, [TicketStatus::ACQUIRED, TicketStatus::IN_PROGRESS, TicketStatus::PENDING])) {
            return false;
        }

        $oldStatus = $this->status;
        
        $this->update([
            'status' => TicketStatus::CLOSED,
            'close_reason' => $reason,
            'closed_at' => now(),
            'expires_at' => now()->addDays(30), // Expires after 30 days for super admin
        ]);

        $this->notifyClientStatusChange($oldStatus, TicketStatus::CLOSED, $user, $reason);

        return true;
    }

    public function deleteByClient(User $user): bool
    {
        if (!$this->canBeDeletedBy($user)) {
            return false;
        }

        $this->delete(); // Soft delete
        return true;
    }

    public function addCollaborator(User $collaborator, User $addedBy): bool
    {
        if ($this->status !== TicketStatus::IN_PROGRESS) {
            return false;
        }

        // Create collaboration request
        $this->collaborators()->create([
            'user_id' => $collaborator->id,
            'role' => $collaborator->role,
            'added_by' => $addedBy->id,
            'status' => 'pending',
        ]);

        // Create notification
        $this->notifications()->create([
            'user_id' => $collaborator->id,
            'sender_id' => $addedBy->id,
            'type' => 'collaboration_request',
            'title' => 'Collaboration Request',
            'message' => "You've been invited to collaborate on ticket #{$this->ticket_number}",
            'data' => ['ticket_id' => $this->id],
            'status' => 'pending',
        ]);

        return true;
    }

    public function hasExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    protected function notifyClientStatusChange(TicketStatus $oldStatus, TicketStatus $newStatus, User $changer, ?string $reason = null): void
    {
        // Don't notify if the client is the one making the change
        if ($this->client_id === $changer->id) {
            return;
        }

        $statusMessages = [
            'NEW' => 'has been created and is awaiting assignment',
            'ACQUIRED' => 'has been acquired by support staff',
            'IN_PROGRESS' => 'is now being worked on',
            'PENDING' => 'is pending additional information or external dependencies',
            'ON_HOLD' => 'has been put on hold',
            'RESOLVED' => 'has been resolved',
            'CLOSED' => 'has been closed',
            'CANCELLED' => 'has been cancelled',
            'CANCELLED_IRRELEVANT' => 'has been cancelled as irrelevant'
        ];

        $message = "Your ticket #{$this->ticket_number} " . ($statusMessages[$newStatus->value] ?? "status has changed to {$newStatus->value}");
        
        if ($reason) {
            $message .= ". Reason: {$reason}";
        }

        $this->notifications()->create([
            'user_id' => $this->client_id,
            'sender_id' => $changer->id,
            'type' => 'status_changed',
            'title' => 'Ticket Status Updated',
            'message' => $message,
            'data' => [
                'ticket_id' => $this->id,
                'old_status' => $oldStatus->value,
                'new_status' => $newStatus->value,
                'reason' => $reason,
                'changed_by' => $changer->name
            ],
            'status' => 'pending',
        ]);
    }

    /**
     * Record activity for this ticket
     */
    public function recordActivity($data)
    {
        // Create activity log entry using Spatie Activity Log format
        ActivityLog::create([
            'log_name' => 'ticket',
            'description' => $data['description'] ?? '',
            'subject_type' => 'App\\Models\\Ticket',
            'subject_id' => $this->id,
            'event' => $data['action'] ?? 'unknown',
            'causer_type' => 'App\\Models\\User',
            'causer_id' => $data['user_id'] ?? auth()->id(),
            'properties' => json_encode($data['changes'] ?? []),
        ]);
    }
}
