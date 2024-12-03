var mysql = require('mysql');
var database = require('./config/database.js');
var dateTime=Math.round(Date.now())+1000*200;
var temp = [];

var connectOptions = {
  'host': 'localhost',
  'port': 61613,
  'ssl': false,
  'connectHeaders':{
    'heart-beat': '1000,2000',
    'host': '/',
    'login': 'admin',
    'passcode': 'admin'
  }
};

console.log(1);
var connection = mysql.createConnection(database['preparenlp']);
      connection.connect(function(err) {
        if (!err) {
          console.log("Database is connected ... nn");
        } else {
          return console.log(err);
        }
      });
  
var subscribeHeaders = {
    'destination': '/topic/PC_Client',
    'ack': 'client-individual'
};

var stompClient = null;

function connectToStomp(){
	stompit.connect(connectOptions, stompConnectionCallback);
}

function stompConnectionCallback(error, client){
	// Check if a connection error occurred
	if (error){
		console.log('connect error ' + error.message);
		
		// Force disconnect of client
		if (stompClient){
			stompClient.disconnect();
		}
		
		stompClient = null;
		
		// Attempt to re-connect to stomp in 5 seconds
		setInterval(connectToStomp, 5000);
	}
	else {
		stompClient = client;
		
		// Send hearbeat message every 1 second
		setInterval(sendStompHeartbeat, 1000);
		
		// Subscribe to destination
		stompClient.subscribe(subscribeHeaders, onMessageReceived);
	}
}

function sendStompHeartbeat(){
	const headers = {
		destination: '/topic/PC_Client',
		'content-type': 'text/plain'
	};

	const frame = client.send(headers);

	frame.write('hello');
	frame.end();

	console.log('Connected');
}

function onMessageReceived(error, message) {
    if (error) {
      console.log('subscribe error ' + error.message);
	  
	  // TODO: Do we need to handle reconnect to destination?
      return;
    }
    
    message.readString('utf-8', function(error, body) {

      if(body=='hello'){
        message.ack();
      }else{
		  
		  var parseString = require('xml2js').parseString;
			  parseString(body, function (err, result) {
		  //     console.log(result.string);
		  // // console.dir(JSON.parse(result.string));
		  //  var values = JSON.parse(result.string); 
		  if (error) {
			console.log('read message error ' + error.message);
			return;
		  }
		  
		  console.log(result.string);
		  var physioArr = result.string.split("\r\n");

			  var count =0 ;
		  physioArr.forEach(function(eachData){

			if(eachData.length>0 && IsJsonString(eachData)){
			  temp = [];
			  var values = JSON.parse(eachData);
	//          console.log(values["Value"]);
			  for (var i = 0; i < values.length; i++){
				console.log(values[i]["Value"]);
				temp.push([values[i]["Value"],values[i]["Source"],values[i]["Type"],parseInt((parseFloat(values[i]["Timestamp"]))*1000),values[i]["Feature"],values[i]["SERIALNUMBER"],values[i]["DEVICECONNECTTIME"]]);
			  }

	//          temp.push([values["Value"],values["Source"],values["Type"],parseInt((parseFloat(values["Timestamp"]))*1000),values["Feature"],values["SERIALNUMBER"],values["DEVICECONNECTTIME"]]);
	//          console.log("TimeDiff:" + (Date.now()-((parseInt(values["Timestamp"]))*1000)));
			}

		  });

		  console.log(2222);
		  console.log(temp);
		  query = "INSERT INTO physlogicaltable (value, source,type, creationTimestamp, feature, SERIALNUMBER,DEVICECONNECTTIME) VALUES ?"

		  // console.log(((parseInt(values["Timestamp"])+5*60*60)*1000));
		  // console.log("timestamp:" + ((parseInt(values["Timestamp"]))*1000));
		  
		  
			
			return connection.query(query, [temp], function(err, results) {


			

			if (!err) {
			  console.log(results);

			} else {
			  console.log(err);
			  
			}
			message.ack();

		  });
		});
	  }
	});
}