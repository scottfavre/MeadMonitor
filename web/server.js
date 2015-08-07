// set up ========================
var _ = require('lodash');
var express = require('express');
var app = express();                               // create our app w/ express
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var db = require('./server/db');

app.use(express.static(__dirname + '/app'));                    // set the static files location /public/img will be /img for users
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// routes
app.post('/temperature', function (req, res) {
    res.send('ok');

    db.devices.insertTemperature(req.body.device.toString(10), req.body.temperature);
});

app.get('/devices', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(db.devices.items));
});
app.get("/devices/:id", function (req, res) {
    var id = parseInt(req.params.id)
    var device = db.devices.get(id);
    if (device) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(device));
    } else {
        res.status(404).send('not found');
    }
});
app.post('/devices', function (req, res) {
    var id = parseInt(req.body.Id);
    var device = db.devices.get(id);

    if (device) {
        db.devices.update(device, req.body).then(function (device) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(device));
        });
    } else {
        res.status(404).send('not found');
    }
});



app.get('/batches', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(db.batches.items));
});
app.get('/batches/:id', function (req, res) {
    var id = parseInt(req.params.id)
    db.batches.get(id).then(function (batch) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(batch));
    }, function (error) {
        res.status(404).send('error');
    });
});
app.post('/batches', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    function returnBatch(batch) {
        res.send(JSON.stringify(batch));
    }

    function returnError(error) {
        res.status(500).send(error);
    }

    console.log(req.body);

    if (req.body.hasOwnProperty("Id")) {
        console.log("update");
        db.batches.update(req.body).then(returnBatch, returnError);
    } else {
        db.batches.create(req.body).then(returnBatch, returnError);
    }
});
app.post('/batches/:id/start/:device_id', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    db.batches.start(parseInt(req.params.id), parseInt(req.params.device_id))
        .then(function (batch) {
            res.json(batch);
        }, function (err) {
            res.status(500).send(err);
        })
});
app.delete('/batches/:id', function (req, res) {
    console.log("deleting batch " + req.params.id);
    db.batches.del(req.params.id)
        .then(function (result) {
            res.send("deleted");
        }, function (error) {
            res.status(500).send(error);
        });
});

// listen (start app with node server.js) ======================================
app.listen(1234);
console.log("App listening on port 1234");