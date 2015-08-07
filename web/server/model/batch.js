var mssql = require('mssql');
var Promise = require('promise');
var _ = require('lodash');

function batchesProvider(execWithConnection) {
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
					execWithConnection(function (connection) {
						var batchInsert = new mssql.Request(connection);
						batchInsert.stream = true;
						batchInsert.input('id', id);
						batchInsert.query("SELECT * FROM Batches WHERE Id = @id", function (err, rows) {
							if (err) {
								reject(err);
							} else {
                                console.log(roww[0]);
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
                execWithConnection(function (connection) {
                    
                    var id = parseInt(params.Id);
                    
                    var update = new mssql.Request(connection);
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
                            var batch = _.find(batches.items, function (b) {
            					return b.Id === id;
            				});
                            
                            if(batch) {
                                _.assign(batch, recordsets[0]);
                            } else {
                                batches.items.push(recordsets[0]);
                            }
                            
                            fulfil(recordsets[0]);
                        }
                    });
                })
            });

            return promise;
        },
		create: function (params) {
            var promise = new Promise(function (fulfil, reject) {
                execWithConnection(function (connection) {
                    
                    var insert = new mssql.Request(connection);
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
        del: function (id) {
            return new Promise(function(fulfil, reject) {
                execWithConnection(function(connection) {
                    var del = new mssql.Request(connection);
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

    execWithConnection(function (connection) {
        var batchSelect = new mssql.Request(connection);
        batchSelect.stream = true;
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