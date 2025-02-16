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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->string('name', 96);
            $table->string('address')->nullable();
            $table->unsignedTinyInteger('province_id')->nullable();
            $table->unsignedSmallInteger('regency_id')->nullable();
            $table->string('phone_number', 16)->nullable();
            $table->string('email', 96)->unique()->nullable();
            $table->enum('status', \App\Enums\SupplierStatus::values())->default(\App\Enums\SupplierStatus::ACTIVE->value);

            $table->foreign('province_id')->references('id')->on('provinces')->nullOnDelete()->cascadeOnUpdate();
            $table->foreign('regency_id')->references('id')->on('regencies')->nullOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
