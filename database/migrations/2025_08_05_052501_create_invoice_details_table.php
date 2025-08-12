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
        Schema::create('invoice_details', function (Blueprint $table) {
            $table->bigIncrements("id_detail_invoice");
            $table->integer("quantity");
            $table->decimal("line_total");
            $table->unsignedBigInteger("invoice_id");
            $table->unsignedBigInteger("product_id");
            $table->foreign('invoice_id')->references('id_invoice')->on('invoices')->onDelete('cascade');
            $table->foreign('product_id')->references('id_product')->on('products')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_details');
    }
};
