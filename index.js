'use strict';

const request = require('request');

const updateStats = () => {
    request.get({
        method: 'GET',
        timeout: 1000,
        uri: process.env.YOULESS_URI + '/a?f=j'
    }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            console.error("Couldn't reach Youless: " + error);
            return;
        }

        response = JSON.parse(response.body);
        if (process.env.YOULESS_GAS) {
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
        }, (error, response) => {
            if (error) {
                console.error('Request Error: ' + error);
                return;
            }
            console.log('Send status to InfluxDB, status: ' + response.statusCode);
        });

        setTimeout(updateStats, 5000);
    });
};
updateStats();
