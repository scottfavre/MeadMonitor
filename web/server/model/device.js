var Promise = require('promise');
var _ = require('lodash');

function devicesProvider(execRequest) {
    var items = [];

    function forDevice(address, action) {
        var device = _.find(items, function (dev) {
            return dev.Address === address;
        });

        if (device) {
            action(device);
        } else {
            execRequest(function (deviceInsert) {
                deviceInsert.stream = true;
                deviceInsert.input('address', address);
                deviceInsert.on("row", function (row) {
                    items.push(row);
                    action(device);
                });
                deviceInsert.query("INSERT INTO Devices (Address) VALUES (@address); SELECT * FROM Devices WHERE Id=SCOPE_IDENTITY();");
            });
        }
    }

    var devices = {
        items: items,
        get: function (id) {
            return _.find(devices.items, function (dev) {
                return dev.Id === id;
            });
        },
        update: function (device, params) {
            var promise = new Promise(function (fulfil, reject) {
                execRequest(function (update) {
                    device.Name = params.Name;

                    update.input('id', device.Id);
                    update.input('name', device.Name);
                    update.query("UPDATE Devices SET Name=@name WHERE Id=@id; SELECT * FROM Devices WHERE Id=@id;", function (err, recordsets) {
                        if (err) {
                            reject(err);
                        } else {
                            _.assign(device, recordsets[0]);
                            fulfil(device);
                        }
                    });
                })
            });

            return promise;
        },
        insertTemperature: function (address, temperature) {
            forDevice(address, function (device) {
                execRequest(function (request) {
                    request.input('deviceId', device.Id);
                    request.input('temperature', temperature);
                    request.input('timestamp', new Date());
                    request.query("INSERT INTO Temperature (MonitorId, Temperature, Timestamp) \
                        SELECT TOP 1 Id MonitorId, @temperature Temperature, @timestamp Timestamp \
                        FROM BatchMonitors \
                        WHERE EndDate IS NULL AND DeviceId=@deviceId", function (err, records) {
                            if (err) {
                                console.log(err);
                            }
                        });
                });
            });
        }
    };

    execRequest(function (deviceSelect) {
        deviceSelect.query("SELECT * FROM Devices;", function (err, rows) {
            _.forEach(rows, function (row) {
                items.push(row);
            });
        });
    })

    return devices;
}

module.exports = {
    devices: devicesProvider
};