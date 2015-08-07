var Promise = require('promise');
var _ = require('lodash');

function temperaturesProvider(execRequest) {
    var temperatures = {
        getForBatch: function (batchId) {
			return new Promise(function (fulfil, reject) {
				execRequest(function (select) {
					select.input('batchId', batchId);
					select.query("SELECT temp.*, mon.DeviceId\
						FROM Temperature temp \
						JOIN BatchMonitors mon ON temp.MonitorId=mon.Id \
						WHERE mon.BatchId=@batchId \
						ORDER BY Timestamp ASC;", function (err, rows) {
							if (err) {
								reject(err);
							} else {
								fulfil(rows);
							}
						});
				});
			});
        }
    };

    return temperatures;
}

module.exports = {
    temperatures: temperaturesProvider
};