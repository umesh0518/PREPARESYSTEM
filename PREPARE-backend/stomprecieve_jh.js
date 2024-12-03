//Variable Declarations
var mysql = require('mysql');
var dateTime=Math.round(Date.now())+1000*200;
var temp = [];


const stompit = require('stompit');

var database = require('./config/database');

var pool = require('./models/db_pool');

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


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
var stompClient;

//Log Status to Console Prior to Database Connectivity Being Established
console.log(1);
//Create initial Database Connection
//var connection;
/*var connection = mysql.createConnection(database['preparenlp']);
      connection.connect(function(err) {
        if (!err) {
		  //If No Error Indicate Database Connection Has Been Established
          console.log("Database is connected ... nn");
        } else {
		  //An Error Occurs Log Error to Console 
          return console.log(err);
		  //If Server Loses Connection Handle Disconnect and Try to Reestablish Database Connection
		  connectDB;
        }
      });
  */
var subscribeHeaders = {
    'destination': '/topic/PC_Client',
    'ack': 'client-individual'
};

function onMessageReceived(error, message) {
  if (error) {
    console.log('subscribe error ' + error.message);
  
  // TODO: Do we need to handle reconnect to destination?
  //Handle Reconnection to Database
  //connectDB;
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
    
    
    
    return pool.query(query, [temp], function(err, results) {

    if (!err) {
      //If No Error Log Messages to Console
      console.log(results);

    } else {
      console.log(err);
     //If Server Loses Connection Handle Disconnect and Try to Reestablish Database Connection
     //  connectDB();
      
    }
    message.ack();

    });
  });
  }
});
}





function connectToStomp(){
	//Connect to Stomp Client
	stompit.connect(connectOptions, function(error, client) {

    console.log(2);
    
    if (error) {
      // Check if a connection error occurred

      console.log('connect error ' + error.message);
      
      // Force disconnect of client
      if (stompClient){
        stompClient.disconnect();
      }
      
      stompClient = null;
      
      // Attempt to re-connect to stomp in 5 seconds
      /** CHANGED BY JH */
      //setInterval(connectToStomp, 5000);
      setTimeout(connectToStomp, 5000);
          return;
    }
    else
    {
      stompClient = client;
  
      // Send hearbeat message every 1 second
      setInterval(sendStompHeartbeat, 1000);
      
      // Subscribe to destination
      stompClient.subscribe(subscribeHeaders, onMessageReceived);
    }
});
}







function sendStompHeartbeat(){
	const headers = {
		destination: '/topic/PC_Client',
		'content-type': 'text/plain'
	};

	const frame = stompClient.send(headers);

	frame.write('hello');
	frame.end();

	console.log('Connected');
}


connectToStomp();

