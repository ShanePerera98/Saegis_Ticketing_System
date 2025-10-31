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
        Schema::create('ticket_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // recipient
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // who sent the notification
            $table->enum('type', ['collaboration_request', 'ticket_assigned', 'status_changed', 'comment_added']);
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // additional data for the notification
            $table->timestamp('read_at')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();

            $table->index(['user_id', 'read_at']);
            $table->index(['ticket_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_notifications');
    }
};
