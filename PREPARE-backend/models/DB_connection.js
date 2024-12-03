var mysql = require('mysql');
var database = require('../config/database.js');


//For mysql single connection
/* var dbconnection = mysql.createConnection(
        dbConnectionInfo
); 

 dbconnection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
}); 

*/

//create mysql connection pool
/*var dbconnection = mysql.createPool(
  dbConnectionInfo
);*/
var dbconnection = mysql.createPool(database['preparenlp']);
// Attempt to catch disconnects 
dbconnection.on('connection', function (connection) {
  console.log('DB Connection established');

  connection.on('error', function (err) {
    console.error(new Date(), 'MySQL error', err.code);
  });
  connection.on('close', function (err) {
    console.error(new Date(), 'MySQL close', err);
  });

});


module.exports = dbconnection;