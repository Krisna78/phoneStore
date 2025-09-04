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
        Schema::create('invoices', function (Blueprint $table) {
            $table->bigIncrements('id_invoice')->primary();
            $table->date("invoice_date");
            $table->enum('status',['Menunggu Pembayaran',"Batal","Pending","Sudah dibayar","Expired"]);
            $table->string("checkout_link");
            $table->uuid('external_id')->unique();
            $table->integer('payment_amount');
            $table->date("payment_date");
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id_user')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
