<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ProductGroupStatus: string
{
    use EnumToArray;

    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
}
