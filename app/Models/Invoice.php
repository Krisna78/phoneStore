<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $table = 'invoices';
    protected $primaryKey = 'id_invoice';
    protected $fillable = [
        'invoice_date',
        'status',
        'checkout_link',
        'external_id',
        'payment_date',
        'payment_amount',
        'user_id',
    ];
    public function user(): BelongsTo {
        return $this->belongsTo(User::class,'id_user');
    }
    public function invoiceDetail(): HasMany {
        return $this->hasMany(InvoiceDetail::class,'id_detail_invoice');
    }
}
