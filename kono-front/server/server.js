const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const app = express();
const router = require('./routes/router');

app.use(express.static('public'));
app.use(express.static('img'));
app.use(express.static('dist'));

app.set('views', __dirname + '/public');
app.use(bodyParser.json()); //for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); //for parsing application/json

app.use('/', router);

app.get('/', (req, res) =>{
  return res.sendFile(path.join(__dirname, './public', 'index.html'));
});

const server = app.listen(80, () => {
  console.log('server running at port 80');
});
