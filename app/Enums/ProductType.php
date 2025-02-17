<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ProductType: string
{
    use EnumToArray;

    case OBAT = 'obat';
    case BHP = 'bhp';
}
