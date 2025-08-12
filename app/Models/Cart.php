<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'id_cart');
    }
}
