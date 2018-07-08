const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const osmosis = require('osmosis');
const moment = require('moment');
const request = require('superagent');
const cors = require('cors');
const fs = require('fs');

app.use(cors())

// respond with "hello world" when a GET request is made to the homepage
app.get('/hello', function (req, res) {
    res.send('hello world')
})

app.get('/lastupdated', function (req, res) {
    osmosis.get("https://www.stellarbeat.io/")
        .find('div.statcard-info')
        .set({
            'info': 'h2.statcard-number'
        })
        .data(data => {
            console.log(JSON.stringify(data))
            return res.status(200).json({ 'updated': data.info });
        })
        .error(err => {
            console.log('error parsing stellarbeat', err);
            return res.status(500).json({ 'error': JSON.stringify(err) });
        });
});

function sendNodeResponse(nodeDataString, res) {
    const body = JSON.parse(nodeDataString);
    const markerMap = {};
    const markers = body.map((marker) => {
        marker.coordinates = [parseFloat(marker.longitude), parseFloat(marker.latitude)]
        let loc = marker.city;
        const country = marker.country;
        if (country) {
          if (loc) {
            loc += ", " + country;
          } else {
            loc = country;
          }
        }
        marker.location = loc; 
        markerMap[marker.publicKey] = marker;
        return marker;
    });

    // Do something
    console.log('returning ' + markers.length + " markers")
    return res.status(200).json(markerMap)
}

function getTodaysFile() {
    const d = new Date();
    const dateString = moment(d).format('YYYY_MM_DD');
    const dataFile = `${dateString}_data.json`;
    return dataFile;
}

// respond with "hello world" when a GET request is made to the homepage
app.get('/nodes', function (req, res) {
    const todaysFile = getTodaysFile();
    let nodeData;
    if (fs.existsSync(todaysFile)) {
        console.log('using cached node data');
        nodeData = fs.readFileSync("data.json");
        sendNodeResponse(nodeData, res);
        return;
    } 

    // Make a new request and save the data.
    request.get("https://www.stellarbeat.io/nodes/raw")
        .end((err, data) => {
            if (err) { // error fetching node data.
                return res.status(500).json([]);
            }

            nodeData = data.text;

            fs.writeFileSync(todaysFile, nodeData);
            sendNodeResponse(nodeData, res);
        });
})

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.listen(PORT, () => console.log(`Stellar world app listening on port ${PORT}!`))