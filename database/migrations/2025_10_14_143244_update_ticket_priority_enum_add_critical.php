<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the priority enum to include CRITICAL and remove URGENT
        DB::statement("ALTER TABLE tickets MODIFY COLUMN priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL DEFAULT 'MEDIUM'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to the old enum values
        DB::statement("ALTER TABLE tickets MODIFY COLUMN priority ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') NOT NULL DEFAULT 'MEDIUM'");
    }
};
