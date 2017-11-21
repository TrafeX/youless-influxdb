'use strict';

const request = require('request');

function updateStats() {
    request.get({
        method: 'GET',
        timeout: 1000,
        uri: process.env.YOULESS_URI + '/a?f=j'
    }, function (error, response, body) {
        if (error || response.statusCode != 200) {
            console.log("Couldn't reach Youless: " + error);
        }

        response = JSON.parse(response.body);
        if(process.env.YOULESS_GAS) {
            body =
                'current_lph,source=youless value=' + response['pwr'] + '\n' +
                'total_m3,source=youless value=' + response['cnt'].replace(/ /g, '').replace(/,/g, '.');
        } else {
            body =
                'current_watt,source=youless value=' + response['pwr'] + '\n' +
                'total_kwh,source=youless value=' + response['cnt'].replace(/ /g, '').replace(/,/g, '.');
        }
        request({
            method: 'POST',
            uri: process.env.INFLUXDB_URI,
            timeout: 1000,
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
