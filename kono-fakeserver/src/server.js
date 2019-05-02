var express = require('express');

/* Parse command line arguments. */
var args = (require('minimist'))(process.argv.slice(2));
var port = args['port'];
var roomID = args['room_id'];

/* Run server on designated port. */
var app = express();
var server = app.listen(port, function() {
    console.log('Express server has started on port ' + port);
});



/* Handling HTTP requests. */
app.get('/', function(req, res) {
    res.end('Hello, world!');
});