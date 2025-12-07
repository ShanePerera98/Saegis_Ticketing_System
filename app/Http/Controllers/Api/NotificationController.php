<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $notifications = $user->notifications()
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($notifications);
    }

    public function unread(Request $request)
    {
        $user = $request->user();
        
        $notifications = $user->unreadNotifications()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'count' => $notifications->count()
        ]);
    }

    public function markAsRead(Request $request, $notificationId)
    {
        $user = $request->user();
        
        $notification = $user->notifications()
            ->where('id', $notificationId)
            ->first();

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        $notification->markAsRead();
        
        return response()->json(['message' => 'Notification marked as read']);
    }

    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        
        $user->unreadNotifications->markAsRead();

        return response()->json(['message' => 'All notifications marked as read']);
    }

    public function acceptCollaboration(Request $request, $notificationId)
    {
        try {
            $user = $request->user();
            
            $notification = $user->notifications()
                ->where('id', $notificationId)
                ->where('type', 'App\Notifications\CollaborationRequest')
                ->first();

            if (!$notification) {
                return response()->json(['message' => 'Collaboration notification not found'], 404);
            }

            // Check if already processed
            if ($notification->read_at) {
                return response()->json(['message' => 'This collaboration request has already been processed'], 400);
            }

            // Get ticket from notification data
            $ticketId = $notification->data['ticket_id'] ?? null;
            if (!$ticketId) {
                return response()->json(['message' => 'Invalid notification data'], 400);
            }

            $ticket = \App\Models\Ticket::find($ticketId);
            if (!$ticket) {
                return response()->json(['message' => 'Ticket not found'], 404);
            }

            // Check if user is already a collaborator
            $existingCollaborator = $ticket->collaborators()->where('user_id', $user->id)->first();
            if ($existingCollaborator) {
                $notification->markAsRead();
                return response()->json(['message' => 'You are already a collaborator on this ticket'], 400);
            }

            // Use the existing respondToCollaboration method
            $request->merge(['action' => 'accept']);
            
            $controller = new TicketController(new \App\Services\TicketService());
            $response = $controller->respondToCollaboration($request, $ticket);

            // Mark notification as read
            $notification->markAsRead();

            return $response;
            
        } catch (\Exception $e) {
            \Log::error('Collaboration acceptance error: ' . $e->getMessage(), [
                'notification_id' => $notificationId,
                'user_id' => $request->user()->id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to accept collaboration request. Please try again.'
            ], 500);
        }
    }

    public function rejectCollaboration(Request $request, $notificationId)
    {
        try {
            $user = $request->user();
            
            $notification = $user->notifications()
                ->where('id', $notificationId)
                ->where('type', 'App\Notifications\CollaborationRequest')
                ->first();

            if (!$notification) {
                return response()->json(['message' => 'Collaboration notification not found'], 404);
            }

            // Check if already processed
            if ($notification->read_at) {
                return response()->json(['message' => 'This collaboration request has already been processed'], 400);
            }

            // Get ticket from notification data
            $ticketId = $notification->data['ticket_id'] ?? null;
            if (!$ticketId) {
                return response()->json(['message' => 'Invalid notification data'], 400);
            }

            $ticket = \App\Models\Ticket::find($ticketId);
            if (!$ticket) {
                return response()->json(['message' => 'Ticket not found'], 404);
            }

            // Use the existing respondToCollaboration method
            $request->merge(['action' => 'decline']);
            
            $controller = new TicketController(new \App\Services\TicketService());
            $response = $controller->respondToCollaboration($request, $ticket);

            // Mark notification as read
            $notification->markAsRead();

            return $response;
            
        } catch (\Exception $e) {
            \Log::error('Collaboration rejection error: ' . $e->getMessage(), [
                'notification_id' => $notificationId,
                'user_id' => $request->user()->id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Failed to reject collaboration request. Please try again.'
            ], 500);
        }
    }

}
