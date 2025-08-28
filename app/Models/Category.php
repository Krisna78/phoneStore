<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'id_category';
    protected $fillable = [
        'category_name',
        'image',
    ];
    public function product(): HasMany {
        return $this->hasMany(Product::class,'category_id', 'id_category');
    }
}
