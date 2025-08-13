<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $primaryKey = 'id_cart';
    protected $fillable = [
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'cart_id', 'id_cart');
    }
}
