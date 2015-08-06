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

app.get('/devices', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(db.devices.items));
});

// listen (start app with node server.js) ======================================
app.listen(1234);
console.log("App listening on port 1234");