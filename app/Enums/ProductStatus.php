<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ProductStatus: string
{
    use EnumToArray;

    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}
