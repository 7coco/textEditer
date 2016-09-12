var connection = require('mysql-promise')();

connection.configure({
  host : 'localhost',
  user : 'root',
  database : 'text_editer_proto',
  charset : 'utf8mb4',
});

module.exports = connection;
