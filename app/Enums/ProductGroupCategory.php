<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ProductGroupCategory: string
{
    use EnumToArray;

    case OBAT = 'obat';
    case BHP = 'bhp';
}
