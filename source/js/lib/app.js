'use strict';

var pageId='994782423876423',fbApiId='1514161315573007',fbToken='836ec560d394a3d55ea37ed3a9457994';

var sheetNewsID = '1WzpFRFin-2-spw8Hx7yT-FvOOD0di4kld__JELgtqSk',
    sheetEntriesID = '1CTo9Bih2V3zlrJycyvKbG1fX5YpUcdMTKq1mNny0veM';
    
function sheetUrl(id){
  return 'https://spreadsheets.google.com/feeds/list/' + id + '/od6/public/values?alt=json';
}

function timing(time){
  if(time < 10){
    return '0'+time;
  }else{
    return time;
  }
}

var app = angular

.module('app', ['ngRoute','blogControllers'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/blog', {
      templateUrl: 'partials/detail/entry.html',
      controller: 'EntryDetailCtrl'
    }).
    otherwise({
      redirectTo: '/home'
    });
  }
])

.factory('Util', [
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
])

.directive('countdown',
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
])

.controller('infoCtrl', ['$scope', '$http', 
  function($scope, $http) {
    $http.get('https://graph.facebook.com/'+pageId+'/posts?access_token='+fbApiId+'|'+fbToken)
    .success(function(response) {
      $scope.messages = response.data;
    });
  }
])

.controller('newsCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get( sheetUrl(sheetNewsID) )
    .success(function(response) {
      $scope.noticias = response.feed.entry;
    });
  }
])

.controller('entriesCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get( sheetUrl(sheetEntriesID) )
    .success(function(response) {
      $scope.entradas = response.feed.entry;
    });
  }
]);

