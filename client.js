/*
var tls = require('tls');
var fs = require('fs');
var test={action:"addAPI",
      name:"WikipediaAPI",
      visibility:"public",
      version:"2.0.0",
      description:"If you want to monitor a MediaWiki installation or create  automatically",
      endpointType:"nonsecured",
      http_checked:"http",
      https_checked:"https",
      tags:"wikipedia,mediawiki",
      tier:"Silver",
      thumbUrl:"https://upload.wikimedia.org/wikipedia/en/b/bc/Wiki.png",
      context:"/wikipedia",
      tiersCollection:"Gold",
      resourceCount:"0",
      resourceMethod:"GET",
      resourceMethodAuthType:"Application",
      resourceMethodThrottlingTier:"Unlimited",
      uriTemplate:"/*",
      endpoint_config:{production_endpoints:{url:"http://en.wikipedia.org/w/api.php",config:null},endpoint_type:"http"}
};
var options = {
  // These are necessary only if using the client certificate authentication
  //key: fs.readFileSync('clientkey.pem'),
  //cert: fs.readFileSync('clientcert.pem'),

  // This is necessary only if the server uses the self-signed certificate
  ca: [ fs.readFileSync('keys/servercert.pem') ]
};

var host='localhost';
var cleartextStream = tls.connect(8000,host,options, function() {
  console.log('client connected',cleartextStream.authorized ? 'authorized' : 'unauthorized');
  process.stdin.pipe(cleartextStream);
  //process.stdin.resume();
});
        

cleartextStream.setEncoding('utf8');
cleartextStream.write(JSON.stringify(test));
cleartextStream.on('end', function() {
                console.log("data is come");
});
*/
//server.close();
//cleartextStream.pipe(cleartextStream);
/*
cleartextStream.on('data', function(data) {
                console.log(data);
});

cleartextStream.on('end', function() {
                console.log("data is come");
});*/

var userDetailsAPI={

    action:"login",
    username:"provider1",
    password:"provider1"
}

var apiPublishDetalis={

    username:"provider1",
    name:"Wsaccv",
    version:"1.0.0",
    provider:"provider1",
    status:"PUBLISHED",
    publishToGateway:"true",
    action:"updateStatus"
}

var apiDetalis={
        action:"addAPI",
        name:"Wsaccv",
        username:"provider1",
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
        context:"/vaccv",
        tiersCollection:"Gold",
        resourceCount:"0",
        resourceMethod:"GET",
        resourceMethodAuthType:"Application",
        resourceMethodThrottlingTier:"Unlimited",
        endpoint_config:{
                production_endpoints:{
                        url:"http://en.wikipedia.org/w/api.php",
                        config:"null"
                                        },
                endpoint_type:"http"
                        },
        uriTemplate:"/*"
}
var userDetails={
        action:"addUser",
        username:"GPrathap8",
        password:"geesara1234A",
        cookie:"",
        firstname:"user1",
        lastname:"user2",
        phonenumber:"",
        postalcode:"",
        country:""
}

var applicatioDetails={

    action:"addApplication",
    application:"default39",
    tier:"Unlimited",
    callbackUrl:"",
    description:"",
    username:"GPrathap8"
}

var subscriptionDetails={
    action:"addSubscription",
    actionApp:"getApplications",
    name:"WikipediaAPIs",
    version:"1.0.0",
    provider:"provider1",
    tier:"Gold",
    applicationId:58,
    username:"GPrathap8",
    applicationKeyDetails:{
        action:"generateApplicationKey",
        application:"default39",
        keytype:"PRODUCTION",
        callbackUrl:"",
        authorizedDomains:"ALL",
        validityTime:36000
    }
}
var applicationKeyDetails={

  action:"generateApplicationKey",
  application:"default39",
  keytype:"PRODUCTION",
  callbackUrl:"",
  authorizedDomains:"ALL",
  validityTime:36000

}

var fs = require('fs');
var request = require('request');

