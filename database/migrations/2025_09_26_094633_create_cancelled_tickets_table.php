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
        Schema::create('cancelled_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->unique()->constrained()->cascadeOnDelete();
            $table->text('reason_text');
            $table->foreignId('cancelled_by')->constrained('users');
            $table->timestamp('cancelled_at');
            $table->enum('type', ['IRRELEVANT', 'DUPLICATE']);
            $table->timestamp('auto_delete_after');
            $table->timestamp('approved_deleted_at')->nullable();
            $table->foreignId('approved_deleted_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index(['type', 'auto_delete_after']);
            $table->index('cancelled_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cancelled_tickets');
    }
};
