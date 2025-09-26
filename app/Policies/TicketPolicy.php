<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TicketPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin() || $user->isClient();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Ticket $ticket): bool
    {
        // Clients can only view their own tickets
        if ($user->isClient()) {
            return $ticket->client_id === $user->id;
        }

        // Admins can view all tickets
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true; // All authenticated users can create tickets
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Ticket $ticket): bool
    {
        // Clients can update their own tickets if not resolved/closed
        if ($user->isClient()) {
            return $ticket->client_id === $user->id && 
                   !in_array($ticket->status->value, ['RESOLVED', 'CLOSED']);
        }

        // Admins can update all tickets
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Ticket $ticket): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can assign ticket to self.
     */
    public function assignSelf(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can assign ticket to others.
     */
    public function assignToOther(User $user, Ticket $ticket): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can add collaborators.
     */
    public function addCollaborator(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin() && $ticket->isAssignedTo($user);
    }

    /**
     * Determine whether the user can remove collaborators.
     */
    public function removeCollaborator(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin() && $ticket->isAssignedTo($user);
    }

    /**
     * Determine whether the user can update ticket status.
     */
    public function updateStatus(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can add comments.
     */
    public function comment(User $user, Ticket $ticket): bool
    {
        if ($user->isClient()) {
            return $ticket->client_id === $user->id;
        }

        return $user->isAdmin();
    }

    /**
     * Determine whether the user can cancel tickets.
     */
    public function cancel(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can merge tickets.
     */
    public function merge(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can undo merges.
     */
    public function undoMerge(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can delete their own tickets (client delete).
     */
    public function clientDelete(User $user, Ticket $ticket): bool
    {
        return $user->isClient() && $ticket->client_id === $user->id;
    }

    /**
     * Determine whether the user can view cancelled tickets.
     */
    public function viewCancelled(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can approve cancellations.
     */
    public function approveCancellation(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can restore tickets.
     */
    public function restoreTicket(User $user): bool
    {
        return $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can view merges.
     */
    public function viewMerges(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view reports.
     */
    public function viewReports(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can view statistics.
     */
    public function viewStats(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine whether the user can export reports.
     */
    public function exportReports(User $user): bool
    {
        return $user->isAdmin();
    }
}
