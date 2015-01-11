

var express = require('express');
var log4js = require('log4js');

var AMRequest = require("../amreqres/amrequest.js");
var AMResponse = require("../amreqres/amresponse.js");
var Nedbapi = require("../dbrequest/nedb.js");

var router = express.Router();
var dbreq = new Nedbapi();
var amreq = new AMRequest();
var amres = new AMResponse();

var logger = log4js.getLogger('initusers.js');

/*

These routers are used for create a user, publishing an application and get the access token. 
All routers are expected these parameters as input arguments.

@param $req- request from client, $res -response from server $next- run the next middleware

here all request from client is handled by amrequest.js, all responses are handled by  
amresponse.js and database transaction is managed by nedb.js

*/


/** 
  * @desc sing up for WSO2API Manager
*/ 

router.post('/signup', function(req, res,next) {

	//var req.body={action:"addUser",username:"geesaraSD",password:"geesaraqA3",cookie:"",firstname:"user1",lastname:"user2",phonenumber:"",postalcode:"",country:""}

	amreq.signup(req.body,function(error,response,body){
                                if(error){
										logger.error("An error has occurred when sending  request to backend server");
										next(new Error("An error has occurred when sending  request to backend server"));
								}else{
										amres.signup(req.body,error,body,function(err,docs){
												if(err==true){

														next(new Error("An error has occurred when getting  response of signup from backend server"));
												}else{
													    next();
												}
										});
								}
								
	});
    },function(req,res){

        res.send({ msg: "You have been successfully signed in."});
    }

);

/** 
  * @desc log in to WSO2API Manager
*/ 

router.post('/login', function(req, res,next) {
   
   // console.log(req.body);
    //res.send({ msg: 'login'});
    amreq.login(req.body,function(error,response,body){
       							if(error){
										logger.error("An error has occurred when logining  request to backend server");
										next(new Error("An error has occurred when logining  request to backend server"));
								}else{
										amres.login(req.body,error,body,response,function(err,docs){
												if(err==true){

														next(new Error("An error has occurred when getting  response of login from backend server"));
												}else{
													    next();
												}
										});
								}

    });
    },function(req,res){
        res.send({ msg: "You have been successfully logged in"});
});

/** 
  * @desc adding application to WSO2API Manager
*/ 

router.post('/addApplication', function(req, res,next) {
   
    var details=req.body;
    if(typeof details.username=="undefined"){
			logger.error('This user has not been signed up yet');
            next(new Error('This user has not been signed up yet'));
	}else{

    	var findCon={"userDetails.username":details.username};

    	dbreq.find(findCon,function(err,docs){
        	if(err==null){
            	logger.info('User is found :'+JSON.stringify(docs));
            	if(typeof docs[0].userDetails=="undefined"){

                	logger.error('This user has not been signed up yet');
                	next(new Error("This user has not been signed up yet"));

            	}else{

                	var cookie=docs[0].userDetails.cookie;
                	if(cookie!=""){
                        amreq.addApplication(cookie,details,function(error, response, body){
                       		if(error){
										logger.error("An error has occurred when adding an application");
										next(new Error("An error has occurred when adding an application"));
							}else{
										amres.addApplication(req.body,error,body,response,function(err,docs){
												if(err==true){

														next(new Error("An error has occurred when getting  response of adding application from backend server error: "+docs.message));
												}else{
													    next();
												}
										});
							}
                    	});
                	}else{
                    	logger.error('User has not logged in yet :'+JSON.stringify(docs));
                    	next(new Error('User has not logged in yet :'+JSON.stringify(docs)));
                	}
            	}

        	}else{
            	logger.error('Application has not been created yet Try that later  :'+err);
            	next(new Error('Application has not been created yet Try that later  :'+err));
        	}
    	});
	}
},function(req,res){
    res.send({ msg: "Application is added"});
});
/** 
  * @desc Subscribing to an application 
*/ 
router.post('/subscribe', function(req, res,next) {

    var details=req.body;
    var findCon={"userDetails.username":details.username};
    this.accessToken="";
    dbreq.find(findCon,function(err,docs){
        if(err==null){
           // console.log("docs "+JSON.stringify(docs) );
            if(typeof docs[0].userDetails=="undefined"){

                logger.error('This user has not been signed up yet');
                next(new Error('This user has not been signed up yet'));

            }else{

                var cookie=docs[0].userDetails.cookie;

                if(cookie!=""){
                    amreq.getAppDetails(cookie,details,function(error, response, body){
                        if(error){
                            logger.error('An error has occurred when getting  application details from backend server ');
                            next(new Error('An error has occurred when getting  application details from backend server at line 172'));
                        }else{
                            var responseBody=JSON.parse(body);
                            if(responseBody.error==true){
                                logger.error(responseBody.message);
                                next(new Error(responseBody.message));
                            }else{

                                logger.info("User information "+JSON.stringify(responseBody));
                                var lengthOfApplication=Object.keys(responseBody.applications).length;
                                var applicationDetails=responseBody.applications;
                                var appname=details.applicationKeyDetails.application;
                                if(lengthOfApplication==0){
                                	logger.error('You have not created any application yet.Please create first before subscribe. ');
                                    next(new Error("You have not created any application yet.Please create first before subscribe. "));
                                }else{
                                    for (var i = 0; i <lengthOfApplication; i++){
                                        if(applicationDetails[i].name==appname){
                                           // console.log("Get ID O of it:"+applicationDetails[i].id);
                                            details.applicationId=applicationDetails[i].id;
                                            amreq.addSubscription(cookie,details,function(error, response, body){
                                                if(error){
                                                    logger.error('An error has occurred when getting  response of subscription from backend server ');
                                                    next();
                                                }else{

                                                    amreq.generateApplicationKey(cookie,details.applicationKeyDetails,function(error, response, body){
                                                    	
                                                       	if(error){
															logger.error("An error has occurred when generating ApplicationKey");
															next(new Error("An error has occurred when generating ApplicationKey"));
														}else{

															amres.generateApplicationKey(details,error,body,response,function(err,docs){

																if(err==true){
																	
																	logger.error(docs.message);
																	next(new Error("An error has occurred when getting  a application key from backend server error: "+docs.message));
																}else{
													   				 next();
																}
															});
														}
                                                    });
                                                }
                                            });
                                        }
                                    }
                                  
                                }

                            }
                        }
                    });
                  


                }else{
                    next(new Error(err));
                }
            }

        }else{
            console.log("error: "+err);
            next(new Error(err));
        }
    });
},function(req,res){
    res.json({ msg: "Your subscription is accepted successfully",appAccessToken:this.accessToken});
});

