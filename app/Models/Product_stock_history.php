<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product_stock_history extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'product_id',
        'transaction_type',
        'action_id',
        'stock_before',
        'stock_after',
        'stock_change',
        'description',
    ];

    /**
     * Get the user that owns the product stock history.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
