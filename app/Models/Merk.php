<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Merk extends Model
{
    protected $table = 'merks';
    protected $primaryKey = 'id_merk';
    protected $fillable = [
        'merk_name',
    ];
    public function product(): HasMany {
        return $this->hasMany(Product::class,'id_product');
    }
}
