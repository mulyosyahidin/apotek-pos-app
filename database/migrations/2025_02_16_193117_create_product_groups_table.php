<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_groups', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name', 64);
            $table->enum('category', \App\Enums\ProductGroupCategory::values())->nullable();
            $table->enum('status', \App\Enums\ProductGroupStatus::values())->default(\App\Enums\ProductGroupStatus::ACTIVE);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_groups');
    }
};
