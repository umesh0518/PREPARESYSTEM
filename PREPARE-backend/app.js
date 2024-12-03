require("dotenv").config();
var express = require('express');

var morgan = require('morgan');

var http = require('http');
var path = require('path');
var handlebars = require('express-handlebars'), hbs;
var app = express();

var bodyParser = require('body-parser');





app.use(express.static('Public'))

app.set('port', 1339);
app.set('views', path.join(__dirname, 'views'));



/* express-handlebars - https://github.com/ericf/express-handlebars
A Handlebars view engine for Express. */
hbs = handlebars.create({
  defaultLayout: 'main'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');





app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// send app to router -->All Application Requests encoded in router
require('./router')(app);

//Create Application Server
http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
