var app = angular.module('app', ['ngRoute','ngResource']);

app.config(function($routeProvider,$locationProvider){

    $routeProvider.when('/',{ templateUrl : "list-contact.html" , controller : 'MainCtrl'});
    $routeProvider.when('/add',{ templateUrl : "add-contact.html"});
    $routeProvider.when('/users',{ templateUrl : "list-users.html", controller : "MainCtrl" });
    $routeProvider.when('/contact/:id',{ templateUrl : "view-contact.html" , controller: "ViewCtrl"});

    $routeProvider.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);

});

app.constant("FirebaseUrl","https://mycontacts-ca1b1.firebaseio.com/");
//creating service that is accessible accross controllers
app.value('ApiKey','AIzaSyC9H_SZmYKPM0TXnnnHxcRPMJyYjf00rvs');

app.factory("contactFactory",function(){

    return [
                        { fullname : "Dennis Agyei", email : "dennisagyei@gmail.com", phone : "0202000121"},
                        { fullname : "Declan Proud", email : "declan@example.com", phone : "0243246523"},
                        { fullname : "James Larbi", email : "jlarbi@yahoo.com", phone : "0243246523"},
                        { fullname : "Doreen Oblitey", email : "oblitey@yahoo.co.uk", phone : "0243246523"}

                    ];
});

app.factory("usersFactory",function($http){
  
  //return  $http.get("https://jsonplaceholder.typicode.com/users")
  return {
            getData : function(){
                //return $http.get('js/data.json')
               return $http.get("https://jsonplaceholder.typicode.com/users")
            }
        }
});

//factory with ngResource
app.factory('usersDataset',function($resource){

    var resource=$resource('https://jsonplaceholder.typicode.com/users', {}, {
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

app.controller('MainCtrl', function($scope,$http,contactFactory,usersFactory,usersDataset) {

    $scope.contacts = contactFactory;
    $scope.users=usersDataset.get();

    usersFactory.getData()
    .success(function(data){
       //$scope.users=data;
       console.log(data);
   })
    .error(function(error){
        console.log(error);
    });
    

    
    
    
    

    $scope.AssignItem = function (x) {
    	
    	$scope.Price=x;
    };
});

app.controller("ViewCtrl",function($scope,$routeParams,contactFactory){
    $scope.contact=contactFactory[$routeParams.id];
});