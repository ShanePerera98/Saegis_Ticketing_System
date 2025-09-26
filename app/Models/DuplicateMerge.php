<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DuplicateMerge extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_ticket_id',
        'merged_by',
        'merged_at',
        'undone_at',
        'undone_by',
    ];

    protected $casts = [
        'merged_at' => 'datetime',
        'undone_at' => 'datetime',
    ];

    // Relationships
    public function parentTicket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'parent_ticket_id');
    }

    public function mergedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'merged_by');
    }

    public function undoneBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'undone_by');
    }

    public function duplicateMergeItems(): HasMany
    {
        return $this->hasMany(DuplicateMergeItem::class);
    }

    public function childTickets()
    {
        return $this->hasManyThrough(
            Ticket::class,
            DuplicateMergeItem::class,
            'duplicate_merge_id', // Foreign key on duplicate_merge_items table
            'id', // Foreign key on tickets table
            'id', // Local key on duplicate_merges table
            'child_ticket_id' // Local key on duplicate_merge_items table
        );
    }

    // Helper methods
    public function isUndone(): bool
    {
        return !is_null($this->undone_at);
    }

    public function canBeUndone(): bool
    {
        return is_null($this->undone_at);
    }
}
