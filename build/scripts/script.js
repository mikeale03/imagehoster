"use strict";

angular.module("MyApp", ["ngRoute"]).controller("mainController", ["$scope", function ($scope) {
  var ctrl = this;
  ctrl.showImgs = [];
  this.addImage = function (image) {
    $scope.$evalAsync(function () {
      var l = ctrl.showImgs.length;
      if (l > 0) {
        image.id = ctrl.showImgs[l - 1].id + 1;
      } else {
        image.id = 1;
      }
      ctrl.showImgs = ctrl.showImgs.concat([image]);
    });
  };

  this.deleteImage = function (event) {
    var a = [];
    var index = ctrl.showImgs.indexOf(event.image);
    ctrl.showImgs.splice(index, 1);
    ctrl.showImgs = a.concat(ctrl.showImgs);
  };

  ctrl.addImageFiles = function (e) {
    var l = e.files.length;

    for (var i = 0; i < l; i++) {
      var reader = new FileReader();
      reader.onload = function (file) {
        var img = {};
        img.file = file;
        img.id = i;
        return function () {
          img.src = this.result;
          ctrl.addImage(img);
        };
      }(e.files[i]);
      reader.readAsDataURL(e.files[i]);
    }
  };

  $scope.$on("routeChange", function () {
    ctrl.showImgs = [];
  });
}]).controller("galleryController", ['images', '$location', '$rootScope', '$http', function (images, $location, $rootScope, $http) {
  var ctrl = this;
  ctrl.isShowModal = false;
  ctrl.imgs = images.data;
  var length = ctrl.imgs.length;
  ctrl.index = 0;
  ctrl.path = $location.protocol() + "://" + $location.host();
  ctrl.deleteImage = function (image) {
    $http({
      method: "POST",
      url: "/ImageGallery/php/delete_image.php",
      data: { imageId: image.image_id },
      //transformRequest: angular.identity,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then(function (response) {
      if (response.data.deleted) {
        var index = ctrl.imgs.indexOf(image);
        ctrl.imgs.splice(index, 1);
      }
    });
  };
  ctrl.renameImage = function (image) {
    $http({
      method: "POST",
      url: "/ImageGallery/php/rename_image.php",
      data: {
        imageId: image.image_id,
        imageName: image.image_name
      },
      //transformRequest: angular.identity,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    }).then(function (response) {

      if (response.data.updated) {
        var index = ctrl.imgs.indexOf(image);
        ctrl.imgs[index].image_name = image.image_name;
      }
    });
  };

  ctrl.showModal = function (image) {
    ctrl.index = ctrl.imgs.indexOf(image);
    ctrl.isShowModal = true;
  };

  ctrl.nextImage = function () {
    if (ctrl.index + 1 < length) {
      ctrl.index++;
    }
  };

  ctrl.prevImage = function () {
    if (ctrl.index - 1 > -1) {
      ctrl.index--;
    }
  };
  ctrl.closeModal = function () {
    ctrl.isShowModal = false;
  };
}]).controller("logOutController", ['logout', '$rootScope', '$location', function (logout, $rootScope) {

  if (logout.data.logout) {
    $rootScope.userData = {};
  }
}]);

angular.module("MyApp").config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when("/upload", {
    template: "<my-upload imgs='mainCtrl.showImgs' on-delete='mainCtrl.deleteImage($event)' on-add-files='mainCtrl.addImageFiles($event)'></my-upload>"
  }).when("/signin", {
    template: "<sign-in></sign-in>",
    logIn: false
  }).when("/signup", {
    template: "<sign-up></sign-up>",
    logIn: false
  }).when("/gallery", {
    template: "<my-gallery imgs='$resolve.imgs'></my-gallery>",
    resolve: {
      imgs: ["Ajax", function imgs(Ajax) {
        return Ajax.getUserImages();
      }]
    },
    logIn: true
  }).when("/logout", {
    template: "<my-upload imgs='mainCtrl.showImgs' on-delete='mainCtrl.deleteImage($event)' on-add-files='mainCtrl.addImageFiles($event)'></my-upload>",
    controller: "logOutController",
    resolve: {
      logout: ["Ajax", function logout(Ajax) {
        return Ajax.logOut();
      }]
    }
  }).otherwise({
    template: "<my-upload imgs='mainCtrl.showImgs' on-delete='mainCtrl.deleteImage($event)' on-add-files='mainCtrl.addImageFiles($event)'></my-upload>"
  });
}]).run(["$rootScope", "Ajax", "$location", function ($rootScope, Ajax, $location) {
  Ajax.getUserData().then(function (response) {
    if (response.data.id) $rootScope.userData = response.data;
  });
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    if (next.$$route.logIn === true) {
      Ajax.getUserData().then(function (response) {
        if (!response.data.id) $location.path('/upload');
      });
    } else if (next.$$route.logIn === false) {
      Ajax.getUserData().then(function (response) {
        if (response.data.id) {
          event.preventDefault();
          $location.path('/upload');
        }
      });
    }
    $rootScope.$broadcast("routeChange");
  });
}]);

