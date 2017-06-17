angular.module("MyApp").config(function($routeProvider) {
    $routeProvider
    .when("/upload", {
        template : "<my-upload imgs='mainCtrl.showImgs' on-delete='mainCtrl.deleteImage($event)' on-add-files='mainCtrl.addImageFiles($event)'></my-upload>"
    })
    .when("/signin", {
        template : "<sign-in></sign-in>"
    })
    .when("/signup", {
        template : "<sign-up></sign-up>"
    })
    .when("/gallery",{
        template:"<my-gallery imgs='$resolve.imgs'></my-gallery>",
        resolve: {
          imgs: function(Ajax) {
            return Ajax.getUserImages();
          }
        }
    })
    .when("/logout", {
      template : "<my-upload imgs='mainCtrl.showImgs' on-delete='mainCtrl.deleteImage($event)' on-add-files='mainCtrl.addImageFiles($event)'></my-upload>",
      controller: "logOutController",
      resolve: {
        logout: function(Ajax) {
          return Ajax.logOut();
        }
      }
    })
    .otherwise({
        template : "<my-upload imgs='mainCtrl.showImgs' on-delete='mainCtrl.deleteImage($event)' on-add-files='mainCtrl.addImageFiles($event)'></my-upload>"
    })
  })
  .run(function($rootScope, Ajax, $location) {
    var userData = Ajax.getUserData();
    userData.then(function(response) {
      if(response.data.id){
        $rootScope.userData = response.data;
      } else {
        $location.path("/upload");
      }
    });

    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        $rootScope.$broadcast("routeChange");
    });
});
