<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum SupplierStatus: string
{
    use EnumToArray;

    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}
