<?php

namespace App\Traits;

/**
 * Trait EnumToArray
 *
 * Trait ini menyediakan metode bantu untuk mendapatkan daftar nama, nilai,
 * dan kombinasi nama-nilai dari sebuah Enum dalam bentuk array.
 */
trait EnumToArray
{
    /**
     * Mengembalikan daftar nama dari semua kasus dalam Enum.
     *
     * @return array Array berisi nama dari setiap kasus dalam Enum.
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    /**
     * Mengembalikan daftar nilai dari semua kasus dalam Enum.
     *
     * @return array Array berisi nilai dari setiap kasus dalam Enum.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Mengembalikan array asosiatif yang berisi nilai sebagai key dan nama sebagai value.
     *
     * @return array Array asosiatif dengan format [nilai => nama].
     */
    public static function array(): array
    {
        return array_combine(self::values(), self::names());
    }
}
