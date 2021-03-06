#!/usr/bin/env nodejs
// modules =================================================
var express        = require('express');
var app            = express();
var multer         = require('multer');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var nodemailer     = require("nodemailer");

// configuration ===========================================
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './client/images');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).any()

app.post('/api/upload',  function (req, res, next) {
  // req.body contains the text fields

  upload(req,res,function(err) {
        if(err) {
            //console.log(err);
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
        //console.log(req.files)
    });
  
})


// config files
var db = require('./config/db');

// set our port 3000 for dev Env
var port = process.env.PORT || 8080; 

// connect to our mongoDB database 
// (uncomment after you enter in your own credentials in config/db.js)
mongoose.connect(db.url); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/client')); 

// routes ==================================================
require('./app/routes')(app); // configure our routes

// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Server listening at ' + port);

// expose app           
exports = module.exports = app;                         



//p.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  //var addr = server.address();
  //nsole.log("Server listening at"  + ":" + process.env.PORT );
//});