angular.module('MyApp').service('Ajax', ["$http", "$q", function ($http, $q) {
  var baseUrl = '/ImageGallery/php/';

  var Request = function Request(method, endpoint, data) {
    this.method = method;
    this.url = baseUrl + endpoint;
    this.headers = { "Content-Type": "application/x-www-form-urlencoded" };
    if (data) this.data = data;
  };

  this.getUserImages = function () {
    var deffered = $q.defer();
    var req = new Request('GET', 'get_images.php');
    $http(req).then(function (response) {
      console.log(response);
      deffered.resolve(response);
    });
    return deffered.promise;
  };

  this.signIn = function (user) {
    var r = new Request('POST', 'sign_in.php', user);
    return $http(r);
  };

  this.signUp = function (user) {
    return $http(new Request('POST', 'sign_up.php', user));
  };

  this.logOut = function () {
    return $http(new Request('GET', 'log_out.php'));
  };

  this.isLogIn = function () {
    $http(new Request('GET', 'get_user.php')).then(function (response) {
      if (response.data.id) return true;else return false;
    });
  };

  this.getUserData = function () {
    return $http(new Request('GET', 'get_user.php'));
  };

  this.deleteImage = function (image) {
    return $http(new Request('POST', 'delete_image.php', image));
  };
}]);

