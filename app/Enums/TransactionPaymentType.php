<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum TransactionPaymentType: string
{
    use EnumToArray;

    case PAID_OFF = 'paid-off';
    case DEBT = 'debt';
}
