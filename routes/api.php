<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\TicketTemplateController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ActivityLogController;
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
    });

    // Template management
    Route::apiResource('ticket-templates', TicketTemplateController::class);
    
    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    
    // Activity logs
    Route::prefix('activity-logs')->group(function () {
        Route::get('/', [ActivityLogController::class, 'index']);
        Route::get('/stats', [ActivityLogController::class, 'stats']);
        Route::get('/ticket/{ticketId}', [ActivityLogController::class, 'forTicket']);
        Route::get('/{activityLog}', [ActivityLogController::class, 'show']);
    });
});
