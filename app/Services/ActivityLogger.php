<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogger
{
    public static function log(
        string $action,
        $entity,
        ?array $payload = null,
        ?array $changes = null,
        ?Request $request = null
    ): ActivityLog {
        $request = $request ?? request();
        
        return ActivityLog::log(
            auth()->id(),
            $action,
            get_class($entity),
            $entity->id,
            $payload,
            $changes,
            $request->ip(),
            $request->userAgent()
        );
    }

    public static function logTicketCreated($ticket, ?Request $request = null): ActivityLog
    {
        return self::log('ticket.created', $ticket, [
            'title' => $ticket->title,
            'priority' => $ticket->priority->value,
            'category_id' => $ticket->category_id,
        ], null, $request);
    }

    public static function logTicketUpdated($ticket, array $changes, ?Request $request = null): ActivityLog
    {
        return self::log('ticket.updated', $ticket, null, $changes, $request);
    }

    public static function logTicketStatusChanged($ticket, string $oldStatus, string $newStatus, ?Request $request = null): ActivityLog
    {
        return self::log('ticket.status_changed', $ticket, [
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
        ], null, $request);
    }

    public static function logTicketAssigned($ticket, $assignedTo, ?Request $request = null): ActivityLog
    {
        return self::log('ticket.assigned', $ticket, [
            'assigned_to' => $assignedTo->id,
            'assigned_to_name' => $assignedTo->name,
        ], null, $request);
    }

    public static function logTicketUnassigned($ticket, $unassignedFrom, ?Request $request = null): ActivityLog
    {
        return self::log('ticket.unassigned', $ticket, [
            'unassigned_from' => $unassignedFrom->id,
            'unassigned_from_name' => $unassignedFrom->name,
        ], null, $request);
    }

    public static function logTicketCancelled($ticket, string $cancelType, string $reason, ?Request $request = null): ActivityLog
    {
        return self::log('ticket.cancelled', $ticket, [
            'cancel_type' => $cancelType,
            'reason' => $reason,
        ], null, $request);
    }

    public static function logTicketMerged($primaryTicket, array $duplicateTicketIds, ?Request $request = null): ActivityLog
    {
        return self::log('ticket.merged', $primaryTicket, [
            'duplicate_tickets' => $duplicateTicketIds,
        ], null, $request);
    }

    public static function logCommentAdded($comment, ?Request $request = null): ActivityLog
    {
        return self::log('comment.created', $comment, [
            'ticket_id' => $comment->ticket_id,
            'is_internal' => $comment->is_internal,
        ], null, $request);
    }

    public static function logCommentUpdated($comment, array $changes, ?Request $request = null): ActivityLog
    {
        return self::log('comment.updated', $comment, null, $changes, $request);
    }

    public static function logCommentDeleted($comment, ?Request $request = null): ActivityLog
    {
        return self::log('comment.deleted', $comment, [
            'ticket_id' => $comment->ticket_id,
            'content' => substr($comment->content, 0, 100),
        ], null, $request);
    }

    public static function logAttachmentUploaded($attachment, ?Request $request = null): ActivityLog
    {
        return self::log('attachment.uploaded', $attachment, [
            'filename' => $attachment->filename,
            'file_size' => $attachment->file_size,
            'ticket_id' => $attachment->ticket_id,
        ], null, $request);
    }

    public static function logUserLogin($user, ?Request $request = null): ActivityLog
    {
        return self::log('user.login', $user, null, null, $request);
    }

    public static function logUserLogout($user, ?Request $request = null): ActivityLog
    {
        return self::log('user.logout', $user, null, null, $request);
    }

    public static function logTemplateCreated($template, ?Request $request = null): ActivityLog
    {
        return self::log('template.created', $template, [
            'name' => $template->name,
            'category_id' => $template->category_id,
        ], null, $request);
    }

    public static function logTemplateUpdated($template, array $changes, ?Request $request = null): ActivityLog
    {
        return self::log('template.updated', $template, null, $changes, $request);
    }

    public static function logCategoryCreated($category, ?Request $request = null): ActivityLog
    {
        return self::log('category.created', $category, [
            'name' => $category->name,
            'parent_id' => $category->parent_id,
        ], null, $request);
    }
}
