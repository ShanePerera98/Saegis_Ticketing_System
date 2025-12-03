<?php

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
        // Update existing URGENT priority values to CRITICAL in tickets table
        DB::table('tickets')
            ->where('priority', 'URGENT')
            ->update(['priority' => 'CRITICAL']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert CRITICAL priority values back to URGENT in tickets table
        DB::table('tickets')
            ->where('priority', 'CRITICAL')
            ->update(['priority' => 'URGENT']);
    }
};
