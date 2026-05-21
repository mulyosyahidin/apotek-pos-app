<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'date',
        'customer_name',
        'customer_phone_number',
        'total_price',
        'total_items',
        'payment_type',
        'customer_type',
    ];

    /**
     * Get the cashier that owns the Transaction
     */
    public function cashier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get all the items for the Transaction
     */
    public function items(): HasMany
    {
        return $this->hasMany(Transaction_item::class);
    }
}
