const request = require('superagent');
const osmosis = require('osmosis');

    // request
    //     .get("https://www.stellarbeat.io/nodes/raw")
    // .end((err, data) => {
    //     const body = JSON.parse(data.text);
    //     const markers = body.map((marker) => {
    //         marker.coordinates = [ parseFloat(marker.latitude), parseFloat(marker.longitude) ]
    //         return marker;
    //     })
    //     console.log(markers);
    // });

    osmosis.get("https://www.stellarbeat.io/")
    .find('div.statcard-info')
    .set({
        'info': 'h2.statcard-number'
    })
    .data(data => {
        console.log(JSON.stringify(data))
        // return res.json({'updated': lastUpdated});
    })