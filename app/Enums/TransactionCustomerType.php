<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum TransactionCustomerType: string
{
    use EnumToArray;

    case GENERAL = 'general';
    case MEDICAL = 'medical';
}
