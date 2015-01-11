var request = require('request');
var fs = require('fs');
var log4js = require('log4js');
var logger = log4js.getLogger('apipublishresponse.js');
var Nedbapi = require("../dbrequest/nedb.js");
var db = new Nedbapi();
/*
This api is used for handling responses corresponding to requests are made by apipublishrequest.js
All methods are expected these parameters as input arguments.

@param $clientreq- request from client,$error- error response from backend server if error

is present $body -response from server $response- caller response $callback- send error or response back to caller 

*/

var amapipublishresponse=function(){

    var am=this;
    /** 
    * @desc handles a login response 
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
    * @desc handles a add an API response 
    */
    am.addAPI=function(clientreq,error,body,response,callback){
                    if(error){
                        logger.error('An error has occurred when adding an application to backend server '+error);
                        
                         callback(true,body);
                    }else{
                        
                        var responseBody=JSON.parse(body);
                      
                        if(typeof responseBody.error==="undefined"||responseBody.error==true){
                                logger.error(responseBody.message);
                                 
                                callback(responseBody.error,responseBody.message);

                        }else{

                                callback(responseBody.error,body);
                        }
                       
                    }
    }
    /** 
    * @desc handles a publishing an API response 
    */
    am.publishAPI=function(clientreq,error,body,response,callback){
                if(error){
                         logger.error('An error has occurred when publishing an API in backend server '+error);
                         callback(true,body);
                }else{
                        
                        var responseBody=JSON.parse(body);
                        if(typeof responseBody.error=="undefined"||responseBody.error==true){
                                 logger.error(responseBody.message);
                                 callback(responseBody.error,responseBody.message);
                        }else{
                            callback(responseBody.error,body);
                        }
                       
                }
    }

}

module.exports=amapipublishresponse;