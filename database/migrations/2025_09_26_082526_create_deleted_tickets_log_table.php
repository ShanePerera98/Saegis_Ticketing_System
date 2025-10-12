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
            $table->unsignedBigInteger('ticket_id'); // Not foreign key since ticket might be deleted
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('deleted_at')->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->index(['client_id', 'deleted_at']);
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
