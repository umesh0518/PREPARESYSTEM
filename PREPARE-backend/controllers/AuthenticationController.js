var AuthenticationModel = require('../models/AuthenticationModel.js');
//var D_itemsModel= require('../models/D_itemsModel.js');
var jst = require('jsonwebtoken');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');

//var secret_key = "hamzawedssafia07072017";
var secret_key = "prepare2017";


module.exports = {
 
	login: function(inputdata, callback) {
		try {
			//inputdata.password = bcrypt.hashSync(inputdata.password, null, null);
			return AuthenticationModel.login(inputdata, function(err, results) {
				if (err) {
					throw err;
				}
				var output = {}
console.log(results);
				if (results.length > 0) {

					if (bcrypt.compareSync(inputdata.password, results[0].password)) {
						var user = {};
						user.id = results[0].id;
						user.username = results[0].username;
						var token = jst.sign(user, secret_key, {
							expiresIn: 40000000000000000
						});
						output.error = false;
					output.token = token;
					callback(null, output);
					} else {
						output.error = true;
						output.message = 'Wrong Password';
						callback(null, output);
					}


					

				} else {
					output.error = true;
					output.message = 'Wrong Username';
					callback(null, output);
				}


			});

		} catch (e) {
			return callback(e);
		}
	},
	signup: function(inputdata, callback) {
		try {
			inputdata.password=bcrypt.hashSync(inputdata.password, null, null);
			return AuthenticationModel.signup(inputdata, function(err, results) {
				if (err) {
					throw err;
				}

				return callback(null,results);


			});

		} catch (e) {
			return callback(e);
		}
	},
	verify: function(inputdata, callback){
		try {
 			 var decoded = jst.verify(inputdata.authenticationtoken, secret_key);
 			 var results={
 			 	error:false, 
 			 	user:decoded
 			 }
 			 callback(null,results);
		} catch(err) {
			//console.log(err);
  			var results={
 			 	error:true,
 			 	message:'not logged in'
 			 }	
 			 callback(null,results);
		}
	}
}