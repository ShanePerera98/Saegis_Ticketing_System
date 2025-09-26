<?php

use App\Enums\TicketStatus;
use App\Enums\TicketPriority;
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
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('title');
            $table->text('description');
            $table->enum('status', TicketStatus::values())->default(TicketStatus::NEW->value);
            $table->enum('priority', TicketPriority::values())->default(TicketPriority::MEDIUM->value);
            $table->foreignId('category_id')->nullable()->constrained('ticket_categories')->onDelete('set null');
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('current_assignee_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('template_id')->nullable()->constrained('ticket_templates')->onDelete('set null');
            $table->softDeletes();
            $table->timestamps();

            $table->index(['status', 'priority', 'created_at']);
            $table->index(['client_id', 'status']);
            $table->index(['current_assignee_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
