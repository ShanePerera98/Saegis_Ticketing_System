<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DuplicateMergeItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'duplicate_merge_id',
        'child_ticket_id',
    ];

    // Relationships
    public function duplicateMerge(): BelongsTo
    {
        return $this->belongsTo(DuplicateMerge::class);
    }

    public function childTicket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'child_ticket_id');
    }
}
