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
        
        // Define valid transitions
        $validTransitions = [
            TicketStatus::NEW->value => [
                TicketStatus::IN_PROGRESS->value,
                TicketStatus::ON_HOLD->value,
                TicketStatus::CANCELLED_IRRELEVANT->value,
                TicketStatus::CANCELLED_DUPLICATE->value,
            ],
            TicketStatus::IN_PROGRESS->value => [
                TicketStatus::ON_HOLD->value,
                TicketStatus::RESOLVED->value,
                TicketStatus::CANCELLED_IRRELEVANT->value,
                TicketStatus::CANCELLED_DUPLICATE->value,
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
}
