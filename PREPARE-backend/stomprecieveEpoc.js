var mysql = require('mysql');
var database = require('./config/database.js');
var dateTime=Math.round(Date.now())+1000*200;
var temp = [];


function IsJsonString(str) {
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

var connection = mysql.createConnection(database['preparenlp']);
      connection.connect(function(err) {
        if (!err) {
          console.log("Database is connected ... nn");
        } else {
          return console.log(err);
        }
      });

stompit.connect(connectOptions, function(error, client) {


  setInterval(function() {

        const headers = {
            destination: '/topic/PC_Client_EPOC+',
            'content-type': 'text/plain'
        };

        const frame = client.send(headers);

        frame.write('hello');
        frame.end();

        console.log('Connected');

    }, 1000);


  
  if (error) {
    console.log('connect error ' + error.message);
    return;
  }
  
  
  
  var subscribeHeaders = {
    'destination': '/topic/PC_Client_EPOC+',
    'ack': 'client-individual'
  };
  
  client.subscribe(subscribeHeaders, function(error, message) {

    if (error) {
      console.log('subscribe error ' + error.message);
      return;
    }
    
    
    message.readString('utf-8', function(error, body) {

      if(body=='hello'){
        message.ack();
      }else{
      
      var parseString = require('xml2js').parseString;
      console.log(body);
          parseString(body, function (err, result) {
      //     console.log(result.string);
      // // console.dir(JSON.parse(result.string));
      //  var values = JSON.parse(result.string); 
      if (error) {
        console.log('read message error ' + error.message);
        return;
      }
      
      var physioArr = result.string.split("\r\n");

          var count =0 ;
      physioArr.forEach(function(eachData){

        if(eachData.length>0 && IsJsonString(eachData)){
          var values = JSON.parse(eachData);
          // console.log(JSON.parse(dat));
          temp.push([values["Value"],values["Source"],values["Type"],parseInt((parseFloat(values["Timestamp"])+5*60*60)*1000),values["Feature"],values["SERIALNUMBER"],values["DEVICECONNECTTIME"]]);
          console.log("TimeDiff:" + (Date.now()-((parseInt(values["Timestamp"])+5*60*60)*1000)));
        }

        
            
      });

      if(temp.length>50){
        query = "INSERT INTO physlogicaltable (value, source,type, creationTimestamp, feature, SERIALNUMBER,DEVICECONNECTTIME) VALUES ?"

        // console.log(((parseInt(values["Timestamp"])+5*60*60)*1000));
        // console.log("timestamp:" + ((parseInt(values["Timestamp"]))*1000));  
        var temp1=temp;
        temp = [];
        return connection.query(query, [temp1], function(err, results) {
          if (!err) {
            console.log(results);

          } else {
            console.log(err);    
          }
          message.ack();
        });
      }
      
     });
    }
    });
  
  });
});