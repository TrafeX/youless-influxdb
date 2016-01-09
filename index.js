const request = require('request');

function updateStats() {
    request.get({
        method: 'GET',
        uri: process.env.YOULESS_URI + '/a?f=j'
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            console.log("Couldn't reach Youless, status: " + response.statusCode);
        }

        response = JSON.parse(response.body);
        body =
            'current_watt,source=youless value=' + response['pwr'] + '\n' +
            'total_kwh,source=youless value=' + response['cnt'];
        request({
            method: 'POST',
            uri: process.env.INFLUXDB_URI,
            body: body
        }, function (error, response, body) {
            if (error) {
                console.error('Request Error: ' + error);
                return;
            }
            console.log('Send status to InfluxDB, status: ' + response.statusCode);
        });

        setTimeout(updateStats, 5000);
    });
}
updateStats();
