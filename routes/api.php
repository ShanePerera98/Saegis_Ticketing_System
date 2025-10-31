<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\TicketTemplateController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\TroubleshootController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Test route
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!', 'time' => now()]);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Ticket routes
    Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index']);
        Route::get('/test', function () {
            return response()->json(['message' => 'Tickets API working', 'user' => auth()->user()]);
        });
        Route::post('/', [TicketController::class, 'store']);
        
        // Advanced ticket management (must be BEFORE /{ticket} routes)
        Route::get('/cancelled', [TicketController::class, 'cancelled']);
        Route::post('/cancelled/{id}/approve', [TicketController::class, 'approveCancellation']);
        Route::post('/cancelled/{id}/restore', [TicketController::class, 'restoreTicket']);
        Route::get('/merges', [TicketController::class, 'merges']);
        
        // Reports and analytics (must be BEFORE /{ticket} routes)
        Route::get('/reports', [TicketController::class, 'reports']);
        Route::get('/stats', [TicketController::class, 'stats']);
        Route::get('/export', [TicketController::class, 'export']);
        
        // Merge operations (must be BEFORE /{ticket} routes)
        Route::post('/merge', [TicketController::class, 'merge']);
        Route::post('/merge/{mergeId}/undo', [TicketController::class, 'undoMerge']);
        
        // Generic ticket routes (must be AFTER specific routes)
        Route::get('/{ticket}', [TicketController::class, 'show']);
        Route::patch('/{ticket}', [TicketController::class, 'update']);

        // Assignment routes
        Route::post('/{ticket}/assign/self', [TicketController::class, 'assignSelf']);
        Route::post('/{ticket}/assign', [TicketController::class, 'assign']);

        // Collaboration routes
        Route::post('/{ticket}/collaborators', [TicketController::class, 'addCollaborator']);
        Route::delete('/{ticket}/collaborators/{user}', [TicketController::class, 'removeCollaborator']);

        // Status management
        Route::post('/{ticket}/status', [TicketController::class, 'updateStatus']);

        // Comments
        Route::post('/{ticket}/comments', [TicketController::class, 'addComment']);

        // Cancellation
        Route::post('/{ticket}/cancel/irrelevant', [TicketController::class, 'cancelIrrelevant']);

        // Client operations
        Route::post('/{ticket}/client-delete', [TicketController::class, 'clientDelete']);
        Route::delete('/{ticket}/delete', [TicketController::class, 'deleteTicket']);

        // Workflow operations
        Route::post('/{ticket}/acquire', [TicketController::class, 'acquire']);
        Route::post('/{ticket}/progress', [TicketController::class, 'setInProgress']);
        Route::post('/{ticket}/pause', [TicketController::class, 'pause']);
        Route::post('/{ticket}/resume', [TicketController::class, 'resume']);
        Route::post('/{ticket}/resolve', [TicketController::class, 'resolve']);
        Route::post('/{ticket}/cancel', [TicketController::class, 'cancel']);
        Route::post('/{ticket}/close', [TicketController::class, 'close']);
        Route::post('/{ticket}/rate', [TicketController::class, 'rate']);
    });

    // Notification routes
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread', [NotificationController::class, 'unread']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/{notification}/accept', [NotificationController::class, 'acceptCollaborationRequest']);
        Route::post('/{notification}/reject', [NotificationController::class, 'rejectCollaborationRequest']);
    });

    // Template management
    Route::apiResource('ticket-templates', TicketTemplateController::class);
    
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    
    // Activity Log routes
    Route::prefix('activity-logs')->group(function () {
        Route::get('/', [ActivityLogController::class, 'index']);
        Route::get('/stats', [ActivityLogController::class, 'stats']);
        Route::get('/ticket/{ticketId}', [ActivityLogController::class, 'forTicket']);
        Route::get('/{activityLog}', [ActivityLogController::class, 'show']);
    });

    // User Management routes
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::post('/', [UserController::class, 'store']);
        Route::patch('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
        Route::patch('/{user}/status', [UserController::class, 'updateStatus']);
    });

    // Troubleshoot Documents routes
    Route::prefix('troubleshoot')->group(function () {
        Route::get('/', [TroubleshootController::class, 'index']);
        Route::post('/', [TroubleshootController::class, 'store']);
        Route::patch('/{document}', [TroubleshootController::class, 'update']);
        Route::delete('/{document}', [TroubleshootController::class, 'destroy']);
        Route::get('/{document}/download', [TroubleshootController::class, 'download'])->name('troubleshoot.download');
        Route::get('/{document}/view', [TroubleshootController::class, 'view'])->name('troubleshoot.view');
    });
});
