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
        Schema::table('ticket_collaborators', function (Blueprint $table) {
            $table->timestamp('joined_at')->nullable()->after('added_by');
            $table->timestamp('left_at')->nullable()->after('joined_at');
            $table->enum('status', ['pending', 'accepted', 'left'])->default('pending')->after('left_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ticket_collaborators', function (Blueprint $table) {
            $table->dropColumn(['joined_at', 'left_at', 'status']);
        });
    }
};
