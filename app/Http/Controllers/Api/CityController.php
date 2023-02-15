<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CityRequest;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $cities = City::select('id','city','country_code', 'country')->get();
        $API_KEY = "e2339fed1bfabc24356e6c5ca5e2a4b9";
        $weatherObj = [];

        foreach ($cities as $key => $city) {
            $link = "https://api.openweathermap.org/data/2.5/weather?q={$city->city},{$city->country_code}&appid={$API_KEY}&units=metric";
            $response = Http::get($link);

            $weath = $response->json();

            array_push($weatherObj,[
                'id' => $city->id,
                'country' => $city->country,
                'country_code' => $city->country_code,
                'city' => $city->city,
                'weather_main' => $weath['weather'][0]['main'],
                'weather_description' => $weath['weather'][0]['description'],
                'weather_icon' => $weath['weather'][0]['icon'],
                'temp' => $weath['main']['temp'],
                'temp_min' => $weath['main']['temp_min'],
                'temp_max' => $weath['main']['temp_max'],
                'humidity' => $weath['main']['humidity'],
                'sunrise' => $weath['sys']['sunrise'],
                'sunset' => $weath['sys']['sunset'],
                'lon' => $weath['coord']['lon'],
                'lat' => $weath['coord']['lat']
            ]);
        }

        return response($weatherObj);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CityRequest $request)
    {
        try {
            $city = new City();
            $city->country = $request->country;
            $city->country_code = $request->country_code;
            $city->city = $request->city;

            if ($city->save()) {
                return response([
                    'message' => "{$city->city} was successfully added.",
                    'status' => "success",
                    'data' => $this->index()
                ]);
            }
        } catch (\Throwable $th) {
            return response([
                'message' => $th->getMessage(),
                'status' => "error",
                'data' => []
            ]);
        }

        return response([
            'message' => "Adding city was not successful.",
            'status' => "warning",
            'data' => $this->index()
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $city
     * @return \Illuminate\Http\Response
     */
    public function show($city = null,$interest = null)
    {
        try {
            $query = "";

            if (isset($interest)) {
                $query = "&query={$interest}";
            }
            $response = Http::withHeaders([
                'Authorization' => 'fsq3lAJ4G2hvAqsnYT/1UB43VttXcLZaO10050ZspBFD99Y=',
                'accept' => 'application/json',
            ])->get("https://api.foursquare.com/v3/places/search?near={$city}{$query}");

            return $response->json();

        } catch (\Throwable $th) {
            return response([
                'message' => $th->getMessage(),
                'status' => 'error'
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $city = City::find($id);
            if ($city->delete()) {
                return $this->index();
            }
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