angular.module('MyApp').component('dropImage', {
  bindings: {
    img: '<',
    delete: '&'
  },
  controller: ["$http", function controller($http) {
    var ctrl = this;
    ctrl.isUploading = false;
    ctrl.isUploadComplete = false;
    ctrl.uploadPercent = 0;
    ctrl.uploadUrl = "";

    ctrl.$onChanges = function (changes) {
      if (changes.img) {
        ctrl.img = changes.img.currentValue;
      }
    };

    ctrl.upload = function (image, e) {
      console.log(e.target);
      e.target.disabled = true;
      var fd = new FormData();
      fd.append("file", image);
      console.log(image);
      $http({
        method: "POST",
        url: "/ImageGallery/php/upload.php",
        eventHandlers: {
          progress: function progress(c) {
            console.log('Progress -> ' + c);
            console.log(c);
          }
        },
        uploadEventHandlers: {
          progress: function progress(e) {
            ctrl.isUploading = true;
            ctrl.uploadMsg = "Uploading:";
            if (e.lengthComputable) {
              ctrl.uploadPercent = parseInt(e.loaded / e.total * 100);
              console.log('UploadProgress -> ' + e);
              console.log(e);
            }
          }
        },
        data: fd,
        transformRequest: angular.identity,
        headers: { "Content-Type": undefined }
      }).then(function (response) {
        console.log(response.data);
        if (response.data.success) {
          ctrl.isUploadComplete = true;
          ctrl.uploadMsg = response.data.message;
          ctrl.uploadUrl = response.data.url;
        } else {
          ctrl.isUploadComplete = true;
          ctrl.uploadMsg = response.data;
        }
      });
    };
  }],
  template: "<div class=\"image-container\">\n        <a ng-if = \"$ctrl.isUploadComplete\"  href=\"{{$ctrl.uploadUrl}}\" target=\"_blank\">\n            <div class=\"image-wrap\">\n                <img ng-src=\"{{$ctrl.img.src}}\">\n            </div>\n        </a>\n        <div ng-hide = \"$ctrl.isUploadComplete\" class=\"image-wrap\">\n            <img ng-src=\"{{$ctrl.img.src}}\">\n        </div>\n        <div class=\"upload-stat\" ng-if=\"$ctrl.isUploading\">\n            {{$ctrl.uploadMsg}} <span ng-hide=\"$ctrl.isUploadComplete\"> {{$ctrl.uploadPercent+\"%\"}}</span>\n        </div>\n        <div>\n            <button ng-click=\"$ctrl.delete($ctrl.img)\">delete</button>\n            <button type=\"button\" name=\"button\" ng-hide=\"$ctrl.isUploadComplete\" ng-click=\"$ctrl.upload($ctrl.img.file, $event)\">upload</button>\n        </div>\n    </div>"
});
angular.module('MyApp').component('myGallery', {
  bindings: {
    imgs: '<'
  },
  controller: ["Ajax", "$location", "$rootScope", function controller(Ajax, $location, $rootScope) {
    var ctrl = this;
    ctrl.isShowModal = false;
    var length;
    ctrl.index = 0;
    ctrl.path = $location.protocol() + "://" + $location.host();
    this.$onInit = function () {
      ctrl.images = ctrl.imgs.data;
      length = ctrl.images.length;
    };

    ctrl.deleteImage = function (image) {
      Ajax.deleteImage(image).then(function (response) {
        console.log(response);
        if (response.data.deleted) {
          var index = ctrl.images.indexOf(image);
          ctrl.images.splice(index, 1);
        }
      });
    };
    ctrl.renameImage = function (image) {
      $http({
        method: "POST",
        url: "/ImageGallery/php/rename_image.php",
        data: {
          imageId: image.image_id,
          imageName: image.image_name
        },
        transformRequest: angular.identity,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }).then(function (response) {
        console.log(response);
        if (response.data.updated) {
          var index = ctrl.images.indexOf(image);
          ctrl.images[index].image_name = image.image_name;
        }
      });
    };

    ctrl.showModal = function (image) {
      ctrl.index = ctrl.images.indexOf(image);
      ctrl.isShowModal = true;
    };

    ctrl.nextImage = function () {
      if (ctrl.index + 1 < length) {
        ctrl.index++;
      }
    };

    ctrl.prevImage = function () {
      if (ctrl.index - 1 > -1) {
        ctrl.index--;
      }
    };
    ctrl.closeModal = function () {
      ctrl.isShowModal = false;
    };
  }],
  template: "<div>\n        <br>\n        <h1>My Image Gallery</h1>\n        <br>\n        <h3 ng-if=\"$ctrl.images.length == 0\">You have no images!</h3>\n        <div class=\"upload-images\">\n            <div ng-repeat=\"img in $ctrl.images track by img.image_id\" class=\"image-container\">\n                <div class=\"image-wrap\" ng-click=\"$ctrl.showModal(img)\">\n                    <img ng-src=\"{{img.image_url}}\">\n                    <div class=\"image-name\">{{img.image_name}}</div>\n                </div>\n                <div style=\"position:relative\">\n                    <button ng-click=\"$ctrl.deleteImage(img)\">delete</button>\n                </div>\n            </div>\n            <div class=\"mod\" ng-show=\"$ctrl.isShowModal\" >\n                <div class=\"mod-content\" tabindex=\"-1\">\n                    <div class=\"url\">\n                        URL: <input type=\"text\" value=\"{{$ctrl.path +'/'+ $ctrl.images[$ctrl.index].image_url}}\"/ readonly>\n                    </div>\n                    <img ng-src=\"{{$ctrl.images[$ctrl.index].image_url}}\" >\n                    <button ng-click=\"$ctrl.prevImage()\" class=\"prevBtn\"><span>&#60;</span></button>\n                    <button ng-click=\"$ctrl.nextImage()\" class=\"nxtBtn\"><span>&#62;</span></button>\n                    <button ng-click=\"$ctrl.closeModal()\" class=\"closeBtn\">X</button>\n                    <div class=\"modal-image-name\">{{$ctrl.images[$ctrl.index].image_name}}</div>\n                </div>\n            </div>\n        </div>\n    </div>"
});
angular.module('MyApp').component('myUpload', {
  bindings: {
    imgs: '<',
    onDelete: '&',
    onAddFiles: '&'
  },
  controller: function controller() {
    var ctrl = this;
    ctrl.$onChanges = function (changes) {
      if (changes.imgs) {
        ctrl.imgs = changes.imgs.currentValue;
      }
    };
    ctrl.delete = function (img) {
      ctrl.onDelete({
        $event: {
          image: img
        }
      });
    };
    ctrl.addFiles = function (ev) {
      ctrl.onAddFiles({
        $event: ev
      });
    };
  },
  template: "<div style=\"text-align:center\" class=\"file-input\">\n        <br>\n        <h1>Upload Your Images</h1>\n        <div style=\"display:inline-block\">\n            <br>\n            <b>Browse Your Images<b>\n            <input type=\"file\" multiple accept=\"image/*\" on-file-input=\"$ctrl.addFiles($event)\" />\n            <br>\n            <b>Or Drag and Drop Your Images Here</b>\n        </div>\n    </div>\n    <div class=\"upload-images\">\n            <drop-image ng-repeat=\"img in $ctrl.imgs track by img.id\" img=\"img\" delete=\"$ctrl.delete(img)\"></drop-image>\n    </div>"
});
angular.module('MyApp').component('signIn', {
  controller: ["Ajax", "$rootScope", "$location", function controller(Ajax, $rootScope, $location) {
    var ctrl = this;
    ctrl.errorNum = 0;
    ctrl.user = {};
    ctrl.isInvalid = false;

    this.signIn = function () {
      Ajax.signIn(ctrl.user).then(function (response) {
        console.log(response.data);
        if (response.data.log_in) {
          $rootScope.userData = response.data;
          $location.path("/login");
        } else {
          ctrl.isInvalid = true;
          ctrl.errorNum = response.data.error_num;
          ctrl.errMsg = response.data.error_msg;
        }
      }, function (resp) {
        ctrl.isInvalid = true;
        ctrl.errMsg = "Server Error!";
      });
    };
  }],
  template: "<div class=\"sign-form\" >\n        <br>\n        <h1>Sign In To Your Account</h1>\n        <br>\n        <form class=\"form-group\" ng-submit=\"$ctrl.signIn()\" method=\"post\">\n          <div class=\"form-group {{$ctrl.errorNum == 1? 'has-error':'' }}\">\n            <input type=\"email\" class=\"form-control\"  ng-model=\"$ctrl.user.email\" placeholder=\"Email Address\">\n          </div>\n          <div class=\"form-group {{$ctrl.errorNum == 2? 'has-error':''}}\">\n            <input type=\"password\"  class=\"form-control\" ng-model=\"$ctrl.user.password\" placeholder=\"Password\">\n          </div>\n            <p style=\"color:red;\" ng-if=\"$ctrl.isInvalid\">{{$ctrl.errMsg}}</p>\n          <button class=\"btn btn-primary btn-block\" type=\"submit\">LOG IN</button>\n        </form>\n      </div>"
});

