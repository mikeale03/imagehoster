angular.module("MyApp")
  .directive("fileInput",function() {
    return {
      restrict:"A",
      scope: {
        showImgs:"="
      },
      controller:function($scope) {
        this.addImage = function(image) {
          var l = $scope.showImgs.length;
          if(l>0) {
            image.id = $scope.showImgs[l-1].id + 1;
          } else {
            image.id = 1;
          }
          $scope.showImgs.push(image);
          console.log($scope.showImgs);
          $scope.$apply();
        }
      },
      link: function ($scope, element, attr, ctrl) {
        element.bind("change", function(e){
          var files = e.target.files;
          var l = files.length;
          for(var i=0;i<l;i++) {
            var reader = new FileReader();
            reader.onload = (function(file) {
                var img = {};
                img.file = file;
                return function() {
                  img.src = this.result;
                  ctrl.addImage(img);
                }
            })(files[i]);
            reader.readAsDataURL(files[i]);
            //console.log(this.files);
          }
        });
      }
    }
  });
