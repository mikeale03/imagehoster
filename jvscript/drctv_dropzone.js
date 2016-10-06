angular.module("MyApp")
  .directive("myDropzone", function() {
    return {
      restrict: "A",
      scope: {
        showImgs:"=",
      },
      //templateUrl: "template/images.html",
      controller: function($scope,$element,$http,$rootScope,$location) {

        this.addImage = function(image) {
          var l = $scope.showImgs.length;
          if(l>0) {
            image.id = $scope.showImgs[l-1].id + 1;
          } else {
            image.id = 1;
          }
          $scope.showImgs.push(image);
          console.log($scope.showImgs);
          console.log($location.path());
          $scope.$apply();
        }

        this.deleteImage = function(image) {
          var index = $scope.showImgs.indexOf(image);
          $scope.showImgs.splice(index,1);
        }

        this.upload = function(image,isUploaded) {
          var fd = new FormData();
          fd.append("file",image);
          //if($rootScope.userData)
            //fd.append("user_id",$rootScope.userData.user_id);
          console.log(image);
          $http({
            method:"POST",
            url:"/ImageGallery/php/upload.php",
            data: fd,
            transformRequest: angular.identity,
            headers:{"Content-Type":undefined}
          }).then(function(response) {
            isUploaded = true;
            console.log(isUploaded);
            $scope.apply();
          });
        }
      },
      controllerAs: "drpCtrl",
      link: function ($scope, element, attr, ctrl) {
        element.on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        element.on('dragenter', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        element.on('drop', function(e) {
          e.preventDefault();
          e.stopPropagation();
          //console.log(e.dataTransfer.files);
          var files = e.dataTransfer.files;
          var l = files.length;
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
            })(files[i]);
            reader.readAsDataURL(files[i]);
          }

          /*if (e.originalEvent.dataTransfer){
          if (e.originalEvent.dataTransfer.files.length > 0) {
            upload(e.originalEvent.dataTransfer.files);
          }
          }

          return false;*/
        });
        /*element.ondragover = function(e) {
          e.preventDefault();
          return false;
        };
        element.ondragleave = function(e) {
          e.preventDefault();
          return false;
        };
        element.ondragenter = function(e) {
          e.preventDefault();
          return false;
        };
        element.ondrop = function(e) {
          e.preventDefault;
          ctrl.addFile();
        };*/
      }
    }
  });
