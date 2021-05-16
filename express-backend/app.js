const express = require('express')
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

app.get('/', function (req, res) {    
    fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': sitename,
        },
      })
    .then(res => res.json())
    .then(data => {
        res.send({ data });
    })
    .catch(err => {
        res.send(err);
    });
});

// const server = app.listen(port, function () {
//     const host = server.address().address
//     const port = server.address().port
   
//     console.log("Example app listening at http://%s:%s", host, port)
// });
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})