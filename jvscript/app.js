angular.module("MyApp",["ngRoute"])
  .controller("mainController", function($scope) {
    var ctrl = this;
    ctrl.showImgs = [];
    $scope.$on("routeChange", function() {
      ctrl.showImgs = [];
    })
  })

  .controller("uploadController", function() {
    this.showimgs = [];
  })

  .controller("navbarController",function($location) {
    this.isRoute = function(route) {
      console.log($location.path());
      if($location.path() == route) {
        return true;
      }
      else {
        return false;
      }
    }
  })

  .controller("signUpController", function($http, $rootScope,$location) {
    var ctrl = this;
    ctrl.user = {};
    ctrl.isMatch = true;
    ctrl.hasError = false;
    ctrl.errorMsg = "";
    this.signUp = function(email,pass,ver) {
      ctrl.hasError = false;
      if(pass!== ver) {
        ctrl.isMatch = false;
        ctrl.errorMsg = "Password don't match!";
      } else {
        ctrl.isMatch = true;
        $http({
          method:"POST",
          url:"/ImageGallery/php/sign_up.php",
          data: ctrl.user,
          //transformRequest: angular.identity,
          headers:{"Content-Type":"application/x-www-form-urlencoded"}
        }).then(function(response) {
          if(response.data.log_in) {
            $rootScope.userData = response.data;
            $location.path("/upload");
          } else {
            ctrl.errorMsg = response.data.error_msg;
            ctrl.hasError = true;
          }
        }, function(response) {
            ctrl.errorMsg = "Server Error!";
        });
      }
      console.log(ctrl.errorMsg);
    }

  })
  .controller("signInController", ['$http','$rootScope','Ajax', '$location',function($http, $rootScope, Ajax,$location) {
    var ctrl = this;
    ctrl.errorNum = 0;
    ctrl.user = {};
    ctrl.isInvalid = false;

    this.signIn = function() {
      $http({
        method:"POST",
        url:"/ImageGallery/php/sign_in.php",
        data: ctrl.user,
        //transformRequest: angular.identity,
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then(function(response) {
        console.log(response.data);
        if(response.data.log_in) {
          $rootScope.userData = response.data;
          $location.path("/login");
          //Ajax.getUserImages();
        } else {
          ctrl.isInvalid = true;
          ctrl.errorNum = response.data.error_num;
          ctrl.errMsg = response.data.error_msg;
        }
      }, function(resp) {
        ctrl.isInvalid = true;
        ctrl.errMsg = "Server Error!";
      });
    }

  }])
  .controller("galleryController", ['images','$location','$rootScope','$http', function(images, $location,$rootScope,$http) {
    var ctrl = this;
    ctrl.isShowModal = false;
    ctrl.imgs = images.data;
    var length = ctrl.imgs.length;
    ctrl.index = 0;
    ctrl.deleteImage = function(image) {

      $http({
        method:"POST",
        url:"/ImageGallery/php/delete_image.php",
        data: {imageId: image.image_id},
        //transformRequest: angular.identity,
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then(function(response) {
        console.log(response);
        if(response.data.deleted) {
          var index = ctrl.imgs.indexOf(image);
          ctrl.imgs.splice(index,1);
        }
      });
    }
    ctrl.renameImage = function(image) {
      $http({
        method:"POST",
        url:"/ImageGallery/php/rename_image.php",
        data: {
          imageId: image.image_id,
          imageName: image.image_name
        },
        //transformRequest: angular.identity,
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then(function(response) {
        console.log(response);
        if(response.data.updated) {
          var index = ctrl.imgs.indexOf(image);
          ctrl.imgs[index].image_name = image.image_name;
        }
      });
    }

    ctrl.showModal = function(image) {
      ctrl.index = ctrl.imgs.indexOf(image);
      ctrl.isShowModal = true;
    }

    ctrl.nextImage = function() {
      if( (ctrl.index+1) < length) {
        ctrl.index++;
      }
    }

    ctrl.prevImage = function() {
      if( (ctrl.index-1) > -1) {
        ctrl.index--;
      }
    }
    ctrl.closeModal = function() {
      ctrl.isShowModal = false;
    }

  }])
  .controller("logOutController", ['logout','$rootScope','$location', function(logout, $rootScope)  {
    console.log(logout.data);
    if(logout.data.logout) {
      $rootScope.userData = {};
    }
  }])
  .config(function($routeProvider) {
    $routeProvider
    .when("/upload", {
        templateUrl : "template/upload.html"
    })
    .when("/signin", {
        templateUrl : "template/sign_in.html"
    })
    .when("/signup", {
        templateUrl : "template/sign_up.html"
    })
    .when("/gallery",{
        templateUrl:"template/gallery.html",

        controller: "galleryController",
        controllerAs: "galCtrl",
        resolve: {
          images: function(Ajax) {
            return promise = Ajax.getUserImages();
            //promise.then(function(data) {
            //  return data.data;
              //console.log(ctrl.imgs)
            //});
          }

        }
    })
    .when("/logout", {
      templateUrl : "template/upload.html",
      controller: "logOutController",
      resolve: {
        logout: function(Ajax) {
          return Ajax.logOut();
        }
      }
    })
    .otherwise({
        templateUrl : "template/upload.html"
    })
  })
  .run(function($rootScope, Ajax, $location) {
    var userData = Ajax.getUserData();
    userData.then(function(response) {
      if(response.data.id){
        $rootScope.userData = response.data;
      } else {
        $location.path("/signin");
      }
    });

    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        $rootScope.$broadcast("routeChange");
    });
  });
