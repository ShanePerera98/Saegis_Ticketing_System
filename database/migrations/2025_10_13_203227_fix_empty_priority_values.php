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
        // Update tickets with empty or null priority values to 'medium'
        DB::table('tickets')
            ->whereNull('priority')
            ->orWhere('priority', '')
            ->update(['priority' => 'medium']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // This migration cannot be safely reversed
        // as we don't know what the original empty values were
    }
};
