<?php

use App\Enums\TemplateFieldType;
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
        Schema::create('ticket_template_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('template_id')->constrained('ticket_templates')->onDelete('cascade');
            $table->string('key');
            $table->string('label');
            $table->enum('type', TemplateFieldType::values());
            $table->boolean('required')->default(false);
            $table->json('options')->nullable();
            $table->json('validation')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_template_fields');
    }
};
