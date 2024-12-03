var HomeController = require('./controllers/HomeController');
var ScenarioControllers = require('./controllers/ScenarioControllers');
var DataRoute = require('./routes/dataRoute.js');
var cors = require('cors')
var link = require('./config/links.js');

var UserAuthentication = require('./routes/UserAuthentication.js');
var multer = require('multer');


// Routes
module.exports = function (app, passport) {

    // Main Routes
    app.use(cors({}));



    //Get Physiological Data (wearables)
    app.get('/physioData', DataRoute.physioData);


    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/images/uploads')
        },
        filename: (req, file, cb) => {


            cb(null, file.originalname + '-' + Date.now() + "." + file['mimetype'].split("/")[1])
        }
    });


    var upload = multer({ storage: storage });
    app.post('/fileUpload', upload.single('myFile'), (req, res, next) => {
        if (req && req['file'] && req['file'] && req['file']['path'] && req && req['file'] && req['file'] && req['file']['originalname'] && req['file'] && req['file']['filename']) {
            params = {};


            params['path'] = req['file']['path'].substring(7, req['file']['path'].length);
            params['playId'] = req['file']['originalname'];
            params['name'] = req['file']['filename'];
            return ScenarioControllers.uploadFileDb(params, function (err, data) {
                if (err) {
                    return res.json({ 'message': 'Error' });
                }
                return res.json({ 'message': 'File uploaded successfully', 'data': data });

            })
        }


        //return saveFileDb()
        return res.json({ 'message': 'File uploaded successfully but not save in DB' });
    });





    app.post('/saveVRData', DataRoute.saveVRData);
    app.get('/downloadAssessmentData', DataRoute.downloadAssessmentData);


    app.get('/downloadInstructorData', DataRoute.downloadInstructorData);

    app.get('/downloadInstructorDataWithPhysio', DataRoute.downloadInstructorDataWithPhysio);

    app.get('/downloadPhysioDataRaw', DataRoute.downloadPhysioDataRaw);
    app.get('/downloadPhysioData', DataRoute.downloadPhysioData);



    //app.get('/other', HomeController.Other,AuthenticationConroller.checkAccessWrites, updateController.addinfo()) ;   
    app.get('/createscenario', UserAuthentication.verify, DataRoute.createScenario);

    app.get('/getCourseOverview', DataRoute.getCourseOverview);



    app.get('/getscenariobycourseid', UserAuthentication.verify, DataRoute.getscenariobycourseid);
    app.get('/addLearner', DataRoute.addLearner);
    app.get('/deleteLearner', DataRoute.deleteLearner);
    app.get('/getLearners', DataRoute.getLearners);
    app.get('/getscenario', DataRoute.getScenario);
    app.post('/addevent', DataRoute.addEvent);
    app.get('/getcourse', UserAuthentication.verify, DataRoute.getCourse);
    app.get('/getevent', DataRoute.getEvent);
    app.get('/deleteevent', UserAuthentication.verify, DataRoute.deleteEvent);
    app.get('/deletescenario', UserAuthentication.verify, DataRoute.deleteScenario);
    app.get('/getStreamData', DataRoute.getStreamData);

    app.get('/getPlayVidList', DataRoute.getPlayVidList);



    app.get('/getStreamDataResults', DataRoute.getStreamDataResults);

    app.get('/saveplay', UserAuthentication.verify, DataRoute.savePlay);
    app.get('/savegoals', UserAuthentication.verify, DataRoute.savegoals);
    app.get('/savepreassessment', UserAuthentication.verify, DataRoute.savepreassessment);
    app.get('/savepostassessment', UserAuthentication.verify, DataRoute.savepostassessment);
    app.get('/speceficcourse', DataRoute.speceficcourse);

    app.get('/getActiveDevices', DataRoute.getActiveDevices);

    app.get('/savepreassessmentformresponse', DataRoute.savepreassessmentformresponse);
    app.get('/savepostassessmentformresponse', DataRoute.savepostassessmentformresponse);







    app.get('/results', UserAuthentication.verify, DataRoute.results);
    app.get('/speceficresults', DataRoute.speceficResults);
    app.post('/login', UserAuthentication.login);
    app.post('/signup', UserAuthentication.signup);


    app.get('/physioData', function (req, res) {

        req.output = {}

        req.output.error = false;
        req.output.message = "shit";
        res.json(req.output);
    });

    app.post('/physioData', DataRoute.streamData);


    app.get('/createcourse', UserAuthentication.verify, DataRoute.createCourse);


    // Get Audio Stream
    app.get('/getAudioStream', UserAuthentication.verify, DataRoute.getAudioStream)
    // Add Audio Stream
    app.post('/addAudioStream', UserAuthentication.verify, DataRoute.addAudioStream)
    //Delete Audio Stream
    app.delete('/deleteAudioStream/:Id', UserAuthentication.verify, DataRoute.deleteAudioStream)

    // Get training authorization password
    app.get('/trainAuthorization', DataRoute.trainAuthorization)

    //Save Scenario Training Info
    app.get('/saveTrainingInfo', DataRoute.saveTrainingInfo)

    //Change Model Version
    app.get('/changeModelVersion', DataRoute.changeModelVersion)

    //Save nlp event detection information to played_nlp_events table
    app.post('/saveNlpPlay', DataRoute.saveNlpPlay);

	//test saveNlpPlay for docker-kub 
    app.post('/testNlpPlay', DataRoute.testNlpPlay);

    //Save ADJUSTED_TIMESTAMP  to played__events table
    app.post('/saveAdjustedTimestamps', DataRoute.saveAdjustedTimestamps);

    //Save nlp event detection information to played_nlp_events table
    app.post('/saveSentimentPlay', DataRoute.saveSentimentPlay);
    //Get training text
    app.get('/getTrainingText', DataRoute.getTrainingText);


};


