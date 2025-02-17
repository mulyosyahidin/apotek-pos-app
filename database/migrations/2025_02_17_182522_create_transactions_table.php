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
        Schema::create('transactions', function (Blueprint $table) {
            $table->increments('id');
            $table->foreignIdFor(\App\Models\User::class)->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->dateTime('date');
            $table->string('customer_name', 32)->nullable();
            $table->string('customer_phone_number', 16)->nullable();
            $table->decimal('total_price', 15, 2);
            $table->smallInteger('total_items');
            $table->enum('payment_type', \App\Enums\TransactionPaymentType::values())->default(\App\Enums\TransactionPaymentType::PAID_OFF);
            $table->enum('customer_type', \App\Enums\TransactionCustomerType::values())->default(\App\Enums\TransactionCustomerType::GENERAL);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
