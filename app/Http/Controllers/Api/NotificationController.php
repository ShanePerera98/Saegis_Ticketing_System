<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TicketNotification;
use App\Models\TicketCollaborator;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $notifications = TicketNotification::forUser($user->id)
            ->with(['ticket', 'sender'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notifications);
    }

    public function unread(Request $request)
    {
        $user = $request->user();
        
        $notifications = TicketNotification::forUser($user->id)
            ->unread()
            ->with(['ticket', 'sender'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'count' => $notifications->count()
        ]);
    }

    public function markAsRead(Request $request, TicketNotification $notification)
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();
        
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        
        TicketNotification::forUser($user->id)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function acceptCollaborationRequest(Request $request, TicketNotification $notification)
    {
        if ($notification->user_id !== $request->user()->id || 
            $notification->type !== 'collaboration_request') {
            return response()->json(['message' => 'Invalid request'], 400);
        }

        $collaborator = TicketCollaborator::where('ticket_id', $notification->ticket_id)
            ->where('user_id', $notification->user_id)
            ->where('status', 'pending')
            ->first();

        if (!$collaborator) {
            return response()->json(['message' => 'Collaboration request not found'], 404);
        }

        $collaborator->accept();
        $notification->accept();
        $notification->markAsRead();

        return response()->json([
            'message' => 'Collaboration request accepted',
            'collaborator' => $collaborator->fresh(['ticket', 'user'])
        ]);
    }

    public function rejectCollaborationRequest(Request $request, TicketNotification $notification)
    {
        if ($notification->user_id !== $request->user()->id || 
            $notification->type !== 'collaboration_request') {
            return response()->json(['message' => 'Invalid request'], 400);
        }

        $collaborator = TicketCollaborator::where('ticket_id', $notification->ticket_id)
            ->where('user_id', $notification->user_id)
            ->where('status', 'pending')
            ->first();

        if ($collaborator) {
            $collaborator->delete();
        }

        $notification->reject();
        $notification->markAsRead();

        return response()->json(['message' => 'Collaboration request rejected']);
    }
}
