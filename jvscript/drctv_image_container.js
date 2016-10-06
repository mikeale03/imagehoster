angular.module("MyApp")
  .directive("imageContainer", function() {
    return {
      restrict: "A",
      scope: {
        img : "=",
        delete: "=",
        index: "=",
        showImgs: "="
      },
      templateUrl:'template/img.html',
      controller: function($scope, $element,$http) {
        var ctrl = this;
        ctrl.isUploading = false;
        ctrl.isUploadComplete = false;
        ctrl.uploadPercent = 0;
        ctrl.uploadUrl = ""
        ctrl.deleteImage = function(image) {
          var index = $scope.showImgs.indexOf(image);
          $scope.showImgs.splice(index,1);
          //$scope.delete(image);
          //$element.remove();
        }

        ctrl.upload = function(image, e) {
          console.log(e.target);
          e.target.disabled = true;
          var fd = new FormData();
          fd.append("file",image);
          //if($rootScope.userData)
            //fd.append("user_id",$rootScope.userData.user_id);
          console.log(image);
          $http({
            method:"POST",
            url:"/ImageGallery/php/upload.php",
            eventHandlers: {
              progress: function(c) {
                console.log('Progress -> ' + c);
                console.log(c);
              }
            },
            uploadEventHandlers: {
              progress: function(e) {
                ctrl.isUploading = true;
                ctrl.uploadMsg = "Uploading:";
                if(e.lengthComputable) {
                  ctrl.uploadPercent = parseInt(e.loaded / e.total * 100)
                  console.log('UploadProgress -> ' + e);
                  console.log(e);
                }
              }
            },
            data: fd,
            transformRequest: angular.identity,
            headers:{"Content-Type":undefined}
          }).then(function(response) {
            console.log(response.data);
            if(response.data.success) {
              ctrl.isUploadComplete = true;
              ctrl.uploadMsg = "Upload Complete!"
              ctrl.uploadUrl = response.data.url;
            } else {
              ctrl.isUploadComplete = true;
              ctrl.uploadMsg = response.data;
            }
          });
        }
      },
      controllerAs:"imgCtrl"
    }
  });
