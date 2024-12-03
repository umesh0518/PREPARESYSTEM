var AuthenticationController = require('../controllers/AuthenticationController.js');

//Simple Temporary User Password Authentication (Need to Connect to Active Directory UTAD)

module.exports = {
	login: function(request, response) {
		try {
			if (request && request.body) {
				['password', 'username'].forEach(function(str) {
					if (!request.body[str]) {
						var err = new Error(str + ' is not present in the URL');
						throw err;
					}
				});
				request.input = {};
				['password', 'username'].forEach(function(str) {
					request.input[str] = request.body[str];
				});
				return AuthenticationController.login(request.input, function(err, data) { 
					if (err) {
						throw err;
					}
					return response.json(data);
				});
			} else {
	
				var err = new Error(' body is not present in the URL');
				throw err;
			}
		} catch (e) {
			request.output = {}
			request.output.error = true;
			request.output.message = e.message;
			response.json(request.output);
		}
	},
	signup: function(request, response) {
		try {
			if (request && request.body) { 
				['username','password','fname','lname','discipline','experience'].forEach(function(str) {
					if (!request.body[str]) {
						var err = new Error(str + ' is not present in the URL');
						throw err;
					}
				});
				request.input = {};
				['username','password','fname','lname','discipline','experience'].forEach(function(str) {
					request.input[str] = request.body[str];
				});
				return AuthenticationController.signup(request.input, function(err, data) {
					if (err) {
						throw err;
					}
					return response.json(data);
				});
			} else {
	
				var err = new Error(' body is not present in the URL');
				throw err;
			}
		} catch (e) {
			request.output = {}
			request.output.error = true;
			request.output.message = e.message;
			response.json(request.output);
		}
	},
	verify: function(request, response, next) {
		try {
			if (request && request.headers) {
				
				['authenticationtoken'].forEach(function(str) {
					if (!request.headers[str]) {
						var err = new Error(str + ' is not present in the URL');
						throw err;
					}
				});
				request.input = {};
				['authenticationtoken'].forEach(function(str) {
					request.input[str] = request.headers[str];
				});
				return AuthenticationController.verify(request.input, function(err, data) {
					if (err) {
						throw err;
					}
					if(!data.error){
						request.user=data.user;
						return next();
					}
					else{
						return response.json(data);
					}
					
				});
			} else {
	
				var err = new Error(' body is not present in the URL');
				throw err;
			}
		} catch (e) {
			request.output = {}
			request.output.error = true;
			request.output.message = e.message;
			response.json(request.output);
		}
	}
}