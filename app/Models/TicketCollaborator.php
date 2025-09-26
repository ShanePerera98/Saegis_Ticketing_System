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
}
