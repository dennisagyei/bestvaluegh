//console.clear();

var app = angular.module('app', ['ngRoute','ngResource','angular-flexslider','angularFileUpload']);

app.config(function($routeProvider,$locationProvider){

    $routeProvider.when('/',{ templateUrl : "home2.html" , controller : 'HomeCtrl'});
    $routeProvider.when('/home2',{ templateUrl : "home2.html" , controller : 'HomeCtrl'});
    $routeProvider.when('/home3',{ templateUrl : "home3.html" , controller : 'HomeCtrl'});
    $routeProvider.when('/subscribe',{ templateUrl : "subscribe.html"});
    $routeProvider.when('/faq',{ templateUrl : "faq.html"});
    $routeProvider.when('/contact',{ templateUrl : "contact.html"});
    $routeProvider.when('/compare/:id',{ templateUrl : "compare.html" , controller : 'MainCtrl'});
    $routeProvider.when('/category/:id',{ templateUrl : "category.html" , controller: "CatgCtrl"});
    $routeProvider.when('/admin',{ templateUrl : "company.html" , controller: 'CompanyCtrl'});
    $routeProvider.when('/admin/kpi',{ templateUrl : "kpi.html" , controller: 'KpiCtrl'});
    $routeProvider.when('/admin/rates',{ templateUrl : "rates.html" , controller: 'RatesCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);

});

app.filter('custNumFormat',function (){
    
    return function(input, symbol) {
        
        var resp = '';
        
        if (symbol=='%')
        {
            resp=input+'%';
        }else
        {
            resp='Ghs'+input;
        }
        
        return resp;
        
    }
});

//creating service that is accessible accross controllers
app.value('ApiKey','AIzaSyC9H_SZmYKPM0TXnnnHxcRPMJyYjf00rvs');


app.factory("HomekpiFactory",function($http){
  
  return {
            getData : function(){
               return $http.get("/api/kpi/get_kpi_stats")
            }
        }
});

app.factory("RateskpiFactory",function($resource){
  
        return $resource('/api/metric/join_kpi', {}, {
        'query' : { method: 'GET', isArray: true }
        });
});


//factory with ngResource
app.factory('companyFactory',function($resource){
    
    return $resource('/api/company/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.factory('kpiFactory',function($resource){
    
    return $resource('/api/kpi/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.factory('metricFactory',function($resource){
    
    return $resource('/api/metric/:id', {}, {
        'query' : { method: 'GET', isArray: true },
        'create' : { method: 'POST' },
        'find' : { method: 'GET' },
        'update' : { method: 'PUT', params: {id: '@id'} },
        'destroy' : { method: 'DELETE', params: {id: '@id'} }
    });
   
});

app.controller('HomeCtrl', function($scope,$http,HomekpiFactory) {
    
    $scope.slides = [
				'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
				'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
				'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
				'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
			];
			
    
    HomekpiFactory.getData()
    .success(function(data){
       $scope.kpi_stats=data;
   })
    .error(function(error){
        console.log(error);
    });
    
    
    $http.get("/api/kpi/get_featured_kpi")
    .then(function(response) {
        $scope.kpi_featured = response.data;
    });
    
    $http.get("/api/metric/join_kpi")
    .then(function(response) {
        $scope.kpi_metrics = response.data;
    });
});

app.controller("MainCtrl",function($scope,$http,$routeParams){
    //$scope.contact=contactFactory[$routeParams.id];
    
    var id =$routeParams.id;
    
    $http.get('/api/metric/get_by_kpi/' + id)
    .then(function(response) {
        $scope.metrics = response.data;
    });
    
    $http.get('/api/kpi/get_kpi_stats/' + id)
    .then(function(response) {
        //First function handles success
        $scope.best_val = response.data;
    }, function(response) {
        //Second function handles error
        console.log(response.statustext);
    });
    
    $http.get('/api/kpi/' + id)
    .then(function(response) {
        $scope.kpis = response.data;
    });
});

app.controller("CatgCtrl",function($scope,$http,$routeParams){
    
     var id =$routeParams.id;
     
    $http.get('/api/kpi/get_featured_by_category/' + id)
    .then(function(response) {
        $scope.cat_metric = response.data;
        console.log(response.data);
    }, function(response) {
        //Second function handles error
        console.log(response.statustext);
    });
     
});


app.controller("LoginCtrl",function($scope, $http, $routeParams) {
    
    $scope.ShowLogin=function(){
        $('#LoginModal').modal({backdrop: 'static', keyboard: false})  ;
    }
})

app.controller("CompanyCtrl",function($scope,$http,$routeParams,companyFactory,$location,FileUploader){
    $scope.uploader = new FileUploader({ url: '/api/upload',alias: 'logo',queueLimit : 1  });
    
    $scope.fileSelected = function() {
     if ($scope.uploader.queue.length>1) {
        $scope.uploader.queue[0].remove();
     }
    };
    
    $scope.companies=companyFactory.query();
    
    $scope.messages = ''; 
    
    $scope.Refresh = function () {
    	$scope.new_company.name= '';
    	$scope.new_company.website= '';
    };

    $scope.AddItem = function(){
        $scope.uploader.clearQueue();
        $('#addModal').modal();
    }; 
    
    $scope.EditItem = function(Item){
        
        $scope.edit_company = Item;
        $('#editModal').modal();
    }; 
   
    $scope.SaveItem = function (Item) {
        
        Item.logo=$scope.uploader.queue[0].file.name;
    
        companyFactory.create(Item,function(){
            $scope.Refresh();
        });
        $scope.messages = 'New company has been created!'; 
        $scope.companies=companyFactory.query();
        
        $('#addModal').modal('hide')
        

    };
    
    $scope.UpdateItem = function (Item) {
        companyFactory.update({id: Item._id }, Item);
    	$scope.companies=companyFactory.query();
    	$('#editModal').modal('hide')
    };
    
    $scope.DeleteItem = function (Item) {
        companyFactory.destroy({id: Item });
        $scope.companies=companyFactory.query();
    };
    
    $scope.FindItem = function (Item) {
        companyFactory.find({id: Item });
    };
    
    
});

app.controller("KpiCtrl",function($scope,$http,kpiFactory){
    
    $scope.kpis=kpiFactory.query();
    
    $scope.messages = ''; 
    
    $scope.AddItem = function(){
        $('#addModal').modal();
    }; 
    
    $scope.EditItem = function(Item){
        $scope.edit_kpi = Item;
        $('#editModal').modal();
    }; 
   
    $scope.SaveItem = function (Item) {
        
        kpiFactory.create(Item,function(){
            $scope.new_kpi=[];
        });
        $scope.messages = 'New Kpi has been created!'; 
        $scope.kpis=kpiFactory.query();
        $('#addModal').modal('hide')
        //$scope.Refresh();

    };
    
    $scope.UpdateItem = function (Item) {
        kpiFactory.update({id: Item._id }, Item);
    	$scope.kpis=kpiFactory.query();
    	$('#editModal').modal('hide')
    };
    
    $scope.DeleteItem = function (Item) {
        kpiFactory.destroy({id: Item });
        $scope.kpis=kpiFactory.query();
    };
    
    $scope.FindItem = function (Item) {
        kpiFactory.find({id: Item });
    };

});

app.controller("RatesCtrl",function($scope,$http,metricFactory,kpiFactory,companyFactory,RateskpiFactory){
 
    $scope.metrics = RateskpiFactory.query();
    $scope.kpis=kpiFactory.query();
    $scope.companies=companyFactory.query();
    
    $scope.messages = ''; 
    
    $scope.AddItem = function(){
        $('#addModal').modal();
    }; 
    
    $scope.EditItem = function(Item){
        
        $scope.edit_metric = Item;
        $('#editModal').modal();
    }; 
   
    $scope.SaveItem = function (Item) {
        //console.log(Item);
        metricFactory.create(Item,function(){
             $scope.new_metric=[];
        });
        $scope.messages = 'New rate has been created!'; 
        $scope.metrics=RateskpiFactory.query();
        $('#addModal').modal('hide')
        

    };
    
    $scope.UpdateItem = function (Item) {
        metricFactory.update({id: Item._id }, Item);
    	$scope.metrics=RateskpiFactory.query();
    	$('#editModal').modal('hide')
    };
    
    $scope.DeleteItem = function (Item) {
        metricFactory.destroy({id: Item });
        $scope.metrics=RateskpiFactory.query();
    };
    
    $scope.FindItem = function (Item) {
        metricFactory.find({id: Item });
    };
});



app.directive('flexslider', function () {

  return {
    link: function (scope, element, attrs) {

      element.flexslider({
        animation: "slide"
      });
    }
  }
});