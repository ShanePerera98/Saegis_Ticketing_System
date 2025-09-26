<?php

namespace App\Models;

use App\Enums\CancelledTicketType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CancelledTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'reason_text',
        'cancelled_by',
        'cancelled_at',
        'type',
        'auto_delete_after',
        'approved_deleted_at',
        'approved_deleted_by',
    ];

    protected $casts = [
        'type' => CancelledTicketType::class,
        'cancelled_at' => 'datetime',
        'auto_delete_after' => 'datetime',
        'approved_deleted_at' => 'datetime',
    ];

    // Relationships
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    public function cancelledBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function approvedDeletedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_deleted_by');
    }

    // Scopes
    public function scopePendingDeletion($query)
    {
        return $query->whereNull('approved_deleted_at')
                    ->where('auto_delete_after', '>', now());
    }

    public function scopeReadyForAutoDeletion($query)
    {
        return $query->whereNull('approved_deleted_at')
                    ->where('auto_delete_after', '<=', now());
    }

    public function scopeByType($query, CancelledTicketType $type)
    {
        return $query->where('type', $type);
    }

    // Helper Methods
    public function isReadyForAutoDeletion(): bool
    {
        return !$this->approved_deleted_at && $this->auto_delete_after->isPast();
    }

    public function canBeRestored(): bool
    {
        return !$this->approved_deleted_at;
    }

    public function markApprovedForDeletion(User $user): void
    {
        $this->update([
            'approved_deleted_at' => now(),
            'approved_deleted_by' => $user->id,
        ]);
    }
}
