
var express = require('express');
var log4js = require('log4js');

var AMapi = require("../amreqres/amrequest.js");
var Nedbapi = require("../dbrequest/nedb.js");

var router = express.Router();
var db = new Nedbapi();
var am = new AMapi();

var logger = log4js.getLogger('amresponse.js');


/*
This api is used for handling responses corresponding to requests are made by amrequest.js
All methods are expected these parameters as input arguments except signup method.

@param $clientreq- request from client,$error- error response from backend server if error

is present $body -response from server $callback- send error or response back to caller 

*/


/** 
  * @desc handles response of sign up
*/ 

var amresponse =function(){
	var am=this;
	am.signup=function(clientreq,error,body,callback){
			var details=JSON.parse(body);

			if(typeof details.error=="undefined"){
					logger.error('An error has occurred when getting  response of signup from backend server');
					//err=new Error('An error has occurred when getting  response of signup from backend server');
					callback(true,body);
			}else{
					if(details.error==true){
									logger.error('An error has occurred when getting  response of signup from backend server');
									//next(new Error('Can not cntact backend server right now try again later'));
                                    //err= new Error('An error has occurred when getting  response of signup from backend server');
                                    callback(details.error,body);
					}else{

									//res.set("X-one","to server");
                           			logger.info('Response of signup request from backend server :'+body);
                                    db.createUser(clientreq,function(err,docs){
                                        if(err==null){

                                            logger.info('This user has been created :'+JSON.stringify(docs));
                                            //res.send({ msg: docs});
                                            callback(err,docs);
                                            
                                        }else{

                                            logger.error('An error has occurred when creating  user ');
                                            //res.send({ msg: null});
                                            callback(err,docs);
                                        }
                                    });
                    }
			}
			
	}

    /** 
     * @desc handles response of log in
    */
	am.login=function(clientreq,error,body,response,callback){
			var details=JSON.parse(body);
			if(typeof details.error=="undefined"){
					logger.error('An error has occurred when getting  response of login from backend server ');
					//err=new Error('An error has occurred when getting  response of signup from backend server');
					callback(true,body);
			}else{
					if(details.error==true){
									logger.error('An error has occurred when getting  response of login from backend server ');
                                    callback(details.error,body);
					}else{

									//res.set("X-one","to server");
                           			logger.info('Response of login request from backend server :'+body);
                                    var findCon={"userDetails.username":clientreq.username};
                					var updateCon={$set:{"userDetails.cookie":response.headers['set-cookie']}};
                					db.update(findCon,updateCon,function(err,docs){
                    					if(err==null){
                         					logger.info('User details has been updated :'+JSON.stringify(docs));
                         					callback(err,docs);
                    					}else{

                         					logger.error('An error has occurred when updating  user at line 56 '+err);
                         					callback(err,docs);
                    					}
                					});
                    }
			}
	}

    /** 
     * @desc handles response of adding application
    */
	am.addApplication=function(clientreq,error,body,response,callback){
		var details=clientreq;
		var serverres=JSON.parse(body);
		if(error){
                logger.error('An error has occurred when getting  response of adding an application from backend server ');
                callback(true,body);
        }else{
        		if(typeof serverres.error=="undefined"){
					logger.error('An error has occurred when getting  response of adding an application from backend server ');
					//err=new Error('An error has occurred when getting  response of signup from backend server');
					callback(true,body);
				}else{
					if(serverres.error==true){
									logger.error('An error has occurred when getting  response  from backend server error: '+body);
                                    callback(serverres.error,serverres);
					}else{

									//res.set("X-one","to server");
                           			logger.info('Response of add an application request from backend server :'+body);
                                    var findCon={"userDetails.username":details.username};               
            						var updateCon={

                    					$push:{
                           					 applicationsInfo:{
                                                application:details.application,
                                				tier:details.tier,
                                				callbackUrl:details.callbackUrl,
                                				description:details.description,
                                				keytype:"",
                            					callbackUrl:"",
                            					authorizedDomains:"",
                            					validityTime:"",
                            					consumerKey:"",
                                            	accessToken:"",
                                            	consumerSecret:""

                       						}
                       					}
                       				};

            						db.update(findCon,updateCon,function(err,docs){
                                		if(err==null){
                                    
                                    		logger.debug('User details has been updated :'+JSON.stringify(docs));
                                    		callback(err,docs);

                                		}else{

                                    		logger.error('Application has not been created yet Try that later  :'+JSON.stringify(docs));
                                    		callback(err,docs);
										}
           							});
                    }
				}
            			

        }
	}

    /** 
     * @desc handles response of generating application key
    */

	am.generateApplicationKey=function(clientreq,error,body,response,callback){
														var details=clientreq;
		 												if(error){
                                                            logger.error('An error has occurred when getting  response of generated application key from backend server ');
                                                            callback(true,body);
                                                        }else{
                                                            body=JSON.parse(body);

                                                            if(typeof body.data =="undefined"){
                                                                logger.error('Response of backend server is invalid, some sort of internal server error might has been occurred');
                                                                callback(true,body);
                                                            }else{

                                                                var findCon={"userDetails.username":details.username};
                                                                var nextApplication=0;
                                                                db.find(findCon,function(err,docs){
                                                                	if(err==null){
                                                                			var lengthOfApplication=Object.keys(docs[0].applicationsInfo).length;
                                                                    		if(lengthOfApplication==0){

                                                                        		nextApplication=lengthOfApplication;
                                                                    		}else{

                                                                        		nextApplication=lengthOfApplication-1;

                                                                    		}

                                                                    		var findCon={"userDetails.username":details.username};

                                                                    		var updateCon = {$set:{}};
                                                                    		updateCon.$set["applicationsInfo."+nextApplication+".consumerKey"] =body.data.key.consumerKey;
                                                                    		updateCon.$set["applicationsInfo."+nextApplication+".accessToken"] =body.data.key.accessToken;
                                                                    		updateCon.$set["applicationsInfo."+nextApplication+".consumerSecret"] =body.data.key.consumerSecret;
                                                                    		updateCon.$set["applicationsInfo."+nextApplication+".keytype"] =details.keytype;
                                                                    		updateCon.$set["applicationsInfo."+nextApplication+".callbackUrl"] =details.callbackUrl;
                                                                    		updateCon.$set["applicationsInfo."+nextApplication+".validityTime"] =details.validityTime;
                                                                    		updateCon.$set["applicationsInfo."+nextApplication+".authorizedDomains"] =details.authorizedDomains;
                                                                    		this.accessToken=body.data.key.accessToken;
                                                                    		db.update(findCon,updateCon,function(err,docs){
                                                                        	if(err==null){

                                                                            	var findCon={"userDetails.username":details.username};
                                                                            	var updateCon={$push:{

                                                                                					subscriptionDetails:
                                                                                						{
                                                                                   							 name:details.name,
                                                                                    						version:details.version,
                                                                                    						provider:details.provider,
                                                                                    						tier:details.tier,
                                                                                    						applicationId:details.applicationId
                                                                                						}
                                                                            					}
                                                                            				};
                                                                            	db.update(findCon,updateCon,function(err,docs){
                                                                                	if(err==null) {
                                                                                    	logger.info('User details has been updated :'+JSON.stringify(docs));
                                                                                    	callback(err,docs);
                                                                                	}else{
                                                                                    
                                                                                    	logger.error('An error has occurred when updating  user ');
                                                                                    	callback(err,docs);
                                                                                	}
                                                                            	});
                                                                        	}else{
                                                                            		logger.error('An error has occurred when updating  user at line 212');
                                                                            		callback(err,docs);
                                                                        	}
                                                                    		});
                                                                	}else{
                                                                		logger.error('User details are invalid');
                                                                        callback(err,docs);
                                                                	}
                                                                    

                                                                });
                                                               
                                                            }

                                                        }
													}

}
module.exports = amresponse;
