var fs = require('fs');
var moment = require('moment'); 
var express = require('express');
var app = express();

// Serial data is a singleton.
var serialData = require('./app/utils/serialData');
var SerialPort = require("serialport").SerialPort;
var SerialParsers = require("serialport").parsers;

// The data since start.
var sensorData = {
  temp: []
};

///////////////////////////////////////////////////////////
// Setup Arduino connection through serialport.

var serialport = new SerialPort('COM6', {
  baudrate: 115200,
  // defaults for Arduino serial communication
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false,
  parser: SerialParsers.readline("\r")
});

serialport.on('open', function(){
  console.log('Serial Port Opend');
})
.on('data', function(data) {
  // Send data for processing.
  serialData.process(data);
});

// SerialData listener
serialData.listen('tempReading', '^TMP:-?([0-9]+\.[0-9]+)$');

// SerialData events.
serialData.on('sysnote', function(data) {
  if (data == 'Setup Complete') {
    // Arduino is setup.
    console.log('Setup Complete');
    startServer();
  }
})
.on('debug', function(data) {
  console.log('DBG:', data);
})
.on('other', function(data) {
  // All data not processes comes here.
  console.log('UNKNOWN:', data);
});

serialData.on('tempReading', function(tmp) {
  tmp = parseFloat(tmp);
  var date = moment().format('YYYY-MM-DD H:mm:ss');
  var data = {
    date: date,
    value: tmp
  };
  sensorData.temp.push(data);
  console.log(date, data);
});

///////////////////////////////////////////////////////////
// Express

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/app/views/index.html');
});

app.get('/sensor/:sensor?', function (req, res) {
  if (!req.params.sensor) {
    return res.send(sensorData);
  }
  
  switch(req.params.sensor) {
    case 'temperature':
      return res.send(sensorData.temp);
    break;
    default:
      return res.send(sensorData);
    break;
  }
  
});

function startServer() {
  app.listen(3000, function () {
    console.log('App listening at http:localhost:3000');
  });
}

