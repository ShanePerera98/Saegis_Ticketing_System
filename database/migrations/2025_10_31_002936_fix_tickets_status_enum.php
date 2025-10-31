<?php

use App\Enums\TicketStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, update any invalid status values to NEW
        DB::table('tickets')
            ->whereNotIn('status', TicketStatus::values())
            ->orWhere('status', '')
            ->orWhereNull('status')
            ->update(['status' => TicketStatus::NEW->value]);

        // Alter the enum column to include all current TicketStatus values
        $enumValues = implode(',', array_map(fn($value) => "'$value'", TicketStatus::values()));
        
        DB::statement("ALTER TABLE tickets MODIFY COLUMN status ENUM($enumValues) NOT NULL DEFAULT 'NEW'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to the original enum values (this might cause data loss)
        $originalValues = "'NEW','IN_PROGRESS','ON_HOLD','RESOLVED','CLOSED','CANCELLED_IRRELEVANT','CANCELLED_DUPLICATE'";
        DB::statement("ALTER TABLE tickets MODIFY COLUMN status ENUM($originalValues) NOT NULL DEFAULT 'NEW'");
    }
};
