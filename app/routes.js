// app/routes.js

// grab the demo model we just created
var Company = require('./models/company.js');
var Kpi = require('./models/kpi.js');
var Metric = require('./models/metric.js');

module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes
        var Mongoose = require('mongoose');
        var ObjectId = Mongoose.Types.ObjectId; 

        app.get('/api', function (req, res) {
          res.send('BestValuegh API Version 1.0 is running');
        });
        
        //Node Mailer API Calls 
        var nodemailer = require('nodemailer');
        var smtpTransport = nodemailer.createTransport({
          host: "mailtrap.io",
          port: 2525,
          auth: {
            user: "b8db91b8032261",
            pass: "c20116e95c0b1f"
          }
        });
        
        app.post('/api/sendmail',function(req,res){
          
            var htmlContent = '<p>Name: ' + req.body.name + '</p>' +
                    '<p>Email: ' + req.body.email + '</p>' +
                    '<p>Message: ' + req.body.message + '</p>';
                    
            var mailOptions={
                from: req.body.name + ' <' + req.body.email + '>',
                to : 'dennisagyei@gmail.com',
                sender: req.body.email,
                subject : req.body.subject,
                html: htmlContent
            }
           
            smtpTransport.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
              //console.log('Message sent: ' + info.response);
              return res.json(201, info.response);
            });
        });
        
        //MAil chimp subscription
        //key 0d434b0ef6ac04a4caa2bca79eef8e3b-us10
        //list id 27df953d19
        var Mailchimp = require('mailchimp-api-v3')
        var mailchimp = new Mailchimp('0d434b0ef6ac04a4caa2bca79eef8e3b-us10');
        
        app.post('/api/signup', function (req, res) {
          // save user details to your database.
          var subscriber = {
              email_address: req.body.email, 
              status: "subscribed", 
              merge_fields: {
                  "FNAME": req.body.firstname,
                  "LNAME": req.body.lastname
                   }
          }
      
          
          mailchimp.post({
            path : '/lists/27df953d19/members',
            body : subscriber
          })
          .then(function (result) {
            return res.json(201, result);
          })
          .catch(function (err) {
             console.log(err);
          })
          
          
        });
        /* GET /KPI listing. */
        app.get('/api/kpi', function(req, res) {
          Kpi.find(function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });
        
        
        //Api for front page to get top Kpis
        app.get('/api/kpi/get_top_kpi', function(req, res) {
          Kpi.find().
            limit(5).
            sort('-createdAt').
            select({ kpi_name: 1 }).
            exec(
            function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });
        
        app.get('/api/kpi/get_kpi_stats', function(req, res) {
          Metric.aggregate([
                          ///{ $match : { featured : true } },  //Having clause
                         //{ $limit : 4 },
                         {
                              $lookup:
                                {
                                  from: "kpis",
                                  localField: "kpi_id",
                                  foreignField: "_id",
                                  as: "kpi_metric"
                                }
                         },{ $unwind:"$kpi_metric" },
                         {
                           $group:
                             {
                               _id: { kpi_name: "$kpi_metric.kpi_name", kpi_id: "$kpi_id",kpi_type: "$kpi_metric.kpi_type",  kpi_image: "$kpi_metric.kpi_image" },
                               kpi_avg: { $avg: "$rate" },
                               kpi_min: { $min: "$rate" },
                               kpi_max: { $max: "$rate" },
                               kpi_count: { $sum: 1 }
                             }
                         }]).
            exec(
            function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });
        
        app.get('/api/kpi/get_kpi_stats/:id', function(req, res) {
          Metric.aggregate([
                        { $match : { kpi_id : new ObjectId(req.params.id) } },  //Having clause
                         {
                              $lookup:
                                {
                                  from: "kpis",
                                  localField: "kpi_id",
                                  foreignField: "_id",
                                  as: "kpi_metric"
                                }
                         },{ $unwind:"$kpi_metric" },
                         {
                           $group:
                             {
                               _id: { kpi_name: "$kpi_metric.kpi_name", kpi_id: "$kpi_id",kpi_type: "$kpi_metric.kpi_type",  kpi_image: "$kpi_metric.kpi_image" },
                               kpi_avg: { $avg: "$rate" },
                               kpi_min: { $min: "$rate" },
                               kpi_max: { $max: "$rate" },
                               kpi_count: { $sum: 1 }
                             }
                         }]).
            exec(
            function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });

        app.get('/api/kpi/get_featured_kpi', function(req, res) {
          Metric.aggregate([
                         //{ $match : { featured : true } },  //Having clause
                         //{ $limit : 4 },
                         {
                              $lookup:
                                {
                                  from: "kpis",
                                  localField: "kpi_id",
                                  foreignField: "_id",
                                  as: "kpi_metric"
                                }
                         },{ $unwind:"$kpi_metric" },
                         {
                           $group:
                             {
                               _id: { kpi_name: "$kpi_metric.kpi_name", category: "$kpi_metric.category", kpi_id: "$kpi_id",kpi_type: "$kpi_metric.kpi_type", kpi_image: "$kpi_metric.kpi_image" },
                               kpi_avg: { $avg: "$rate" },
                               kpi_min: { $min: "$rate" },
                               kpi_max: { $max: "$rate" },
                               kpi_count: { $sum: 1 }
                             }
                         }]).
            exec(
            function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });
        
        app.get('/api/kpi/get_featured_by_category/:id', function(req, res) {
            Metric.aggregate([
                         {
                              $lookup:
                                {
                                  from: "kpis",
                                  localField: "kpi_id",
                                  foreignField: "_id",
                                  as: "kpi_metric"
                                }
                         },{ $unwind:"$kpi_metric" },{ $match : { "kpi_metric.category" : req.params.id  } },
                         {
                           $group:
                             {
                               _id: { kpi_name: "$kpi_metric.kpi_name", category: "$kpi_metric.category", kpi_id: "$kpi_id",kpi_type: "$kpi_metric.kpi_type", kpi_image: "$kpi_metric.kpi_image" },
                               kpi_avg: { $avg: "$rate" },
                               kpi_min: { $min: "$rate" },
                               kpi_max: { $max: "$rate" },
                               kpi_count: { $sum: 1 }
                             }
                         }]).
            exec(
            function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });
        
        /* POST /todos */
        app.post('/api/kpi', function(req, res, next) {
          Kpi.create(req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* GET /todos/id */
        app.get('/api/kpi/:id', function(req, res, next) {
          Kpi.findById(req.params.id, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* PUT /todos/:id */
        app.put('/api/kpi/:id', function(req, res, next) {
          Kpi.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        // route to handle delete goes here (app.delete)
        /* DELETE /todos/:id */
        app.delete('/api/kpi/:id', function(req, res, next) {
          Kpi.findByIdAndRemove(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        //==============================Metrics KPIs================================
        /* GET /todos listing. */
        app.get('/api/metric', function(req, res) {
          Metric.find(function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });
        
        app.get('/api/metric/join_kpi', function(req, res) {
          Metric.aggregate([
                         
                         {
                              $lookup:
                                {
                                  from: "kpis",
                                  localField: "kpi_id",
                                  foreignField: "_id",
                                  as: "kpi_metric"
                                }
                         },{ $unwind:"$kpi_metric" }
                         ]).
            exec(
            function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });
        
        /* POST /todos */
        app.post('/api/metric', function(req, res, next) {
          Metric.create(req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* GET /todos/id */
        app.get('/api/metric/get_by_kpi/:id', function(req, res, next) {
          Metric.find({kpi_id : req.params.id}).exec(function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* GET all metrics for a particular kpi */
        app.get('/api/metric/:id', function(req, res, next) {
          Metric.findById(req.params.id, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* PUT /todos/:id */
        app.put('/api/metric/:id', function(req, res, next) {
          Metric.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        // route to handle delete goes here (app.delete)
        /* DELETE /todos/:id */
        app.delete('/api/metric/:id', function(req, res, next) {
          Metric.findByIdAndRemove(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        //==============================Company KPIs================================
        /* GET /todos listing. */
        app.get('/api/company', function(req, res) {
          Company.find(function (err, data) {
            if (err){
              res.send(err);
            }else{
              res.json(data);
            }
            
          });
        });
        
        /* POST /todos */
        app.post('/api/company', function(req, res, next) {
          Company.create(req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* GET /todos/id */
        app.get('/api/company/:id', function(req, res, next) {
          Company.findById(req.params.id, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        /* PUT /todos/:id */
        app.put('/api/company/:id', function(req, res, next) {
          Company.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        // route to handle delete goes here (app.delete)
        /* DELETE /todos/:id */
        app.delete('/api/company/:id', function(req, res, next) {
          Company.findByIdAndRemove(req.params.id, req.body, function (err, data) {
            if (err) return next(err);
            res.json(data);
          });
        });
        
        // frontend routes =========================================================
        // route to handle all angular requests
        app.get('*', function(req, res) {
            res.sendfile('./client/index.html'); // load our public/index.html file
        });

    };
