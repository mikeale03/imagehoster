angular.module("MyApp")
  .directive("onFileDrop", function() {
    return function ($scope, element, attr) {
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
          var files = e.dataTransfer.files;
          $scope.$eval(attr.onFileDrop,{
              $event: {files:files} 
          });
        });
    }
  });
