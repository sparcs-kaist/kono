const mysql = require('mysql');
const connection = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '????????',
  port     : 3306,
  database : 'kono'
});

module.exports = connection;
