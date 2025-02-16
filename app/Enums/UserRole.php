<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum UserRole: string
{
    use EnumToArray;

    case ADMIN = 'admin';
    case CASHIER = 'cashier';
}
