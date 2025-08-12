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
        Schema::create('cart_items', function (Blueprint $table) {
            $table->bigIncrements("id_card_item")->primary();
            $table->integer("quantity");
            $table->integer("price");
            $table->integer("subtotal");
            $table->unsignedBigInteger("product_id");
            $table->unsignedBigInteger("cart_id");
            $table->foreign("product_id")->references("id_product")->on("products")->onDelete("cascade");
            $table->foreign("cart_id")->references("id_cart")->on("carts")->onDelete("cascade");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cart_items');
    }
};
