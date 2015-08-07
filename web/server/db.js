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

function execWithConnection(action) {
    var connection = mssql.connect(dbConfig, function (err) {
        if (err) {
            connection = null;
            console.log(err);
            return;
        }
        action(connection);
    });
}

module.exports = {
    devices: Device.devices(execWithConnection),
    batches: Batch.batches(execWithConnection)
};