<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_ref', 32)->unique();
            $table->string('customer_name', 120);
            $table->string('customer_phone', 20);
            $table->string('customer_email', 150);
            $table->text('delivery_address');
            $table->text('notes')->nullable();
            $table->json('items_json');
            $table->unsignedInteger('total_bottles')->default(1);
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['pending', 'confirmed', 'dispatched', 'delivered', 'cancelled'])->default('pending');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index('order_ref');
            $table->index('status');
            $table->index('customer_phone');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
