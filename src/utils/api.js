const request = require('postman-request');

const getCurrentWeather = (latitude, longitude, callback) => {
    const url = `http://api.weatherstack.com/current?access_key=3cbe9a9b8596464fc85a72b00736b9a6&query=${longitude},${latitude}`;
    request({url, json: true}, (error, response) => {
       // console.log(response.body.location);
        if (error) {
            callback('Not able to get Weather server');
        } else if (response.body.error) {
            callback('wrong request, please check variables');
        } else {
            console.log('Weather response: ', response.body.current);
            const {temperature, feelslike, weather_descriptions} = response.body.current;
            callback(undefined, {temperature, feelslike, weather_descriptions});
        }
    });
};

const getGeocoding = (place, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?limit=1&access_token=pk.eyJ1IjoidXJpZWxnIiwiYSI6ImNrZHg2enRvdDJ5Y3kycXRhMzIwY2E5YjEifQ.cLRZVDZ_GPNzY7y6ullmbw`;
    request({url, json: true}, (error, response) => {
        if (error) {
            callback('Not able to get Geo server');
        } else if (response.body.error || response.body.features.length === 0) {
            callback('Not able to get place: ' + place);
        } else {
            const [latitude, longitude] = response.body.features[0].center;
            callback(undefined, {latitude, longitude, location: response.body.features[0].place_name})
        }
    });
};

module.exports = {
    getCurrentWeather,
    getGeocoding,
};