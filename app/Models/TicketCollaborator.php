<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketCollaborator extends Model
{
    protected $fillable = [
        'ticket_id',
        'user_id',
        'role',
        'added_by',
        'joined_at',
        'left_at',
        'status',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
        'left_at' => 'datetime',
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function addedBy()
    {
        return $this->belongsTo(User::class, 'added_by');
    }

    public function accept(): bool
    {
        return $this->update([
            'status' => 'accepted',
            'joined_at' => now(),
        ]);
    }

    public function leave(): bool
    {
        return $this->update([
            'status' => 'left',
            'left_at' => now(),
        ]);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
