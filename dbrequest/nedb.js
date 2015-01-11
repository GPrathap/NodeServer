
var log4js = require('log4js');
var logger = log4js.getLogger('initusersjs');

var Datastore = require('nedb');
var db = new Datastore({ filename: 'database/userinfo1.db', autoload: true });

/*

All database transactions are managed by this api(nedb). 
Database details-: name:userinfo1.db path:../database/
@param 
$findCon- a query that is used as find condition
$updateCon - a query that is the update condition corresponding to find result

*/

var nedbapi = function(){
    var nedb =this;
    nedb.db=db;
   
   
    /*var findCon={"userDetails.username":"prsedsdef"};
    var updateCon={$push:{
	 			subscriptionDetails:{name:"WikipediaAPIs",version:"1.0.0",provider:"provider1",tier:"Gold",applicationId:32}
			  }};
    var updateCon={$set:{"userDetails.password":"gothere123A","userDetails.firstname":"Jone"}};*/

    /** 
    * @desc -updating database

    */ 
    nedb.update=function(findCon,updateCon,callback){
            var error;
            var doc;
			nedb.db.update(findCon,updateCon,{upsert: true},function(err,docs){
                if(err){
                    this.error=err;
                    this.doc=null;
                    logger.error('An error has occurred when updating  user at line 56 '+err);
                    if(typeof callback==="function"){
                        callback(this.error,this.doc);
                    }
                }else{
                    this.error=null;
                    this.doc=docs;
                    if(typeof callback==="function"){
                        callback(this.error,this.doc);
                    }
                }
			});
    }
//nedb.update(findCon,updateCon,function(err,docs){});
    /** 
    * @desc -finding data from database

    */ 
    nedb.find=function(findCon,callback){
                var error;
                var doc;
	            nedb.db.find(findCon,function(err,docs){

		             if(err){
                         this.error=err;
                         this.doc=null;
			             logger.error('An error has occurred when finding  user at line 56 '+err);
                         if(typeof callback==="function"){
                             callback(this.error,this.doc);
                         }
                     }else{
                            this.error=null;
                            this.doc=docs;
                            if(typeof callback==="function"){
                                callback(this.error,this.doc);
                            }
		             }

	            });
    }

//var findCon={"applicationsInfo.applicationKeyDetails.keytype":"PRODUCTION"};
//var findCon={"userDetails.username":"prsedsdef"};
//nedb.find(findCon,function(err,docs){});
     
     /** 
    * @desc -inserting data into database

    */ 


    nedb.insert=function(data,callback){
        var error;
        var doc;
	    nedb.db.insert(data,function(err,docs){
            if(err){
                this.error=err;
                this.doc=null;
                logger.error('An error has occurred when inserting data  at line 112 '+err);
                if(typeof callback==="function"){
                    callback(this.error,this.doc);
                }
            }else{
                this.error=null;
                this.doc=docs;
                if(typeof callback==="function"){
                    callback(this.error,this.doc);
                }
            }

	    });
    }

//nedb.insert(userinfo,,function(err,docs){});
    /*This is the way how create a user*/
    nedb.createUser=function(userDetails,callback){
        var error;
        var doc;
        /*This is the skeleton structure of user*/
        var userinfo={

            userDetails:
            {
                username:"",
                password:"",
                cookie:"",
                firstname:"",
                lastname:"",
                phonenumber:"",
                postalcode:"",
                country:""
            },
            applicationsInfo:[
                {
                    application:"",
                    tier:"",
                    callbackUrl:"",
                    description:"",
                    keytype:"",
                    callbackUrl:"",
                    authorizedDomains:"",
                    validityTime:"",
                    consumerKey :"",
                    accessToken : "",
                    consumerSecret : ""

    
                }
            ],
            subscriptionDetails:[
                {
                    name:"",
                    version:"",
                    provider:"",
                    tier:"",
                    applicationId:""
                }
            ]

        };
        userinfo.userDetails=userDetails;
        nedb.db.insert(userinfo,function(err,docs){
            if(err){
                this.error=err;
                this.doc=null;
                logger.error('An error has occurred when inserting data  at line 180 '+err);
                if(typeof callback==="function"){
                    callback(this.error,this.doc);
                }
            }else{
                this.error=null;
                this.doc=docs;
                if(typeof callback==="function"){
                    callback(this.error,this.doc);
                }
            }

        });
    }
    /*This is the way how create a api publisher*/
    nedb.createAPIUser=function(userDetails,callback){
        var error;
        var doc;
        /*This is the skeleton structure of api publisher*/
        var userinfo={

            userDetails:
            {
                username:"provider1",
                password:"provider1",
                cookie:"",
                firstname:"",
                lastname:"",
                phonenumber:"",
                postalcode:"",
                country:""
            },
            applicationsInfo:[
                {
                    application:"",
                    tier:"",
                    callbackUrl:"",
                    description:"",
                    applicationKeyDetails:
                    {
                        keytype:"",
                        callbackUrl:"",
                        authorizedDomains:"",
                        validityTime:"",
                        consumerKey :"",
                        accessToken : "",
                        consumerSecret : ""
                    }
                }
            ],
            subscriptionDetails:[
                {
                    name:"",
                    version:"",
                    provider:"",
                    tier:"",
                    applicationId:""
                }
            ],
            apiPublishDetalis:[
                {
                    name: "",
                    version: "1.0.",
                    provider: "",
                    status: "",
                    publishToGateway: "",
                    action: ""
                }
            ],
            apiDetalis:[
                {
                    action:"",
                    name:"",
                    visibility:"",
                    version:"",
                    description:"",
                    endpointType:"",
                    http_checked:"",
                    https_checked:"",
                    wsdl:"",
                    tags:"",
                    tier:"",
                    thumbUrl:"",
                    context:"",
                    tiersCollection:"",
                    resourceCount:"",
                    resourceMethod:"",
                    resourceMethodAuthType:"",
                    resourceMethodThrottlingTier:"",
                    endpoint_config:{
                        production_endpoints:{
                            url:"",
                            config:""
                        },
                        endpoint_type:""
                    },
                    uriTemplate:""
                }
            ]

        };
       // userinfo.userDetails=userDetails;
        nedb.db.insert(userinfo,function(err,docs){
            if(err){
                this.error=err;
                this.doc=null;
                console.log("An error has occurred in nedb.js line 275");
                if(typeof callback==="function"){
                    callback(this.error,this.doc);
                }
            }else{
                this.error=null;
                this.doc=docs;
                if(typeof callback==="function"){
                    callback(this.error,this.doc);
                }
            }

        });
    }

}

/*
var d =  new nedbapi();
var findCon={"userDetails.username":"provider1"};
d.createAPIUser(null,function(err,docs){});
d.find(findCon,function(err,docs){
    console.log(docs);
});*/


module.exports = nedbapi;