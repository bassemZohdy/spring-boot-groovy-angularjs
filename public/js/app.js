'use strict';

function addId(obj){
  if(obj){
    if(obj._links){
      if(obj._links.self){
        var href =obj._links.self.href;
        if(href)
        return obj.id=href.substring(href.lastIndexOf('/')+1);
      }
    }
  }
  return obj;
}

var app = angular.module('app', ['ngRoute','restangular']);
app.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('/api');
  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
    var extractedData;
    if (operation === "getList") {
      var list = data._embedded[what];
      list.map(addId);
      extractedData=list;
    } else if (what === "profile"){
      var temp = Object.keys(data._links).filter(function(r){return r !== 'self'});
      extractedData = temp;
    } else {
      addId(data);
      extractedData = data;
    }
    return extractedData;
  });
});

app.factory('toBeHidden', function ($http) {
  return $http.get('/toBeHidden');
});

app.controller('AppController',function($rootScope,$location){
  $rootScope.$on('$routeChangeError', function(event, current,previous,rejection) {
    $location.url('/');
 });
});

app.config(['$routeProvider',function($routeProvider) {
  $routeProvider
  .when('/',{
    controller:'HomeController',
    templateUrl:'views/home.html',
    resolve: {
      resources:function(Restangular){
        return Restangular.one('profile').get();
      }
    }
  })
  .when('/:restName', {
    controller:'ListController',
    templateUrl:'views/list.html',
    resolve: {
      resourceName:function($route){
        return $route.current.params.restName;
      },
      list:function(Restangular,$route) {
        return Restangular.all($route.current.params.restName).getList();
      },
      profile:function(Restangular,$route) {
        return Restangular.one('profile/'+$route.current.params.restName).get();
      }
    }
  })
  .when('/:restName/edit/:id', {
    controller:'EditController',
    templateUrl:'views/detail.html',
    resolve: {
      resourceName:function($route){
        return $route.current.params.restName;
      },
      resource:function(Restangular,$route) {
        return Restangular.one($route.current.params.restName, $route.current.params.id).get();
      },
      profile:function(Restangular,$route) {
        return Restangular.one('profile/'+$route.current.params.restName).get();
      }
    }
  })
  .when('/:restName/new', {
    controller:'NewController',
    templateUrl:'views/detail.html',
    resolve: {
      resourceName:function($route){
        return $route.current.params.restName;
      },
      list:function(Restangular,$route) {
        return Restangular.all($route.current.params.restName).getList();
      },
      profile:function(Restangular,$route) {
        return Restangular.one('profile/'+$route.current.params.restName).get();
      }
    }
  })
  .otherwise({
    redirectTo:'/'
  });
}]);

app.controller('HomeController', function($scope,resources){
  $scope.list=resources;
});

app.controller('ListController', function(list,profile,resourceName,$scope,toBeHidden) {
  toBeHidden.then(function(reply){
    $scope.notToBeHiddenFilter = function(f){
      return reply.data.indexOf(f)===-1;
    }
  });
  $scope.list=list;
  $scope.resourceName=resourceName;
  $scope.fields = profile.alps.descriptors[0].descriptors.map(function(f){return f.name});
});

app.controller('EditController', function($location,resourceName,resource,$scope ,profile,toBeHidden) {
  toBeHidden.then(function(reply){
    $scope.notToBeHiddenFilter = function(f){
      return reply.data.indexOf(f)===-1;
    }
  });
  $scope.resource=resource;
  $scope.resourceName=resourceName;
  $scope.fields = profile.alps.descriptors[0].descriptors.map(function(f){return f.name});
  $scope.save = function() {
    $scope.resource.put().then(function(){
      $location.url('/'+resourceName);
    });
  }
  $scope.destroy = function() {
    $scope.resource.remove().then(function(){
      $location.url('/'+resourceName);
    });
  };
});

app.controller('NewController', function($location,list,resourceName,$scope,profile,toBeHidden) {
  toBeHidden.then(function(reply){
    $scope.notToBeHiddenFilter = function(f){
      return reply.data.indexOf(f)===-1;
    }
  });
  $scope.resource={};
  $scope.resourceName=resourceName;
  $scope.fields = profile.alps.descriptors[0].descriptors.map(function(f){return f.name});
  $scope.save = function() {
    list.post($scope.resource).then(function(){
      $location.url('/'+resourceName);
    });
  }
});

app.filter('titleCase', function() {
  return function(input) {
    input = input || '';
    var temp =  input.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  };
});
