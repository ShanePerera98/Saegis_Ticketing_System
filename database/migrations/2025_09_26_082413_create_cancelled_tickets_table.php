<?php

use App\Enums\CancelledTicketType;
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
            $table->foreignId('ticket_id')->unique()->constrained('tickets')->onDelete('cascade');
            $table->text('reason_text')->nullable();
            $table->foreignId('cancelled_by')->constrained('users')->onDelete('cascade');
            $table->timestamp('cancelled_at');
            $table->enum('type', CancelledTicketType::values());
            $table->timestamp('auto_delete_after');
            $table->timestamp('approved_deleted_at')->nullable();
            $table->foreignId('approved_deleted_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
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
