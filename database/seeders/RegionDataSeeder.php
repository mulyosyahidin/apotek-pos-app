<?php

namespace Database\Seeders;

use Exception;
use Illuminate\Database\Seeder;

class RegionDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @throws Exception
     */
    public function run(): void
    {
        \DB::beginTransaction();

        try {
            $provinces = json_decode(file_get_contents(database_path('seeders/data/provinces.json')), true);
            foreach ($provinces as $provinceData) {
                if (\App\Models\Province::query()->where('id', $provinceData['id'])->exists()) {
                    continue;
                }

                \App\Models\Province::forceCreate([
                    'id' => $provinceData['id'],
                    'name' => $provinceData['name'],
                ]);
            }

            $regencies = json_decode(file_get_contents(database_path('seeders/data/regencies.json')), true);
            foreach ($regencies as $regencyData) {
                if (\App\Models\Regency::query()->where('id', $regencyData['id'])->exists()) {
                    continue;
                }

                \App\Models\Regency::forceCreate([
                    'id' => $regencyData['id'],
                    'province_id' => $regencyData['province_id'],
                    'name' => $regencyData['name'],
                ]);
            }

            \DB::commit();
        } catch (Exception $e) {
            \DB::rollBack();

            throw $e;
        }
    }
}
