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

/* 
 * There are 3 virtual sensors attached to the room.
 * 
 * - PIR sensor:        Measures if any moving object in the room.
 *                      The output of the sensor is given in digital signal 0/1.
 *                      The sensor produces 0 if the room is empty,
 *                      but it may produce 0 occasionally even if the room is in use.
 * 
 * - Supersonic sensor: Mesures the distance between the sensor and the door.
 *                      The output of the sensor is given in centimeter scale float value, 
 *                      from 2.00 to 400.00, or -1.0 if the measurement cannot be done (out of range).
 *                      The sensor produces value around 200.00 when the door is closed. (distance from door to the sensor).
 *                      When the door is open, the value is smaller than 200.00 or it produces invalid value -1.0.
 * 
 * - Sound sensor:      Measures the amplitude of the sound in the room.
 *                      The output of the sensor is given in integer value, from 0 (low) to 1023 (high).
 *                      In the simulation, the room is usually noisy when someone sings.
 *                      The output value in this case is in range of 300 to 800.
 *                      If the room is empty or no one is singing, the room is usually quiet,
 *                      but the result is affected by other room's sound level.
 *
 * The sensor output values are retrieved every 1 second.
 */

function randf(min, max) {
    return Math.random() * (max - min) + min;
}

function err(range) {
    return randf(-range, range);
}

/* Initialize some constants for simulation. */
var TIME_ACCELERATE = 1.0;

var SONG_AMPLITUDE_MIN = 300;
var SONG_AMPLITUDE_MAX = 800;
var DOOR_DISTANCE_CLOSED = 200.0;
var DOOR_DISTANCE_OPEN = 120.0;
var DOOR_DISTANCE_MAX = 150.0;
var DOOR_DISTANCE_MIN = 80.0;
var DOOR_DISTANCE_DIFF = 6.0 * TIME_ACCELERATE;
var DOOR_OPEN_DURATION_MIN = 0.0 / TIME_ACCELERATE;
var DOOR_OPEN_DURATION_MAX = 5.0 / TIME_ACCELERATE;
var DOOR_DISTANCE_ERROR = 2.0;

var SONG_LENGTH_MIN = 2 * 60 * 1000 / TIME_ACCELERATE;
var SONG_LENGTH_MAX = 5 * 60 * 1000 / TIME_ACCELERATE;
var BETWEEN_SONG_INTERVAL_MIN = 3 * 1000 / TIME_ACCELERATE;
var BETWEEN_SONG_INTERVAL_MAX = 90 * 1000 / TIME_ACCELERATE;

var NUM_SONGS_MIN = 1;
var NUM_SONGS_MAX = 20;

var PROBABILITY_CUSTOMER_ARRIVE = 1.0 / (50.0 * 60);
var PROBABILITY_CUSTOMER_OPEN_DOOR = 1.0 / (50.0 * 60);
var PROBABILITY_CUSTOMER_REPEAT_OPEN_DOOR = 1.0 / (500.0 * 60);

var SONG_SPLASH_EFFECT = 0.4;

/* Initialize virtual room states. */
var state = false;           // room state.
var isSongPlayed = false;    // Is the song currently played in this virtual room?
var doorDistance = DOOR_DISTANCE_CLOSED + err(DOOR_DISTANCE_ERROR);
var doorIsMoving = false;

var start_time = Date.now(); // zero-point for virtual timestamp.
var pirOutput = [];          // records of virtual PIR sensor output.
var supersonicOutput = [];   // records of virtual supersonic sensor output.
var soundOutput = [];        // records of virtual sound sensor output.

/* Define some events. */
var songPlayEvent = function() {
    if (!isSongPlayed) {
        isSongPlayed = true;
        setTimeout(function() {
            isSongPlayed = false;
        }, randf(SONG_LENGTH_MIN, SONG_LENGTH_MAX));
    }
};

var doorOpenEvent = function() {
    if (!doorIsMoving) {
        doorIsMoving = true;
        var doorThreshold = randf(DOOR_DISTANCE_MIN, DOOR_DISTANCE_MAX);
        var doorClose = function() {
            if (doorDistance > DOOR_DISTANCE_CLOSED) {
                doorDistance = DOOR_DISTANCE_CLOSED;
                doorIsMoving = false;
            }
            else {
                doorDistance += DOOR_DISTANCE_DIFF;
                setTimeout(doorClose, 100);
            }
        }
        var doorOpen = function() {
            if (doorDistance > doorThreshold) {
                doorDistance -= DOOR_DISTANCE_DIFF;
                setTimeout(doorOpen, 100);
            }
            else {
                setTimeout(doorClose, randf(DOOR_OPEN_DURATION_MIN, DOOR_OPEN_DURATION_MAX));
            }
        }
        doorOpen();
    }
}

/* Define measurement functions. */
var measureDoorDistance = function() {
    var result = doorDistance + err(DOOR_DISTANCE_ERROR);
    if (result < DOOR_DISTANCE_OPEN)
        result = -1;
    return result.toLocaleString(
        undefined,
        { minimumFractionDigits: 3 }
    );
}

/* Retrieving virtual sensor outputs. */
setInterval(function() {

    var timestamp = Date.now() - start_time;
    console.log(timestamp + ", " + measureDoorDistance() + ", " + doorIsMoving);


}, 200);

/* 
 * When HTTP request arrives to the fake server, it returns:
 * {
 *     timestamp: <timestamp>             // A timestamp of the arduino board, in milliseconds scale unsigned integer.
 *     room_id: <room_id>                 // The room id of this fake server, as set in cmd arguments.
 *     pir: [<0 | 1>]                     // An array of most recent PIR sensor outputs.
 *     supersonic: [<-1.0 | 2.0 ~ 400.0>] // An array of most recent supersonic sensor outputs.
 *     sound: [<0 ~ 1023>]                // An array of most recent sound sensor outputs.
 *     state: <0 | 1>                     // The 'correct state' of the current room, provided for debugging and polishing.
 * }
 */

/* Handling HTTP requests. */
app.get('/', function(req, res) {
    res.end('Hello, world!');
});