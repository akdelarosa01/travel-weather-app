## About Travel-Weather-App

Travel-Weather-App is a web application that can help travelers to search their interest within each cities they may look in to. Also, it can indicate current weather in every city in the world. They can search for:

- Food or Restaurants in the city.
- Coffee Shops.
- Shopping Malls and other retail stores.
- etc.

## Learning Travel Weather App

Travel-Weather-App was built using Laravel 8 and ReactJS which uses OpenWeatherMap API, Foursquare API, OpenLayer Map API, and Chakra UI for the frontend design.

## Installation
First clone the repository, command:
``
git clone https://github.com/akdelarosa01/travel-weather-app.git
``
Navigate to project folder and then install Composer and NPM
``
cd travel-weather-app
composer install
npm install
``
Prepare or create your database then migrate the cities table and seed pre-saved data.
``
php artisan migrate
php artisan db:seed --class=CitySeeder
``
Navigate to react folder then install NPM to setup the frontend codes.
``
cd react
npm install
``
Create copy of .env.example file as .env file for both in folders /travel-weather-app and /react.

Finally, run the application. To run navigate to react folder then do this command:
``
npm run dev
``
