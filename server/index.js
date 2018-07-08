const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const osmosis = require('osmosis');
const request = require('superagent');
const cors = require('cors');
const fs = require('fs');

app.use(cors())

// respond with "hello world" when a GET request is made to the homepage
app.get('/hello', function (req, res) {
    res.send('hello world')
})

app.get('/lastupdated', function(req, res) {
    osmosis.get("https://www.stellarbeat.io/")
    .find('div.statcard-info')
    .set({
        'info': 'h2.statcard-number'
    })
    .data(data => {
        console.log(JSON.stringify(data))
        return res.json({'updated': data.info});
    })
});

// respond with "hello world" when a GET request is made to the homepage
app.get('/nodes', function (req, res) {
    let data = {};
    data.text = fs.readFileSync("data.json");

    // request
    //     .get("https://www.stellarbeat.io/nodes/raw")
    //     .end((err, data) => {
    //         if (err) {
    //             return res.json([]);
    //         }
            const body = JSON.parse(data.text);
            const markerMap = {};
            const markers = body.map((marker) => {
                marker.coordinates = [ parseFloat(marker.longitude), parseFloat(marker.latitude) ]
                markerMap[marker.publicKey] = marker;
                return marker;
            });

            // Do something
            console.log('returning ' + markers.length + " markers")
            return res.json(markerMap)
        // });
})

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.listen(PORT, () => console.log(`Stellar world app listening on port ${PORT}!`))