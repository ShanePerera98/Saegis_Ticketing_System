<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing ticket loading...\n";

try {
    // Test 1: Simple count
    $count = \App\Models\Ticket::count();
    echo "✅ Total tickets: $count\n";
    
    // Test 2: Load first 5 tickets
    $tickets = \App\Models\Ticket::take(5)->get();
    echo "✅ Loaded " . $tickets->count() . " tickets\n";
    
    foreach ($tickets as $ticket) {
        echo "  - {$ticket->ticket_number} | {$ticket->priority->value} | {$ticket->status->value}\n";
    }
    
    // Test 3: Test pagination (what the API uses)
    echo "\nTesting pagination...\n";
    $paginated = \App\Models\Ticket::orderBy('created_at', 'desc')->paginate(15);
    echo "✅ Paginated tickets: " . $paginated->count() . "\n";
    
    // Test 4: Test JSON serialization (what causes the API error)
    echo "\nTesting JSON serialization...\n";
    $json = $paginated->toJson();
    echo "✅ JSON serialization successful\n";
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
