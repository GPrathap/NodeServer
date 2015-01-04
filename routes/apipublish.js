/**
 * Created by geesara on 1/1/15.
 */

var log4js = require('log4js');
var express = require('express');
var router = express.Router();


var AMPublishAPI = require("../apipublish/apipublish.js");
var Nedbapi = require("../dbrequest/nedb.js");

var logger = log4js.getLogger('apipublish.js');
var db = new Nedbapi();
var am = new AMPublishAPI();

/*
router.get('/', function(req, res) {
	//res.jsonp({message: 'welcome'});
	//console.log("check cookie:"+JSON.stringify(req.cookies.count));
	//var count = parseInt(req.cookies.count) || 0;
	//count++;
	//res.cookie('count', count);
	//res.send('Count: ' + count);
	var count = req.signedCookies.count || 0;
	count++;
	res.cookie('count', count, { signed: true });
	res.send('Count: ' + count);
});*/

router.post('/login', function(req, res,next) {

    am.login(req.body,function(error,response,body){

        if(JSON.parse(body).error==true){
            logger.error('An error has occurred when getting  response of login from backend server at line 34');
            next();
        }else{
            //res.set("X-two","login is done");
            var findCon={"userDetails.username":req.body.username};
            var updateCon={$set:{"userDetails.cookie":response.headers['set-cookie']}};
            db.update(findCon,updateCon,function(err,docs){
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
    res.send({ msg: "You have been successfully logged in."});
});

router.post('/addAPI', function(req, res,next) {

    var findCon={"userDetails.username":req.body.username};
    db.find(findCon,function(err,docs){
        if(err==null){
            
            var cookie=docs[0].userDetails.cookie;
            if(cookie!=""){
                am.addAPI(req.body,cookie,function(error, response, body){
                    if(!error){
                        logger.error('An error has occurred when adding an application to backend server at line 56 '+error);
                        next();
                    }else{
                        logger.info('API is added to backed server :'+JSON.stringify(body));
                        next();
                    }
                });
            }else{
                next();
            }
        }else{
             logger.error('This user has not been signed up yet ' +err);
            next();
        }
    });
},function(req,res){
    res.send({ msg: "API is successfully added"});
});

router.post('/publishAPI', function(req, res,next) {
    var findCon={"userDetails.username":req.body.username};
    db.find(findCon,function(err,docs){
        if(err==null){
            //console.log("docs "+JSON.stringify(docs) );
            var cookie=docs[0].userDetails.cookie;
            if(cookie!=""){
                am.publishAPI(req.body,cookie,function(error, response, body){
                    if(error){
                        logger.error('An error has occurred when publishing an application to backend server at line 56 '+error);
                        next();
                    }else{
                        logger.info('Application is published to backed server :'+body);
                        next();
                    }
                });
            }else{
                next();
            }
        }else{
            console.log("error: "+err);
            next();
        }
    });
},function(req,res){
    res.send({ msg: "API is successfully deployed"});
});

module.exports = router;

