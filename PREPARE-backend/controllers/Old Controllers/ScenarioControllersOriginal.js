var ScenarioModel = require('../models/ScenarioModel.js');
//var D_itemsModel= require('../models/D_itemsModel.js');
var async = require('async');
 

module.exports = {
	 
	saveVRData:function(inputdata, callback) {
		try {

			console.log(inputdata);
				
			return ScenarioModel.saveVRData(inputdata,function(err1,playedEvents){
				if (err1) {
					console.log(err1)
					throw err1;
				}

				return callback(null, playedEvents);
				

			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},


	getCourseOverview:function(inputdata, callback) {
		try {

			console.log(inputdata);
				
			return ScenarioModel.getPlayedEvents(inputdata,function(err1,playedEvents){
				if (err1) {
					console.log(err1)
					throw err1;
				}
				

				return ScenarioModel.getGoalsObjectives(inputdata,function(err1,goalsobjectives){
					if (err1) {
						console.log(err1)
						throw err1;
					}
				
					return ScenarioModel.getPreassessmentResponse(inputdata,function(err1,preassessmentResponse){
						if (err1) {
							console.log(err1)
							throw err1;
						}
						return ScenarioModel.getPostassessmentResponse(inputdata,function(err1,postassessmentResponse){
							if (err1) {
								console.log(err1)
								throw err1;
						
							}

							return ScenarioModel.getPreassessmentDetails(inputdata,function(err1,preassessmentDetails){
								if (err1) {
									console.log(err1)
									throw err1;
							
								}


								return ScenarioModel.getPostassessmentDetails(inputdata,function(err1,postassessmentDetails){
									if (err1) {
										console.log(err1)
										throw err1;
							
									}

									//Need objectives mapped to goal 
									// all objectives

									var objectivesList = [];
									var objectScore={};
									var objectiveGoalMapping={};

									var goalDetails={};


									goalsobjectives.forEach(function(eachgoalObjective,index){
										var goals = JSON.parse(eachgoalObjective.GOAL_NAME);

										goalDetails[goals.goalName]=goals.objectives;
										
										goals.objectives.forEach(function(eachObjective){
											objectScore[eachObjective]=[0,0];
											objectivesList.push(eachObjective);
											objectiveGoalMapping[eachObjective]=goals.goalName;
										});
									});

									var  objectiveScoreAll  = JSON.parse(JSON.stringify(objectScore));

									var  objectiveScorePre  = JSON.parse(JSON.stringify(objectScore));

									var  objectiveScorePost  = JSON.parse(JSON.stringify(objectScore));

									var objectiveScoreScenario = JSON.parse(JSON.stringify(objectScore));

							

									var pregoalmapping={};

									//{"type":"numericRange","targetname":"My confidence level with Pediatric Physical Exam Assessment is... (Low confidence-0) (High confidence-100)","description":"","goals":"Full physical exam (undress patient)","minInt":0,"maxInt":100}
									preassessmentDetails.forEach(function(eachdata){	
										current = JSON.parse(eachdata['TEXT']);
										if(current.goals){
											pregoalmapping[current.targetname]=current.goals;	
										}
									});

									var postgoalmapping={};
									postassessmentDetails.forEach(function(eachdata){
										current = JSON.parse(eachdata['TEXT']);
										if(current.goals){
											postgoalmapping[current.targetname]=current.goals;	
										}
									});





									var averageScenarioEvents={};
									var averagePreassessment={};
									var averagePostassessment={};


									playedEvents.forEach(function(eachevent){

										if(!averageScenarioEvents[eachevent.SCENARIO_NAME]){
													averageScenarioEvents[eachevent.SCENARIO_NAME]={};											
										}




											if(!averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]){
															averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]={};
															averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['event_name']=eachevent.EVENT_NAME;
															averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['skill_type']=eachevent.SKILL_TYPE;
															averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['specific_skill']=eachevent.SPECIFIC_SKILL;
															averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['total_points']=0;
															averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['count']=0;
													}
															averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['total_points']=averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['total_points']+Number(eachevent.POINTS);
															averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['count']=averageScenarioEvents[eachevent.SCENARIO_NAME][eachevent.EVENT_NAME]['count']+1;


										if(eachevent.obj1){
												objectivesList.forEach(function(eachObjective){
													
													if(eachevent.obj1.includes(eachObjective)){
														objectiveScoreAll[eachObjective][0]=objectiveScoreAll[eachObjective][0]+Number(eachevent.POINTS);
														objectiveScoreAll[eachObjective][1]=objectiveScoreAll[eachObjective][1]+1;
														objectiveScoreScenario[eachObjective][0]=objectiveScoreScenario[eachObjective][0]+Number(eachevent.POINTS);
														objectiveScoreScenario[eachObjective][1]=objectiveScoreScenario[eachObjective][1]+1;
													};	
												});
										}
									});

									preassessmentResponse.forEach(function(eachData){
										var formData=JSON.parse(eachData.FORMDATA);
										Object.keys(formData).forEach(function(question){
											if(!averagePreassessment[question]){
												averagePreassessment[question]={};
												averagePreassessment[question]['question']=question;
												averagePreassessment[question]['total_points']=0;
												averagePreassessment[question]['count']=0;
											}
										averagePreassessment[question]['total_points']=averagePreassessment[question]['total_points']+Number(formData[question]);
										averagePreassessment[question]['count']=averagePreassessment[question]['count']+1;
										var objective = null;

										if(pregoalmapping[question]){
											objective=pregoalmapping[question];
											objectiveScorePre[objective][0] = objectiveScorePre[objective][0]+Number(formData[question]);
											objectiveScorePre[objective][1] = objectiveScorePre[objective][1]+1;

											objectiveScoreAll[objective][0]=objectiveScoreAll[objective][0]+Number(formData[question]);
											objectiveScoreAll[objective][1]=objectiveScoreAll[objective][1]+1;
										}


										});

									});


									postassessmentResponse.forEach(function(eachData){
										var formData=JSON.parse(eachData.FORMDATA);
										Object.keys(formData).forEach(function(question){
											if(!averagePostassessment[question]){
												averagePostassessment[question]={};
												averagePostassessment[question]['question']=question;
												averagePostassessment[question]['total_points']=0;
												averagePostassessment[question]['count']=0;
											}
										averagePostassessment[question]['total_points']=averagePostassessment[question]['total_points']+Number(formData[question]);
										averagePostassessment[question]['count']=averagePostassessment[question]['count']+1;
										var objective = null;

										if(postgoalmapping[question]){
											objective=postgoalmapping[question];
											objectiveScorePost[objective][0] = objectiveScorePost[objective][0]+Number(formData[question]);
											objectiveScorePost[objective][1] = objectiveScorePost[objective][1]+1;

											objectiveScoreAll[objective][0]=objectiveScoreAll[objective][0]+Number(formData[question]);
											objectiveScoreAll[objective][1]=objectiveScoreAll[objective][1]+1;
										}


										});

									});


									// postassessmentResponse


									// console.log(playedEvents);
									// console.log(goalsobjectives);
									// console.log(preassessmentResponse);
									// console.log(postassessmentResponse);
									// console.log(preassessmentDetails);
									// console.log(postassessmentDetails);

									var rawdata={};




									rawdata.playedEvents=playedEvents;
									rawdata.preassessmentResponse=preassessmentResponse;
									rawdata.postassessmentResponse=postassessmentResponse;

									var output = {};

									

									output['objectiveScoreAll']=objectiveScoreAll;
									output['objectiveScorePre']=objectiveScorePre;
									output['objectiveScorePost']=objectiveScorePost;
									output['objectiveScoreScenario']=objectiveScoreScenario;
									output['averageScenarioEvents']=averageScenarioEvents;
									output['averagePreassessment']=averagePreassessment;
									output['averagePostassessment']=averagePostassessment;
									output['goalDetails']=goalDetails;
									output['rawdata']=rawdata;

								 	var data = {
										error: 0, 
										data: output,
										message: 'Retreived Data'
									}

									return callback(null, data);




								});

							});
						
						});



					});
				});
			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},


	downloadInstructorData:function(inputdata, callback) {
		try {

			console.log(inputdata);
				
			return ScenarioModel.getPlayedEvents1(inputdata,function(err1,playedEvents){
				if (err1) {
					console.log(err1)
					throw err1;
				}

				return callback(null, playedEvents);
				

			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},


	downloadInstructorDataWithPhysio:function(inputdata, callback) {
		try {

			console.log(inputdata);

			var windowSize=Number(inputdata.window);
				
			return ScenarioModel.getPlayedEventswithPhysio(inputdata,function(err1,playedEvents){
				if (err1) {
					console.log(err1)
					throw err1;
				}

				var playedEventDic={};
				playedEvents.forEach(function(playedEvent){
					
					if(!playedEventDic[playedEvent['PLAY_ID']]){
						playedEventDic[playedEvent['PLAY_ID']]=[];
					}
					playedEventDic[playedEvent['PLAY_ID']].push(playedEvent);
				});

				var v = 1;

				var output1=[];

				return async.eachSeries(Object.keys(playedEventDic), function(play_id,callback) {
							var events=playedEventDic[play_id];

							var start =1000000000000000000;

							var end =0;

							var device_id=0;

							events.forEach(function(eachEvent){
								start = Math.min(start, eachEvent.TIMESTAMP);
								end= Math.max(end, eachEvent.TIMESTAMP);
								device_id=eachEvent.SERIALNUMBER;
							});


							start=start-40000;
							end=end+40000;

							output=1;
							var inputdata={};
							


							inputdata.serialNumber=device_id;
							inputdata.startTime=start;
							inputdata.endTime=end;


							return ScenarioModel.getStreamDataResultsHR(inputdata, function(err,dataphysio){
								console.log(v);
								v=v+1;

								
								events.forEach(function(event){
									var time = Math.round(event['TIMESTAMP']/1000);
									var startTime=time-windowSize;
									var endTime=time+windowSize;
									var hrs = new Array(windowSize*2).fill(-1);
									
									counter=0;
									
									var allhrs=[];
									dataphysio.forEach(function(eachdataphysio){
										allhrs.push(eachdataphysio["val"]);
										if(eachdataphysio["tp"]>=startTime && eachdataphysio["tp"]<=endTime && counter < hrs.length){
											hrs[counter] = eachdataphysio["val"];

											counter=counter+1; 
										}
									});
									if(allhrs.length==0){
										allhrs.push(-1);
									};

									allhrs.sort(function(a, b){return a-b});


									
									var allhrs1 = allhrs.slice(0,15);
									
									

									var sumhrs1 = allhrs1.reduce((previous, current) => current += previous);
									var baseLineHR = sumhrs1/allhrs1.length;




									var sumhrs = hrs.reduce((previous, current) => current += previous);
									var avghrs = sumhrs / hrs.length;
									event['baseHr']=baseLineHR;
									event['avgHr']=avghrs;
									counter=0;
									var cs = windowSize*-1;
									
									hrs.forEach(function(hr){
										var label = 'hr_'+cs;
										event[label]=hr;
										cs=cs+1;
									});

								});

								




								return callback();
							})




						},
						function(err){
							console.log(v+100);
							return callback(null, playedEvents);

						}


					);

				

				


				

			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},

	downloadAssessmentData:function(inputdata, callback) {
		try {

			console.log(inputdata);
				
			return ScenarioModel.getPlayedEvents1(inputdata,function(err1,playedEvents){
				if (err1) {
					console.log(err1)
					throw err1;
				}
				

				return ScenarioModel.getGoalsObjectives(inputdata,function(err1,goalsobjectives){
					if (err1) {
						console.log(err1)
						throw err1;
					}
				
					return ScenarioModel.getPreassessmentResponse1(inputdata,function(err1,preassessmentResponse){
						if (err1) {
							console.log(err1)
							throw err1;
						}
						return ScenarioModel.getPostassessmentResponse1(inputdata,function(err1,postassessmentResponse){
							if (err1) {
								console.log(err1)
								throw err1;
						
							}

							return ScenarioModel.getPreassessmentDetails(inputdata,function(err1,preassessmentDetails){
								if (err1) {
									console.log(err1)
									throw err1;
							
								}


								return ScenarioModel.getPostassessmentDetails(inputdata,function(err1,postassessmentDetails){
									if (err1) {
										console.log(err1)
										throw err1;
							
									}

									var AssessmentQuestions = [];

									preassessmentResponse.forEach(function(eachResponse){
										var course_id = eachResponse.COURSE_ID; 
										var learner_id = eachResponse.LEARNER_ID; 
										var learner_name = eachResponse.LEARNER_NAME; 
										var created_at = eachResponse.CREATED_AT;

										var formData= JSON.parse(eachResponse.FORMDATA);

										Object.keys(formData).forEach(function(eachQuestion){
											var score = formData[eachQuestion];

											var temp = {};

											temp.course_id=course_id;
											temp.learner_id=learner_id;
											temp.learner_name=learner_name;
											temp.created_at=created_at;
											temp.eachQuestion=eachQuestion;
											temp.score=score;
											temp.assessment='pre';
											AssessmentQuestions.push(temp);
										});
									});



									postassessmentResponse.forEach(function(eachResponse){
										var course_id = eachResponse.COURSE_ID; 
										var learner_id = eachResponse.LEARNER_ID; 
										var learner_name = eachResponse.LEARNER_NAME; 
										var created_at = eachResponse.CREATED_AT;

										var formData= JSON.parse(eachResponse.FORMDATA);

										Object.keys(formData).forEach(function(eachQuestion){
											var score = formData[eachQuestion];

											var temp = {};

											temp.course_id=course_id;
											temp.learner_id=learner_id;
											temp.learner_name=learner_name;
											temp.created_at=created_at;
											temp.eachQuestion=eachQuestion;
											temp.score=score;
											temp.assessment='post';
											AssessmentQuestions.push(temp);
										});
									});




									var rawdata={};
									rawdata.playedEvents=playedEvents;
									rawdata.preassessmentResponse=preassessmentResponse;
									rawdata.postassessmentResponse=postassessmentResponse;

									var output = {};

									

									
									output['rawdata']=rawdata;

								 	

									return callback(null, AssessmentQuestions);




								});

							});
						
						});



					});
				});
			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},


	downloadPhysioDataRaw: function(inputdata, callback) { 
		try {
			var insertParams = inputdata;
			return ScenarioModel.speceficResults(inputdata, function(err1, events) {
				if (err1) {
					return callback(err1);
				}

				if (events.length > 0 && inputdata.lastname) {
					lname = inputdata.lastname;
				}

				var start =1000000000000000000;

				var end =0;

				var device_id=0;

				events.forEach(function(eachEvent){
					start = Math.min(start, eachEvent.TIMESTAMP);
					end= Math.max(end, eachEvent.TIMESTAMP);
					device_id=eachEvent.SERIALNUMBER;
				});

				inputdata.serialNumber=device_id;
				inputdata.startTime=start;
				inputdata.endTime=end;


				return ScenarioModel.getStreamDataResultsRawCSV(inputdata, function(err, results) {
					return callback(null, results);
				});

			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},



	downloadPhysioData: function(inputdata, callback) { 
		try {
			var insertParams = inputdata;

			console.log(inputdata);
			return ScenarioModel.speceficResults(inputdata, function(err1, events) {
				
				if (err1) {
					return callback(err1);
				}

				if (events.length > 0 && inputdata.lastname) {
					lname = inputdata.lastname;
				}

				var start =1000000000000000000;

				var end =0;

				var device_id=0;
				console.log(events);
				events.forEach(function(eachEvent){
					start = Math.min(start, eachEvent.TIMESTAMP);
					end= Math.max(end, eachEvent.TIMESTAMP);
					device_id=eachEvent.SERIALNUMBER;
				});

				inputdata.serialNumber=device_id;
				inputdata.startTime=start;
				inputdata.endTime=end;

				console.log(inputdata);

				// return callback(null, events); 



				return ScenarioModel.getStreamDataResultsCSV(inputdata, function(err, results) {
					return callback(null, results); 
				});

			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},





	getLearners:function(inputdata, callback) {
		try {
				
			return ScenarioModel.getAllLearners(inputdata,function(err1,Finalresults){
				if (err1) {
					console.log(err1)
					throw err1;
				}
				var data = {
					error: 0, 
					data: Finalresults,
					message: 'Retreived Data'
				}
				
			return callback(null, data);

			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	addLearner:function(inputdata, callback) {
		try {
			return ScenarioModel.addLearner(inputdata, function(err, results) {
				if (err) {
					console.log(err)
					throw err;
				}
				

				return ScenarioModel.getAllLearners(inputdata,function(err1,Finalresults){
					if (err1) {
						console.log(err1)
						throw err1;
					}
					var data = {
						error: 0, 
						data: Finalresults,
						message: 'Retreived Data'
					}
					
				return callback(null, data);

				});

					
				
			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},

	physioData:function(inputdata, callback) {
		try {

				var streamParams = {
					unixtime: inputdata.unixtime
				}

				return ScenarioModel.getStreamData1(streamParams, function(err, results) {
					if (err) {
						throw err;
					}
					var data = {
						error: 0, 
						data: results,
						message: 'Retreived Data'
					}
					
					return callback(null, data);


				});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	getPlayVidList:function(inputdata, callback) {
		try {

			return ScenarioModel.getUploadFileList(inputdata, function(err, results) {
					if (err) {
						throw err;
					}

					return callback(null, results);

			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},

	uploadFileDb:function(inputdata, callback) {
		try {

				console.log(inputdata);

				return ScenarioModel.uploadFileDb(inputdata, function(err, results1) {
					if (err) {
						throw err;
					}


					return ScenarioModel.getUploadFileList(inputdata, function(err, results) {
						if (err) {
							throw err;
						}

						return callback(null, results);

					});



				});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	getStreamDataResults:function(inputdata, callback) {
		try {

			console.log(inputdata);

				var streamParams = {
					serialNumber:inputdata.serialNumber,
					startTime:inputdata.startTime,
					endTime:inputdata.endTime
				}

				return ScenarioModel.getStreamDataResults(streamParams, function(err, results) {
					if (err) {
						throw err;
					}
					

					var startTime=0;
					var endTime=0;

					if(results.length>0){
						startTime=results[0].tp;
						endTime=results[results.length-1].tp;
					}

					var labelsKey = {};

					results.forEach(function(eachData){
						labelsKey[eachData.label] = null;
					});

					var labels = Object.keys(labelsKey)



					var data1=[];
					for (var i=startTime;i<=endTime;i++){
						var temp={};
						labels.forEach(function(label){
							temp[label]=null;
						})
						temp.second=i-startTime;
						temp.timestamp=i;
						data1.push(temp);
					}
					
					results.forEach(function(eachData){
						var timestamp=eachData.tp;
						var ind = timestamp-startTime;
						var label= eachData.label;
						var value=eachData.val;
						data1[ind][label]=value;
					});


					data1.forEach(function(eachData){

						labels.forEach(function(label){
							if(!eachData[label]){
								eachData[label]=labelsKey[label];
							}else{
								labelsKey[label]=eachData[label];
							}
						})
					});




					var data = {
						error: 0,
						data: data1,
						labels:labels,
						message: 'Retreived Data'
					}

					return callback(null, data);


				});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	getStreamData:function(inputdata, callback) {
		try {

				var streamParams = {
					serialNumber:inputdata.serialNumber,
					time: Math.round(Date.now())-5000
				}

				return ScenarioModel.getStreamData(streamParams, function(err, results) {
					if (err) {
						throw err;
					}
					var data = {
						error: 0,
						data: results,
						message: 'Retreived Data'
					}
					
					return callback(null, data);


				});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},

	streamData: function(inputdata,callback){
		try {
			var serialNumber=inputdata.serialNumber;
			var deviceConnectTime=inputdata.deviceConnectTime;
			var timeSeriesData=[];
			if(inputdata.tempTimeStamp && inputdata.tempVals && inputdata.tempTimeStamp.length==inputdata.tempVals.length){
				inputdata.tempVals.forEach(function(tempVal,index){
					//[timestamp,label,value, serialNumber,deviceConnectTime]
					var temp=[inputdata.tempTimeStamp[index],'temp',inputdata.tempVals[index],serialNumber,deviceConnectTime];
					timeSeriesData.push(temp);
				})
			}





			if(inputdata.bvpValsTimeStamp && inputdata.bvpVals && inputdata.bvpValsTimeStamp.length==inputdata.bvpVals.length){
				inputdata.bvpVals.forEach(function(tempVal,index){
					//[timestamp,label,value, serialNumber,deviceConnectTime]
					var temp=[inputdata.bvpValsTimeStamp[index],'bvp',inputdata.bvpVals[index],serialNumber,deviceConnectTime];
					timeSeriesData.push(temp);
				})
			}

			//gsrTimeStamp ,gsrVals

			if(inputdata.gsrTimeStamp && inputdata.gsrVals && inputdata.gsrTimeStamp.length==inputdata.gsrVals.length){
				inputdata.gsrVals.forEach(function(tempVal,index){
					//[timestamp,label,value, serialNumber,deviceConnectTime]
					var temp=[inputdata.gsrTimeStamp[index],'gsr',inputdata.gsrVals[index],serialNumber,deviceConnectTime];
					timeSeriesData.push(temp);
				})
			}


			if(inputdata.ibiTimeStamp && inputdata.ibiVals && inputdata.ibiTimeStamp.length==inputdata.ibiVals.length){
				inputdata.ibiVals.forEach(function(tempVal,index){
					//[timestamp,label,value, serialNumber,deviceConnectTime]
					var temp=[inputdata.ibiTimeStamp[index],'ibi',inputdata.ibiVals[index],serialNumber,deviceConnectTime];
					timeSeriesData.push(temp);
				})
			}




			if(inputdata.accTimeStamp && inputdata.accValsx && inputdata.accTimeStamp.length==inputdata.accValsx.length){
				inputdata.accValsx.forEach(function(tempVal,index){
					//[timestamp,label,value, serialNumber,deviceConnectTime]
					var temp=[inputdata.accTimeStamp[index],'accx',inputdata.accValsx[index],serialNumber,deviceConnectTime];
					timeSeriesData.push(temp);
				})
			}


			if(inputdata.accTimeStamp && inputdata.accValsy && inputdata.accTimeStamp.length==inputdata.accValsy.length){
				inputdata.accValsy.forEach(function(tempVal,index){
					//[timestamp,label,value, serialNumber,deviceConnectTime]
					var temp=[inputdata.accTimeStamp[index],'accy',inputdata.accValsy[index],serialNumber,deviceConnectTime];
					timeSeriesData.push(temp);
				})
			}

			if(inputdata.accTimeStamp && inputdata.accValsz && inputdata.accTimeStamp.length==inputdata.accValsz.length){
				inputdata.accValsz.forEach(function(tempVal,index){
					//[timestamp,label,value, serialNumber,deviceConnectTime]
					var temp=[inputdata.accTimeStamp[index],'accz',inputdata.accValsz[index],serialNumber,deviceConnectTime];
					timeSeriesData.push(temp);
				})
			}

			
			

			return ScenarioModel.streamData(timeSeriesData, function(err, results) {
				if (err) {
					throw err;
				}
				
				var data = {
					message: 'Data Entered'
				}
				
				return callback(null, data);

			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	savepostassessment: function(inputdata, callback) {
		try {
			
			var postassessments = inputdata.postassessment;
			var course_id=inputdata.course_id;
			var postassessmentDatabaseRows=[];
			postassessments.forEach(function(postassessment){
				postassessmentJson=JSON.parse(postassessment);
				var temp=[];

				temp.push(course_id);
				temp.push(postassessmentJson.type);
				temp.push(postassessmentJson.targetname);
				temp.push(postassessmentJson.description);
				temp.push(postassessment);
				postassessmentDatabaseRows.push(temp);

			});

			return ScenarioModel.deletepostassessment(course_id,function(err1,results1){
				if(err1){
					throw err1;
				}

				return ScenarioModel.savepostassessment(postassessmentDatabaseRows,function(err,results){
					if(err){
						throw err;
					}
					
					var send = {};
					send.error = false;
					send.message = "Data Saved";
					return callback(null, send);
				});
			})



		// 		`COURSE_ID` int(11) NOT NULL,
  // `QUESTIONTYPE` varchar(255) NOT NULL,
  // `QUESTIONSTRING` varchar(255) NOT NULL,
  // `DESCRIPTION` varchar(255) NOT NULL,
  // `TEXT` mediumtext NOT NULL,

			// var goals=inputdata.goals;
			
			// var goalDatabaseRows=[];
			// console.log(inputdata);
			// goals.forEach(function(goal){
			// 	var temp=[];
			// 	temp.push(course_id);
			// 	temp.push(goal);
			// 	goalDatabaseRows.push(temp);
			// });
			
			


		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	savepostassessmentformresponse:function(inputdata, callback) {
		try {
			

			return ScenarioModel.savepostassessmentformresponse(inputdata,function(err1,results1){
				if(err1){
					throw err1;
				}
				var send = {};
					send.error = false;
					send.message = "Data Saved";
				return callback(null, send);
			})

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	savepreassessmentformresponse: function(inputdata, callback) {
		try {
			

			return ScenarioModel.savepreassessmentformresponse(inputdata,function(err1,results1){
				if(err1){
					throw err1;
				}
				var send = {};
					send.error = false;
					send.message = "Data Saved";
				return callback(null, send);
			})

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},

	savepreassessment: function(inputdata, callback) {
		try {
			console.log(inputdata);
			var preassessments = inputdata.preassessment;
			var course_id=inputdata.course_id;
			var preassessmentDatabaseRows=[];
			preassessments.forEach(function(preassessment){
				preassessmentJson=JSON.parse(preassessment);
				var temp=[];

				temp.push(course_id);
				temp.push(preassessmentJson.type);
				temp.push(preassessmentJson.targetname);
				temp.push(preassessmentJson.description);
				temp.push(preassessment);
				preassessmentDatabaseRows.push(temp);

			});

			return ScenarioModel.deletepreassessment(course_id,function(err1,results1){
				if(err1){
					throw err1;
				}

				return ScenarioModel.saveassessment(preassessmentDatabaseRows,function(err,results){
					if(err){
						throw err;
					}
					console.log(results);
					var send = {};
					send.error = false;
					send.message = "Data Saved";
					return callback(null, send);
				});
			})



		// 		`COURSE_ID` int(11) NOT NULL,
  // `QUESTIONTYPE` varchar(255) NOT NULL,
  // `QUESTIONSTRING` varchar(255) NOT NULL,
  // `DESCRIPTION` varchar(255) NOT NULL,
  // `TEXT` mediumtext NOT NULL,

			// var goals=inputdata.goals;
			
			// var goalDatabaseRows=[];
			// console.log(inputdata);
			// goals.forEach(function(goal){
			// 	var temp=[];
			// 	temp.push(course_id);
			// 	temp.push(goal);
			// 	goalDatabaseRows.push(temp);
			// });
			
			


		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	savegoals: function(inputdata, callback) {
		try {
			console.log(inputdata);
			var goals=inputdata.goals;
			var course_id=inputdata.course_id;
			var goalDatabaseRows=[];
			console.log(inputdata);
			goals.forEach(function(goal){
				var temp=[];
				temp.push(course_id);
				temp.push(goal);
				goalDatabaseRows.push(temp);
			});
			return ScenarioModel.deletegoals(course_id,function(err1,results1){
				if(err1){
					throw err1;
				}

				return ScenarioModel.savegoals(goalDatabaseRows,function(err,results){
					if(err){
						throw err;
					}
					console.log(results);
					var send = {};
					send.error = false;
					send.message = "Data Saved";
					return callback(null, send);
				});
			})
			


		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},
	savePlay: function(inputdata, callback) {
		console.log(inputdata);
		try {
			var trainee = JSON.parse(inputdata.trainee);
			var scenario_id = inputdata.scenario_id;
			var nodes = JSON.parse(inputdata.nodes);
			console.log(inputdata.trainee);
			var comments= JSON.parse(inputdata.comments);

			var createPlayParams = {
				user_id:inputdata.user.id,
				scenario_id: scenario_id
			}


			return ScenarioModel.createPlay(createPlayParams, function(err, results) {
				if (err) {
					throw err;
				}
				var data = {
					error: 0,
					message: 'Data Entered'
				}

				var play_id = results.insertId;
				var savePlayComments = [];
				comments.forEach(function(comment){
					var temp=[];
					temp.push(play_id);
					temp.push(comment);
					savePlayComments.push(temp);
				});
				
				var deviceDetails = [];
				return ScenarioModel.saveComments(savePlayComments, function(err3, results3) {
					if(err3){
						throw err3;
					}

					var insertPlaysTraineeParams = []
					Object.keys(trainee).forEach(function(key) {
						var temp = [];
						currentTrainee = trainee[key];

						console.log(currentTrainee);
						temp.push(play_id);
						temp.push(currentTrainee.traineefname);
						temp.push(currentTrainee.traineelname);
						temp.push(currentTrainee.dicipline);
						temp.push(currentTrainee.years);
						temp.push(key);
						temp.push(currentTrainee.rating);
						// temp.push(currentTrainee.deviceConnectTime);
						// temp.push(currentTrainee.serialNumber);
						temp.push(currentTrainee.learnerid);
						temp.push(currentTrainee.rocketid);

						
						currentTrainee.deviceConnectTime.forEach(function(dat,ind){
							var temp1 = [];
							temp1.push(play_id);
							temp1.push(currentTrainee.deviceConnectTime[ind]);
							temp1.push(currentTrainee.serialNumber[ind]);
							deviceDetails.push(temp1);
						});
						

						insertPlaysTraineeParams.push(temp);

					});

					return ScenarioModel.insertPlaysTrainee(insertPlaysTraineeParams, function(err2, result2) {
						
						console.log(result2);
						var insertPlayedEventsParams = [];
						nodes.forEach(function(node) {
							var temp = [];
							temp.push(play_id);
							temp.push(node.id);
							temp.push(node.rating);
							temp.push(node.scenario_role_id);
							temp.push(node.completedTime);
							temp.push(node.time);
							temp.push(node.skillLevel);

							
							insertPlayedEventsParams.push(temp);

						});

						console.log(insertPlayedEventsParams);
						return ScenarioModel.insertPlayedEvents(insertPlayedEventsParams, function(err1, result1) {
							if (err1) {
								throw err1;
							}

							console.log(deviceDetails);
							if(!Array.isArray(deviceDetails) || (Array.isArray(deviceDetails) && deviceDetails.length==0)){
								var send = {};
								send.error = false;
								send.message = "Data Saved";
								return callback(null, send);
							}
							
							return ScenarioModel.insertDeviceData(deviceDetails, function(err1, result1) {
								if (err1) {
									throw err1;
								}
								var send = {};
								send.error = false;
								send.message = "Data Saved";
								return callback(null, send);
								
							});
						});

					});

				})



			});

		} catch (e) {
			console.log(e);
			return callback(e);
		}

	},

	getCourse: function(callback) {
		try {
			return ScenarioModel.getCourses(function(err1, courses) {
				var data = {
					data: courses,
					message: 'Data Entered'
				}
				return callback(null, courses);
			});

		} catch (e) {
			return callback(e);
		}

	},

	createCourse:function(inputdata, callback) {
		try {
			
			var insertParams = {
				user_id: inputdata.user.id,
				coursename: inputdata.coursename
			}
			return ScenarioModel.createCourse(insertParams, function(err, results) {
				if (err) {
					throw err;
				}
				return ScenarioModel.getCourses(function(err2, courses) {
						if (err2) {
							throw err2;
						}

						var data = {
							data: courses,
							message: 'Data Entered'
						}
						
						return callback(null, courses);
				});

			});

		} catch (e) {
			return callback(e);
		}

	},
	createScenario: function(inputdata, callback) {
		try {
			var insertParams = inputdata;
			return ScenarioModel.createScenario(insertParams, function(err, results) {
				if (err) {
					throw err;
				}
				//insert roles 
				var scenario_id = results.scenario_id
				var roles = inputdata.roles;
				var insertRoles = [];

				roles.forEach(function(role) {
					role = JSON.parse(role);
					var temp = [];
					temp.push(scenario_id);
					temp.push(role.roleLabel);
					temp.push(role.roleNumber);

					insertRoles.push(temp);
				});

				return ScenarioModel.addRoles(insertRoles, function(err1, resultsRole) {
					if (err1) {
						throw err1;
					}
					return ScenarioModel.getscenariobycourseid(inputdata,function(err2, scenarios) {
						var data = {
							data: scenarios,
							message: 'Data Entered'
						}
						return callback(null, scenarios);
					});
				})



			});

		} catch (e) {
			return callback(e);
		}

	},

	getActiveDevices : function(inputdata,callback) {
		try {
			return ScenarioModel.getActiveDevices(inputdata,function(err1, devices) {
				var data = {
					data: devices,
					message: 'Data Entered'
				}
				return callback(null, data);
			});

		} catch (e) {
			return callback(e);
		}
	},
	results: function(inputdata,callback) {
		var insertParams = inputdata;
		try {
			return ScenarioModel.results(inputdata,function(err1, scenarios) {
				var data = {
					data: scenarios,
					message: 'Data Entered'
				}
				return callback(null, scenarios);
			});

		} catch (e) {
			return callback(e);
		}
	},
	speceficResults: function(inputdata, callback) { 
		try {
			var insertParams = inputdata;
			return ScenarioModel.speceficResults(inputdata, function(err1, events) {
				if (err1) {
					return callback(err1);
				}

				return ScenarioModel.getComments(inputdata, function(errComments, comments) {
					if (errComments) {
						return callback(errComments);
					}
					if (events.length > 0 && inputdata.lastname) {
						lname = inputdata.lastname;
	
						var params={}
						params.playId =inputdata.play_id;
	
						
						return ScenarioModel.traineeHistory(lname, function(err2, histDetails) {
							if (err2) {
								return callback(err2);
							}
	
							return ScenarioModel.traineeHistorySkills(lname, function(err3, histSkillsDetails) {
								if (err3) {
									return callback(err3);
								}
								return ScenarioModel.getConnectedDevices(params, function(err4, connectedDevices) {
									if (err4) {
										return callback(err4);
									}
	
								return ScenarioModel.traineeHistorySpecificSkill(lname, function(err4, histSpecificSkillsDetails) {
									if (err4) {
										return callback(err4);
									}
	
									return ScenarioModel.getUploadFileList(params,function(err6,vidList){
										if (err6) {
												return callback(err6);
											}
										return ScenarioModel.traineeHistoryEvent(lname, function(err5, histEventsDetails) {
											if (err5) {
												return callback(err5);
											}
											var output = {};
											output.playOutput = events;
											output.comments=comments;
											output.histDetails = histDetails;
											output.histSkillsDetails=histSkillsDetails;
											output.histSpecificSkillsDetails=histSpecificSkillsDetails;
											output.histEventsDetails=histEventsDetails;
											output.vidList=vidList;
											output.connectedDevices=connectedDevices;
											return callback(null, output);
	
										});
									})
	
	
								});	
	
	
								});
	
	
								
								
	
							});
							
	
						});
					}

				});

				

				output = {};
				output.playOutput = events;
				output.histDetails = [];
				return callback(null, events);

			});

		} catch (e) {
			return callback(e);
		}
	},



	speceficcourse:function(inputdata,callback) {
		try {
			if(inputdata.course_id){
				inputdata.courseId=inputdata.course_id;
			}

			return ScenarioModel.getAllLearners(inputdata,function(err0,learnerData){
				return ScenarioModel.getCourseDetails(inputdata, function(err,courseDetails){

					return ScenarioModel.getGoals(inputdata, function(err,goalData){
						if (err) {
							throw err;
						}
						return ScenarioModel.getPreassessmentData(inputdata, function(err1,preassessmentData){
							if (err1) {
								throw err1;
							}
							return ScenarioModel.getPostassessmentData(inputdata, function(err2,postassessmentData){
								if (err2) {
									throw err2;
								}

								var data ={
									data:{
										goalData:goalData,
										preassessmentData:preassessmentData,
										postassessmentData:postassessmentData,
										courseDetails:courseDetails,
										learnerData:learnerData
									}
								}
								return callback(null, data);
							});	
						});	
					});



				});



			})
			
			
			
			return ScenarioModel.getscenariobycourseid(inputdata, function(err1, scenarios) {
				var data = {
					data: scenarios,
					message: 'Data Entered'
				}
				return callback(null, scenarios);
			});

		} catch (e) {
			return callback(e);
		}

	},
	getscenariobycourseid:function(inputdata,callback) {
		try {
			return ScenarioModel.getscenariobycourseid(inputdata, function(err1, scenarios) {
				var data = {
					data: scenarios,
					message: 'Data Entered'
				}
				return callback(null, scenarios);
			});

		} catch (e) {
			return callback(e);
		}

	},
	getScenario: function(callback) {
		try {
			return ScenarioModel.getScenario(function(err1, scenarios) { 
				var data = {
					data: scenarios,
					message: 'Data Entered'
				}
				return callback(null, scenarios);
			});

		} catch (e) {
			return callback(e);
		}

	},

	addEvent: function(inputdata, callback) {
		try {
			var insertParams = inputdata;
			return ScenarioModel.addEvent(insertParams, function(err, results) {
				if (err) {
					throw err;
				}
				return ScenarioModel.getEvents(inputdata.scenario_id, function(err1, scenarios) {
					var data = {
						data: scenarios,
						message: 'Data Entered'
					}
					return callback(null, scenarios);
				});
			});
		} catch (e) {
			return callback(e);
		}
	},
	getEvent: function(inputdata, callback) {
		try {
			var insertParams = inputdata;
			return ScenarioModel.getEvents(inputdata.scenario_id, function(err1, events) {
				if (err1) {
					return callback(err1);
				}
				return ScenarioModel.getRoles(inputdata.scenario_id, function(err2, roles) {
					if (err2) {
						return callback(err3);
					}

					inputdata["dateTime"]= Date.now()-15000;
					return ScenarioModel.getGoalsObjectivesbyscenarioid(inputdata.scenario_id, function(err,goalsobjectives){
						return ScenarioModel.getScenarioById(inputdata.scenario_id, function(err3, scenarioDetails) {
							return ScenarioModel.getLearnersByScenarioid(inputdata.scenario_id, function(err4,learnerData){
								return ScenarioModel.getActiveDevices(inputdata,function(err5,deviceData){
									var data = {
										data: events,
										scenarioDetails: scenarioDetails,
										roles: roles,
										goalsobjectives:goalsobjectives,
										learnerData:learnerData,
										deviceData:deviceData,
										message: 'Data Entered'
									}
									return callback(null, data);	
								});
								
							});
							
						});

					});
						

				});



			});

		} catch (e) {
			return callback(e);
		}
	},
	deleteEvent: function(inputdata, callback) {
		try {
			var insertParams = inputdata;
			return ScenarioModel.deleteEvent(insertParams, function(err, results) {
				if (err) {
					throw err;
				}
				return ScenarioModel.getEvents(inputdata.scenario_id, function(err1, scenarios) {
					var data = {
						data: scenarios,
						message: 'Data deleted'
					}
					return callback(null, scenarios);
				});
			});
		} catch (e) {
			return callback(e);
		}
	},
	deleteScenario: function(inputdata, callback) {
		try {
			var insertParams = inputdata;
			return ScenarioModel.deleteScenario(insertParams, function(err, results) {
				if (err) {
					throw err;
				}
				return ScenarioModel.getScenario(function(err1, scenarios) {
					var data = {
						data: scenarios,
						message: 'Data Entered'
					}
					return callback(null, scenarios);
				});
			});
		} catch (e) {
			return callback(e);
		}
	}
}