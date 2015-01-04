/**
 * Created by geesara on 1/1/15.
 */

var request = require('request');
var fs = require('fs');

var amapipublish=function(){

    var am=this;

    am.login=function(userDetails,callback){
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded',
                'Cookie':fs.readFileSync('./cookie/cookies').toString()
            },
            url: 'http://localhost:9763/publisher/site/blocks/user/login/ajax/login.jag',
            form:{
                action:"login",
                username:userDetails.username,
                password:userDetails.password

            }
        },function(error, response, body){
            if(error){
               
                callback(error,response,body);
            }else{
                //console.log(body);
                callback(error,response,body);
            }
        });

    }

    am.addAPI=function(apiDetalis,setcookie,callback){
        request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded',
                      'Cookie':setcookie
            },
            url: 'http://localhost:9763/publisher/site/blocks/item-add/ajax/add.jag',
            body:'action=' +apiDetalis.action+
            '&name=' +apiDetalis.name+
            '&visibility=' +apiDetalis.visibility+
            '&version=' +apiDetalis.version+
            '&description=' +apiDetalis.description+
            '&endpointType=' +apiDetalis.endpointType+
            '&http_checked=' +apiDetalis.http_checked+
            '&https_checked=' +apiDetalis.https_checked+
            '&wsdl=' +apiDetalis.wsdl+
            '&tags=' +apiDetalis.tags+
            '&tier=' +apiDetalis.tier+
            '&thumbUrl=' +apiDetalis.thumbUrl+
            '&context=' +apiDetalis.context+
            '&tiersCollection=' +apiDetalis.tiersCollection+
            '&resourceCount=' +apiDetalis.resourceCount+
            '&resourceMethod-0=' +apiDetalis.resourceMethod+
            '&resourceMethodAuthType-0=' +apiDetalis.resourceMethodAuthType+
            '&resourceMethodThrottlingTier-0=' +apiDetalis.resourceMethodThrottlingTier+
            '&endpoint_config={"production_endpoints":{"url":"' +apiDetalis.endpoint_config.production_endpoints.url+
            '","config":' +apiDetalis.endpoint_config.production_endpoints.config+
            '},"endpoint_type":"' +apiDetalis.endpoint_config.endpoint_type+
            '"}&' +
            'uriTemplate-0=' +apiDetalis.uriTemplate+
            ''


        },function(error, response, body){
            if(error){
               
                callback(error,response,body);
            }else{
               // console.log(body);
                callback(error,response,body);
            }
        });
    }
    am.publishAPI=function(apiDetalis,setcookie,callback){
       request.post({
            headers: {'content-type' : 'application/x-www-form-urlencoded',
                'Cookie':setcookie
            },
            url:'http://localhost:9763/publisher/site/blocks/life-cycles/ajax/life-cycles.jag',
            form:{
                name:apiDetalis.name,
                version:apiDetalis.version,
                provider:apiDetalis.provider,
                status:apiDetalis.status,
                publishToGateway:apiDetalis.publishToGateway,
                action:apiDetalis.action
            }

        }, function(error, response, body){
            if(error){
                
                callback(error,response,body);
            }else{
               // console.log(body);
                callback(error,response,body);
            }
        });


    }

}

module.exports=amapipublish;
/*
var userDetalis={

    action:"login",
    username:"provider1",
    password:"provider1"
}

var apiPublishDetalis={

    name:"Wikiv",
    version:"1.0.0",
    provider:"provider1",
    status:"PUBLISHED",
    publishToGateway:"true",
    action:"updateStatus"
}

var apiDetalis={
        action:"addAPI",
        name:"Wikiv",
        visibility:"public",
        version:"1.0.0",
        description:"If tabases",
        endpointType:"nonsecured",
        http_checked:"http",
        https_checked:"https",
        wsdl:"",
        tags:"wikipedia,mediawiki",
        tier:"Silver",
        thumbUrl:"https://upload.wikimedia.org/wikipedia/en/b/bc/Wiki.png",
        context:"/vvvvvv",
        tiersCollection:"Gold",
        resourceCount:"0",
        resourceMethod:"GET",
        resourceMethodAuthType:"Application",
        resourceMethodThrottlingTier:"Unlimited",
        endpoint_config:{
                "production_endpoints":{
                        "url":"http://en.wikipedia.org/w/api.php",
                        "config":null
                                        },
                "endpoint_type":"http"
                        },
        uriTemplate:"/*"
}

var cookie;
var am = new amapipublish();
am.login(userDetalis,function(error,response,body){
    console.log(error);
    console.log(body);
    cookie=response.headers['set-cookie'];
    am.addAPI(apiDetalis,response.headers['set-cookie'],function(error,response,body){


        console.log(error);
        console.log(body);
        am.publishAPI(apiPublishDetalis,cookie,function(error,response,body){
            console.log(error);
            console.log(body);
        });
    });
});

*/








