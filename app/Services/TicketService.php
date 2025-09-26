<?php

namespace App\Services;

use App\Models\Ticket;
use App\Models\User;
use App\Models\DuplicateMerge;
use App\Enums\TicketStatus;
use App\Enums\CancelledTicketType;
use App\Services\ActivityLogger;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TicketService
{
    public function createTicket(array $data, User $user): Ticket
    {
        return DB::transaction(function () use ($data, $user) {
            $ticket = Ticket::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'priority' => $data['priority'],
                'category_id' => $data['category_id'] ?? null,
                'template_id' => $data['template_id'] ?? null,
                'client_id' => $user->isClient() ? $user->id : $data['client_id'],
                'created_by' => $user->id,
                'status' => TicketStatus::NEW,
            ]);

            // Store template field values if template is used
            if (isset($data['field_values']) && $ticket->template_id) {
                $this->storeFieldValues($ticket, $data['field_values']);
            }

            // Create initial status transition
            $ticket->statusTransitions()->create([
                'from_status' => null,
                'to_status' => TicketStatus::NEW,
                'changed_by' => $user->id,
            ]);

            return $ticket;
        });
    }

    public function assignToSelf(Ticket $ticket, User $user): void
    {
        if (!$user->isAdmin()) {
            throw new \InvalidArgumentException('Only admins can assign tickets');
        }

        DB::transaction(function () use ($ticket, $user) {
            // Create assignment record
            $ticket->assignments()->updateOrCreate(
                ['assigned_to' => $user->id],
                [
                    'assigned_by' => $user->id,
                    'is_owner' => true,
                ]
            );

            // Update current assignee
            $ticket->update(['current_assignee_id' => $user->id]);
        });
    }

    public function assignToOther(Ticket $ticket, User $assignee, User $assigner): void
    {
        if (!$assigner->isSuperAdmin()) {
            throw new \InvalidArgumentException('Only super admins can assign tickets to others');
        }

        if (!$assignee->isAdmin()) {
            throw new \InvalidArgumentException('Can only assign to admins or super admins');
        }

        DB::transaction(function () use ($ticket, $assignee, $assigner) {
            // Create assignment record
            $ticket->assignments()->updateOrCreate(
                ['assigned_to' => $assignee->id],
                [
                    'assigned_by' => $assigner->id,
                    'is_owner' => true,
                ]
            );

            // Update current assignee
            $ticket->update(['current_assignee_id' => $assignee->id]);
        });
    }

    public function addCollaborator(Ticket $ticket, User $collaborator, User $adder): void
    {
        if (!$adder->isAdmin()) {
            throw new \InvalidArgumentException('Only admins can add collaborators');
        }

        if (!$collaborator->isAdmin()) {
            throw new \InvalidArgumentException('Only admins can be collaborators');
        }

        // Check if user is assigned to the ticket
        if (!$ticket->isAssignedTo($adder)) {
            throw new \InvalidArgumentException('Only assigned users can add collaborators');
        }

        $ticket->collaborators()->updateOrCreate(
            ['user_id' => $collaborator->id],
            [
                'role' => $collaborator->role->value,
                'added_by' => $adder->id,
            ]
        );
    }

    public function transitionStatus(Ticket $ticket, TicketStatus $newStatus, User $user, string $reason = null): void
    {
        if (!$ticket->canTransitionTo($newStatus)) {
            throw new \InvalidArgumentException("Invalid status transition from {$ticket->status->value} to {$newStatus->value}");
        }

        DB::transaction(function () use ($ticket, $newStatus, $user, $reason) {
            $oldStatus = $ticket->status;
            
            $ticket->update(['status' => $newStatus]);

            $ticket->statusTransitions()->create([
                'from_status' => $oldStatus,
                'to_status' => $newStatus,
                'changed_by' => $user->id,
                'reason' => $reason,
            ]);
        });
    }

    public function cancelAsIrrelevant(Ticket $ticket, User $user, string $reason = null): void
    {
        if (!$user->isAdmin()) {
            throw new \InvalidArgumentException('Only admins can cancel tickets');
        }

        DB::transaction(function () use ($ticket, $user, $reason) {
            $ticket->update(['status' => TicketStatus::CANCELLED_IRRELEVANT]);

            $ticket->statusTransitions()->create([
                'from_status' => $ticket->status,
                'to_status' => TicketStatus::CANCELLED_IRRELEVANT,
                'changed_by' => $user->id,
                'reason' => $reason,
            ]);

            $ticket->cancelledTicket()->create([
                'reason_text' => $reason,
                'cancelled_by' => $user->id,
                'cancelled_at' => now(),
                'type' => CancelledTicketType::IRRELEVANT,
                'auto_delete_after' => now()->addDays(14),
            ]);
        });
    }

    public function mergeDuplicates(array $childTicketIds, array $parentData, User $user): Ticket
    {
        if (!$user->isAdmin()) {
            throw new \InvalidArgumentException('Only admins can merge tickets');
        }

        return DB::transaction(function () use ($childTicketIds, $parentData, $user) {
            // Create parent ticket
            $parentTicket = Ticket::create([
                'title' => $parentData['title'],
                'description' => $parentData['description'],
                'priority' => $parentData['priority'],
                'category_id' => $parentData['category_id'] ?? null,
                'client_id' => $parentData['client_id'],
                'created_by' => $user->id,
                'current_assignee_id' => $user->id,
                'status' => TicketStatus::NEW,
            ]);

            // Create merge record
            $merge = $parentTicket->duplicateMerges()->create([
                'merged_by' => $user->id,
                'merged_at' => now(),
            ]);

            // Update child tickets to cancelled_duplicate status
            $childTickets = Ticket::whereIn('id', $childTicketIds)->get();
            foreach ($childTickets as $childTicket) {
                $childTicket->update(['status' => TicketStatus::CANCELLED_DUPLICATE]);
                
                $merge->duplicateMergeItems()->create([
                    'child_ticket_id' => $childTicket->id,
                ]);

                $childTicket->cancelledTicket()->create([
                    'reason_text' => "Merged into ticket {$parentTicket->ticket_number}",
                    'cancelled_by' => $user->id,
                    'cancelled_at' => now(),
                    'type' => CancelledTicketType::DUPLICATE,
                    'auto_delete_after' => now()->addDays(14),
                ]);
            }

            return $parentTicket;
        });
    }

    public function undoMerge(int $mergeId, User $user): void
    {
        if (!$user->isSuperAdmin()) {
            throw new \InvalidArgumentException('Only super admins can undo merges');
        }

        DB::transaction(function () use ($mergeId, $user) {
            $merge = DuplicateMerge::findOrFail($mergeId);
            
            // Restore child tickets
            foreach ($merge->duplicateMergeItems as $item) {
                $childTicket = $item->childTicket;
                $childTicket->update(['status' => TicketStatus::NEW]);
                $childTicket->cancelledTicket()->delete();
            }

            // Mark parent as cancelled or delete
            $parentTicket = $merge->parentTicket;
            $parentTicket->update(['status' => TicketStatus::CANCELLED_DUPLICATE]);

            // Update merge record
            $merge->update([
                'undone_at' => now(),
                'undone_by' => $user->id,
            ]);
        });
    }

    public function clientDelete(Ticket $ticket, User $client, string $reason = null): void
    {
        if (!$client->isClient() || $ticket->client_id !== $client->id) {
            throw new \InvalidArgumentException('Only ticket creator can delete their tickets');
        }

        DB::transaction(function () use ($ticket, $client, $reason) {
            // Log the deletion
            $ticket->deletedTicketsLog()->create([
                'ticket_id' => $ticket->id,
                'client_id' => $client->id,
                'deleted_at' => now(),
                'reason' => $reason,
            ]);

            // Soft delete the ticket
            $ticket->delete();
        });
    }

    public function restoreFromCancelled(Ticket $ticket, User $user): void
    {
        if (!$user->isSuperAdmin()) {
            throw new \InvalidArgumentException('Only super admins can restore tickets');
        }

        DB::transaction(function () use ($ticket, $user) {
            $cancelledTicket = $ticket->cancelledTicket;
            $previousStatus = TicketStatus::NEW; // Default fallback

            // Try to find the previous status from transitions
            $lastTransition = $ticket->statusTransitions()
                ->where('to_status', '!=', $ticket->status->value)
                ->orderBy('created_at', 'desc')
                ->first();

            if ($lastTransition) {
                $previousStatus = TicketStatus::from($lastTransition->to_status);
            }

            $ticket->update(['status' => $previousStatus]);
            $cancelledTicket->delete();

            $ticket->statusTransitions()->create([
                'from_status' => $ticket->status,
                'to_status' => $previousStatus,
                'changed_by' => $user->id,
                'reason' => 'Restored from cancelled status',
            ]);
        });
    }

    public function approveCancellation(int $ticketId, User $user): void
    {
        if (!$user->isSuperAdmin()) {
            throw new \InvalidArgumentException('Only super admins can approve cancellations');
        }

        DB::transaction(function () use ($ticketId, $user) {
            $ticket = Ticket::findOrFail($ticketId);
            $cancelledTicket = $ticket->cancelledTicket;
            
            if (!$cancelledTicket) {
                throw new \InvalidArgumentException('Ticket is not cancelled');
            }

            $cancelledTicket->update([
                'status' => 'APPROVED',
                'approved_by' => $user->id,
                'approved_at' => now(),
            ]);

            // Schedule for deletion after specified period
            if ($cancelledTicket->auto_delete_after) {
                // This could trigger a job or event for cleanup
            }
        });
    }

    public function restoreTicket(int $ticketId, User $user): void
    {
        if (!$user->isSuperAdmin()) {
            throw new \InvalidArgumentException('Only super admins can restore tickets');
        }

        DB::transaction(function () use ($ticketId, $user) {
            $ticket = Ticket::findOrFail($ticketId);
            $this->restoreFromCancelled($ticket, $user);
        });
    }

    private function storeFieldValues(Ticket $ticket, array $fieldValues): void
    {
        foreach ($fieldValues as $fieldId => $value) {
            $ticket->fieldValues()->create([
                'field_id' => $fieldId,
                'value' => json_encode($value),
            ]);
        }
    }
}
