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
        'expire_date',
        'payment_amount',
        'user_id',
    ];
    protected $casts = [
        'invoice_date' => 'datetime',
        'created_at'   => 'datetime',
        'updated_at'   => 'datetime',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id_user');
    }
    public function invoiceDetail(): HasMany
    {
        return $this->hasMany(InvoiceDetail::class, 'invoice_id', 'id_invoice');
    }
}
