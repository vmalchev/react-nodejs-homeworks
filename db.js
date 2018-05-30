var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'simple_blogging'
});

connection.connect(function(err) {
    if (err) throw err;
})

// connection.end()
module.exports = connection;
