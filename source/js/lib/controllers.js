var blogControllers = angular.module('blogControllers', []);


blogControllers.controller('EntryDetailCtrl', ['$scope', '$routeParams',
  function($scope, $routeParams) {
  	console.log(routeParams);
    // $scope.blogId = $routeParams.phoneId;
}]);