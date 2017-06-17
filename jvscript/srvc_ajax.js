angular.module('MyApp')
  .service('Ajax', function($http,$q) {
    let baseUrl =  '/ImageGallery/php/';

    let Request = function(method,endpoint,data) {
      this.method = method;
      this.url = baseUrl+endpoint;
      this.headers = {"Content-Type":"application/x-www-form-urlencoded"};
      if(data) this.data = data;
    }

    this.getUserImages = function() {
      let deffered = $q.defer();
      let req = new Request('GET','get_images.php');
      $http(req).then(function(response) {
        console.log(response);
        deffered.resolve(response);
      });
      return deffered.promise;
    }

    this.signIn = function(user) {
      let r = new Request('POST','sign_in.php',user)
      return $http(r);
    }

    this.signUp = (user) => $http(new Request('POST','sign_up.php',user));

    this.logOut = function() {
      return $http(new Request('GET','log_out.php'));
    }

    this.isLogIn = () => {
      $http(new Request('GET','get_user.php'))
      .then(function(response) {
        if(response.data.id)
          return true;
        else
          return false;
      });
    }

    this.getUserData = function() {
      return $http(new Request('GET','get_user.php'));
    }

    this.deleteImage = (image) => $http(new Request('POST','delete_image.php',image));
  });
