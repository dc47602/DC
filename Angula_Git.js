(function() {
  var app = angular.module("githubViewer", []);

  var MainController = function($scope, $http, $interval, $log) {
    var onUserComplete = function(response) {
      $scope.user = response.data;
      $http.get($scope.user.repos_url)
        .then(onRepos, onError);
    };

    var onError = function(response) {
      $scope.error = "Could not fetch data";
    };

    var onRepos = function(response) {
      $scope.repos = response.data;
    };

    $scope.Search = function(username) {
      $log.info("Searching user " + username);
      $http.get("https://api.github.com/users/" + username)
        .then(onUserComplete, onError);
      
      if(countdownInterval){ 
        $interval.cancel(countdownInterval);
        $scope.countdown = null;
        
      }
    };
    var decrementCounter = function() {
      $scope.countdown -= 1;
      if ($scope.countdown < 1) {
        $scope.Search($scope.username);
      }
    };
    
    var countdownInterval = null;
    var startCounter = function() {
      countdownInterval = $interval(decrementCounter, 1000, $scope.countdown);
    };


    $scope.username = "Angular";
    $scope.repoSortOrder = "-stargazers_count";
    $scope.countdown = 5;
    startCounter();
  }

  app.controller('MainController', MainController);
}());
