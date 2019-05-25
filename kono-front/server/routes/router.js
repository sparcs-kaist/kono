const express = require('express');
const os = require('os');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  console.log('error!!');
  const queryString = `SELECT * FROM room t1 WHERE t1.timestamp =
  (SELECT MAX(t2.timestamp) FROM room t2
  WHERE t2.room_number = t1.room_number) ORDER BY room_number;`;
  db.query(queryString, (err, rows) => {
    if(!err){
      console.log('DB connection success!');
      res.send(rows);
    }else{
      console.log(`DB query error : ${err}`);
      res.send(err);
    }
  });
});


module.exports = router;
