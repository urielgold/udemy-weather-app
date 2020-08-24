const path = require('path');
const express = require('express');
const hbs = require('hbs');
const {getGeocoding, getCurrentWeather}  = require('./utils/api');

const publicDir = path.join(__dirname, '../public');
const ViewsDir = path.join(__dirname, '../templates/views');
const partialsDir = path.join(__dirname, '../templates/partials');

const app = express();
const name = 'Uriel';

// Setup handlebars engine and view directory
app.set('view engine', 'hbs');
app.set('views', ViewsDir);
hbs.registerPartials(partialsDir);

// Setting the directory of the static pages
app.use(express.static(publicDir));

app.get('', (req, res) => res.render('index', {
    title: 'My Weather Site',
    name,
}));

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name,
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name,
    });
});

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({error: 'You must provide an address'});
    }

    getGeocoding(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error});
        }

        getCurrentWeather(latitude, longitude, (weatherError, {temperature, feelslike, weather_descriptions = []} = {}) =>
            weatherError
                ? res.send({error: weatherError})
                : res.send({
                    forecast: weather_descriptions[0],
                    location,
                    temperature,
                    feelslike,
                })
        );
    });
});

app.get('/*', (_, res) => res.render('404', {title: '404'}));

app.listen(3000, () => console.log('Server is running on port 3000'));