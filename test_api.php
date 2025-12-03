<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Testing API endpoint simulation...\n";

try {
    // Create a user for testing
    $user = \App\Models\User::first();
    if (!$user) {
        echo "❌ No users found in database\n";
        exit(1);
    }
    
    echo "✅ Found user: {$user->name} (ID: {$user->id})\n";
    
    // Simulate the API controller logic
    echo "\nTesting TicketController logic...\n";
    
    $query = \App\Models\Ticket::with(['category', 'client', 'currentAssignee', 'creator']);
    
    // If user is client, filter tickets
    if ($user->role === 'Client') {
        $query = $query->where('client_id', $user->id);
    }
    
    // Add status filter (simulate status=NEW)
    $query = $query->where('status', 'NEW');
    
    echo "✅ Query built successfully\n";
    
    // Test pagination (this is where the error occurs)
    echo "Testing pagination...\n";
    $tickets = $query->orderBy('created_at', 'desc')->paginate(15);
    echo "✅ Pagination successful - " . $tickets->count() . " tickets\n";
    
    // Test JSON serialization (this is where the API error happens)
    echo "Testing JSON response...\n";
    $response = response()->json($tickets);
    echo "✅ JSON response created successfully\n";
    
    // Test the actual JSON output
    echo "Testing JSON string conversion...\n";
    $jsonString = $tickets->toJson();
    echo "✅ JSON string conversion successful\n";
    
    echo "\n🎉 All tests passed - API should work!\n";
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    
    // If it's an enum error, let's find the problematic ticket
    if (strpos($e->getMessage(), 'not a valid backing value for enum') !== false) {
        echo "\n🔍 Searching for tickets with invalid enum values...\n";
        
        // Check for empty priorities again
        $emptyPriorities = \DB::select('SELECT id, ticket_number, priority, status FROM tickets WHERE priority = "" OR priority IS NULL OR status = "" OR status IS NULL');
        
        if (count($emptyPriorities) > 0) {
            echo "Found tickets with empty enum values:\n";
            foreach ($emptyPriorities as $ticket) {
                echo "  - ID: {$ticket->id}, Number: {$ticket->ticket_number}, Priority: '{$ticket->priority}', Status: '{$ticket->status}'\n";
            }
        } else {
            echo "No empty enum values found\n";
        }
        
        // Check for invalid enum values
        $allTickets = \DB::select('SELECT DISTINCT priority, status FROM tickets');
        $validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        $validStatuses = ['NEW', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'CLOSED'];
        
        echo "\nChecking for invalid enum values...\n";
        foreach ($allTickets as $ticket) {
            if (!in_array($ticket->priority, $validPriorities)) {
                echo "  - Invalid priority: '{$ticket->priority}'\n";
            }
            if (!in_array($ticket->status, $validStatuses)) {
                echo "  - Invalid status: '{$ticket->status}'\n";
            }
        }
    }
}
