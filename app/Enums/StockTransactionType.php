<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum StockTransactionType: string {
    use EnumToArray;

    case SALE = 'sale';
    case STOCK_UPDATE = 'stock-update';
    case PRODUCT_CREATION = 'product-creation';
}
