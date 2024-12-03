var mysql = require('mysql');

//var database = require('../config/database.js');
var pool = require('./db_pool');

module.exports = {


	saveVRData: function (inputparams, callback) {
		try {

			[inputparams.startTime, inputparams.endTime, inputparams.subjectID, inputparams.score, inputparams.scenarioID, inputparams.answer].forEach(function (eachP) {
				if (isNaN(eachP || eachP > 999999999999)) {
					return callback(new Error(eachP + " is not a Number"));
				}
			});

			query = "INSERT INTO vr_data (START_TIME, END_TIME, VR_SIM_ID,VR_SUBJECT_ID,SCORE,ANSWER) VALUES (?, ?, ?, ?, ?, ?)";


			return pool.query(query, [inputparams.startTime, inputparams.endTime, inputparams.scenarioID, inputparams.subjectID, inputparams.score, inputparams.answer], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},
	getConnectedDevices: function (inputparams, callback) {
		try {

			query = "select * from connected_devices where PLAY_ID = ?"

			return pool.query(query, [inputparams.playId], function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}



	},
	getSentimentDetails: function (inputparams, callback) {
		try {

			query = "select * from played_sentiment_events where PLAY_ID = ?"

			return pool.query(query, [inputparams.playId], function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}



	},
	getUploadFileList: function (inputparams, callback) {
		try {

			query = "select * from plays_vid where PLAY_ID = ?"

			return pool.query(query, [inputparams.playId], function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}
	},

	getAllLearners: function (inputparams, callback) {
		try {
			console.log(inputparams);
			query = "select l.*, (Select count(play_id) from plays_trainee where learner_id = l.learner_id) as numPlays from learners l where course_id=?"

			return pool.query(query, [inputparams.courseId], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}


	},
	savepostassessmentformresponse: function (inputparams, callback) {
		try {
			query = "INSERT INTO postassessment_response (COURSE_ID, LEARNER_ID, LEARNER_NAME,LEARNER_DETAIL,FORMDATA) VALUES (?, ?, ?, ?, ?)";
			return pool.query(query, [inputparams.course_id, inputparams.learner_id, inputparams.learner_name, inputparams.learnerDetail, inputparams.formData], function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},

	savepreassessmentformresponse: function (inputparams, callback) {
		try {
			query = "INSERT INTO preassessment_response (COURSE_ID, LEARNER_ID, LEARNER_NAME,LEARNER_DETAIL,FORMDATA) VALUES (?, ?, ?, ?, ?)";


			return pool.query(query, [inputparams.course_id, inputparams.learner_id, inputparams.learner_name, inputparams.learnerDetail, inputparams.formData], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	addLearner: function (inputparams, callback) {
		try {
			query = "INSERT INTO learners (LEARNER_NAME, ROCKET_ID, ROLE,YEARS,FACULTY,COURSE_ID) VALUES (?, ?, ?, ?, ?, ?)";

			return pool.query(query, [inputparams.learnerName, inputparams.rocketId, inputparams.role, inputparams.years, inputparams.faculty, inputparams.courseId], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	deleteLearner: function (inputparams, callback) {
		try {
			query = "Delete from learners where learner_id = ?";

			return pool.query(query, [inputparams.learner_id], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	uploadFileDb: function (inputparams, callback) {
		try {
			query = "INSERT INTO plays_vid (PLAY_ID, PATH, NAME) VALUES (?, ?, ?)"
			return pool.query(query, [inputparams.playId, inputparams.path, inputparams.name], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},

	getPreassessmentResponse1: function (inputparams, callback) {
		try {
			query = "select * from preparenlp.preassessment_response where course_id=?;"

			return pool.query(query, [inputparams.courseId], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getPostassessmentResponse1: function (inputparams, callback) {
		try {
			query = "select * from preparenlp.postassessment_response where course_id=?;"

			return pool.query(query, [inputparams.courseId], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	getStreamDataResultsHR: function (inputparams, callback) {
		try {
			query = "SELECT round(creationTimestamp/1000) as tp, feature as label, avg(value)  as val FROM preparenlp.physlogicaltable where SERIALNUMBER=?  and creationTimestamp> ? and creationTimestamp < ? and feature ='HEART_RATE' group by  tp, label order by tp asc;"

			return pool.query(query, [inputparams.serialNumber, inputparams.startTime, inputparams.endTime], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},

	getPlayedEventswithPhysio: function (inputparams, callback) {
		try {
			query = "SELECT pe.*, e.OBJECTIVES as obj1, e.*, sc.SCENARIO_NAME, pt.LEARNER_ID, pt.SERIALNUMBER FROM preparenlp.played_events pe left join preparenlp.events e on e.event_id = pe.event_id left join preparenlp.scenario sc on sc.scenario_id = e.scenario_id left join preparenlp.plays_trainee pt on pt.PLAY_ID=pe.PLAY_ID where  pe.play_id in (SELECT PLAY_ID FROM preparenlp.plays p  where p.INACTIVE= 0 and p.scenario_id in (select scenario_id from preparenlp.scenario where course_id=?));"

			return pool.query(query, [inputparams.courseId], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getPlayedEvents1: function (inputparams, callback) {
		try {

			query = "SELECT pe.*, pn.TIMESTAMP AS 'NLP_TIMESTAMP', CASE WHEN pn.TIMESTAMP <> '' THEN TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(pn.TIMESTAMP / 1000), FROM_UNIXTIME(pe.TIMESTAMP / 1000)) ELSE NULL END AS 'TIME_DIFF_SECONDS(INSTRUCTOR TIME - NLP TIME)',pn.AUTOMATED_NLP_SCORE, e.OBJECTIVES AS obj1, e.*, sc.SCENARIO_NAME, pt.LEARNER_ID, pt.SERIALNUMBER FROM preparenlp.played_events pe LEFT JOIN preparenlp.events e ON e.event_id = pe.event_id LEFT JOIN preparenlp.scenario sc ON sc.scenario_id = e.scenario_id LEFT JOIN preparenlp.plays_trainee pt ON pt.PLAY_ID = pe.PLAY_ID LEFT JOIN played_nlp_events pn ON pn.PLAY_ID = pe.PLAY_ID AND pn.PREDICTED_EVENT_ID = pe.event_id WHERE pe.play_id IN (SELECT PLAY_ID FROM preparenlp.plays WHERE scenario_id IN (SELECT scenario_id FROM preparenlp.scenario WHERE course_id = ?));"
			return pool.query(query, [inputparams.courseId], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},


	getPlayedEvents: function (inputparams, callback) {
		try {


			query = "SELECT pe.*, e.OBJECTIVES as obj1, e.*, sc.SCENARIO_NAME, pt.LEARNER_ID FROM preparenlp.played_events pe left join preparenlp.events e on e.event_id = pe.event_id left join preparenlp.scenario sc on sc.scenario_id = e.scenario_id left join preparenlp.plays_trainee pt on pt.PLAY_ID=pe.PLAY_ID where pe.play_id in (SELECT PLAY_ID FROM preparenlp.plays where scenario_id in (select scenario_id from preparenlp.scenario where course_id=?)) and pt.LEARNER_ID in (?);"

			return pool.query(query, [inputparams.courseId, inputparams.learner_ids], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	getGoalsObjectives: function (inputparams, callback) {
		try {

			query = "SELECT * FROM preparenlp.scenario_goals where course_id=?;"

			return pool.query(query, [inputparams.courseId], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getPreassessmentResponse: function (inputparams, callback) {
		try {

			query = "select * from preparenlp.preassessment_response where course_id=? and LEARNER_ID in (?);"

			return pool.query(query, [inputparams.courseId, inputparams.learner_ids], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getPostassessmentResponse: function (inputparams, callback) {
		try {

			query = "select * from preparenlp.postassessment_response where course_id=? and LEARNER_ID in (?);"

			return pool.query(query, [inputparams.courseId, inputparams.learner_ids], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}
	},
	getPreassessmentDetails: function (inputparams, callback) {
		try {

			query = "select * from preparenlp.scenario_preassessment where course_id=?;"
			return pool.query(query, [inputparams.courseId], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getPostassessmentDetails: function (inputparams, callback) {
		try {

			query = "select * from preparenlp.scenario_postassessment where course_id=?;"
			return pool.query(query, [inputparams.courseId], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},


	getCourseDetails: function (inputparams, callback) {
		try {
			query = "SELECT * FROM preparenlp.course where course_id=?"

			return pool.query(query, [inputparams.course_id], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	getGoals: function (inputparams, callback) {
		try {

			query = "select * from scenario_goals where course_id=?"

			return pool.query(query, [inputparams.course_id], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	getPreassessmentData: function (inputparams, callback) {
		try {

			query = "select * from scenario_preassessment where course_id=?"

			return pool.query(query, [inputparams.course_id], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getActiveDevices: function (inputparams, callback) {
		try {
			query = "SELECT SERIALNUMBER FROM (SELECT SERIALNUMBER, creationTimestamp FROM preparenlp.physlogicaltable order by id desc limit 250000) as t where creationTimestamp>=? group by SERIALNUMBER;"

			return pool.query(query, [inputparams.dateTime], function (err, results) {
				console.log(results);

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	getPostassessmentData: function (inputparams, callback) {
		try {

			query = "select * from scenario_postassessment where course_id=?"

			return pool.query(query, [inputparams.course_id], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},

	getStreamDataResultsRawCSV: function (inputparams, callback) {
		try {
			query = "SELECT  * FROM preparenlp.physlogicaltable where SERIALNUMBER in ((SELECT SERIALNUMBER FROM preparenlp.connected_devices where PLAY_ID=?))  and creationTimestamp> ? and creationTimestamp < ? order by id asc;"
			return pool.query(query, [inputparams.play_id, inputparams.startTime, inputparams.endTime], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},

	getStreamDataResultsRaw: function (inputparams, callback) {
		try {
			query = "SELECT  * FROM preparenlp.physlogicaltable where SERIALNUMBER=?  and creationTimestamp> ? and creationTimestamp < ? order by id asc;"

			return pool.query(query, [inputparams.serialNumber, inputparams.startTime, inputparams.endTime], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}
	},


	getStreamDataResults: function (inputparams, callback) {
		try {

			query = "SELECT round(creationTimestamp/1000) as tp, feature as label, avg(value)  as val FROM preparenlp.physlogicaltable where SERIALNUMBER=?  and creationTimestamp> ? and creationTimestamp < ? group by  tp, label order by tp asc;"

			return pool.query(query, [inputparams.serialNumber, inputparams.startTime, inputparams.endTime], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},

	getStreamDataResultsCSV: function (inputparams, callback) {
		try {
			query = "SELECT round(creationTimestamp/1000) as tp, feature as label, avg(value)  as val FROM preparenlp.physlogicaltable where SERIALNUMBER in ((SELECT SERIALNUMBER FROM preparenlp.connected_devices where PLAY_ID=?))  and creationTimestamp> ? and creationTimestamp < ? group by  tp, label order by tp asc;"

			return pool.query(query, [inputparams.play_id, inputparams.startTime, inputparams.endTime], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getStreamData1: function (inputparams, callback) {
		try {

			console.log("Database is connected ... nn");
			query = "SELECT value, source, type, creationTimestamp,feature from preparenlp.physlogicaltable where (creationTimestamp >  ?) order by creationTimestamp asc"

			console.log(inputparams.unixtime);
			console.log(typeof (inputparams.unixtime));

			var num = parseFloat(inputparams.unixtime);
			console.log(num);
			console.log(typeof (num));

			console.log('dd:');
			console.log(inputparams.unixtime)
			return pool.query(query, [num], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	getStreamData: function (inputparams, callback) {
		try {

			query = "SELECT feature, avg(value) as value FROM preparenlp.physlogicaltable  where creationTimestamp > ?  and SERIALNUMBER = ?  group by feature"

			return pool.query(query, [inputparams.time, inputparams.serialNumber], function (err, results) {


				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	savepostassessment: function (inputdata, callback) {
		try {
			if (inputdata.length == 0) {
				return callback(null, []);
			}

			query = "INSERT INTO scenario_postassessment (COURSE_ID, QUESTIONTYPE, QUESTIONSTRING,DESCRIPTION,TEXT) VALUES ?";

			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	saveassessment: function (inputdata, callback) {
		try {
			if (inputdata.length == 0) {
				return callback(null, []);
			}

			query = "INSERT INTO scenario_preassessment (COURSE_ID, QUESTIONTYPE, QUESTIONSTRING,DESCRIPTION,TEXT) VALUES ?";

			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},

	savegoals: function (inputdata, callback) {
		try {
			if (inputdata.length == 0) {
				return callback(null, []);
			}

			query = "INSERT INTO scenario_goals (COURSE_ID, GOAL_NAME) VALUES ?";

			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},
	streamData: function (inputdata, callback) {
		try {
			if (inputdata.length == 0) {
				return callback(null, []);
			}

			query = "INSERT INTO empaticabanddata (timestamp, label, value, serialNumber, deviceConnectTime) VALUES ?"

			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},
	saveComments: function (inputdata, callback) {
		try {
			if (inputdata.length == 0) {
				return callback(null, []);
			}

			query = "INSERT INTO plays_comments (PLAY_ID, COMMENT) VALUES ?"

			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},
	insertDeviceData: function (inputdata, callback) {
		try {

			console.log(inputdata);
			query = "INSERT INTO connected_devices (PLAY_ID,DEVICECONNECTTIME,SERIALNUMBER) VALUES ?"

			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {

					return callback(null, results);

				} else {
					console.log("Database is connected ... n3");
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},
	insertPlaysTrainee: function (inputdata, callback) {
		try {

			console.log(inputdata);
			query = "INSERT INTO plays_trainee (PLAY_ID, TRAINEE_F_NAME,TRAINEE_L_NAME,TRAINEE_DISCIPLINE,TRAINEE_YEARS,SCENARIO_ROLE_ID,RATING,LEARNER_ID, ROCKET_ID) VALUES ?"

			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}


	},

	insertPlayedEvents: function (inputdata, callback) {
		try {

			query = "INSERT INTO played_events (PLAY_ID, EVENT_ID,POINTS,SCENARIO_ROLE_ID, TIMESTAMP,TIME,SKILL_LEVEL,AUTOMATED_INSTRCUTOR_SCORE) VALUES ?";


			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},
	createPlay: function (inputdata, callback) {
		try {

			query = "INSERT INTO plays (SCENARIO_ID, user_id) VALUES (?,?)"


			return pool.query(query, [inputdata.scenario_id, inputdata.user_id], function (err, results) {


				if (!err) {
					return callback(null, results);

				} else {
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},
	addRoles: function (inputdata, callback) {
		try {


			var query = "INSERT INTO scenario_role (SCENARIO_ID, ROLE_NAME, NUMBER) VALUES ?"


			return pool.query(query, [inputdata], function (err, results) {


				if (!err) {



					var ress = {
						message: 'allok'
					};
					return callback(null, ress);



				} else {
					console.log(err);
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},

	createCourse: function (inputdata, callback) {
		try {

			query = "INSERT INTO course (COURSE_NAME,id) VALUES (?, ?)"


			return pool.query(query, [inputdata.coursename, inputdata.user_id], function (err, results) {


				if (!err) {



					var ress = {
						message: 'allok',
						scenario_id: results.insertId
					};
					return callback(null, ress);



				} else {
					console.log(err);
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}
	},


	createScenario: function (inputdata, callback) {
		try {

			query = "INSERT INTO scenario (SCENARIO_NAME, TIME_DURATION, CATEGORY, COURSE_ID) VALUES (?, ?, ?,?)"


			return pool.query(query, [inputdata.scenario_name, inputdata.scenario_time, inputdata.category, inputdata.course_id], function (err, results) {


				if (!err) {



					var ress = {
						message: 'allok',
						scenario_id: results.insertId
					};
					return callback(null, ress);



				} else {
					console.log(err);
					return callback(err);
				}
			});



		} catch (e) {
			return callback(e);
		}

	},
	addEvent: function (inputdata, callback) {
		try {

			console.log(inputdata.objectives);

			var query = "INSERT INTO events (SCENARIO_ID, EVENT_NAME, TIME_START, SKILL_TYPE, SPECIFIC_SKILL,HEART_RATE,SYSTOLIC_BP,DISTOLIC_BP,SPO2,R_RATE,CARDIAC_RYTHM,SCENARIO_ROLE_ID,OBJECTIVES,LOOKUP_WORDS_SYNONYMS,EVENT_TIMEOUT, EVENT_PENALTY_COEFFICIENT,DELTA_SYNCHRONIZATION,NON_SEQUENCE_PENALTY) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
			return pool.query(query, [inputdata.scenario_id, inputdata.eventname, inputdata.timestart, inputdata.skilltype, inputdata.specificskill, inputdata.heart_rate, inputdata.systolic_bp, inputdata.diastolic_bp, inputdata.spo2, inputdata.r_rate, inputdata.cardiac_rhythm, inputdata.scenario_role_id, inputdata.objectives1, inputdata.lookupSynonyms, inputdata.event_timeout, inputdata.event_penalty_coefficient, inputdata.delta_synchronization, inputdata.non_sequence_penalty], function (err, results) {

				if (!err) {
					var ress = {
						message: 'allok'
					};
					return callback(null, ress);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},

	deletepostassessment: function (course_id, callback) {
		try {

			query = "DELETE FROM scenario_postassessment WHERE COURSE_ID=?"
			return pool.query(query, [course_id], function (err, results) {

				if (!err) {
					var ress = {
						message: 'allok'
					};
					return callback(null, ress);
				} else {
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},

	deletepreassessment: function (course_id, callback) {
		try {

			query = "DELETE FROM scenario_preassessment WHERE COURSE_ID=?"
			return pool.query(query, [course_id], function (err, results) {

				if (!err) {
					var ress = {
						message: 'allok'
					};
					return callback(null, ress);
				} else {
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},

	deletegoals: function (course_id, callback) {
		try {

			query = "DELETE FROM scenario_goals  WHERE COURSE_ID=?"
			return pool.query(query, [course_id], function (err, results) {

				if (!err) {
					var ress = {
						message: 'allok'
					};
					return callback(null, ress);
				} else {
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	deleteEvent: function (inputdata, callback) {
		try {

			query = "DELETE FROM events WHERE EVENT_ID=?"
			return pool.query(query, [inputdata.event_id], function (err, results) {

				if (!err) {
					var ress = {
						message: 'allok'
					};
					return callback(null, ress);
				} else {
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	deleteScenario: function (inputdata, callback) {
		try {

			query = "DELETE FROM EVENTS WHERE SCENARIO_ID=?"
			return pool.query(query, [inputdata.scenario_id], function (err, results) {
				if (!err) {
					query = "DELETE FROM scenario  WHERE SCENARIO_ID=?"
					return pool.query(query, [inputdata.scenario_id], function (err, results) {

						if (!err) {
							var ress = {
								message: 'allok'
							};
							return callback(null, ress);
						} else {
							return callback(err);
						}
					});
				} else {
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	getLearnersByScenarioid: function (s_id, callback) {
		try {


			query = "select * from learners where COURSE_ID in(select distinct(course_id) as course_id FROM scenario where scenario_id=?);"

			return pool.query(query, s_id, function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	getGoalsObjectivesbyscenarioid: function (s_id, callback) {
		try {

			query = "select * from preparenlp.scenario_goals sg  where COURSE_ID in (select COURSE_ID from scenario where SCENARIO_ID=?);"
			return pool.query(query, s_id, function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	getEvents: function (s_id, callback) {
		try {

			query = "select e.*,sr.ROLE_NAME from events e left join scenario_role sr on sr.SCENARIO_ROLE_ID=e.SCENARIO_ROLE_ID where e.scenario_id=?"
			return pool.query(query, s_id, function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	getRoles: function (s_id, callback) {
		try {

			query = "select SCENARIO_ROLE_ID, SCENARIO_ID, ROLE_NAME, `NUMBER` from scenario_role where scenario_id=?";
			return pool.query(query, s_id, function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	results: function (inputdata, callback) {
		try {

			var query = "select  s.SCENARIO_NAME,    p.CREATED_AT , CONCAT(pt.trainee_f_name) AS `Trainee Name`,  pt.trainee_l_name as trainee_l_name ,CONCAT(u.fname, u.lname) AS 'Observer name',    AVG(CASE        WHEN e.SKILL_TYPE = 'behavioral' THEN pe.POINTS        ELSE NULL    END) AS `behavioral AVG`,    AVG(CASE        WHEN e.SKILL_TYPE = 'psychomotor' THEN pe.POINTS        ELSE NULL    END) AS `psychomotor AVG`,    AVG(CASE        WHEN e.SKILL_TYPE = 'cognitive' THEN pe.POINTS        ELSE NULL    END) AS `cognitive AVG`, cd.SERIALNUMBER,    pe.play_id from  played_events  pe left join events e ON pe.EVENT_ID = e.EVENT_ID LEFT JOIN  scenario  s  ON s.scenario_id = e.scenario_id      LEFT JOIN    plays p ON p.play_id = pe.play_id left join connected_devices cd ON cd.play_id = pe.play_id  left join plays_trainee pt on pt.SCENARIO_ROLE_ID=pe.SCENARIO_ROLE_ID and pt.PLAY_ID=pe.PLAY_ID    LEFT JOIN    users u ON u.id = p.user_id    WHERE    s.SCENARIO_NAME IS NOT NULL and pt.TRAINEE_F_NAME is not null  and  p.PLAY_ID>108 and s.COURSE_ID = ? and p.INACTIVE=0  GROUP BY pe.PLAY_ID , e.scenario_id, pt.TRAINEE_L_NAME, pt.trainee_f_name,pt.SERIALNUMBER;"
			//var query = " select  s.SCENARIO_NAME,    p.CREATED_AT, pt.SERIALNUMBER  , CONCAT(pt.trainee_f_name) AS `Trainee Name`,  pt.trainee_l_name as trainee_l_name ,CONCAT(u.fname, u.lname) AS 'Observer name',    AVG(CASE        WHEN e.SKILL_TYPE = 'behavioral' THEN pe.POINTS        ELSE NULL    END) AS `behavioral AVG`,    AVG(CASE        WHEN e.SKILL_TYPE = 'psychomotor' THEN pe.POINTS        ELSE NULL    END) AS `psychomotor AVG`,    AVG(CASE        WHEN e.SKILL_TYPE = 'cognitive' THEN pe.POINTS        ELSE NULL    END) AS `cognitive AVG`,    pe.play_id from  played_events  pe left join events e ON pe.EVENT_ID = e.EVENT_ID LEFT JOIN  scenario  s  ON s.scenario_id = e.scenario_id      LEFT JOIN    plays p ON p.play_id = pe.play_id    left join plays_trainee pt on pt.SCENARIO_ROLE_ID=pe.SCENARIO_ROLE_ID and pt.PLAY_ID=pe.PLAY_ID    LEFT JOIN    users u ON u.id = p.user_id    WHERE    s.SCENARIO_NAME IS NOT NULL and pt.TRAINEE_F_NAME is not null  and  p.PLAY_ID>108 and s.COURSE_ID = ? and p.INACTIVE=0  GROUP BY pe.PLAY_ID , e.scenario_id, pt.TRAINEE_L_NAME, pt.trainee_f_name,pt.SERIALNUMBER;"
			//SELECT  s.SCENARIO_NAME, p.CREATED_AT, concat(p.trainee_f_name, ' ',p.trainee_l_name) as `Trainee Name`, concat(u.fname, u.lname) as 'Observer name',  avg(case when e.SKILL_TYPE='behavioral' then pe.POINTS else null end) as `behavioral AVG`,  avg(case when e.SKILL_TYPE='psychomotor' then pe.POINTS else null end) as `psychomotor AVG`,  avg(case when e.SKILL_TYPE='cognitive' then pe.POINTS else null end) as `cognitive AVG`, pe.play_id FROM preparenlp.PLAYED_EVENTS pe  left join events e on pe.EVENT_ID=e.EVENT_ID   left join SCENARIO S on s.scenario_id =e.scenario_id    left join PLAYS p on p.play_id=pe.play_id  left join users u on  u.id=p.user_id where  s.SCENARIO_NAME is not NULL group by pe.PLAY_ID,e.scenario_id ;";

			return pool.query(query, inputdata.course_id, function (err, results) {
				if (!err) {

					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	speceficResults: function (inputdata, callback) {
		try {
			query = "SELECT s.SCENARIO_NAME,s.CATEGORY,CONCAT(u.fname, ' ', u.lname) AS 'Observer Name',CONCAT(pt.TRAINEE_F_NAME, ' ', pt.TRAINEE_L_NAME) AS 'TRAINEE Name',pt.TRAINEE_L_NAME AS lname, pt.DEVICECONNECTTIME, pt.SERIALNUMBER, e.EVENT_NAME,e.EVENT_ID,e.SKILL_TYPE,e.SPECIFIC_SKILL,e.HEART_RATE,e.SYSTOLIC_BP,e.DISTOLIC_BP AS DISTOLIC_BP,e.SPO2,R_RATE,e.NON_SEQUENCE_PENALTY,e.DELTA_SYNCHRONIZATION,e.CARDIAC_RYTHM,pe.POINTS, pe.TIMESTAMP, pe.TIME, pe.ID, pe.AUTOMATED_INSTRCUTOR_SCORE,pn.AUTOMATED_NLP_SCORE,pn.TIMESTAMP AS 'NLP_TIMESTAMP', pn.PREDICTED_TEXT FROM  played_events pe LEFT JOIN plays p ON p.PLAY_ID = pe.PLAY_ID LEFT JOIN plays_trainee pt on pt.PLAY_ID=pe.PLAY_ID LEFT JOIN users u ON u.id = p.user_id LEFT JOIN scenario s ON s.scenario_id = p.scenario_id LEFT JOIN events e ON e.event_id = pe.event_id LEFT JOIN played_nlp_events pn ON pn.PLAY_ID = pe.PLAY_ID AND pn.PREDICTED_EVENT_ID = pe.event_id WHERE p.PLAY_ID =? and pt.TRAINEE_L_NAME=?"
			return pool.query(query, [inputdata.play_id, inputdata.lastname], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},

	getComments: function (inputdata, callback) {
		try {

			query = "select * from plays_comments where play_id=?";
			return pool.query(query, [inputdata.play_id], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},

	traineeHistory: function (lname, callback) {

		try {

			query = "SELECT     a.PLAY_ID,    a.points AS TOTAL_AVG,    b.points AS BEHAVIORAL_AVG,    c.points AS PSYCHOMOTOR_AVG,    d.points AS COGNITIVE_AVG FROM    (SELECT         pe.PLAY_ID, COUNT(*), AVG(POINTS) AS points    FROM        preparenlp.played_events pe    LEFT JOIN `events` e ON e.EVENT_ID = pe.EVENT_ID    LEFT JOIN plays p ON p.play_id = pe.play_id    LEFT JOIN plays_trainee pt on pt.PLAY_ID=p.PLAY_ID    WHERE        pt.TRAINEE_L_NAME = ?    GROUP BY pe.PLAY_ID) a        LEFT JOIN    (SELECT         pe.PLAY_ID, COUNT(*), AVG(POINTS) AS points    FROM        preparenlp.played_events pe    LEFT JOIN `events` e ON e.EVENT_ID = pe.EVENT_ID    LEFT JOIN plays p ON p.play_id = pe.play_id    LEFT JOIN plays_trainee pt on pt.PLAY_ID=p.PLAY_ID    WHERE        pt.TRAINEE_L_NAME = ?            AND e.SKILL_TYPE = 'behavioral'    GROUP BY pe.PLAY_ID) b ON a.play_id = b.play_id        LEFT JOIN    (SELECT         pe.PLAY_ID, COUNT(*), AVG(POINTS) AS points    FROM        preparenlp.played_events pe    LEFT JOIN `events` e ON e.EVENT_ID = pe.EVENT_ID    LEFT JOIN plays p ON p.play_id = pe.play_id    LEFT JOIN plays_trainee pt on pt.PLAY_ID=p.PLAY_ID    WHERE        pt.TRAINEE_L_NAME = ?            AND e.SKILL_TYPE = 'psychomotor'    GROUP BY pe.PLAY_ID) c ON a.play_id = c.play_id        LEFT JOIN    (SELECT         pe.PLAY_ID, COUNT(*), AVG(POINTS) AS points    FROM        preparenlp.played_events pe    LEFT JOIN `events` e ON e.EVENT_ID = pe.EVENT_ID    LEFT JOIN plays p ON p.play_id = pe.play_id    LEFT JOIN plays_trainee pt on pt.PLAY_ID=p.PLAY_ID    WHERE        pt.TRAINEE_L_NAME = ?            AND e.SKILL_TYPE = 'cognitive'    GROUP BY pe.PLAY_ID) d ON a.play_id = d.play_id;"

			return pool.query(query, [lname, lname, lname, lname], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	traineeHistorySkills: function (lname, callback) {

		try {

			query = "SELECT  skill_type,pe.play_id, avg(pe.points) as points FROM preparenlp.played_events pe LEFT JOIN preparenlp.events e ON e.EVENT_ID = pe.EVENT_ID LEFT JOIN preparenlp.plays_trainee pt ON pt.play_id = pe.play_id and pt.scenario_role_id=pe.scenario_role_id where pt.trainee_l_name=? group by skill_type,pe.play_id;"

			return pool.query(query, [lname, lname, lname, lname], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},

	traineeHistorySpecificSkill: function (lname, callback) {

		try {

			query = "SELECT  specific_skill,pe.play_id, avg(pe.points) as points FROM preparenlp.played_events pe LEFT JOIN preparenlp.events e ON e.EVENT_ID = pe.EVENT_ID LEFT JOIN preparenlp.plays_trainee pt ON pt.play_id = pe.play_id and pt.scenario_role_id=pe.scenario_role_id where pt.trainee_l_name=? group by specific_skill,pe.play_id;"

			return pool.query(query, [lname, lname, lname, lname], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	traineeHistoryEvent: function (lname, callback) {

		try {

			query = "SELECT  event_name,pe.play_id, avg(pe.points) as points FROM preparenlp.played_events pe LEFT JOIN preparenlp.events e ON e.EVENT_ID = pe.EVENT_ID LEFT JOIN preparenlp.plays_trainee pt ON pt.play_id = pe.play_id and pt.scenario_role_id=pe.scenario_role_id where pt.trainee_l_name=? group by event_name,pe.play_id;"

			return pool.query(query, [lname, lname, lname, lname], function (err, results) {

				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	getScenarioById: function (s_id, callback) {
		try {

			query = "SELECT * FROM scenario where scenario_id=? "

			return pool.query(query, s_id, function (err, results) {


				if (!err) {
					console.log(results);
					return callback(null, results);
				} else {
					console.log(results);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getCourses: function (callback) {
		try {

			query = "SELECT s.*, u.username  FROM preparenlp.course s left join users u on u.id=s.id where s.course_id > 35 and s.INACTIVE=0";

			return pool.query(query, function (err, results) {


				if (!err) {
					console.log(results);
					return callback(null, results);
				} else {
					console.log(results);
					return callback(err);
				}
			});


		} catch (e) {
			return callback(e);
		}

	},
	getscenariobycourseid: function (inputdata, callback) {
		try {


			query = "SELECT CATEGORY as DISCIPLINE, SCENARIO_NAME as `SCENARIO NAME`, (TIME_DURATION/60) as 'TIME DURATION', scenario_id, course_id, LAST_TRAIN_DATE, MODEL_VERSIONS, SELECTED_MODEL_VERSION  FROM scenario where course_id = ? "

			return pool.query(query, [inputdata.course_id], function (err, results) {


				if (!err) {
					console.log(results);
					return callback(null, results);
				} else {
					console.log(results);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	},
	getScenario: function (callback) {
		try {
			query = "SELECT CATEGORY as DISCIPLINE, SCENARIO_NAME as `SCENARIO NAME`, (TIME_DURATION/60) as 'TIME DURATION', scenario_id  FROM preparenlp.scenario  where scenario_id>31"

			return pool.query(query, function (err, results) {


				if (!err) {

					return callback(null, results);
				} else {

					return callback(err);
				}
			});


		} catch (e) {


			return callback(e);
		}
	},
	//Get audio Stream
	getAudioStream: function (callback) {
		try {
			query = "SELECT * FROM audio_stream";

			return pool.query(query, function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}
	},
	//Add Audio Stream
	addAudioStream: function (inputdata, callback) {
		try {
			let query = "INSERT INTO audio_stream (Room, Ip, Port, Protocol, Fs, Channels) VALUES (?, ?, ?, ?, ?, ?)";
			let values = [
				inputdata.Room,
				inputdata.Ip,
				inputdata.Port,
				inputdata.Protocol,
				inputdata.Fs || null,
				inputdata.Channels || null
			];

			return pool.query(query, values, function (err, results) {
				if (!err) {
					var ress = {
						message: 'Successfully added to database'
					};
					return callback(null, ress);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}
	},
	//Delete Audio Stream
	deleteAudioStream: function (id, callback) {
		try {
			query = "Delete from audio_stream where Id = ?";

			return pool.query(query, [id], function (err, results) {
				if (!err) {
					var ress = {
						message: 'Successfully deleted from the database'
					};
					return callback(null, ress);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}
	},
	//Save Scenario Training Info
	saveTrainingInfo: function (insertParams, callback) {
		try {
			const query = `
            UPDATE scenario 
            SET 
                MODEL_VERSIONS = CASE 
                    WHEN (MODEL_VERSIONS IS NULL OR MODEL_VERSIONS = '') THEN ? 
                    ELSE CONCAT(MODEL_VERSIONS, ',', ?) 
                END,
                LAST_TRAIN_DATE = NOW()
            WHERE SCENARIO_ID = ?;
        `;

			return pool.query(query, [insertParams.model_version, insertParams.model_version, insertParams.scenario_id], function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}
	},
	//Change Model Version
	changeModelVersion: function (insertParams, callback) {
		try {

			const query = "UPDATE scenario SET SELECTED_MODEL_VERSION = ? WHERE SCENARIO_ID = ?";

			return pool.query(query, [insertParams.version, insertParams.scenario_id], function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}
	},

	//Save nlp event detection information to played_nlp_events table
	saveNlpPlay: function (nlpPlayDataRows, callback) {
		try {
			if (nlpPlayDataRows.length === 0) {
				return callback(null, {
					message: 'No data to save',
					error: false
				});
			}
			// Construct a query template for inserting data.
			const query = `
				INSERT INTO played_nlp_events
				(PLAY_ID, SCENARIO_ROLE_ID, PREDICTED_TEXT, PREDICTED_EVENT_LOOKUP, LOOKUP_COUNTER,
				PREDICTED_EVENT_NLP, FINAL_PREDICTED_EVENT, PREDICTED_EVENT_ID, TIME, TIMESTAMP, AUTOMATED_NLP_SCORE)
				VALUES ?`;

			return pool.query(query, [nlpPlayDataRows], function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},
	saveAdjustedTimestamps: async function (adjustedTimeStampRows, callback) {
		try {
			if (adjustedTimeStampRows.length === 0) {
				return callback(null, {
					message: 'No data to save',
					error: false
				});
			}

			console.log('Data to be sent:', adjustedTimeStampRows);

			// Disable SQL_SAFE_UPDATES mode
			const disableSafeUpdates = "SET SQL_SAFE_UPDATES=0;";
			await pool.query(disableSafeUpdates);

			// Construct and execute the UPDATE query for each row
			for (let row of adjustedTimeStampRows) {
				const [adjustedTimestamp, playId, eventId] = row;
				const query = `
					UPDATE preparenlp.played_events 
					SET ADJUSTED_TIMESTAMP = ?
					WHERE PLAY_ID = ? AND EVENT_ID = ?;
				`;

				await pool.query(query, [adjustedTimestamp, playId, eventId]);
			}

			// Re-enable SQL_SAFE_UPDATES mode after all queries have been executed
			const enableSafeUpdates = "SET SQL_SAFE_UPDATES=1;";
			await pool.query(enableSafeUpdates);
			return callback(null, { message: "All rows updated successfully" });

		} catch (e) {
			console.log(e);
			return callback(e);
		}
	},

	//Save setiment detection information to played_nlp_events table
	saveSentimentPlay: function (sentimentPlayDataRows, callback) {
		console.log('This is sentiment Data Rows', sentimentPlayDataRows)
		try {
			if (sentimentPlayDataRows.length === 0) {
				return callback(null, {
					message: 'No data to save',
					error: false
				});
			}
			// Construct a query template for inserting data.
			const query = `
						INSERT INTO played_sentiment_events
						(PLAY_ID, SCENARIO_ROLE_ID, SCENARIO_ID, PREDICTED_TEXT, PREDICTED_SENTIMENT, TIMESTAMP, MODEL_VERSION)
						VALUES ?`;

			return pool.query(query, [sentimentPlayDataRows], function (err, results) {
				if (!err) {
					return callback(null, results);
				} else {
					console.log(err);
					return callback(err);
				}
			});
		} catch (e) {
			return callback(e);
		}

	},

	//Get training text
	getTrainingText: function (inputdata, callback) {
		try {


			const query = `
				WITH EventSentimentCTE AS (
					SELECT
						pe.EVENT_ID,
						e.event_name,
						pse.PREDICTED_TEXT,
						pse.TIMESTAMP as Sentiment_TIMESTAMP,
						pe.TIMESTAMP as Event_TIMESTAMP,
						ABS(pse.TIMESTAMP - pe.TIMESTAMP) as TimeDifference,
						ROW_NUMBER() OVER (PARTITION BY pse.ID ORDER BY ABS(pse.TIMESTAMP - pe.TIMESTAMP) ASC) as rn
					FROM 
						(SELECT DISTINCT PLAY_ID
						 FROM played_sentiment_events
						 WHERE SCENARIO_ID = ?) AS p
					JOIN played_events pe ON p.PLAY_ID = pe.PLAY_ID
					JOIN events e ON pe.EVENT_ID = e.event_id
					JOIN played_sentiment_events pse ON pse.PLAY_ID = p.PLAY_ID 
					AND pse.TIMESTAMP BETWEEN (pe.TIMESTAMP - 7000) AND (pe.TIMESTAMP + 7000)
				)
				
				SELECT EVENT_ID, event_name, PREDICTED_TEXT, Sentiment_TIMESTAMP, Event_TIMESTAMP
				FROM EventSentimentCTE
				WHERE rn = 1;
				`;

			return pool.query(query, [inputdata.scenario_id], function (err, results) {


				if (!err) {
					console.log(results);
					return callback(null, results);
				} else {
					console.log(results);
					return callback(err);
				}
			});

		} catch (e) {
			return callback(e);
		}

	}



}
