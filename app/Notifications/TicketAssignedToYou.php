<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class TicketAssignedToYou extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        protected Ticket $ticket,
        protected User $assignedBy
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'ticket_assigned_to_you',
            'title' => 'New Ticket Assignment',
            'message' => "You have been assigned to ticket #{$this->ticket->ticket_number} by {$this->assignedBy->name}",
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'ticket_subject' => $this->ticket->subject,
            'client_name' => $this->ticket->client->name,
            'assigned_by' => [
                'id' => $this->assignedBy->id,
                'name' => $this->assignedBy->name,
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
