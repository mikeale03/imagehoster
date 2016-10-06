angular.module("MyApp")
  .service("Ajax", function($http,$q) {

    this.getUserImages = function() {
      var deffered = $q.defer();
      $http({
        method:"GET",
        url:"/ImageGallery/php/get_images.php",

        //transformRequest: angular.identity,
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then(function(response) {
        console.log(response);
        deffered.resolve(response);
      });
      return deffered.promise;
    }

    this.isLogIn = function() {

      return $http({
        method:"GET",
        url:"/ImageGallery/php/is_log_in.php",

        //transformRequest: angular.identity,
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then(function(response) {
        return response
      });

    }
    this.logOut = function() {
      return $http({
        method:"GET",
        url:"/ImageGallery/php/log_out.php",

        //transformRequest: angular.identity,
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then(function(response) {
        return response
      });
    }

    this.getUserData = function() {
      return $http({
        method:"GET",
        url:"/ImageGallery/php/get_user.php",
        //transformRequest: angular.identity,
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then(function(response) {
        return response
      });
    }

  });
