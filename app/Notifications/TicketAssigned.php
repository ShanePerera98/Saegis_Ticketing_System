<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class TicketAssigned extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Ticket $ticket,
        protected User $assignedStaff
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'ticket_assigned',
            'title' => 'Ticket Assigned',
            'message' => "Your ticket #{$this->ticket->ticket_number} has been assigned to {$this->assignedStaff->name}",
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'assigned_staff' => [
                'id' => $this->assignedStaff->id,
                'name' => $this->assignedStaff->name,
            ],
            'url' => "/tickets/{$this->ticket->id}",
            'created_at' => now(),
        ];
    }

    public function toDatabase($notifiable): DatabaseMessage
    {
        return new DatabaseMessage($this->toArray($notifiable));
    }
}
