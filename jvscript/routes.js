angular.module("MyApp").config(function($routeProvider) {
    $routeProvider
    .when("/upload", {
        template : "<my-upload imgs='mainCtrl.showImgs' on-delete='mainCtrl.deleteImage($event)' on-add-files='mainCtrl.addImageFiles($event)'></my-upload>"
    })
    .when("/signin", {
        template : "<sign-in></sign-in>",
        logIn: false
    })
    .when("/signup", {
        template : "<sign-up></sign-up>",
        logIn: false
    })
    .when("/gallery",{
        template:"<my-gallery imgs='$resolve.imgs'></my-gallery>",
        resolve: {
          imgs: function(Ajax) {
              return Ajax.getUserImages();
          }
        },
        logIn: true
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
    Ajax.getUserData().then(function(response) {
        if(response.data.id)
            $rootScope.userData = response.data;
    });
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        if(next.$$route.logIn === true) {
            Ajax.getUserData().then(function(response) {
                if(!response.data.id)
                    $location.path('/upload');
            });
        } else if(next.$$route.logIn === false) {
            Ajax.getUserData().then(function(response) {
                if(response.data.id) {
                    event.preventDefault();
                    $location.path('/upload');
                }
            });
        }
        $rootScope.$broadcast("routeChange");
    });
});
