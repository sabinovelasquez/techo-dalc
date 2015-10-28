'use strict';

var app = angular.module('app', []);

function timing(time){
  if(time < 10){
    return '0'+time;
  }else{
    return time;
  }
}

app.directive('countdown', 
  ['Util', '$interval', function(Util, $interval) {
    return {
      restrict: 'A',
      scope: {
        date: '@'
      },
      link: function(scope, element) {
        var future;
        future = new Date(scope.date);
        $interval(function() {
          var diff;
          diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
          return element.text(Util.dhms(diff));
        }, 1000);
      }
    };
  }
]);

app.controller('infoCtrl', function($scope, $http) {
  $http.get("http://www.w3schools.com/angular/customers.php")
    .success(function(response) {
      $scope.names = response.records;
    });
});

app.factory('Util', [
  function() {
    return {
      dhms: function(t) {
        var days, hours, minutes, seconds, newsec;
        days = Math.floor(t / 86400);
        t -= days * 86400;
        hours = Math.floor(t / 3600) % 24;
        t -= hours * 3600;
        minutes = Math.floor(t / 60) % 60;
        t -= minutes * 60;
        seconds = t % 60;
        return [days + ' días, ', timing(hours) + ':', timing(minutes) + ':', timing(seconds)].join('');
      }
    };
  }
]);
