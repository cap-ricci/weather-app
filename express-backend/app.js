const express = require('express')
const fetch   = require('node-fetch');
var cors = require('cors')
const app = express()

const port = 3000
const sitename = 'https://github.com/cap-ricci/weather-app/0.1';
const corsOptions = {
    origin: 'http://localhost:8080',
  }

app.use(cors(corsOptions))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/data', function (req, res) { 
  return res.send('Received a GET HTTP method');   
  
});

app.post('/data', function (req, res) {
  const coord = {
    lat : req.body.lat,
    lon : req.body.lon
  }
  const url = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat='+coord.lat+'&lon='+coord.lon;
  fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': sitename,
        },
      })
    .then(res => {
      console.log(res.headers)
      res.json()
    })
    .then(json => res.send(json))
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})