angular.module('MyApp').component('signUp', {
  controller: ["Ajax", "$rootScope", "$location", function controller(Ajax, $rootScope, $location) {
    var ctrl = this;
    ctrl.user = {};
    ctrl.isMatch = true;
    ctrl.hasError = false;
    ctrl.errorMsg = "";
    this.signUp = function (email, pass, ver) {
      ctrl.hasError = false;
      if (pass !== ver) {
        ctrl.isMatch = false;
        ctrl.errorMsg = "Password don't match!";
      } else {
        ctrl.isMatch = true;
        Ajax.signUp(ctrl.user
        /*$http({
          method:"POST",
          url:"/ImageGallery/php/sign_up.php",
          data: ctrl.user,
          //transformRequest: angular.identity,
          headers:{"Content-Type":"application/x-www-form-urlencoded"}*/
        ).then(function (response) {
          if (response.data.log_in) {
            $rootScope.userData = response.data;
            $location.path("/upload");
          } else {
            ctrl.errorMsg = response.data.error_msg;
            ctrl.hasError = true;
          }
        }, function (response) {
          ctrl.errorMsg = "Server Error!";
        });
      }
    };
  }],
  template: "<div class=\"sign-form\">\n        <br>\n        <h1>Create Your Account</h1>\n        <br>\n        <form class=\"form-group\" ng-submit=\"$ctrl.signUp($ctrl.user.email,$ctrl.user.password,$ctrl.confirm)\" method=\"post\">\n          <div class=\"{{$ctrl.hasError ? 'has-error':''}}\">\n            <input class=\"form-control\" type=\"email\" placeholder=\"Enter your email address\" ng-model=\"$ctrl.user.email\" required>\n          </div>\n          <div class=\"{{!$ctrl.isMatch ? 'has-error':''}}\">\n            <input class=\"form-control\" type=\"password\" placeholder=\"Enter your password\" ng-model=\"$ctrl.user.password\" required>\n          </div>\n          <div class=\"{{!$ctrl.isMatch ? 'has-error':''}}\">\n            <input class=\"form-control\" type=\"password\" placeholder=\"Confirm password\" ng-model=\"$ctrl.confirm\" required>\n          </div>\n          <p style=\"color:red;\">{{$ctrl.errorMsg}}</p>\n          <button class=\"btn btn-primary btn-block\" type=\"submit\">SUBMIT</button>\n        </form>\n      </div>"
});

