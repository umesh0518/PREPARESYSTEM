//var mysql = require('mysql');

//var database = require('../config/database.js');

var connection;
var db = require('./db_pool'); 
module.exports = {
	login: function(inputdata, callback) {
		try {
		
			query = "SELECT * from users where username = '?'";

		
			return pool.query(query, [inputdata.username,inputdata.password], function(err, results) {
			
				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	}
}