var mysql = require('mysql');
var database = require('./config/database.js');
var dateTime=Math.round(Date.now())+1000*200;
var temp = [];


const stompit = require('stompit');

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

console.log(1);
var connection = mysql.createConnection(database['preparenlp']);
      connection.connect(function(err) {
        if (!err) {
          console.log("Database is connected ... nn");
        } else {
          return console.log(err);
        }
      });

stompit.connect(connectOptions, function(error, client) {

  console.log(2);
  
  if (error) {
    console.log('connect error ' + error.message);
    return;
  }

  setInterval(function() {

        const headers = {
            destination: '/topic/PC_Client',
            'content-type': 'text/plain'
        };

        const frame = client.send(headers);

        frame.write('hello');
        frame.end();

        console.log('Connected');

    }, 1000);
  
  
  var subscribeHeaders = {
    'destination': '/topic/PC_Client',
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
  });
});