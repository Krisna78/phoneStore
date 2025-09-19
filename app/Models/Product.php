<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Product extends Model
{
    protected $primaryKey = "id_product";
    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'merk_id',
        'category_id',
    ];
    public function merk(): BelongsTo
    {
        return $this->belongsTo(Merk::class, 'merk_id', 'id_merk');
    }
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id_category');
    }
    public function invoiceDetail()
    {
        return $this->hasMany(InvoiceDetail::class, 'product_id', 'id_product');
    }
    public function cartItems()
    {
        return $this->hasMany(CartItem::class, 'product_id', 'id_product');
    }
}
