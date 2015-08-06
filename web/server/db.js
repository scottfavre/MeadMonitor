var mssql = require('mssql');
var Promise = require('promise');
var _ = require('lodash');

var dbConfig = {
    user: 'mead',
    password: 'foobar',
    server: 'ScottFavre', // You can use 'localhost\\instance' to connect to named instance 
    database: 'MeadMonitor',
    stream: true, // You can enable streaming globally
};

var connection = null;

function execWithConnection(action) {
    if (connection) {
        action(connection);
    } else {
        connection = mssql.connect(dbConfig, function (err) {
            if (err) {
                connection = null;
                console.log(err);
                return;
            }

            action(connection);
        });
    }
}

function forDevice(address, action) {   
    var device =  _.find(devices.items, function (dev) {
        return dev.Address === address;
    });
    
    if(device) {
        action(device);
    } else {
        var deviceInsert = new mssql.Request(connection);
        deviceInsert.input('address', address);
        deviceInsert.on("row", function (row) {
            devices.push(row);
            action(device);
        });
        deviceInsert.query("INSERT INTO Devices (Address) VALUES (@address); SELECT * FROM Devices WHERE Id=SCOPE_IDENTITY();");
    }
}

var devices =
    {
        items: [],
        insertTemperature: function (address, temperature) {
            forDevice(address, function(device) {
                execWithConnection(function (connection) {
                    var request = new mssql.Request(connection);
                    request.input('deviceId', device.Id);
                    request.input('temperature', temperature);
                    request.input('timestamp', new Date());
                    request.query("INSERT INTO Temperature (DeviceId, Temperature, Timestamp) VALUES (@deviceId, @temperature, @timestamp)", function (err, records) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });
            });
        }
    };

var connection = mssql.connect(dbConfig, function (err) {
    var deviceSelect = new mssql.Request(connection);
    deviceSelect.on("row", function (row) {
        devices.items.push(row);
    });
    deviceSelect.query("SELECT * FROM Devices;");
});

module.exports = {
    devices: devices	
};