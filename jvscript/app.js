angular.module("MyApp",["ngRoute"])
  .controller("mainController", function($scope) {
    var ctrl = this;
    ctrl.showImgs = [];
    this.addImage = function(image) {
      $scope.$evalAsync(function() {
        var l = ctrl.showImgs.length;
        if(l>0) {
          image.id = ctrl.showImgs[l-1].id + 1;
        } else {
          image.id = 1;
        }
        ctrl.showImgs = ctrl.showImgs.concat([image]);
      });
      
    }

    this.deleteImage = function(event) {
      var a = []
      var index = ctrl.showImgs.indexOf(event.image);
      ctrl.showImgs.splice(index,1);
      ctrl.showImgs = a.concat(ctrl.showImgs);
      
    }

    ctrl.addImageFiles = function(e) {
       var l = e.files.length;
       
       for(var i=0;i<l;i++) {
          var reader = new FileReader();
          reader.onload = (function(file) {
              var img = {};
              img.file = file;
              img.id = i;
              return function() {
                img.src = this.result;
                ctrl.addImage(img);
              }
          })(e.files[i]);
          reader.readAsDataURL(e.files[i]);
      }
    }
  
    $scope.$on("routeChange", function() {
      ctrl.showImgs = [];
    })
  })

  .controller("galleryController", ['images','$location','$rootScope','$http', function(images, $location,$rootScope,$http) {
    var ctrl = this;
    ctrl.isShowModal = false;
    ctrl.imgs = images.data;
    var length = ctrl.imgs.length;
    ctrl.index = 0;
    ctrl.path = $location.protocol()+"://"+$location.host();
    ctrl.deleteImage = function(image) {
      $http({
        method:"POST",
        url:"/ImageGallery/php/delete_image.php",
        data: {imageId: image.image_id},
        //transformRequest: angular.identity,
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
      }).then(function(response) {
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
    
    if(logout.data.logout) {
      $rootScope.userData = {};
    }
  }])
  