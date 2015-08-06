// set up ========================
var _ = require('lodash'); 
var express = require('express');
var app = express();                               // create our app w/ express
var mssql = require('mssql');                      // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================


var dbConfig = {
    user: 'mead',
    password: 'foobar',
    server: 'ScottFavre', // You can use 'localhost\\instance' to connect to named instance 
    database: 'MeadMonitor',
    stream: true, // You can enable streaming globally
}


//mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/app'));                    // set the static files location /public/img will be /img for users
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

var devices = [];

var connection = mssql.connect(dbConfig, function (err) {
    var deviceSelect = new mssql.Request(connection);
    deviceSelect.on("row", function (row) {
        devices.push(row);
    });
    deviceSelect.query("SELECT * FROM Devices;");
});

function insertTemperature(connection, device, temperature) {    
    var request = new mssql.Request(connection);
    request.input('deviceId', device.Id);
    request.input('temperature', temperature);
    request.input('timestamp', new Date());
    request.query("INSERT INTO Temperature (DeviceId, Temperature, Timestamp) VALUES (@deviceId, @temperature, @timestamp)", function (err, records) {
        if (err) {
            console.log(err);
        }
    });
}

// routes
app.post('/temperature', function (req, res) {
    res.send('ok');
    var connection = mssql.connect(dbConfig, function (err) {
        if (err) {
            console.log(err);
            return;
        }

        var address = req.body.device.toString(10);

        var device = _.find(devices, function(dev) {
            return dev.Address === address;
        });

        if (!device) {
            var deviceInsert = new mssql.Request(connection);
            deviceInsert.input('address', address);
            deviceInsert.on("row", function (row) {
                devices.push(row);
                insertTemperature(connection, row, req.body.temperature);
            });
            deviceInsert.query("INSERT INTO Devices (Address) VALUES (@address); SELECT * FROM Devices WHERE Id=SCOPE_IDENTITY();");
        } else {
            insertTemperature(connection, device, req.body.temperature);
        }
    });
});

// listen (start app with node server.js) ======================================
app.listen(1234);
console.log("App listening on port 1234");