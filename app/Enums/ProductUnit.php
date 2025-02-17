<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ProductUnit: string
{
    use EnumToArray;

    case BALL = 'Ball';
    case BOTOL = 'Botol';
    case BOX = 'Box';
    case BUAH = 'Buah';
    case BUNGKUS = 'Bungkus';
    case CUP = 'Cup';
    case FLS = 'Fls';
    case GALON = 'Galon';
    case KG = 'Kg';
    case KIT = 'Kit';
    case KOTAK = 'Kotak';
    case LEMBAR = 'Lembar';
    case LITER = 'Liter';
    case LUSIN = 'Lusin';
    case PACK = 'Pack';
    case PCS = 'PCS';
    case POT = 'Pot';
    case PSG = 'Psg';
    case RIM = 'Rim';
    case ROLL = 'Roll';
    case SACK = 'Sack';
    case SET = 'Set';
    case TABUNG = 'Tabung';
    case TUBE = 'Tube';
    case VIAL = 'Vial';
    case TABLET = 'Tablet';
    case AMPUL = 'Ampul';
    case KOLF = 'Kolf';
    case SYRINGE = 'Syringe';
    case PEN = 'Pen';
    case BLISTER = 'Blister';
    case SACHET = 'Sachet';
    case STP = 'Stp';
    case STR = 'Str';
}
