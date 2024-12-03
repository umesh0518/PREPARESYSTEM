

var Stomp = require('stomp-client');
var destination = '/topic/DataMessage.JSON';
var client = new Stomp('localhost', 61613, 'admin', 'admin');
var mysql = require('mysql');
var database = require('./config/database.js');

var dateTime=Math.round(Date.now())+1000*200;



function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


client.connect(function(sessionId) {

	var connection = mysql.createConnection(database['preparenlp']);
			connection.connect(function(err) {
				if (!err) {
					console.log("Database is connected ... nn");
				} else {
					return console.log(err);
				}
			});

	var temp = [];
    client.subscribe(destination, function(body, headers) {
      // console.log('This is the body of a message on the subscribed queue:', body);
      // console.log(typeof(body));

      var n = body.indexOf("{");
       body = body.substring(n, body.length);

      
		if(isJson(body)){
			try {
      		
      		var values = JSON.parse(body)
      		// console.log(Object.keys(values));

      		// console.log((values));


      		// values["deviceId"]="ABCD123"
      		// values["connectionTime"]=43921;
      		// console.log("*********************************************")
      		// console.log(Date.now()-values["creationTimestamp"]);
      		// console.log("*********************************************")

			query = "INSERT INTO physlogicalTable (value, source,type, creationTimestamp, feature, SERIALNUMBER,DEVICECONNECTTIME) VALUES ?"

			

			if(temp.length==100){
				var temp1=temp;
				temp = [];
				console.log(temp1);
				return connection.query(query, [temp1], function(err, results) {
				

				if (!err) {
					console.log(results);

				} else {
					console.log(err);
					
				}
			});

			}else{
				temp.push([values["value"],values["source"],values["@type"],values["creationTimestamp"],values["feature"],values["deviceId"],values["connectionTime"]]);
			}
			



		} catch (e) {
			console.log(e);
		}


      		}

      

    	});

    //client.publish(destination, 'Oh herrow');
});

