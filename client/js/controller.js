var app = angular.module("mainApp", []);

app.controller('MainCtrl', function($scope) {
    $scope.name="World";

    $scope.person = { firstname : "Dennis" ,lastname :"Agyei"};
});