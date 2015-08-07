var mssql = require('mssql');
var Promise = require('promise');
var _ = require('lodash');
var Device = require('./model/device');
var Batch = require('./model/batch')

var dbConfig = {
    user: 'mead',
    password: 'foobar',
    server: 'ScottFavre', // You can use 'localhost\\instance' to connect to named instance 
    database: 'MeadMonitor'
};

function execRequest(action) {
    var connection = mssql.connect(dbConfig, function (err) {
        if (err) {
            connection = null;
            console.log(err);
            return;
        }

        var request = mssql.Request(connection);
        action(request);
    });
}

function execStreamRequest(action) {
    var connection = mssql.connect(dbConfig, function (err) {
        if (err) {
            connection = null;
            console.log(err);
            return;
        }

        connection.stream = true;
        var request = new mssql.Request(connection);
        action(request);
    });
}

module.exports = {
    devices: Device.devices(execRequest, execStreamRequest),
    batches: Batch.batches(execRequest, execStreamRequest)
};