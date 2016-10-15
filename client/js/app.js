//console.clear();

var app = angular.module('app', ['ngRoute','ngResource','angular-flexslider']);

app.config(function($routeProvider,$locationProvider){

    $routeProvider.when('/',{ templateUrl : "home.html" , controller : 'HomeCtrl'});
    $routeProvider.when('/contact',{ templateUrl : "contact.html"});
    $routeProvider.when('/faq',{ templateUrl : "faq.html"});
    //$routeProvider.when('/contact/:id',{ templateUrl : "view-contact.html" , controller: "ViewCtrl"});

    $routeProvider.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);

});


//creating service that is accessible accross controllers
app.value('ApiKey','AIzaSyC9H_SZmYKPM0TXnnnHxcRPMJyYjf00rvs');


app.factory("kpiFactory",function($http){
  
  return {
            getData : function(){
               return $http.get("/api/kpi/get_kpi_stats")
            }
        }
});


//factory with ngResource
app.factory('usersDataset',function($resource){

    var resource=$resource('/api/kpi/get_kpi_stats', {}, {
        'query': {method: 'GET', isArray: true}
    });

    return{
            get : function(){
                return resource.query();
            },

            find : function(id){
                return resource.get({id: id});
            },

            create : function(){
                return new resource();
            },

            destroy : function(id){
                return resource.delete({id : id});
            }
        }

});

app.controller('HomeCtrl', function($scope,$http,kpiFactory,usersDataset) {
    
    $scope.slides = [
				'http://flexslider.woothemes.com/images/kitchen_adventurer_cheesecake_brownie.jpg',
				'http://flexslider.woothemes.com/images/kitchen_adventurer_lemon.jpg',
				'http://flexslider.woothemes.com/images/kitchen_adventurer_donut.jpg',
				'http://flexslider.woothemes.com/images/kitchen_adventurer_caramel.jpg'
			];
			
    //$scope.contacts = contactFactory;
    $scope.users=usersDataset.get();

    kpiFactory.getData()
    .success(function(data){
       $scope.kpi_stats=data;
       console.log(data);
   })
    .error(function(error){
        console.log(error);
    });
    
    
    $http.get("/api/kpi/get_featured_kpi")
    .then(function(response) {
        $scope.kpi_featured = response.data;
        console.log(response.data);
    });
    
    
    
    

    $scope.AssignItem = function (x) {
    	
    	$scope.Price=x;
    };
});

app.controller("ViewCtrl",function($scope,$routeParams,contactFactory){
    $scope.contact=contactFactory[$routeParams.id];
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