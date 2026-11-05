<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cms_contents', function (Blueprint $table) {
            $table->id();
            $table->string('field_key', 80)->unique();
            $table->text('field_value')->nullable();
            $table->string('field_group', 50)->default('general');
            $table->string('field_type', 30)->default('text');
            $table->timestamps();

            $table->index('field_key');
            $table->index('field_group');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cms_contents');
    }
};
