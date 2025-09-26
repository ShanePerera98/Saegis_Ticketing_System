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
        Schema::create('deleted_tickets_log', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ticket_id'); // Don't use FK as ticket might be hard deleted
            $table->string('ticket_number');
            $table->string('title');
            $table->foreignId('client_id')->constrained('users');
            $table->timestamp('deleted_at');
            $table->text('reason')->nullable();
            $table->json('ticket_data'); // Store full ticket snapshot
            $table->timestamps();

            $table->index(['client_id', 'deleted_at']);
            $table->index('ticket_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deleted_tickets_log');
    }
};
