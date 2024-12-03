var mysql = require('mysql');

var database = require('../config/database.js');

var pool = require('./db_pool');

module.exports = {
	login: function(inputdata, callback) {
		try {
		
			var query = "SELECT * from users where username = ?";

			return pool.query(query, [inputdata.username], function(err, results) {
				
				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	signup: function(inputData, callback) {
		try {
	
					var query1 = "SELECT * from users where username = ?";
					return pool.query(query1, [inputData.username], function(err1, results) {
						

						if (!err1) {
							if (results.length == 0) {
								var query = "INSERT INTO users ( username, password ,fname,lname,discipline,experience) values (?,?,?,?,?,?)";

								return pool.query(query, [inputData.username,inputData.password ,inputData.fname,inputData.lname,inputData.discipline,inputData.experience], function(err, results) {
									if (!err) {
										var option = {};
										option.error = false;
										option.message = 'User Added Login again';
										callback(null, option);

									} else {
										return callback(err);
									}
								});

							} else {
								var option = {};
								option.error = true;
								option.message = 'User Already exists';
								callback(null, option);
							}

						} else {
							return callback(err1);
						}
					});
				

		} catch (e) {
			return callback(e);
		}

	}
}