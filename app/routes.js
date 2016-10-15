// app/routes.js

// grab the demo model we just created
var Company = require('./models/company.js');
var Kpi = require('./models/kpi.js');

module.exports = function(app) {

        // server routes ===========================================================
        // handle things like api calls
        // authentication routes
        
        app.get('/api', function (req, res) {
          res.send('BestValuegh API Version 1.0 is running');
        });
        
        /* GET /todos listing. */
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
          Kpi.aggregate([
                         //{ $match : { is_active : true } },  //Having clause
                         {
                           $group:
                             {
                               _id: "$kpi_name",
                               kpi_avg: { $avg: "$kpi_value" },
                               kpi_min: { $min: "$kpi_value" },
                               kpi_max: { $max: "$kpi_value" },
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
          Kpi.aggregate([
                         //{ $match : { featured : true } },  //Having clause
                         { $limit : 4 },
                         {
                           $group:
                             {
                               _id: { kpi_name: "$kpi_name", kpi_image: "$kpi_image"},
                               kpi_avg: { $avg: "$kpi_value" },
                               kpi_min: { $min: "$kpi_value" },
                               kpi_max: { $max: "$kpi_value" },
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
