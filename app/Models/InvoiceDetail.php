<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvoiceDetail extends Model
{
    protected $fillable = [
        'quantity',
        'line_total',
        'invoice_id',
        'product_id',
    ];
    public function invoice(): BelongsTo {
        return $this->belongsTo(Invoice::class,'id_invoice');
    }
    public function product(): BelongsTo {
        return $this->belongsTo(Product::class,'id_product');
    }
}
