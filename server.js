var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo =require('mongoskin');
var routes = require('./routes/index');
var users = require('./routes/users');
var initusers = require('./routes/initusers');
var apipublish = require('./routes/apipublish');
var debug = require('debug')('wso2nodeserver');
var https=require('https');
var fs = require('fs');
var log4js = require('log4js');
var log = log4js.getLogger('server.js');
//define our rest api as this
var restapi = function(){
  var rest =this;

  rest.initializeServer=function(){
      //  Set the environment variables we need.
        rest.ipaddress = process.env.IP;
        rest.port      = process.env.port|| 3000;

        if (typeof rest.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            rest.ipaddress = "localhost";
        };
        rest.app.set('port',rest.port);
        //get private and public key
       
  }
  //get private and public certificates
  rest.getcertificate=function(){
      
       rest.https_options = {
                key: fs.readFileSync('keys/serverkey.pem'),
                cert: fs.readFileSync('keys/servercert.pem')
        }

  }
  //log server to file 
  rest.loggertofile=function(){
      rest.app.use(express.logger({
              format: 'tiny',
              stream: fs.createWriteStream('app.log', {'flags': 'w'})
      }));
  }
  rest.constructor=function(){
   
    //initialize express 
    rest.app= express();
    // view engine setup
    rest.app.set('views', path.join(__dirname, 'views'));
    rest.app.set('view engine', 'ejs');
    rest.app.use(logger('dev'));
    rest.app.use(bodyParser.json());
    rest.app.use(bodyParser.urlencoded({ extended: false }));
    rest.app.use(cookieParser('S3CRE7'));
    //rest.app.use(express.cookieSession());
 
    //setup public directory which  is exposure to the outside
    rest.app.use(express.static(path.join(__dirname, 'public')));
    rest.app.use(function(req,res,next){
        next();
    });
  }
 //when user is clicked ctrl+c (SIGINT) like wise thnis one is used to handle errors
  rest.setupTerminationHandlers=function(){
     process.on('exit', function() { rest.terminator(); });
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { rest.terminator(element); });
        });
  }
 //if one of above errors is triggered stop the server
  rest.terminator=function(sig){
    if (typeof sig === "string") {
           console.log();
           log.debug( Date(Date.now()) +' Received  '+sig+' - terminating Node Server ...');
           process.exit(1);
        }
       
        log.debug( Date(Date.now()) +' Node server stopped.');
  }

  rest.initializeRouters= function(){
     //if request is the main directory "/" 
      rest.app.use('/', routes);
      //all subdirectories are handled by this
      //rest.app.use('/users', users,{db:rest.DB});

      rest.app.use('/initusers', initusers);

      rest.app.use('/apipublish',apipublish);

      rest.app.use(function(req, res) {
              res.status(400);
              res.render('404.jade',
            {
              title: '404',
              message: 'File Not Found'
            }
          );
      });
      //requested page is not found
      rest.app.use(function(req, res, next) {
              var err = new Error('Not Found');
              err.status = 404;
              next(err);
      });
      // Add the errorHander middleware
     // rest.app.use(express.errorHandler());
      //if some internal server error is present
      if (rest.app.get('env') === 'development') {
              rest.app.use(function(err, req, res, next) {
              res.status(err.status || 500);
              res.render('error', {
                  message: err.message,
                  error: err
              });
        });
      }
      rest.app.use(function(err, req, res, next) {
          res.status(err.status || 500);
          res.render('error', {
          message: err.message,
          error: {}
       });
      });
  }
 
  rest.initialize=function(){
      rest.constructor();
      rest.setupTerminationHandlers();
      rest.initializeRouters();
      rest.initializeServer();
  }
  //to start http server 
  rest.starthttp = function(){
    var server = rest.app.listen(rest.app.get('port'), function() {
             
             log.debug('HTTP wso2 node server listening on '+ rest.ipaddress+' '+rest.app.get('port'));
        });
  }
  //to start https server use this instead  of rest.starthttp()
  rest.starthttps =function(){
    rest.getcertificate();
    var server = https.createServer(rest.https_options,rest.app).listen(rest.app.get('port'),rest.ipaddress);
    log.debug('HTTPS wso2 node server listening on '+ rest.ipaddress+' '+rest.app.get('port'));
  }
  rest.start=function(){
      var arguments = process.argv.slice(2);
      if(arguments[0]==="http"){
          rest.starthttp();
      }else{
          rest.starthttps();
      }
  }
  //database connnection if is to use mongoDB
  rest.dbconnector=function(){
    var host=process.env.HOST;
    var port=process.env.PORT;
   if(typeof host==="undefined"){
        
        mongo.connect('mongodb://localhost:27017/nodetest2',function(err,db){
        if(err){console.log("error connect to sdb "+err);}
        else{       
           
            rest.DB=db;
        }
    });
        return rest.DB;
    }else{
        console.log("database is connected to "+host+':'+port);
        mongo.connect('mongodb://'+process.env.MONGODB_DB_URL+'/nodetest2',function(err,db){
        if(err){console.log("error connect to db "+err);}
        else{       
            
            rest.DB=db;
        }
        });
        return rest.DB;
    }
}

}

var nodehub= new restapi();
nodehub.initialize();
// to start https server use npm start https
nodehub.start();