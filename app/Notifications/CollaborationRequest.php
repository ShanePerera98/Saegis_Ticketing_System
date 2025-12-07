<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;

class CollaborationRequest extends Notification
{

    public function __construct(
        protected Ticket $ticket,
        protected User $requestedBy,
        protected ?string $message = null
    ) {}

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable): array
    {
        return [
            'type' => 'collaboration_request',
            'title' => 'Collaboration Request',
            'message' => "Collaboration request from {$this->requestedBy->name} for Ticket #{$this->ticket->ticket_number}: {$this->ticket->title} (Status: {$this->ticket->status->value})",
            'custom_message' => $this->message,
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'ticket_title' => $this->ticket->title,
            'ticket_status' => $this->ticket->status->value,
            'ticket_priority' => $this->ticket->priority->value,
            'client_name' => $this->ticket->client->name,
            'requested_by' => [
                'id' => $this->requestedBy->id,
                'name' => $this->requestedBy->name,
                'role' => $this->requestedBy->role->value,
            ],
            'url' => "/tickets/{$this->ticket->id}",
            'actions' => [
                'accept' => "Accept collaboration request for ticket #{$this->ticket->ticket_number}",
                'decline' => "Decline collaboration request for ticket #{$this->ticket->ticket_number}"
            ],
            'created_at' => now(),
        ];
    }

    public function toDatabase($notifiable): DatabaseMessage
    {
        return new DatabaseMessage($this->toArray($notifiable));
    }
}