angular.module("MyApp").directive("imgOnload", function () {
  return {
    restrict: "A",

    controller: ["$scope", function controller($scope) {}],
    controllerAs: "imgOnloadCtrl",
    link: function link($scope, element, attr, ctrl) {
      console.log(element);
      element.on("load", function () {
        var height = this.naturalHeight;
        var width = this.naturalWidth;
        console.log(height);
        console.log(width);
        if (height > width) {
          //ctrl.isPortrait = true;
          this.className = "portrait";
        } else {
          this.className = "landscape";
          //ctrl.isPortrait = false;
        }
        console.log(ctrl.isPortrait);
      });
      //if(height>width) {
      //    $scope.isPortrait = true;
      //}
    }

  };
});

angular.module("MyApp").directive("onFileDrop", function () {
  return function ($scope, element, attr) {
    element.on('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    element.on('dragenter', function (e) {
      e.preventDefault();
      e.stopPropagation();
    });
    element.on('drop', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var files = e.dataTransfer.files;
      $scope.$eval(attr.onFileDrop, {
        $event: { files: files }
      });
    });
  };
});

angular.module("MyApp").directive("onFileInput", function () {
  return function ($scope, element, attr, ctrl) {
    element.bind("change", function (e) {
      var files = e.target.files;
      $scope.$eval(attr.onFileInput, { $event: { files: files } });
    });
  };
});

angular.module('MyApp').component('headerLogin', {
  controller: ["$location", function controller($location) {
    this.isRoute = function (route) {
      console.log($location.path());
      if ($location.path() == route) {
        return true;
      } else {
        return false;
      }
    };
  }],
  template: "<nav class=\"navbar navbar-custom\">\n        <div class=\"container-fluid\">\n          <div class=\"navbar-header\">\n            <a class=\"navbar-brand\" href=\"#\">Image Hoster. Your free image hosting site</a>\n          </div>\n          <ul class=\"nav navbar-nav navbar-right\">\n            <li class=\"{{$ctrl.isRoute('/upload') ? 'active':''}}\"><a href=\"#/upload\">UPLOAD</a></li>\n            <li class=\"{{$ctrl.isRoute('/gallery') ? 'active':''}}\"><a href=\"#/gallery\">IMAGE GALLERY</a></li>\n            <li><a href=\"#/logout\">LOG OUT</a></li>\n          </ul>\n        </div>\n      </nav>"
});

angular.module('MyApp').component('headerLogout', {
  controller: ["$location", function controller($location) {
    this.isRoute = function (route) {
      console.log($location.path());
      if ($location.path() == route) {
        return true;
      } else {
        return false;
      }
    };
  }],
  template: "<nav class=\"navbar navbar-custom\">\n        <div class=\"container-fluid\">\n          <div class=\"navbar-header\">\n            <a class=\"navbar-brand\" href=\"#\">Image Hoster. Your free image hosting site</a>\n          </div>\n          <ul class=\"nav navbar-nav navbar-right\">\n            <li class=\"{{$ctrl.isRoute('/upload') ? 'active':''}}\"><a href=\"#/upload\">UPLOAD</a></li>\n            <li class=\"{{$ctrl.isRoute('/signin') ? 'active':''}}\"><a href=\"#/signin\">SIGN IN</a></li>\n            <li class=\"{{$ctrl.isRoute('/signup') ? 'active':''}}\"><a href=\"#/signup\">CREATE ACCOUNT</a></li>\n          </ul>\n        </div>\n      </nav>"
});