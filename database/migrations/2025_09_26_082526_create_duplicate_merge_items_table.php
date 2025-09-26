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
        Schema::create('duplicate_merge_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merge_id')->constrained('duplicate_merges')->onDelete('cascade');
            $table->foreignId('child_ticket_id')->constrained('tickets')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['merge_id', 'child_ticket_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('duplicate_merge_items');
    }
};
