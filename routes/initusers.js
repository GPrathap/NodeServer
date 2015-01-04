

var express = require('express');
var log4js = require('log4js');

var AMapi = require("../amrequest/amrequest.js");
var Nedbapi = require("../dbrequest/nedb.js");

var router = express.Router();
var dbreq = new Nedbapi();
var amreq = new AMapi();

var logger = log4js.getLogger('initusers.js');

router.post('/signup', function(req, res,next) {

	//var req.body={action:"addUser",username:"geesaraSD",password:"geesaraqA3",cookie:"",firstname:"user1",lastname:"user2",phonenumber:"",postalcode:"",country:""}

	amreq.signup(req.body,function(error,response,body){
                                //console.log("AM body :"+JSON.parse(body).error==false);
								if(JSON.parse(body).error===true){
									logger.error('An error has occurred when getting  response of signup from backend server at line 19');
									//next(new Error('Can not cntact backend server right now try again later'));
                                    next();
								}else{

									//res.set("X-one","to server");
                                    logger.info('Response of signup request from backend server :'+body);
                                    dbreq.createUser(req.body,function(err,docs){
                                        if(err==null){

                                            logger.info('This user has been created :'+JSON.stringify(docs));
                                            //res.send({ msg: docs});

                                            next();
                                        }else{
                                            logger.error('An error has occurred when creating  user at line 29');
                                            //res.send({ msg: null});
                                            next();
                                        }
                                    });


								}
	});
    },function(req,res){

        res.send({ msg: "You have been successfully signed in."});
    }

);
router.post('/login', function(req, res,next) {
   
   // console.log(req.body);
    //res.send({ msg: 'login'});
    amreq.login(req.body,function(error,response,body){
        if(JSON.parse(body).error==true){
            logger.error('An error has occurred when getting  response of login from backend server at line 56');
            next();
        }else{
                //res.set("X-two","login is done");
                var findCon={"userDetails.username":req.body.username};
                var updateCon={$set:{"userDetails.cookie":response.headers['set-cookie']}};
                dbreq.update(findCon,updateCon,function(err,docs){
                    if(err==null){
                         logger.info('User details has been updated :'+JSON.stringify(docs));
                         next();
                    }else{

                         logger.error('An error has occurred when updating  user at line 56 '+err);
                         next();
                    }
                });
            }
    });
    },function(req,res){
        res.send({ msg: "You have been successfully logged in"});
});

router.post('/addApplication', function(req, res,next) {
   
    var details=req.body;
    var findCon={"userDetails.username":details.username};

    dbreq.find(findCon,function(err,docs){
        if(err==null){
            logger.info('User is found :'+JSON.stringify(docs));
            if(typeof docs[0].userDetails=="undefined"){

                logger.error('This user has not been signed up yet');
                next();
            }else{
                var cookie=docs[0].userDetails.cookie;
                if(cookie!=""){
                        amreq.addApplication(cookie,details,function(error, response, body){
                        if(error){
                            logger.error('An error has occurred when getting  response of adding an application from backend server at line 95');
                            next();
                        }else{
                            
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
                                            						consumerSecret:"",

                       										}
                                                }
                                        };
                            dbreq.update(findCon,updateCon,function(err,docs){
                                if(err==null){
                                    
                                    logger.debug('User details has been updated :'+JSON.stringify(docs));
                                    next();

                                }else{

                                    logger.error('Application has not been created yet Try that later  :'+JSON.stringify(docs));
                                    next();

                                }
                            });

                        }
                    });
                }else{
                    logger.error('User not found :'+JSON.stringify(docs));
                    next();
                }
            }

        }else{
            logger.error('Application has not been created yet Try that later  :'+err);
            next();
        }
    });
},function(req,res){
    res.send({ msg: "Application is added"});
});

router.post('/subscribe', function(req, res,next) {

    var details=req.body;
    var findCon={"userDetails.username":details.username};
    this.accessToken="";
    dbreq.find(findCon,function(err,docs){
        if(err==null){
           // console.log("docs "+JSON.stringify(docs) );
            if(typeof docs[0].userDetails=="undefined"){

                logger.error('This user has not been signed up yet');
                next();

            }else{

                var cookie=docs[0].userDetails.cookie;

                if(cookie!=""){

                    amreq.addSubscription(cookie,details,function(error, response, body){
                        if(error){
                            logger.error('An error has occurred when getting  response of subscription from backend server at line 170');
                            next();
                        }else{
                           
                            amreq.generateApplicationKey(cookie,details.applicationKeyDetails,function(error, response, body){
                                if(error){
                                    logger.error('An error has occurred when getting  response of generated application key from backend server at line 176');
                                    next();
                                }else{
                                    body=JSON.parse(body);
                                    if(typeof body.data.key =="undefined"){
                                        logger.error('Response of backend server is invalid, some sort of internal server error might has been occurred');
                                        next();
                                    }else{
                                    	
                                        var findCon={"userDetails.username":details.username};
                                        var nextApplication=0;
                                        dbreq.find(findCon,function(err,docs){
                                        		
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
                                                dbreq.update(findCon,updateCon,function(err,docs){
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
                                                            dbreq.update(findCon,updateCon,function(err,docs){
                                                                if(err==null) {
                                                                        logger.info('User details has been updated :'+JSON.stringify(docs));
                                                                        next();
                                                                 }else{
                                                                        logger.error(' :'+JSON.stringify(docs));
                                                                        logger.error('An error has occurred when updating  user at line 234');
                                                                        next();
                                                                }
                                                            });
                                                        }else{
                                                            logger.error('An error has occurred when updating  user at line 212');
                                                            next();
                                                        }
                                            });

                                        });
                                        next();
                                    }

                                }
                            });
                        }
                    });
                }else{
                    next();
                }
            }

        }else{
            console.log("error: "+err);
            next();
        }
    });
},function(req,res){
    res.json({ msg: "Your subscription is accepted successfully",appAccessToken:this.accessToken});
});



module.exports = router;
