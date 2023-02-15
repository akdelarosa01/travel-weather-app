<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cities = [
            [
                'country_code' => 'JP',
                'country' => 'Japan',
                'city' => 'Tokyo'
            ],
            [
                'country_code' => 'JP',
                'country' => 'Japan',
                'city' => 'Yokohama'
            ],
            [
                'country_code' => 'JP',
                'country' => 'Japan',
                'city' => 'Kyoto'
            ],
            [
                'country_code' => 'JP',
                'country' => 'Japan',
                'city' => 'Osaka'
            ],
            [
                'country_code' => 'JP',
                'country' => 'Japan',
                'city' => 'Sapporo'
            ],
            [
                'country_code' => 'JP',
                'country' => 'Japan',
                'city' => 'Nagoya'
            ],
        ];

        foreach ($cities as $key => $city) {
            City::create($city);
        }
        
    }
}