/** 
  * @desc gettnig applications details
*/ 

router.post('/getAppDetails', function(req, res,next) {

    //var req.body={action:"addUser",username:"geesaraSD",password:"geesaraqA3",cookie:"",firstname:"user1",lastname:"user2",phonenumber:"",postalcode:"",country:""}
    var details=req.body;
    if(typeof details.username=="undefined"){

        logger.error("Client request may have some errors.");
        next(new Error("Client request may have some errors."));

    }
    var findCon={"userDetails.username":details.username};

    dbreq.find(findCon,function(err,docs){
        if(err==null){
            logger.info('User is found :'+JSON.stringify(docs));
            if(typeof docs[0].userDetails=="undefined"){

                logger.error('This user has not been signed up yet');
                next(new Error("This user has not been signed up yet"));

            }else{
                var cookie=docs[0].userDetails.cookie;
                if(cookie!=""){
                        amreq.getAppDetails(cookie,details,function(error, response, body){
                        if(error){
                            logger.error('An error has occurred when getting  application details from backend server ');
                            next(new Error("An error has occurred when getting  application details from backend server "));
                        }else{
                                var responseBody=JSON.parse(body);
                                if(responseBody.error==true){
                                        logger.error(responseBody.message);
                                        next(new Error(responseBody.message));
                                }else{
                                                logger.info(JSON.stringify(responseBody));
                                                var lengthOfApplication=Object.keys(responseBody.applications).length;
                                                var applicationDetails=responseBody.applications;
                                                var appname=details.applicationKeyDetails.application;
                                                if(lengthOfApplication==0){
                                                    
                                                    logger.error("You have not been created any Application yet");
                                                    next(new Error("You have not been created any Application yet"));
                                                   
                                                }else{

                                                    /*for (var i = 0; i <lengthOfApplication; i++) {
                                                        if(applicationDetails[i].name==appname){
                                                            console.log(""+applicationDetails[i].id);
                                                        }
                                                    };*/
                                                    next();
                                                }
                                        
                                }
                        }
                    });
                }else{
                    logger.error('User not found :'+JSON.stringify(docs));
                    next(new Error('User not found :'+JSON.stringify(docs)));
                }
            }

        }else{
            logger.error('Application has not been created yet Try that later  :'+err);
            next(new Error('Application has not been created yet Try that later  :'+err));
        }
    });
    },function(req,res){

        res.send({ msg: "Your application details are below"});
    }

);


module.exports = router;
