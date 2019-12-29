require('./config');

const express = require('express');
const app = express();

app.use('/static', express.static(__dirname + '/public'));

app.listen(process.env.STATIC_PORT, () => {
    console.log(`kono-judge static server listening at port ${process.env.STATIC_PORT}`);
});