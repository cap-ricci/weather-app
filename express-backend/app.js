const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

const fetch   = require('node-fetch');

const sitename = 'https://github.com/cap-ricci/weather-app/0.1';
// const headers = new Headers({
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//     'User-Agent': sitename,
// });
const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=46.44&lon=1.61`;

const corsOptions = {
    origin: 'http://localhost:8080',
  }

app.get('/', cors(corsOptions), function (req, res) { 
    res.json({ msg: 'WHOAH with CORS it works! 🔝 🎉' })   
    // fetch(url, {
    //     method: 'GET',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //         'User-Agent': sitename,
    //     },
    //   })
    // .then(res => res.json())
    // .then(data => {
    //     res.send({ data });
    // })
    // .catch(err => {
    //     res.send(err);
    // });
    // return res.send('GET HTTP method test');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})