var optsSingup = {
    url: "https://localhost:3000/initusers/signup",
    method: "POST",
    ca: [fs.readFileSync('keys/servercert.pem')],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    form:{
        action:userDetails.action,
        username:userDetails.username,
        password:userDetails.password,
        cookie:userDetails.cookie,
        firstname:userDetails.firstname,
        lastname:userDetails.lastname,
        phonenumber:userDetails.phonenumber,
        postalcode:userDetails.postalcode,
        country:userDetails.country
        }

};
var optsGetAppDetails = {
    url: "https://localhost:3000/initusers/getAppDetails",
    method: "POST",
    ca: [fs.readFileSync('keys/servercert.pem')],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    form:{
            action:"getApplications",
            username:userDetails.username,
            applicationKeyDetails:{
                application:"default39"
            }
    }

};
var optsLogin = {
    url: "https://localhost:3000/initusers/login",
    method: "POST",
    ca: [fs.readFileSync('keys/servercert.pem')],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    form:{
            action:"login",
            username:userDetails.username,
            password:userDetails.password
    }

};

var optsAddApplication = {
    url: "https://localhost:3000/initusers/addApplication",
    method: "POST",
    ca: [fs.readFileSync('keys/servercert.pem')],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    form:{
            action:applicatioDetails.action,
            application:applicatioDetails.application,
            tier:applicatioDetails.tier,
            callbackUrl:applicatioDetails.callbackUrl,
            description:applicatioDetails.description,
            username:applicatioDetails.username
    }

};

var optsSubscription = {
    url: "https://localhost:3000/initusers/subscribe",
    method: "POST",
    ca: [fs.readFileSync('keys/servercert.pem')],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    form:{
            action:subscriptionDetails.action,
            name:subscriptionDetails.name,
            version:subscriptionDetails.version,
            provider:subscriptionDetails.provider,
            tier:subscriptionDetails.tier,
            applicationId:subscriptionDetails.applicationId,
            username:subscriptionDetails.username,
            applicationKeyDetails:subscriptionDetails.applicationKeyDetails
    }

};
var optsLoginAPI = {
    url: "https://localhost:3000/apipublish/login",
    method: "POST",
    ca: [fs.readFileSync('keys/servercert.pem')],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    form:{
        action:"login",
        username:userDetailsAPI.username,
        password:userDetailsAPI.password
    }

};
var optsaddAPI = {
    url: "https://localhost:3000/apipublish/addAPI",
    method: "POST",
    ca: [fs.readFileSync('keys/servercert.pem')],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    form:{
        action:apiDetalis.action,
        username:apiDetalis.username,
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
        resourceMethod:apiDetalis.resourceMethod,
        resourceMethodAuthType:apiDetalis.resourceMethodAuthType,
        resourceMethodThrottlingTier:apiDetalis.resourceMethodThrottlingTier,
        endpoint_config:{
            production_endpoints:{
                url:apiDetalis.endpoint_config.production_endpoints.url,
                config:apiDetalis.endpoint_config.production_endpoints.config
            },
            endpoint_type:apiDetalis.endpoint_config.endpoint_type
        },
        uriTemplate:apiDetalis.uriTemplate
    }

};

var optsPublishAPI = {
    url: "https://localhost:3000/apipublish/publishAPI",
    method: "POST",
    ca: [fs.readFileSync('keys/servercert.pem')],
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
    form:{
        username:apiPublishDetalis.username,
        name:apiPublishDetalis.name,
        version:apiPublishDetalis.version,
        provider:apiPublishDetalis.provider,
        status:apiPublishDetalis.status,
        publishToGateway:apiPublishDetalis.publishToGateway,
        action:apiPublishDetalis.action
    }

};

var optstry = {
    url: "http://localhost:3000/apipublish/",
    method: "GET",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }

};

var optstrycookie = {
    url: "http://localhost:3000/apipublish/",
    method: "GET",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie":"count=0"
    }

};
//optsSingup
//optsLogin
//optsAddApplication
//optsSubscription
//optsLoginAPI
//optsaddAPI
//optsPublishAPI
//optsGetAppDetails

request(optsGetAppDetails, function (err, res, body) {
    console.log('error', err);
    console.log('status', res.statusCode);
    console.log('body', body);
});