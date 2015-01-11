/**
 * Created by geesara on 1/1/15.
 */

var log4js = require('log4js');
var express = require('express');
var router = express.Router();


var AMPublishAPIRequest = require("../apipublish/apipublishrequest.js");
var AMPublishAPIResponse = require("../apipublish/apipublishresponse.js");
var Nedbapi = require("../dbrequest/nedb.js");

var logger = log4js.getLogger('apipublish.js');
var db = new Nedbapi();
var amreq = new AMPublishAPIRequest();
var amres = new AMPublishAPIResponse();

/*

These routers are used for publishing an api, Someone who has account is able to log in,add and 
publish API using these routes. All routers are expected these parameters as input arguments.

@param $req- request from client, $res -response from server $next- run the next middleware

here all request from client is handled by apipublishrequest.js, all responses are handled by  
apipublishresponse.js and database transaction is managed by nedb.js

*/

/** 
  * @desc log in to WSO2API	Manager
*/ 
router.post('/login', function(req, res,next) {

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
    res.send({ msg: "You have been successfully logged in."});
});


/** 
  * @desc add API to WSO2API Manager
*/ 
router.post('/addAPI', function(req, res,next) {

    var findCon={"userDetails.username":req.body.username};
    
    db.find(findCon,function(err,docs){
        if(err==null){
            console.log(JSON.stringify(docs[0]));
            var cookie=docs[0].userDetails.cookie;
            if(cookie!=""){

                amreq.addAPI(req.body,cookie,function(error, response, body){
                	if(error){
						logger.error("An error has occurred when adding API request to backend server");
						next(new Error("An error has occurred when adding API  request to backend server"));
					}else{
						
						amres.addAPI(req.body,error,body,response,function(err,docs){
							if(err==true){
								
								next(new Error("An error has occurred when adding API request to backend server"));
							}else{
								next();
							}
						});
					}
                   	
                });
            }else{
                next(new Error("Please login first befor publishing an API"));
            }
        }else{
             logger.error('This user has not been signed up yet ' +err);
             next(new Error('This user has not been signed up yet ' +err));
        }
    });
},function(req,res){
    res.send({ msg: "API is successfully added"});
});

/** 
  * @desc publish API on WSO2API Manager
*/ 
router.post('/publishAPI', function(req, res,next) {
	var details=req.body;
	if(typeof details.username=="undefined"){
		logger.error('An error has occurred when getting request from client');
		next(new Error("An error has occurred when getting request from client"));
	}else{
		var findCon={"userDetails.username":req.body.username};
    	db.find(findCon,function(err,docs){
        	if(err==null){
            //console.log("docs "+JSON.stringify(docs) );
            	var cookie=docs[0].userDetails.cookie;
            	if(cookie!=""){
                	amreq.publishAPI(req.body,cookie,function(error, response, body){
                   			if(error){
								logger.error('An error has occurred when publishing an application to backend server ');
								next(new Error('An error has occurred when publishing an application to backend server '));
							}else{
								amres.publishAPI(details,error,body,response,function(err,docs){
										if(err==true){
												next(new Error("An error has occurred when getting  response of publishing an API from backend server"));
										}else{
												next();
										}
								});
							}
                	});
            	}else{
                	next(new Error(err));
            	}
        	}else{
            	console.log("error: "+err);
            	next(new Error(err));
        	}
    	});
	}
   
},function(req,res){
    res.send({ msg: "API is successfully deployed"});
});

module.exports = router;

