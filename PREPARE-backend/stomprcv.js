var Stomp = require('stomp-client');
var destination = '/topic/PhysioData1';
var client = new Stomp('3.14.176.211',61614, 'hamzaowais', 'paytm@123456');
var mysql = require('mysql');
var database = require('./config/database.js');



var dateTime=Math.round(Date.now())+1000*200;
var temp = [];


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

const stompit = require('stompit');


var connectOptions = {
  'host': 'b-9f2a7899-17c1-41fa-84e8-fc9d4f29cb55-1.mq.us-east-2.amazonaws.com',
  'port': 61614,
  'ssl': true,
  'connectHeaders':{
    'heart-beat': '1000,2000',
    'host': '/',
    'login': 'hamzaowais',
    'passcode': 'paytm@123456'
  }
};

// var connection = mysql.createConnection(database['preparenlp']);
//       connection.connect(function(err) {
//         if (!err) {
//           console.log("Database is connected ... nn");
//         } else {
//           return console.log(err);
//         }
//       });

stompit.connect(connectOptions, function(error, client) {
  
  if (error) {
    console.log('connect error ' + error.message);
    return;
  }
  
  var sendHeaders = {
    'destination': '/queue/test',
    'content-type': 'text/plain'
  };
  
  var frame = client.send(sendHeaders);
  frame.write('hello');
  frame.end();
  
  var subscribeHeaders = {
    'destination': '/topic/PC_Client_E4',
    'ack': 'client-individual'
  };
  
  client.subscribe(subscribeHeaders, function(error, message) {
    
    if (error) {
      console.log('subscribe error ' + error.message);
      return;
    }
    
    message.readString('utf-8', function(error, body) {
      
      var parseString = require('xml2js').parseString;
          parseString(body, function (err, result) {
          // console.dir(JSON.parse(result.string));
          console.log(result.string);

          if (error) {
            console.log('read message error ' + error.message);
            return;
          }
      
          

      message.ack();

     });
      // client.ack(message);
      
      // client.disconnect();
    });
  });
});