Publish Youless metrics to InfluxDB
=======================================

Every 5 seconds send the Youless metrics to InfluxDB.


[![Docker Pulls](https://img.shields.io/docker/pulls/trafex/youless-influxdb.svg)](https://hub.docker.com/r/trafex/youless-influxdb/)

Usage
-----

    docker build -t youless .
    docker run -it --rm --name youless -e "YOULESS_URI=http://<Youless IP>" -e "INFLUXDB_URI=http://<UnfluxDB uri>:8086/write?db=youless" youless

Debugging
---------
Add to the run command:

    -v "$PWD":/usr/src/app -w /usr/src/app
