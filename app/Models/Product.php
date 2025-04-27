<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'supplier_id',
        'product_group_id',
        'batch_number',
        'pbf_number',
        'barcode_content',
        'name',
        'stock',
        'unit',
        'type',
        'expire_date',
        'status',
        'purchase_price',
        'general_sell_price',
        'medical_sell_price',
    ];

    /**
     * Get the supplier that owns the Product
     *
     * @return BelongsTo
     */
    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /**
     * Get the product group that owns the Product
     *
     * @return BelongsTo
     */
    public function productGroup(): BelongsTo
    {
        return $this->belongsTo(Product_group::class);
    }

    /**
     * Get all of the stock histories for the Product
     *
     * @return HasMany
     */
    public function stockHistories(): HasMany
    {
        return $this->hasMany(Product_stock_history::class);
    }
}
