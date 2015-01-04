var log4js = require('log4js');
var request = require('request');
var fs = require('fs');

var logger = log4js.getLogger('initusersjs');

var userDetails={
  action:"addUser",
  username:"prsedsdefovsd",
  password:"prosedfrvisdrasdfA1",
  firstname:"user1",
  lastname:"user2",
  phonenumber:"",
  postalcode:"",
  country:""
}

var applicatioDetails={
  action:"addApplication",
  application:"defaultFun12",
  tier:"Unlimited",
  callbackUrl:"",
  description:""
}

var subscriptionDetails={
  action:"addSubscription",
  name:"WikipediaAPIs",
  version:"1.0.0",
  provider:"provider1",
  tier:"Gold",
  applicationId:32
}
var applicationKeyDetails={
  action:"generateApplicationKey",
  application:"defaultFun12",
  keytype:"PRODUCTION",
  callbackUrl:"",
  authorizedDomains:"ALL",
  validityTime:36000
}


var amrequest=function(){
    var am=this;

    am.signup = function(userDetails,callback){
            var allFieldsValuesF=function(){
                    function checkAndSet(value){
                        if(userDetails[value]===""){
                          allFieldsValues+="|";
                        }else{
                           allFieldsValues+=userDetails[value];
                           allFieldsValues+="|";
                        }
                    }

                                 var allFieldsValues="";
                                checkAndSet("firstname");
                                checkAndSet("lastname");
                                checkAndSet("phonenumber");
                                checkAndSet("postalcode");
                                checkAndSet("country");

                     if(allFieldsValues.substring(allFieldsValues.length-1,allFieldsValues.length)==="|"){
                                allFieldsValues=allFieldsValues.substring(0,allFieldsValues.length-1) + "";
                        }
                return allFieldsValues;
            }

            var detalis = allFieldsValuesF();
            request.post({
                 headers: {'content-type' : 'application/x-www-form-urlencoded',
                    'Cookie':fs.readFileSync('./cookie/cookies').toString(),
                    'Method':'POST'
                },
                url: 'http://localhost:9763/store/site/blocks/user/sign-up/ajax/user-add.jag',
                form:  {
                        action:userDetails.action,
                        username:userDetails.username,
                        password:userDetails.password,
                        allFieldsValues:detalis
                 }
             }, 
             function(error, response, body){
                if(error){
                    callback(error,response,body);
                }else{
                   // console.log(body);
                    callback(error,response,body);
                }
                
            });
        }

    am.login=function(userDetails,callback){
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded',
                'Cookie':fs.readFileSync('./cookie/cookies').toString(),
                'Method':'POST'
             },
            url:'http://localhost:9763/store/site/blocks/user/login/ajax/login.jag',
            form:  {
                action:"login",
                username:userDetails.username,
                password:userDetails.password
            }
            }, 
            function(error, response, body){
              //console.log(body);
                if(error){
                    
                    callback(error,response,body);
                }else{
                   // console.log(body);
                    callback(error,response,body);
                }
        });
    }

    am.addApplication=function(setcookie,applicatioDetails,callback){
        request.post({
        headers: {
          'content-type' : 'application/x-www-form-urlencoded',
          'Cookie':setcookie
        },
        url: 'http://localhost:9763/store/site/blocks/application/application-add/ajax/application-add.jag',
        form:{
            action:applicatioDetails.action,
            application:applicatioDetails.application,
            tier:applicatioDetails.tier,
            callbackUrl:applicatioDetails.callbackUrl,
            description:applicatioDetails.description
        }
        }, 
        function(error, response, body){
            if(error){
                
                callback(error,response,body);
            }else{
               // console.log(body);
                callback(error,response,body);
            }
        });
    }

    am.addSubscription=function(setcookie,subscriptionDetails,callback){
    
        request.post({
                headers: {
                    'content-type' : 'application/x-www-form-urlencoded',
                    'Cookie':setcookie
        },
        url: 'http://localhost:9763/store/site/blocks/subscription/subscription-add/ajax/subscription-add.jag',
     
        form:{
                action:subscriptionDetails.action,
                name:subscriptionDetails.name,
                version:subscriptionDetails.version,
                provider:subscriptionDetails.provider,
                tier:subscriptionDetails.tier,
                applicationId:subscriptionDetails.applicationId
        }
        }, 
        function(error, response, body){
            if(error){
               
                callback(error,response,body);
            }else{
                //console.log(body);
                callback(error,response,body);
            }
          
        });
    }

    am.generateApplicationKey = function(setcookie,applicationKeyDetails,callback){
    
        request.post({
            headers: {
                'content-type' : 'application/x-www-form-urlencoded',
                'Cookie':setcookie
            },
            url: 'http://localhost:9763/store/site/blocks/subscription/subscription-add/ajax/subscription-add.jag',
     
            form:{
                action:applicationKeyDetails.action,
                application:applicationKeyDetails.application,
                keytype:applicationKeyDetails.keytype,
                callbackUrl:applicationKeyDetails.callbackUrl,
                authorizedDomains:applicationKeyDetails.authorizedDomains,
                validityTime:applicationKeyDetails.validityTime,
                retryAfterFailure:applicationKeyDetails.retryAfterFailure
            }
        },
            function(error, response, body){
                if(error){
                   
                    callback(error,response,body);
                }else{
                   // console.log(body);
                    callback(error,response,body);
                }

            });
    }
}

module.exports = amrequest;