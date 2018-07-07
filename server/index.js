const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const osmosis = require('osmosis');
const request = require('superagent');
const cors = require('cors');

app.use(cors())

// respond with "hello world" when a GET request is made to the homepage
app.get('/hello', function (req, res) {
    res.send('hello world')
})

// respond with "hello world" when a GET request is made to the homepage
app.get('/nodes', function (req, res) {

    request
        .get("https://www.stellarbeat.io/nodes/raw")
        .end((err, data) => {
            console.log('data', data);
            // Do something
            return res.json(data.text)
        });
})

const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());
app.listen(PORT, () => console.log(`Stellar world app listening on port ${PORT}!`))