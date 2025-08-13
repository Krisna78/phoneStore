<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    protected $primaryKey = 'id_cart_item';
    protected $table = 'cart_items';
    protected $keyType = 'int';
    protected $fillable = [
        'price',
        'subtotal',
        'quantity',
        'product_id',
        'cart_id',
    ];
    public function cart()
    {
        return $this->belongsTo(Cart::class,'cart_id','id_cart');
    }
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id_product');
    }
}
