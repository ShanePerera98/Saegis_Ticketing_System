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
        Schema::table('tickets', function (Blueprint $table) {
            if (!Schema::hasColumn('tickets', 'pause_reason')) {
                $table->text('pause_reason')->nullable()->after('description');
            }
            if (!Schema::hasColumn('tickets', 'resolution_note')) {
                $table->text('resolution_note')->nullable()->after('pause_reason');
            }
            if (!Schema::hasColumn('tickets', 'cancel_reason')) {
                $table->text('cancel_reason')->nullable()->after('resolution_note');
            }
            if (!Schema::hasColumn('tickets', 'close_reason')) {
                $table->text('close_reason')->nullable()->after('cancel_reason');
            }
            if (!Schema::hasColumn('tickets', 'resolved_at')) {
                $table->timestamp('resolved_at')->nullable()->after('close_reason');
            }
            if (!Schema::hasColumn('tickets', 'cancelled_at')) {
                $table->timestamp('cancelled_at')->nullable()->after('resolved_at');
            }
            if (!Schema::hasColumn('tickets', 'closed_at')) {
                $table->timestamp('closed_at')->nullable()->after('cancelled_at');
            }
            if (!Schema::hasColumn('tickets', 'expires_at')) {
                $table->timestamp('expires_at')->nullable()->after('deleted_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tickets', function (Blueprint $table) {
            $table->dropColumn([
                'pause_reason', 'resolution_note', 'cancel_reason', 'close_reason',
                'resolved_at', 'cancelled_at', 'closed_at', 'expires_at'
            ]);
        });
    }
};
