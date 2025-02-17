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
        Schema::create('products', function (Blueprint $table) {
            $table->smallIncrements('id');
            $table->unsignedSmallInteger('supplier_id')->nullable();
            $table->unsignedSmallInteger('product_group_id')->nullable();
            $table->string('batch_number', 32)->nullable();
            $table->string('pbf_number', 64)->nullable();
            $table->string('barcode_content', 64)->nullable();
            $table->string('name', 64)->nullable();
            $table->unsignedSmallInteger('stock')->default(0);
            $table->enum('unit', \App\Enums\ProductUnit::values());
            $table->enum('type', \App\Enums\ProductType::values())->nullable();
            $table->date('expire_date')->nullable();
            $table->enum('status', \App\Enums\ProductStatus::values())->default(\App\Enums\ProductStatus::ACTIVE);
            $table->decimal('purchase_price', 15, 2)->default(0);
            $table->decimal('general_sell_price', 15, 2)->default(0);
            $table->decimal('medical_sell_price', 15, 2)->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('supplier_id')->references('id')->on('suppliers')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreign('product_group_id')->references('id')->on('product_groups')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
