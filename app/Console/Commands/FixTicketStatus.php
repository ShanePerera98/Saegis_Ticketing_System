<?php

namespace App\Console\Commands;

use App\Enums\TicketStatus;
use App\Models\Ticket;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixTicketStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tickets:fix-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix tickets with empty or invalid status values';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for tickets with invalid status values...');
        
        // Get tickets with empty or null status using raw SQL to avoid enum casting issues
        $invalidTickets = DB::table('tickets')
            ->where(function($query) {
                $query->whereNull('status')
                      ->orWhere('status', '')
                      ->orWhere('status', 'LIKE', '%NULL%');
            })
            ->get();

        $this->info("Found {$invalidTickets->count()} tickets with invalid status values");

        if ($invalidTickets->count() > 0) {
            foreach ($invalidTickets as $ticket) {
                $this->info("Fixing ticket ID: {$ticket->id} - Current status: [{$ticket->status}]");
                
                // Update to NEW status as default
                DB::table('tickets')
                    ->where('id', $ticket->id)
                    ->update(['status' => TicketStatus::NEW->value]);
                
                $this->info("Updated ticket ID: {$ticket->id} to status: NEW");
            }
            
            $this->info('All tickets have been fixed!');
        } else {
            $this->info('No tickets with invalid status found.');
        }
        
        // Verify the fix
        $this->info('Verifying fix...');
        $remainingInvalid = DB::table('tickets')
            ->where(function($query) {
                $query->whereNull('status')
                      ->orWhere('status', '');
            })
            ->count();
            
        if ($remainingInvalid == 0) {
            $this->info('✅ All tickets now have valid status values!');
        } else {
            $this->error("❌ Still have {$remainingInvalid} tickets with invalid status");
        }
        
        return 0;
    }
}