/*
 form:{
 action:apiDetalis.action,
 name:apiDetalis.name,
 visibility:apiDetalis.visibility,
 version:apiDetalis.version,
 description:apiDetalis.description,
 endpointType:apiDetalis.endpointType,
 http_checked:apiDetalis.http_checked,
 https_checked:apiDetalis.https_checked,
 wsdl:apiDetalis.wsdl,
 tags:apiDetalis.tags,
 tier:apiDetalis.tier,
 thumbUrl:apiDetalis.thumbUrl,
 context:apiDetalis.context,
 tiersCollection:apiDetalis.tiersCollection,
 resourceCount:apiDetalis.resourceCount,
 'resourceMethod-0':apiDetalis.resourceMethod,
 'resourceMethodAuthType-0':apiDetalis.resourceMethodAuthType,
 'resourceMethodThrottlingTier-0':apiDetalis.resourceMethodThrottlingTier,
 endpoint_config:{
 production_endpoints:{
 url:"http://en.wikipedia.org/w/api.php",
 config:null
 },
 endpoint_type:"http"
 },
 'uriTemplate-0':apiDetalis.uriTemplate
 }
 var request = require('request');
 request.post({
 headers: {'content-type' : 'application/x-www-form-urlencoded'},
 url:     'http://localhost/test2.php',
 body:    "mes=heydude"
 }, function(error, response, body){
 console.log(body);
 });
 {"provider":"provider1","apiName":"WikipediaAPIc","version":"5.0.0","status":"PUBLISHED","publishToGateway":"true","deprecateOldVersions":null,"makeKeysForwardCompatible":"true"}
 {"provider":"provider1","apiName":"WikipediaAPIg","version":"14.0.0","status":"PUBLISHED","publishToGateway":"true","deprecateOldVersions":null,"makeKeysForwardCompatible":"true"}
 {"request":{},"apiName":"WikipediaAPIx","version":"1.0.0","defaultVersion":null,"description":"If you want to monitor a MediaWiki installation, or create a bot to automatically maintain one, you can use the MediaWiki web service API. The web service API provides direct, high-level access to the data contained in MediaWiki databases","transports":"http,https","endpoint":null,"sandbox":null,"wsdl":"","wadl":null,"tags":"wikipedia,mediawiki","tier":"Gold","imageUrl":null,"context":"/wikipediasded","bizOwner":null,"bizOwnerEmail":null,"techOwner":null,"techOwnerEmail":null,"visibility":"public","visibleRoles":null,"visibleTenants":null,"endpointSecured":"nonsecured","endpointUTUsername":null,"endpointUTPassword":null,"inSequence":null,"outSequence":null,"redirectURL":null,"apiOwner":null,"advertiseOnly":null,"subscriptionAvailability":null,"subscriptionTenants":null,"endpoint_config":"{\"production_endpoints\":{\"url\":\"http://en.wikipedia.org/w/api.php\",\"config\":null},\"endpoint_type\":\"http\"}","resource_config":null,"responseCache":null,"cacheTimeout":null,"faultSequence":null,"destinationStats":null,"externalAPIStores":[],"uriTemplateArr":["/*"],"uriMethodArr":["GET"],"uriAuthMethodArr":["Application"],"throttlingTierArr":[""],"provider":"provider1"}
 {"request":{},"apiName":"WikipediaAPIw","version":"1.0.0","defaultVersion":null,"description":"If tabases                                                                                                                                                                                                                                    ","transports":"http,https","endpoint":null,"sandbox":null,"wsdl":"","wadl":null,"tags":"wikipedia,mediawiki","tier":"Gold","imageUrl":null,"context":"/wikipededrf","bizOwner":null,"bizOwnerEmail":null,"techOwner":null,"techOwnerEmail":null,"visibility":"public","visibleRoles":null,"visibleTenants":null,"endpointSecured":"nonsecured","endpointUTUsername":null,"endpointUTPassword":null,"inSequence":null,"outSequence":null,"redirectURL":null,"apiOwner":null,"advertiseOnly":null,"subscriptionAvailability":null,"subscriptionTenants":null,"endpoint_config":"{production_endpoints:{url:'http://en.wikipedia.org/w/api.php',config:null},endpoint_type:'http'}","resource_config":null,"responseCache":null,"cacheTimeout":null,"faultSequence":null,"destinationStats":null,"externalAPIStores":[],"uriTemplateArr":["/*"],"uriMethodArr":["GET"],"uriAuthMethodArr":["Application"],"throttlingTierArr":[""],"provider":"provider1"}



 var request = require('request');
 var token = '6e3e83dc6ff727e6ea7bae7dbf3829d';
 var opts = {
 url: "http://localhost:9763/publisher/site/blocks/user/login/ajax/login.jag",
 method: "POST",
 headers: {
 "Content-Type": "application/x-www-form-urlencoded"
 }
 };

 request(opts, function (err, res, body) {
 console.log('error', err);
 console.log('status', res.statusCode);
 console.log('body', body);
 });
 var http = require('http');
 var post_data = 'action=login&username=provider1&password=provider1',
 headers = {
 host: 'http://localhost:9763/publisher/site/blocks/user/login/ajax/login.jag',
 method: 'POST',
 headers: {
 "Content-Type": "application/x-www-form-urlencoded",
 'Content-Length': Buffer.byteLength(post_data)
 }
 };

 var request = http.request(headers, function(response) {
 response.on('data', function(d) {
 console.log(d);
 });
 });
 request.on('error', function(err) {
 console.log("An error ocurred!");
 });
 request.write(post_data);

 request.end();*/