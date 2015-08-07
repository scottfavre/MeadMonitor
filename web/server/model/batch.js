var Promise = require('promise');
var _ = require('lodash');

function batchesProvider(execRequest, execStreamRequest) {
    function updateCachedRow(id, row) {
        var batch = _.find(batches.items, function (b) {
			return b.Id === id;
		});
        
        if(batch) {
            _.assign(batch, row);
        } else {
            batches.items.push(row);
        }
    }
    
    
    var batches = {
        items: [],
        get: function (id) {
			var promise = new Promise(function (fulfil, reject) {
				var batch = _.find(batches.items, function (b) {
					return b.Id === id;
				});

				if (batch) {
					fulfil(batch);
				} else {
					execRequest(function (batchInsert) {
						batchInsert.stream = true;
						batchInsert.input('id', id);
						batchInsert.query("SELECT * FROM Batches WHERE Id = @id", function (err, rows) {
							if (err) {
								reject(err);
							} else {
                                console.log(row[0]);
								fulfil(rows[0]);
							}
						});
					});
				}
			});

			return promise;
        },
        update: function (params) {
            var promise = new Promise(function (fulfil, reject) {
                execRequest(function (update) {                    
                    var id = parseInt(params.Id);

                    update.input('id', id);
                    update.input('name', params.Name);
					update.input('series', params.Series);
					update.input('sequence', params.Sequence);
					update.input('startDate', params.StartDate);
					update.input('endDate', params.EndDate);
                    update.query("UPDATE Batches SET \
						Name=@name, \
						Series=@series, \
						Sequence=@sequence, \
						StartDate=@startDate, \
						EndDate=@endDate \
						WHERE Id=@id; \
						SELECT * FROM Batches WHERE Id=@id;", function (err, recordsets) {
                        if (err) {
                            reject(err);
                        } else {
                            updateCachedRow(id, recordsets[0]);                            
                            fulfil(recordsets[0]);
                        }
                    });
                })
            });

            return promise;
        },
		create: function (params) {
            var promise = new Promise(function (fulfil, reject) {
                execRequest(function (insert) {
                    insert.input('name', params.Name);
					insert.input('series', params.Series);
					insert.input('sequence', params.Sequence);
                    insert.query("INSERT Batches (Name, Series, Sequence) VALUES (@name, @series, @sequence); \
						SELECT * FROM Batches WHERE Id=SCOPE_IDENTITY();", function (err, recordsets) {
                        if (err) {
                            reject(err);
                        } else {
                            batches.items.push(recordsets[0]);
                            fulfil(recordsets[0]);
                        }
                    });
                })
            });

            return promise;
        },
        start: function(id, deviceId) {
          return new Promise(function(fulfil, reject) {
             execRequest(function(start) {
                start.input('id', id);
                start.input('deviceId', deviceId);
                start.input('startDate', new Date());
                start.query("INSERT BatchMonitors (BatchId, DeviceId, StartDate) VALUES (@id, @deviceId, @startDate);\
                    UPDATE Batches SET StartDate=@startDate,EndDate=NULL;\
                    SELECT * FROM Batches WHERE Id=@id;", function(err, rows) {
                        if (err) {
                            reject(err);
                        } else {
                            updateCachedRow(id, rows[0]);                            
                            fulfil(rows[0]);
                        }
                    }) 
             });
          });
        },
        del: function (id) {
            return new Promise(function(fulfil, reject) {
                execRequest(function(del) {
                    del.input('id', id);
                    del.query("DELETE FROM Batches WHERE Id=@id",
                        function(err) {
                            if(err){
                                reject(err);
                            } else {
                                _.remove(batches.items, function(b) {
                                   b.Id === id; 
                                });
                                fulfil();
                            }
                        });
                });             
            });
        }
    };

    execStreamRequest(function (batchSelect) {
        batchSelect.on("row", function (row) {
            batches.items.push(row);
        });
        batchSelect.query("SELECT * FROM Batches;");
    })

    return batches;
}

module.exports = {
    batches: batchesProvider
};