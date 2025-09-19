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
            $table->bigIncrements('id_product')->primary();
            $table->string('name');
            $table->longText('description');
            $table->bigInteger(column: "price"); 
            $table->string("image")->default("image");
            $table->unsignedBigInteger('merk_id');
            $table->unsignedBigInteger('category_id');
            $table->foreign("merk_id")->references("id_merk")->on('merks')->onDelete('cascade');
            $table->foreign("category_id")->references("id_category")->on('categories')->onDelete('cascade');
            $table->timestamps();
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
