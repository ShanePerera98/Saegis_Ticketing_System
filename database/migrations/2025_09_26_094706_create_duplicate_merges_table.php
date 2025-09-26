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
        Schema::create('duplicate_merges', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_ticket_id')->constrained('tickets')->cascadeOnDelete();
            $table->foreignId('merged_by')->constrained('users');
            $table->timestamp('merged_at');
            $table->timestamp('undone_at')->nullable();
            $table->foreignId('undone_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index('merged_at');
            $table->index(['parent_ticket_id', 'undone_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('duplicate_merges');
    }
};
