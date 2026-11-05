<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->string('customer_name', 100);
            $table->string('customer_email', 150);
            $table->string('flavor_key', 50);
            $table->unsignedTinyInteger('rating')->default(5);
            $table->string('headline', 200);
            $table->text('review_text');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('moderated_at')->nullable();
            $table->string('moderated_by', 100)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index('flavor_key');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
