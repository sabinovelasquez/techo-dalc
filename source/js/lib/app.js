'use strict';

var pageId='532314866881073',fbApiId='1514161315573007',fbToken='836ec560d394a3d55ea37ed3a9457994';

var sheetInfoID = '1naw4HFJQMkYqqRa5YGiWeq8kB9zO73p6VYpIbkLrXY0',
    sheetNewsID = '1WzpFRFin-2-spw8Hx7yT-FvOOD0di4kld__JELgtqSk',
    sheetEntriesID = '1CTo9Bih2V3zlrJycyvKbG1fX5YpUcdMTKq1mNny0veM',
    sheetDownloadsID = '1q571jZ14UYCepNug2Q05UciGobJkhU3seRW3KBss1o0',
    sheetDownloadsInfoID = '1eru4TUfsvqhvjxKVHJdV8fW7WjsYmMkCiHkU2wtG2qE';
    
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

.module('app', ['ngAnimate','ui.bootstrap'])

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

        return [days + ' d, ', timing(hours) + ':', timing(minutes) + ':', timing(seconds)].join('');
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
.controller('gralCtrl', ['$scope',
  function($scope) {
    
    $scope.idioma = 1;

    $scope.langEv = function(ln) {
      ga('send', 'event', 'Idioma', 'click', 'idioma: '+ln );
    }

    $scope.open = function() {
      $scope.showModal = true;
    };

    $scope.ok = function() {
      $scope.showModal = false;
    };

    $scope.cancel = function() {
     $scope.showModal = false;
      var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
      iframe.postMessage('{"event":"command","func":"' + 'stopVideo' +   '","args":""}', '*');
    };
  }
])
.controller('campaignCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get( sheetUrl(sheetInfoID) )
    .success(function(response) {
      $scope.parrafos = response.feed.entry;
    });
  }
])
.controller('fbCtrl', ['$scope', '$http', 
  function($scope, $http) {
    $http.get('https://graph.facebook.com/'+pageId+'/posts?access_token='+fbApiId+'|'+fbToken)
    .success(function(response) {
      $scope.posts = _.reject(response.data, function(post){ return !post.message; });
    });
    $scope.newsEv = function(post) {
      ga('send', 'event', 'News', 'click', 'noticia: '+post.message );
    }
  }
])
.controller('downloadsCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.isCollapsed = true;
  $http.get( sheetUrl(sheetDownloadsInfoID) )
    .success(function(response) {
      $scope.downloadinfo = response.feed.entry;
    });
  $http.get( sheetUrl(sheetDownloadsID) )
    .success(function(response) {
      $scope.downloads = response.feed.entry;
    });
  $scope.downEv = function(name) {
    var downloadtext;
    if(name.$t){
      downloadtext=name.$t;
    }else{
      downloadtext=name;
    }
    
    ga('send', 'event', 'Downloads', 'click', 'descarga: '+downloadtext );
  }

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

