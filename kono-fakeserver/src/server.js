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

function randfInverse(min, max) {
    return 1 / randf(1 / max, 1 / min);
}

function err(range) {
    return randf(-range, range);
}

/* Initialize some constants for simulation. */
var TIME_ACCELERATE = 1.0;

var SONG_EMPTY_MIN = 0;
var SONG_EMPTY_MAX = 400;
var SONG_AMPLITUDE_MIN = 200;
var SONG_AMPLITUDE_MAX = 800;
var DOOR_DISTANCE_CLOSED = 200.0;
var DOOR_DISTANCE_OPEN = 120.0;
var DOOR_DISTANCE_MAX = 150.0;
var DOOR_DISTANCE_MIN = 80.0;
var DOOR_DISTANCE_DIFF = 6.0 * TIME_ACCELERATE;
var DOOR_OPEN_DURATION_MIN = 0.0 / TIME_ACCELERATE;
var DOOR_OPEN_DURATION_MAX = 5 * 1000 / TIME_ACCELERATE;
var DOOR_DISTANCE_ERROR = 2.0;

var SONG_LENGTH_MIN = 20 * 1000 / TIME_ACCELERATE;
var SONG_LENGTH_MAX = 30 * 1000 / TIME_ACCELERATE;
var BETWEEN_SONG_INTERVAL_MIN = 3 * 1000 / TIME_ACCELERATE;
var BETWEEN_SONG_INTERVAL_MAX = 10 * 1000 / TIME_ACCELERATE;
var BETWEEN_CUSTOMER_INTERVAL_MIN = 5 * 1000 / TIME_ACCELERATE;
var BETWEEN_CUSTOMER_INTERVAL_MAX = 2 * 60 * 1000 / TIME_ACCELERATE;

var SERVER_DIE_DURATION_MIN = 1 * 1000;
var SERVER_DIE_DURATION_MAX = 5 * 60 * 1000;

var PROBABILITY_CUSTOMER_LEAVE = 0.4;
var PROBABILITY_CUSTOMER_NOT_MOVING = 0.3;
var PROBABILITY_SERVER_NOT_AVAILABLE = 1.0 / (3 * 60 * 60 * 1000);
var PROBABILITY_DOOR_MOVE = 1 / (30 * 1000);

/* Initialize virtual room states. */
var state = false;
var isSongPlayed = false;
var doorDistance = DOOR_DISTANCE_CLOSED + err(DOOR_DISTANCE_ERROR);
var doorIsMoving = false;
var soundDataQueue = [];
var SOUND_DATA_QUEUE_SIZE = 7;
var alive = true;

var start_time = Date.now(); // zero-point for virtual timestamp.
var timestamp;
var pirOutput = [];          // records of virtual PIR sensor output.
var supersonicOutput = [];   // records of virtual supersonic sensor output.
var soundOutput = [];        // records of virtual sound sensor output.
var RECORD_SIZE = 10;

/* Define some events. */
var customerEnterEvent = function() {
    state = true;
    doorOpenEvent();
    setTimeout(songPlayEvent, randfInverse(BETWEEN_SONG_INTERVAL_MIN, BETWEEN_SONG_INTERVAL_MAX));
}

var songPlayEvent = function() {
    if (!isSongPlayed) {
        isSongPlayed = true;
        setTimeout(playNextSongEvent, randf(SONG_LENGTH_MIN, SONG_LENGTH_MAX));
    }
};

var playNextSongEvent = function() {
    isSongPlayed = false;
    if (randf(0, 1) >= PROBABILITY_CUSTOMER_LEAVE) {
        setTimeout(songPlayEvent, randf(BETWEEN_SONG_INTERVAL_MIN, BETWEEN_SONG_INTERVAL_MAX));
    }
    else {
        state = false;
        doorOpenEvent();
        setTimeout(customerEnterEvent, randfInverse(BETWEEN_CUSTOMER_INTERVAL_MIN, BETWEEN_CUSTOMER_INTERVAL_MAX));
    }
}

var soundMeasureCallback = function() {
    var soundData = isSongPlayed ? 
        randf(SONG_AMPLITUDE_MIN, SONG_AMPLITUDE_MAX) : 
        randf(SONG_EMPTY_MIN, SONG_EMPTY_MAX);
    soundDataQueue.push(soundData);
    if (soundDataQueue.length > SOUND_DATA_QUEUE_SIZE)
        soundDataQueue.shift();
}

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

var doorOpenEvent = function() {
    if (!doorIsMoving) {
        doorIsMoving = true;
        var doorThreshold = randf(DOOR_DISTANCE_MIN, DOOR_DISTANCE_MAX);
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

var measureSound = function() {
    var sum = 0;
    for (var data of soundDataQueue)
        sum += data;
    return Math.round(sum / soundDataQueue.length);
}

var measurePIR = function() {
    if (!state)
        return 0;
    else if (randf(0, 1) < PROBABILITY_CUSTOMER_NOT_MOVING)
        return 0;
    return 1;
}

/* Initialize events. */
setInterval(soundMeasureCallback, 230);
setInterval(function() {
    if (randf(0, 1) < PROBABILITY_DOOR_MOVE)
        doorOpenEvent();
}, 1000);
setInterval(function() {

    /* Dead check. */
    if (alive) {
        if (randf(0, 1) < PROBABILITY_SERVER_NOT_AVAILABLE) {
            alive = false;
            setTimeout(function() {alive = true;}, randf(SERVER_DIE_DURATION_MIN, SERVER_DIE_DURATION_MAX));
        }
    }

    timestamp = Date.now() - start_time;
    
    pirOutput.push(measurePIR());
    if (pirOutput.length > RECORD_SIZE)
        pirOutput.shift();
    soundOutput.push(measureSound());
    if (soundOutput.length > RECORD_SIZE)
        soundOutput.shift();
    supersonicOutput.push(measureDoorDistance());
    if (supersonicOutput.length > RECORD_SIZE)
        supersonicOutput.shift();

}, 1000);
setTimeout(customerEnterEvent, randfInverse(BETWEEN_CUSTOMER_INTERVAL_MIN, BETWEEN_CUSTOMER_INTERVAL_MAX))

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
    if (alive)
        res.end(JSON.stringify({
            timestamp: timestamp,
            room_id: roomID,
            pir: pirOutput,
            supersonic: supersonicOutput,
            sound: soundOutput,
            state: state
        }));
    else
        res.status(500);
});